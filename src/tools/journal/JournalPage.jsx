import { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import './journalPage.css'
import TemplateList from './components/TemplateList.jsx'
import TemplateCanvas from './components/TemplateCanvas.jsx'
import BoxInspector from './components/BoxInspector.jsx'
import JournalToolbar from './components/JournalToolbar.jsx'
import PrintArea from './components/PrintArea.jsx'
import { useUndoableState } from '../../shared/hooks/useUndoableState.js'
import {
  LIBRARY_KEY,
  emptyLibrary,
  migrateLibrary,
  newTemplate,
  newBox,
  newPage,
  downloadTemplateJson,
  downloadLibraryJson,
  readJsonFile,
  PAGE_W,
  PAGE_H,
  GRID_PX,
  snap,
  clamp,
} from './lib/journalTemplate.js'
import { exportTemplatePdf } from './lib/exportJournalPdf.js'

export default function JournalPage() {
  const [library, setLibrary, history] = useUndoableState(
    LIBRARY_KEY,
    emptyLibrary(),
    migrateLibrary,
  )
  const isReady = history.isReady
  const [selectedBoxId, setSelectedBoxId] = useState(null)
  const [activePageIndex, setActivePageIndex] = useState(0)

  const { undo, redo } = history

  const templates = library.templates
  const activeId = library.activeTemplateId
  const activeTemplate =
    templates.find((t) => t.id === activeId) ?? templates[0] ?? null

  // Clamp activePageIndex if a template's page count drops below it.
  useEffect(() => {
    if (!activeTemplate) return
    if (activePageIndex >= activeTemplate.pages.length) {
      setActivePageIndex(0)
    }
  }, [activeTemplate, activePageIndex])

  // Reset selection + page when switching templates.
  useEffect(() => {
    setSelectedBoxId(null)
    setActivePageIndex(0)
  }, [activeId])

  // If the active template id ever points at a removed template, fix it.
  useEffect(() => {
    if (!activeTemplate && templates.length > 0) {
      setLibrary({ ...library, activeTemplateId: templates[0].id })
    }
  }, [templates, activeTemplate])

  const activePage = activeTemplate?.pages[activePageIndex] ?? activeTemplate?.pages[0]
  const boxes = activePage?.boxes ?? []
  const selectedBox = boxes.find((b) => b.id === selectedBoxId) ?? null

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
      pages: original.pages.map((p) => ({
        id: uuid(),
        boxes: p.boxes.map((b) => ({ ...b, id: uuid() })),
      })),
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

  /* ---------- page management ---------- */
  const updateActivePage = (patch) => {
    if (!activeTemplate || !activePage) return
    updateActiveTemplate({
      pages: activeTemplate.pages.map((p, i) =>
        i === activePageIndex ? { ...p, ...patch } : p,
      ),
    })
  }

  const handleToggleTwoSided = (twoSided) => {
    if (!activeTemplate) return
    if (twoSided) {
      if (activeTemplate.pages.length >= 2) return
      updateActiveTemplate({
        pages: [...activeTemplate.pages, newPage()],
      })
    } else {
      if (activeTemplate.pages.length <= 1) return
      const back = activeTemplate.pages[1]
      if (back.boxes.length > 0) {
        if (!confirm('Remove the back side and all of its boxes?')) return
      }
      updateActiveTemplate({ pages: [activeTemplate.pages[0]] })
      setActivePageIndex(0)
    }
  }

  /* ---------- box management ---------- */
  const updateBoxes = (next) => updateActivePage({ boxes: next })

  const handleChangeBox = (id, patch) => {
    if (!activePage) return
    updateBoxes(activePage.boxes.map((b) => (b.id === id ? { ...b, ...patch } : b)))
  }

  const handleDeleteBox = (id) => {
    if (!activePage) return
    updateBoxes(activePage.boxes.filter((b) => b.id !== id))
    if (selectedBoxId === id) setSelectedBoxId(null)
  }

  const handleDuplicateBox = (id) => {
    if (!activePage) return
    const original = activePage.boxes.find((b) => b.id === id)
    if (!original) return
    const copy = {
      ...structuredClone(original),
      id: uuid(),
      x: clamp(original.x + 16, 0, PAGE_W - original.w),
      y: clamp(original.y + 16, 0, PAGE_H - original.h),
      trackers: (original.trackers ?? []).map((t) => ({ ...t, id: uuid() })),
    }
    updateBoxes([...activePage.boxes, copy])
    setSelectedBoxId(copy.id)
  }

  const handleNudgeBox = (id, dx, dy) => {
    if (!activePage) return
    const box = activePage.boxes.find((b) => b.id === id)
    if (!box) return
    handleChangeBox(id, {
      x: clamp(box.x + dx, 0, PAGE_W - box.w),
      y: clamp(box.y + dy, 0, PAGE_H - box.h),
    })
  }

  const handleBringToFront = (id) => {
    if (!activePage) return
    const box = activePage.boxes.find((b) => b.id === id)
    if (!box) return
    updateBoxes([...activePage.boxes.filter((b) => b.id !== id), box])
  }

  const handleSendToBack = (id) => {
    if (!activePage) return
    const box = activePage.boxes.find((b) => b.id === id)
    if (!box) return
    updateBoxes([box, ...activePage.boxes.filter((b) => b.id !== id)])
  }

  const handleAddBox = () => {
    if (!activeTemplate || !activePage) return

    const NEW_W = 240
    const NEW_H = 144
    // Title band sits at top:24 with ~50px of content; 88 is the first
    // y clear of it.
    const TOP_OF_SHEET = 88

    const layoutBottom = activePage.boxes.reduce(
      (max, b) => Math.max(max, b.y + b.h),
      TOP_OF_SHEET - 8,
    )
    const stagger = (activePage.boxes.length % 6) * 8

    let y = snap(layoutBottom + 8 + stagger)
    let x = snap(24 + stagger)
    if (y + NEW_H > PAGE_H) {
      y = snap(TOP_OF_SHEET + stagger)
      x = snap(24 + stagger)
    }
    if (x + NEW_W > PAGE_W) x = PAGE_W - NEW_W

    const box = newBox({ title: 'New box', x, y, w: NEW_W, h: NEW_H })
    updateBoxes([...activePage.boxes, box])
    setSelectedBoxId(box.id)
  }

  /* ---------- keyboard ---------- */
  // All keyboard shortcuts in one place. Skipped while focus is in a
  // text input so typing labels doesn't trigger nudges.
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target
      const inEditable =
        t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
      if (inEditable) return

      const mod = e.ctrlKey || e.metaKey

      // Undo / redo
      if (mod) {
        const key = e.key.toLowerCase()
        if (key === 'z' && !e.shiftKey) {
          e.preventDefault()
          undo()
          return
        }
        if ((key === 'z' && e.shiftKey) || key === 'y') {
          e.preventDefault()
          redo()
          return
        }
        if (key === 'd' && selectedBoxId) {
          e.preventDefault()
          handleDuplicateBox(selectedBoxId)
          return
        }
      }

      if (!selectedBoxId) return

      // Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        handleDeleteBox(selectedBoxId)
        return
      }

      // Arrow nudge — Shift = 4× the snap (i.e. 32 px)
      const step = e.shiftKey ? GRID_PX * 4 : GRID_PX
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handleNudgeBox(selectedBoxId, -step, 0)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNudgeBox(selectedBoxId, step, 0)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        handleNudgeBox(selectedBoxId, 0, -step)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        handleNudgeBox(selectedBoxId, 0, step)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedBoxId, activePage, undo, redo])

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
          templates.length === 1 &&
          templates[0].pages.every((p) => p.boxes.length === 0)
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
          onUndo={undo}
          onRedo={redo}
          canUndo={history.canUndo}
          canRedo={history.canRedo}
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
              activePageIndex={activePageIndex}
              onChangeActivePage={(i) => {
                setActivePageIndex(i)
                setSelectedBoxId(null)
              }}
              selectedBoxId={selectedBoxId}
              onSelectBox={setSelectedBoxId}
              onChangeBox={handleChangeBox}
              onDeleteBox={handleDeleteBox}
            />
            <BoxInspector
              box={selectedBox}
              template={activeTemplate}
              activePageIndex={activePageIndex}
              onAddBox={handleAddBox}
              onChangeBox={handleChangeBox}
              onChangeTemplate={(patch) => updateActiveTemplate(patch)}
              onDeleteBox={handleDeleteBox}
              onDuplicateBox={handleDuplicateBox}
              onBringToFront={handleBringToFront}
              onSendToBack={handleSendToBack}
              onToggleTwoSided={handleToggleTwoSided}
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
