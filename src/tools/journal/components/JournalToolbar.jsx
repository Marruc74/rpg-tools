import { useRef } from 'react'

export default function JournalToolbar({
  onPrintPdf,
  onExportTemplate,
  onExportLibrary,
  onImportJson,
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
      <button onClick={onPrintPdf} title="Generate a printable PDF of the active template">
        Print PDF
      </button>
      <span className="toolbar__sep" />
      <button onClick={onExportTemplate} title="Export the active template as JSON">
        Export template
      </button>
      <button onClick={onExportLibrary} title="Export the entire library as JSON">
        Export library
      </button>
      <button onClick={handleImportClick} title="Import a template or library JSON">
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
