import { useRef } from 'react'

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
  hasSelection,
  hasCollection,
  cardCount,
}) {
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
      <button onClick={onExportPdf} disabled={cardCount === 0}>
        Export PDF (all {cardCount})
      </button>
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
