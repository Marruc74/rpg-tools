import { useRef } from 'react'

export default function JournalToolbar({
  onPrintPdf,
  onExportTemplate,
  onImportTemplate,
  onResetDefaults,
}) {
  const fileInputRef = useRef(null)
  const handleImportClick = () => fileInputRef.current?.click()
  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    await onImportTemplate(file)
    e.target.value = ''
  }

  return (
    <div className="toolbar">
      <button onClick={onPrintPdf} title="Generate a printable PDF of the blank template">
        Print PDF
      </button>
      <span className="toolbar__sep" />
      <button onClick={onExportTemplate} title="Save the template structure as JSON">
        Export template
      </button>
      <button onClick={handleImportClick} title="Replace the current template with one from a JSON file">
        Import template
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleFile}
        style={{ display: 'none' }}
      />
      <span className="toolbar__sep" />
      <button
        onClick={() => {
          if (confirm('Reset to the default sections? Your current template will be replaced.')) {
            onResetDefaults()
          }
        }}
        title="Restore the default set of sections"
      >
        Reset to defaults
      </button>
    </div>
  )
}
