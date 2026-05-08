import { useRef, useState } from 'react'

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
}) {
  const [pdfSides, setPdfSides] = useState('both')
  const [pdfPageSize, setPdfPageSize] = useState('a4')
  const [pdfScale, setPdfScale] = useState(1)

  // Bubble PDF settings up so the preview panel can mirror them.
  const updateOption = (patch) => {
    if (patch.sides !== undefined) setPdfSides(patch.sides)
    if (patch.pageSize !== undefined) setPdfPageSize(patch.pageSize)
    if (patch.scale !== undefined) setPdfScale(patch.scale)
    onPdfOptionsChange?.({
      sides: patch.sides ?? pdfSides,
      pageSize: patch.pageSize ?? pdfPageSize,
      scale: patch.scale ?? pdfScale,
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
        onClick={() => onExportPdf({ sides: pdfSides, pageSize: pdfPageSize, scale: pdfScale })}
        disabled={cardCount === 0}
      >
        Export PDF ({cardCount})
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
