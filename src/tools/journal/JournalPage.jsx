import { useEffect, useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'
import './journalPage.css'
import TemplateList from './components/TemplateList.jsx'
import TemplateCanvas from './components/TemplateCanvas.jsx'
import BoxInspector from './components/BoxInspector.jsx'
import JournalToolbar from './components/JournalToolbar.jsx'
import PrintArea from './components/PrintArea.jsx'
import { useIndexedDBState } from '../../shared/hooks/useIndexedDBState.js'
import {
  LIBRARY_KEY,
  emptyLibrary,
  migrateLibrary,
  newTemplate,
  newBox,
  downloadTemplateJson,
  downloadLibraryJson,
  readJsonFile,
  PAGE_W,
  PAGE_H,
} from './lib/journalTemplate.js'
import { exportTemplatePdf } from './lib/exportJournalPdf.js'

export default function JournalPage() {
  const [library, setLibrary, isReady] = useIndexedDBState(
    LIBRARY_KEY,
    emptyLibrary(),
    migrateLibrary,
  )
  const [selectedBoxId, setSelectedBoxId] = useState(null)

  const templates = library.templates
  const activeId = library.activeTemplateId
  const activeTemplate =
    templates.find((t) => t.id === activeId) ?? templates[0] ?? null

  // If the active template id ever points at a removed template, fix it.
  useEffect(() => {
    if (!activeTemplate && templates.length > 0) {
      setLibrary({ ...library, activeTemplateId: templates[0].id })
    }
  }, [templates, activeTemplate])

  // Drop selection when switching templates.
  useEffect(() => {
    setSelectedBoxId(null)
  }, [activeId])

  const selectedBox =
    activeTemplate?.boxes.find((b) => b.id === selectedBoxId) ?? null

  /* ---------- template management ---------- */
  const updateTemplate = (id, patch) =>
    setLibrary({
      ...library,
      templates: templates.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })

  const updateActiveTemplate = (patch) =>
    activeTemplate && updateTemplate(activeTemplate.id, patch)

  const handleSelectTemplate = (id) =>
    setLibrary({ ...library, activeTemplateId: id })

  const handleNewTemplate = () => {
    const t = newTemplate({ name: `Template ${templates.length + 1}` })
    setLibrary({
      ...library,
      templates: [...templates, t],
      activeTemplateId: t.id,
    })
  }

  const handleDuplicateTemplate = (id) => {
    const original = templates.find((t) => t.id === id)
    if (!original) return
    const copy = {
      ...structuredClone(original),
      id: uuid(),
      name: `${original.name} (copy)`,
      boxes: original.boxes.map((b) => ({ ...b, id: uuid() })),
    }
    const idx = templates.findIndex((t) => t.id === id)
    const next = [...templates]
    next.splice(idx + 1, 0, copy)
    setLibrary({ ...library, templates: next, activeTemplateId: copy.id })
  }

  const handleDeleteTemplate = (id) => {
    const remaining = templates.filter((t) => t.id !== id)
    if (remaining.length === 0) return
    setLibrary({
      ...library,
      templates: remaining,
      activeTemplateId: activeId === id ? remaining[0].id : activeId,
    })
  }

  const handleRenameTemplate = (id, name) => updateTemplate(id, { name })

  /* ---------- box management ---------- */
  const updateBoxes = (next) => updateActiveTemplate({ boxes: next })

  const handleChangeBox = (id, patch) => {
    if (!activeTemplate) return
    updateBoxes(
      activeTemplate.boxes.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    )
  }

  const handleDeleteBox = (id) => {
    if (!activeTemplate) return
    updateBoxes(activeTemplate.boxes.filter((b) => b.id !== id))
    if (selectedBoxId === id) setSelectedBoxId(null)
  }

  const handleAddBox = () => {
    if (!activeTemplate) return
    // Place the new box at a slight offset from the existing top-left.
    const offset = activeTemplate.boxes.length * 16
    const box = newBox({
      title: 'New box',
      x: 24 + (offset % 200),
      y: 24 + (offset % 200),
      w: 240,
      h: 160,
    })
    updateBoxes([...activeTemplate.boxes, box])
    setSelectedBoxId(box.id)
  }

  /* ---------- export / import ---------- */
  const handlePrintPdf = async () => {
    if (!activeTemplate) return
    await exportTemplatePdf(activeTemplate.name)
  }

  const handleExportTemplate = () => {
    if (!activeTemplate) return
    downloadTemplateJson(activeTemplate)
  }

  const handleExportLibrary = () => downloadLibraryJson(library)

  const handleImportJson = async (file) => {
    try {
      const parsed = await readJsonFile(file)
      if (parsed.kind === 'template') {
        const t = { ...parsed.template, id: uuid() }
        setLibrary({
          ...library,
          templates: [...templates, t],
          activeTemplateId: t.id,
        })
        return
      }
      if (parsed.kind === 'library') {
        const replace =
          templates.length === 1 && templates[0].boxes.length === 0
            ? true
            : confirm('Replace your current library with the imported one? Click Cancel to merge templates.')
        if (replace) {
          setLibrary(parsed.library)
        } else {
          const existingIds = new Set(templates.map((t) => t.id))
          const merged = [
            ...templates,
            ...parsed.library.templates.filter((t) => !existingIds.has(t.id)),
          ]
          setLibrary({ ...library, templates: merged })
        }
      }
    } catch (err) {
      alert(`Import failed: ${err.message}`)
    }
  }

  if (!isReady) {
    return (
      <div className="journal">
        <header className="journal__header">
          <h1>Journal Sheet</h1>
        </header>
        <main className="journal__main journal__main--loading">
          <p className="hint">Loading library…</p>
        </main>
      </div>
    )
  }

  return (
    <div className="journal">
      <header className="journal__header">
        <h1>Journal Sheet</h1>
        <JournalToolbar
          onAddBox={handleAddBox}
          onPrintPdf={handlePrintPdf}
          onExportTemplate={handleExportTemplate}
          onExportLibrary={handleExportLibrary}
          onImportJson={handleImportJson}
        />
      </header>

      <main className="journal__main">
        <TemplateList
          templates={templates}
          activeId={activeTemplate?.id}
          onSelect={handleSelectTemplate}
          onNew={handleNewTemplate}
          onDuplicate={handleDuplicateTemplate}
          onDelete={handleDeleteTemplate}
          onRename={handleRenameTemplate}
        />
        {activeTemplate ? (
          <>
            <TemplateCanvas
              template={activeTemplate}
              selectedBoxId={selectedBoxId}
              onSelectBox={setSelectedBoxId}
              onChangeBox={handleChangeBox}
              onDeleteBox={handleDeleteBox}
            />
            <BoxInspector
              box={selectedBox}
              template={activeTemplate}
              onChangeBox={handleChangeBox}
              onChangeTemplate={(patch) => updateActiveTemplate(patch)}
              onDeleteBox={handleDeleteBox}
            />
          </>
        ) : (
          <div className="empty-state">
            <p>No templates yet.</p>
            <button className="primary" onClick={handleNewTemplate}>
              + Create your first template
            </button>
          </div>
        )}
      </main>

      <PrintArea template={activeTemplate} />
    </div>
  )
}
