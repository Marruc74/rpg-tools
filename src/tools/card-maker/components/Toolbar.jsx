import { useEffect, useRef, useState } from 'react'

// Per-printer duplex calibration. Saved separately from the library since
// it's a property of the user's printer, not their cards.
const BACK_OFFSET_X_KEY = 'cardmaker:backOffsetX'
const BACK_OFFSET_Y_KEY = 'cardmaker:backOffsetY'
const GAP_KEY = 'cardmaker:gap'

function loadNumber(key, fallback) {
  const raw = parseFloat(typeof window === 'undefined' ? '' : window.localStorage.getItem(key))
  return Number.isFinite(raw) ? raw : fallback
}

export default function Toolbar({
  onExportPng,
  onExportPdf,
  onExportLibraryJson,
  onExportCollectionJson,
  onExportCardJson,
  onImportJson,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onTogglePdfPreview,
  pdfPreviewOpen,
  onPdfOptionsChange,
  onOpenSnapshots,
  hasSelection,
  hasCollection,
  cardCount,
  exportProgress,
}) {
  const isExporting = exportProgress != null
  const [pdfSides, setPdfSides] = useState('both')
  const [pdfPageSize, setPdfPageSize] = useState('a4')
  const [pdfScale, setPdfScale] = useState(1)
  const [backOffsetX, setBackOffsetX] = useState(() => loadNumber(BACK_OFFSET_X_KEY, 0))
  const [backOffsetY, setBackOffsetY] = useState(() => loadNumber(BACK_OFFSET_Y_KEY, 0))
  const [gap, setGap] = useState(() => loadNumber(GAP_KEY, 2))

  useEffect(() => {
    window.localStorage.setItem(BACK_OFFSET_X_KEY, String(backOffsetX))
  }, [backOffsetX])
  useEffect(() => {
    window.localStorage.setItem(BACK_OFFSET_Y_KEY, String(backOffsetY))
  }, [backOffsetY])
  useEffect(() => {
    window.localStorage.setItem(GAP_KEY, String(gap))
  }, [gap])

  // Bubble PDF settings up so the preview panel can mirror them.
  const updateOption = (patch) => {
    if (patch.sides !== undefined) setPdfSides(patch.sides)
    if (patch.pageSize !== undefined) setPdfPageSize(patch.pageSize)
    if (patch.scale !== undefined) setPdfScale(patch.scale)
    if (patch.backOffsetX !== undefined) setBackOffsetX(patch.backOffsetX)
    if (patch.backOffsetY !== undefined) setBackOffsetY(patch.backOffsetY)
    if (patch.gap !== undefined) setGap(patch.gap)
    onPdfOptionsChange?.({
      sides: patch.sides ?? pdfSides,
      pageSize: patch.pageSize ?? pdfPageSize,
      scale: patch.scale ?? pdfScale,
      gap: patch.gap ?? gap,
      backOffsetX: patch.backOffsetX ?? backOffsetX,
      backOffsetY: patch.backOffsetY ?? backOffsetY,
    })
  }
  const fileInputRef = useRef(null)

  const handleImportClick = () => fileInputRef.current?.click()

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    await onImportJson(file)
    e.target.value = ''
  }

  return (
    <div className="toolbar">
      <button onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)">
        ↶ Undo
      </button>
      <button onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)">
        ↷ Redo
      </button>
      <span className="toolbar__sep" />
      <button onClick={onExportPng} disabled={!hasSelection}>
        Export PNG (this card)
      </button>
      <button
        onClick={() => onExportPdf({
          sides: pdfSides,
          pageSize: pdfPageSize,
          scale: pdfScale,
          gap,
          backOffsetX,
          backOffsetY,
        })}
        disabled={cardCount === 0 || isExporting}
        aria-busy={isExporting}
      >
        {isExporting ? (
          <>
            <span className="toolbar__spinner" aria-hidden="true" />
            {exportProgress.total
              ? `Exporting… ${exportProgress.done}/${exportProgress.total}`
              : 'Exporting…'}
          </>
        ) : (
          `Export PDF (${cardCount})`
        )}
      </button>
      <select
        className="toolbar__select"
        value={pdfSides}
        onChange={(e) => updateOption({ sides: e.target.value })}
        title="Which sides to include in PDF"
        disabled={cardCount === 0}
      >
        <option value="both">Both sides</option>
        <option value="front">Front only</option>
        <option value="back">Back only</option>
      </select>
      <select
        className="toolbar__select"
        value={pdfPageSize}
        onChange={(e) => updateOption({ pageSize: e.target.value })}
        title="PDF page size"
        disabled={cardCount === 0}
      >
        <option value="a4">A4</option>
        <option value="letter">Letter</option>
        <option value="legal">Legal</option>
      </select>
      <select
        className="toolbar__select"
        value={pdfScale}
        onChange={(e) => updateOption({ scale: Number(e.target.value) })}
        title="Card scale on the PDF"
        disabled={cardCount === 0}
      >
        <option value="1">100%</option>
        <option value="1.25">125%</option>
        <option value="1.5">150%</option>
        <option value="2">200%</option>
      </select>
      <span
        className="toolbar__gap"
        title="Whitespace between cards (mm). Makes cutting easier. 0 packs cards edge-to-edge."
      >
        <span className="toolbar__gap-label">Gap:</span>
        <input
          type="number"
          className="toolbar__gap-input"
          value={gap}
          step="0.5"
          min="0"
          max="20"
          onChange={(e) => updateOption({ gap: Math.max(0, Number(e.target.value) || 0) })}
          disabled={cardCount === 0}
          aria-label="Gap between cards in millimetres"
        />
        <span className="toolbar__gap-unit">mm</span>
      </span>
      {pdfSides === 'both' && (
        <span
          className="toolbar__back-offset"
          title="Per-printer duplex calibration. Positive X shifts backs right; positive Y shifts backs down. Saved across sessions."
        >
          <span className="toolbar__back-offset-label">Back nudge:</span>
          <input
            type="number"
            className="toolbar__back-offset-input"
            value={backOffsetX}
            step="0.5"
            min="-10"
            max="10"
            onChange={(e) => updateOption({ backOffsetX: Number(e.target.value) || 0 })}
            disabled={cardCount === 0}
            aria-label="Back side X offset in millimetres"
          />
          <span className="toolbar__back-offset-unit">×</span>
          <input
            type="number"
            className="toolbar__back-offset-input"
            value={backOffsetY}
            step="0.5"
            min="-10"
            max="10"
            onChange={(e) => updateOption({ backOffsetY: Number(e.target.value) || 0 })}
            disabled={cardCount === 0}
            aria-label="Back side Y offset in millimetres"
          />
          <span className="toolbar__back-offset-unit">mm</span>
        </span>
      )}
      {onTogglePdfPreview && (
        <button
          onClick={onTogglePdfPreview}
          disabled={cardCount === 0}
          title="Show PDF layout preview"
        >
          {pdfPreviewOpen ? 'Hide preview' : 'Preview PDF'}
        </button>
      )}
      <span className="toolbar__sep" />
      <button onClick={onExportCardJson} disabled={!hasSelection} title="Export selected card as JSON">
        Export card
      </button>
      <button onClick={onExportCollectionJson} disabled={!hasCollection} title="Export active collection as JSON">
        Export collection
      </button>
      <button onClick={onExportLibraryJson} disabled={cardCount === 0} title="Export entire library as JSON">
        Export library
      </button>
      <button onClick={handleImportClick} title="Import a card, collection, or library JSON">
        Import…
      </button>
      {onOpenSnapshots && (
        <>
          <span className="toolbar__sep" />
          <button onClick={onOpenSnapshots} title="Save and restore named library snapshots">
            Snapshots
          </button>
        </>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleFile}
        style={{ display: 'none' }}
      />
    </div>
  )
}
