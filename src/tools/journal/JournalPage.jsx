import { useEffect, useRef, useState } from 'react'
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

function computeGuides(boxes, dragStartMap) {
  const vert = new Set()
  const horz = new Set()
  const moving = boxes.filter((b) => dragStartMap.has(b.id))
  const stationary = boxes.filter((b) => !dragStartMap.has(b.id))
  if (moving.length === 0 || stationary.length === 0) {
    return { vertical: [], horizontal: [] }
  }
  for (const m of moving) {
    const mxs = [m.x, m.x + m.w / 2, m.x + m.w]
    const mys = [m.y, m.y + m.h / 2, m.y + m.h]
    for (const s of stationary) {
      const sxs = [s.x, s.x + s.w / 2, s.x + s.w]
      const sys = [s.y, s.y + s.h / 2, s.y + s.h]
      for (const mx of mxs) {
        for (const sx of sxs) {
          if (Math.abs(mx - sx) < 1) vert.add(Math.round(sx))
        }
      }
      for (const my of mys) {
        for (const sy of sys) {
          if (Math.abs(my - sy) < 1) horz.add(Math.round(sy))
        }
      }
    }
  }
  return { vertical: [...vert], horizontal: [...horz] }
}

export default function JournalPage() {
  const [library, setLibrary, history] = useUndoableState(
    LIBRARY_KEY,
    emptyLibrary(),
    migrateLibrary,
  )
  const isReady = history.isReady
  const [selectedBoxIds, setSelectedBoxIds] = useState(() => new Set())
  const [activePageIndex, setActivePageIndex] = useState(0)
  const [guides, setGuides] = useState({ vertical: [], horizontal: [] })
  const dragStartRef = useRef(null)

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
    setSelectedBoxIds(new Set())
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
  const selectedBoxes = boxes.filter((b) => selectedBoxIds.has(b.id))
  // Inspector's Box panel only makes sense with one selection.
  const primarySelectedBox = selectedBoxes.length === 1 ? selectedBoxes[0] : null

  const handleSelectBox = (id, additive = false) => {
    if (id === null) {
      setSelectedBoxIds(new Set())
      return
    }
    if (additive) {
      setSelectedBoxIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
    } else {
      // Plain click on an already-selected (single) box keeps the
      // selection; clicking a different box replaces.
      if (selectedBoxIds.size === 1 && selectedBoxIds.has(id)) return
      if (selectedBoxIds.has(id) && selectedBoxIds.size > 1) return
      setSelectedBoxIds(new Set([id]))
    }
  }

  const handleSelectMany = (ids, additive = false) => {
    setSelectedBoxIds((prev) => {
      if (additive) {
        const next = new Set(prev)
        ids.forEach((id) => next.add(id))
        return next
      }
      return new Set(ids)
    })
  }

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

  /* ---------- gesture move (multi-box drag) ---------- */
  const handleMoveStart = (sourceBoxId, additive) => {
    if (!activePage) return
    // Pick the set of boxes that participate in this drag. If the
    // dragged box is already part of the selection, drag everything
    // selected; otherwise this drag works on just that box and updates
    // the selection accordingly.
    let dragIds
    if (selectedBoxIds.has(sourceBoxId)) {
      dragIds = new Set(selectedBoxIds)
    } else if (additive) {
      dragIds = new Set(selectedBoxIds).add(sourceBoxId)
      setSelectedBoxIds(dragIds)
    } else {
      dragIds = new Set([sourceBoxId])
      setSelectedBoxIds(dragIds)
    }
    const map = new Map()
    activePage.boxes.forEach((b) => {
      if (dragIds.has(b.id)) map.set(b.id, { x: b.x, y: b.y })
    })
    dragStartRef.current = map
  }

  const handleMoveDelta = (dx, dy) => {
    if (!dragStartRef.current || !activePage) return
    const next = activePage.boxes.map((b) => {
      const start = dragStartRef.current.get(b.id)
      if (!start) return b
      return {
        ...b,
        x: clamp(snap(start.x + dx), 0, PAGE_W - b.w),
        y: clamp(snap(start.y + dy), 0, PAGE_H - b.h),
      }
    })
    updateBoxes(next)
    setGuides(computeGuides(next, dragStartRef.current))
  }

  const handleMoveEnd = () => {
    dragStartRef.current = null
    setGuides({ vertical: [], horizontal: [] })
  }

  const handleChangeBox = (id, patch) => {
    if (!activePage) return
    updateBoxes(activePage.boxes.map((b) => (b.id === id ? { ...b, ...patch } : b)))
  }

  const handleDeleteBox = (id) => {
    if (!activePage) return
    updateBoxes(activePage.boxes.filter((b) => b.id !== id))
    setSelectedBoxIds((prev) => {
      if (!prev.has(id)) return prev
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const handleDeleteSelected = () => {
    if (!activePage || selectedBoxIds.size === 0) return
    const ids = selectedBoxIds
    if (ids.size > 1 && !confirm(`Delete ${ids.size} boxes?`)) return
    updateBoxes(activePage.boxes.filter((b) => !ids.has(b.id)))
    setSelectedBoxIds(new Set())
  }

  const handleDuplicateSelected = () => {
    if (!activePage || selectedBoxIds.size === 0) return
    const additions = []
    activePage.boxes.forEach((b) => {
      if (!selectedBoxIds.has(b.id)) return
      additions.push({
        ...structuredClone(b),
        id: uuid(),
        x: clamp(b.x + 16, 0, PAGE_W - b.w),
        y: clamp(b.y + 16, 0, PAGE_H - b.h),
        trackers: (b.trackers ?? []).map((t) => ({ ...t, id: uuid() })),
      })
    })
    updateBoxes([...activePage.boxes, ...additions])
    setSelectedBoxIds(new Set(additions.map((b) => b.id)))
  }

  const handleNudgeSelected = (dx, dy) => {
    if (!activePage || selectedBoxIds.size === 0) return
    updateBoxes(
      activePage.boxes.map((b) => {
        if (!selectedBoxIds.has(b.id)) return b
        return {
          ...b,
          x: clamp(b.x + dx, 0, PAGE_W - b.w),
          y: clamp(b.y + dy, 0, PAGE_H - b.h),
        }
      }),
    )
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
        if (key === 'd' && selectedBoxIds.size > 0) {
          e.preventDefault()
          handleDuplicateSelected()
          return
        }
        if (key === 'a') {
          e.preventDefault()
          if (activePage) {
            setSelectedBoxIds(new Set(activePage.boxes.map((b) => b.id)))
          }
          return
        }
      }

      if (selectedBoxIds.size === 0) return

      // Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        handleDeleteSelected()
        return
      }

      // Arrow nudge — Shift = 4× the snap (i.e. 32 px)
      const step = e.shiftKey ? GRID_PX * 4 : GRID_PX
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handleNudgeSelected(-step, 0)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNudgeSelected(step, 0)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        handleNudgeSelected(0, -step)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        handleNudgeSelected(0, step)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedBoxIds, activePage, undo, redo])

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
                setSelectedBoxIds(new Set())
              }}
              selectedBoxIds={selectedBoxIds}
              onSelectBox={handleSelectBox}
              onSelectMany={handleSelectMany}
              onChangeBox={handleChangeBox}
              onMoveStart={handleMoveStart}
              onMoveDelta={handleMoveDelta}
              onMoveEnd={handleMoveEnd}
              guides={guides}
            />
            <BoxInspector
              box={primarySelectedBox}
              selectionCount={selectedBoxIds.size}
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
              onDeleteSelected={handleDeleteSelected}
              onDuplicateSelected={handleDuplicateSelected}
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
