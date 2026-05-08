import { useRef } from 'react'

export default function JournalToolbar({
  onExportPdf,
  onExportEntryJson,
  onExportJournalJson,
  onImportJson,
  hasEntry,
  entryCount,
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
      <button onClick={onExportPdf} disabled={!hasEntry}>
        Export PDF (this entry)
      </button>
      <span className="toolbar__sep" />
      <button onClick={onExportEntryJson} disabled={!hasEntry} title="Export this entry as JSON">
        Export entry
      </button>
      <button onClick={onExportJournalJson} disabled={entryCount === 0} title="Export entire journal as JSON">
        Export journal
      </button>
      <button onClick={handleImportClick} title="Import an entry or journal JSON">
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
