import './journalPage.css'
import TemplateEditor from './components/TemplateEditor.jsx'
import JournalToolbar from './components/JournalToolbar.jsx'
import PrintArea from './components/PrintArea.jsx'
import SheetPreview from './components/SheetPreview.jsx'
import { useIndexedDBState } from '../../shared/hooks/useIndexedDBState.js'
import {
  TEMPLATE_KEY,
  emptyTemplate,
  defaultTemplate,
  migrateTemplate,
  downloadTemplateJson,
  readJsonFile,
} from './lib/journalTemplate.js'
import { exportTemplatePdf } from './lib/exportJournalPdf.js'

export default function JournalPage() {
  const [template, setTemplate, isReady] = useIndexedDBState(
    TEMPLATE_KEY,
    emptyTemplate(),
    migrateTemplate,
  )

  const handlePrintPdf = async () => {
    await exportTemplatePdf()
  }

  const handleExportTemplate = () => downloadTemplateJson(template)

  const handleImportTemplate = async (file) => {
    try {
      const next = await readJsonFile(file)
      setTemplate(next)
    } catch (err) {
      alert(`Import failed: ${err.message}`)
    }
  }

  const handleResetDefaults = () => setTemplate(defaultTemplate())

  if (!isReady) {
    return (
      <div className="journal">
        <header className="journal__header">
          <h1>Journal Sheet</h1>
        </header>
        <main className="journal__main journal__main--loading">
          <p className="hint">Loading template…</p>
        </main>
      </div>
    )
  }

  return (
    <div className="journal">
      <header className="journal__header">
        <h1>Journal Sheet</h1>
        <JournalToolbar
          onPrintPdf={handlePrintPdf}
          onExportTemplate={handleExportTemplate}
          onImportTemplate={handleImportTemplate}
          onResetDefaults={handleResetDefaults}
        />
      </header>

      <main className="journal__main">
        <TemplateEditor template={template} onChange={setTemplate} />
        <SheetPreview template={template} />
      </main>

      <PrintArea template={template} />
    </div>
  )
}
