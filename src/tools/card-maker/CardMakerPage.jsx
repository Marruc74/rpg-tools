import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import './cardMaker.css'
import './styles/card.css'
import CollectionList from './components/CollectionList.jsx'
import CardList from './components/CardList.jsx'
import CardEditor from './components/CardEditor.jsx'
import CardPreview from './components/CardPreview.jsx'
import Toolbar from './components/Toolbar.jsx'
import HiddenExportArea from './components/HiddenExportArea.jsx'
import StorageIndicator from './components/StorageIndicator.jsx'
import PdfPreview from './components/PdfPreview.jsx'
import SnapshotsModal from './components/SnapshotsModal.jsx'
import { useUndoableState } from '../../shared/hooks/useUndoableState.js'
import { useBackupNudge } from './hooks/useBackupNudge.js'
import { useSnapshots } from './hooks/useSnapshots.js'
import { newCard } from './lib/newCard.js'
import {
  LIBRARY_KEY,
  emptyLibrary,
  migrateLibrary,
  newCollection,
  downloadJson,
  downloadCollectionJson,
  downloadCardJson,
  readJsonFile,
} from './lib/library.js'
import { exportCardPngs } from './lib/exportPng.js'
import { exportLibraryPdf } from './lib/exportPdf.js'

export default function CardMakerPage() {
  const [library, setLibrary, history] = useUndoableState(
    LIBRARY_KEY,
    emptyLibrary(),
    migrateLibrary,
  )
  const backup = useBackupNudge()

  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false)
  // null when idle; { done, total } while a PDF export is running.
  const [exportProgress, setExportProgress] = useState(null)
  const [pdfOptions, setPdfOptions] = useState({
    sides: 'both',
    pageSize: 'a4',
    scale: 1,
  })

  const [snapshotsOpen, setSnapshotsOpen] = useState(false)
  const snapshotsApi = useSnapshots()

  const handleSaveSnapshot = (name) => snapshotsApi.save(name, library)
  const handleRestoreSnapshot = (id) => {
    const restored = snapshotsApi.restore(id)
    if (restored) {
      setLibrary(restored)
      setSnapshotsOpen(false)
    }
  }

  const [overflowMap, setOverflowMap] = useState(() => new Map())
  const handleOverflowChange = useCallback((cardId, side, overflows) => {
    setOverflowMap((prev) => {
      const cur = prev.get(cardId) ?? { front: false, back: false }
      if (cur[side] === overflows) return prev
      const next = new Map(prev)
      next.set(cardId, { ...cur, [side]: overflows })
      return next
    })
  }, [])
  const overflowingIds = useMemo(() => {
    const set = new Set()
    for (const [id, sides] of overflowMap) {
      if (sides.front || sides.back) set.add(id)
    }
    return set
  }, [overflowMap])

  const collections = library.collections
  const activeCollectionId = library.activeCollectionId
  const activeCollection =
    collections.find((c) => c.id === activeCollectionId) ?? collections[0]

  const [selectedId, setSelectedId] = useState(activeCollection?.cards[0]?.id ?? null)

  const frontRef = useRef(null)
  const backRef = useRef(null)

  const cards = activeCollection?.cards ?? []
  const selected = useMemo(
    () => cards.find((c) => c.id === selectedId) ?? null,
    [cards, selectedId],
  )

  // Reset card selection when switching collections.
  useEffect(() => {
    setSelectedId(activeCollection?.cards[0]?.id ?? null)
  }, [activeCollectionId])

  // If selected card was removed, fall back to first card.
  useEffect(() => {
    if (selectedId && !cards.find((c) => c.id === selectedId)) {
      setSelectedId(cards[0]?.id ?? null)
    }
  }, [cards, selectedId])

  // Global Ctrl/Cmd+Z (undo) and Ctrl/Cmd+Shift+Z or Ctrl+Y (redo).
  // Skip when focus is inside a text input — let the browser's native
  // undo handle character-level edits.
  const { undo, redo } = history
  useEffect(() => {
    const onKey = (e) => {
      const mod = e.ctrlKey || e.metaKey
      if (!mod) return
      const t = e.target
      const inEditable =
        t &&
        (t.tagName === 'INPUT' ||
          t.tagName === 'TEXTAREA' ||
          t.isContentEditable)
      if (inEditable) return

      const key = e.key.toLowerCase()
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if ((key === 'z' && e.shiftKey) || key === 'y') {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo])

  /* ---------- collection helpers ---------- */
  const updateCollection = (id, patch) => {
    setLibrary({
      ...library,
      collections: collections.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })
  }

  const updateActiveCollection = (patch) =>
    activeCollection && updateCollection(activeCollection.id, patch)

  const handleNewCollection = () => {
    const col = newCollection({ name: 'New collection' })
    setLibrary({
      ...library,
      collections: [...collections, col],
      activeCollectionId: col.id,
    })
  }

  const handleSelectCollection = (id) => {
    setLibrary({ ...library, activeCollectionId: id })
  }

  const handleDeleteCollection = (id) => {
    const remaining = collections.filter((c) => c.id !== id)
    if (remaining.length === 0) return
    setLibrary({
      ...library,
      collections: remaining,
      activeCollectionId:
        activeCollectionId === id ? remaining[0].id : activeCollectionId,
    })
  }

  const handleDuplicateCollection = (id) => {
    const original = collections.find((c) => c.id === id)
    if (!original) return
    const copy = {
      ...structuredClone(original),
      id: uuid(),
      name: `${original.name} (copy)`,
      cards: original.cards.map((card) => ({
        ...structuredClone(card),
        id: uuid(),
      })),
    }
    const idx = collections.findIndex((c) => c.id === id)
    const next = [...collections]
    next.splice(idx + 1, 0, copy)
    setLibrary({
      ...library,
      collections: next,
      activeCollectionId: copy.id,
    })
  }

  const handleRenameCollection = (id, name) => updateCollection(id, { name })

  const handleUpdateCollectionStyle = (id, style) =>
    updateCollection(id, { style })

  const handleUpdateCollectionSize = (id, size) =>
    updateCollection(id, { size })

  const handleUpdateCollectionCategories = (id, categories) =>
    updateCollection(id, { categories })

  const handleUpdateCollectionBackMode = (id, backMode) =>
    updateCollection(id, { backMode })

  const handleUpdateCollectionSharedBack = (id, category, side) => {
    const col = collections.find((c) => c.id === id)
    if (!col || !category) return
    updateCollection(id, {
      sharedBacks: { ...(col.sharedBacks ?? {}), [category]: side },
    })
  }

  /* ---------- card helpers (operate on active collection) ---------- */
  const updateCard = (next) => {
    updateActiveCollection({
      cards: cards.map((c) => (c.id === next.id ? next : c)),
    })
  }

  const handleNewCard = () => {
    const card = newCard({
      style: { ...(activeCollection?.style ?? {}) },
    })
    updateActiveCollection({ cards: [card, ...cards] })
    setSelectedId(card.id)
  }

  const handleDeleteCard = (id) => {
    updateActiveCollection({ cards: cards.filter((c) => c.id !== id) })
  }

  const handleReorderCards = (fromId, toId) => {
    if (fromId === toId) return
    const fromIdx = cards.findIndex((c) => c.id === fromId)
    const toIdx = cards.findIndex((c) => c.id === toId)
    if (fromIdx === -1 || toIdx === -1) return
    const next = cards.slice()
    const [moved] = next.splice(fromIdx, 1)
    next.splice(toIdx, 0, moved)
    updateActiveCollection({ cards: next })
  }

  const handleDuplicateCard = (id) => {
    const original = cards.find((c) => c.id === id)
    if (!original) return
    const copy = {
      ...structuredClone(original),
      id: uuid(),
      name: `${original.name} (copy)`,
    }
    const idx = cards.findIndex((c) => c.id === id)
    const next = [...cards]
    next.splice(idx + 1, 0, copy)
    updateActiveCollection({ cards: next })
    setSelectedId(copy.id)
  }

  /* ---------- exports ---------- */
  const handleExportPng = async () => {
    if (!selected || !frontRef.current || !backRef.current) return
    await exportCardPngs(selected, frontRef.current, backRef.current)
  }

  const handleExportPdf = async (options = {}) => {
    if (cards.length === 0) return
    setExportProgress({ done: 0, total: 0 })
    try {
      await exportLibraryPdf(cards, activeCollection?.size, {
        ...options,
        onProgress: (done, total) => setExportProgress({ done, total }),
      })
    } catch (err) {
      console.error('[card-maker] PDF export crashed:', err)
      alert(
        `PDF export failed: ${err?.message || err}\n\n` +
          `See the browser console (F12) for the full error.`,
      )
    } finally {
      setExportProgress(null)
    }
  }

  const handleExportLibraryJson = () => {
    downloadJson(library)
    backup.markExported()
  }

  const handleExportCollectionJson = () => {
    if (!activeCollection) return
    downloadCollectionJson(activeCollection)
    backup.markExported()
  }

  const handleExportCardJson = () => {
    if (!selected) return
    downloadCardJson(selected)
  }

  const handleImportJson = async (file) => {
    try {
      const parsed = await readJsonFile(file)

      if (parsed.kind === 'card') {
        if (!activeCollection) {
          alert('No active collection to import the card into.')
          return
        }
        const card = { ...parsed.card, id: uuid() }
        updateActiveCollection({ cards: [card, ...cards] })
        setSelectedId(card.id)
        return
      }

      if (parsed.kind === 'collection') {
        const col = { ...parsed.collection, id: uuid() }
        setLibrary({
          ...library,
          collections: [...collections, col],
          activeCollectionId: col.id,
        })
        return
      }

      // kind === 'library'
      const incoming = parsed.library
      const choice =
        collections.length === 1 && collections[0].cards.length === 0
          ? 'replace'
          : confirm(
              'Replace your current library with the imported one? Click Cancel to add imported collections to the existing library.',
            )
            ? 'replace'
            : 'merge'

      if (choice === 'replace') {
        setLibrary(incoming)
      } else {
        const existingIds = new Set(collections.map((c) => c.id))
        const merged = [
          ...collections,
          ...incoming.collections.filter((c) => !existingIds.has(c.id)),
        ]
        setLibrary({ ...library, collections: merged })
      }
    } catch (err) {
      alert(`Import failed: ${err.message}`)
    }
  }

  /* ---------- render ---------- */
  if (!history.isReady) {
    return (
      <div className="app">
        <header className="app__header">
          <h1>Card-Maker</h1>
        </header>
        <main className="app__main app__main--loading">
          <p className="hint">Loading library…</p>
        </main>
      </div>
    )
  }

  const hasAnyCards = collections.some((c) => c.cards.length > 0)
  const showBackupBanner = backup.isStale && hasAnyCards

  return (
    <div className="app">
      {showBackupBanner && (
        <div className="backup-banner" role="status">
          <span>
            {backup.lastExport
              ? `It's been over 2 weeks since your last library export. Browser storage isn't a backup — keep a JSON copy somewhere safe.`
              : `Tip: export your library to JSON every now and then. Browser storage is local to this machine and can be wiped.`}
          </span>
          <div className="backup-banner__actions">
            <button onClick={handleExportLibraryJson}>Export library now</button>
            <button onClick={backup.snooze} className="link">
              Remind me later
            </button>
          </div>
        </div>
      )}
      <header className="app__header">
        <h1>Card-Maker</h1>
        <StorageIndicator library={library} />
        <Toolbar
          onExportPng={handleExportPng}
          onExportPdf={handleExportPdf}
          onExportLibraryJson={handleExportLibraryJson}
          onExportCollectionJson={handleExportCollectionJson}
          onExportCardJson={handleExportCardJson}
          onImportJson={handleImportJson}
          onUndo={history.undo}
          onRedo={history.redo}
          canUndo={history.canUndo}
          canRedo={history.canRedo}
          onTogglePdfPreview={() => setPdfPreviewOpen((v) => !v)}
          pdfPreviewOpen={pdfPreviewOpen}
          onPdfOptionsChange={setPdfOptions}
          onOpenSnapshots={() => setSnapshotsOpen(true)}
          hasSelection={!!selected}
          hasCollection={!!activeCollection}
          cardCount={cards.length}
          exportProgress={exportProgress}
        />
      </header>

      <main className="app__main">
        <CollectionList
          collections={collections}
          activeId={activeCollection?.id}
          onSelect={handleSelectCollection}
          onNew={handleNewCollection}
          onDelete={handleDeleteCollection}
          onDuplicate={handleDuplicateCollection}
          onRename={handleRenameCollection}
          onUpdateStyle={handleUpdateCollectionStyle}
          onUpdateSize={handleUpdateCollectionSize}
          onUpdateCategories={handleUpdateCollectionCategories}
          onUpdateBackMode={handleUpdateCollectionBackMode}
          onUpdateSharedBack={handleUpdateCollectionSharedBack}
        />

        <CardList
          cards={cards}
          categories={activeCollection?.categories ?? []}
          sizeId={activeCollection?.size}
          selectedId={selectedId}
          overflowingIds={overflowingIds}
          onSelect={setSelectedId}
          onNew={handleNewCard}
          onDelete={handleDeleteCard}
          onDuplicate={handleDuplicateCard}
          onReorder={handleReorderCards}
        />

        {selected ? (
          <>
            <CardEditor
              card={selected}
              collectionStyle={activeCollection?.style}
              categories={activeCollection?.categories}
              backMode={activeCollection?.backMode}
              onChange={updateCard}
            />
            <CardPreview
              card={selected}
              gameName={activeCollection?.name ?? ''}
              sizeId={activeCollection?.size}
              backMode={activeCollection?.backMode}
              sharedBacks={activeCollection?.sharedBacks}
              frontRef={frontRef}
              backRef={backRef}
            />
          </>
        ) : (
          <div className="empty-state">
            <p>No card selected.</p>
            <button className="primary" onClick={handleNewCard}>
              + Create your first card
            </button>
          </div>
        )}
      </main>

      {pdfPreviewOpen && (
        <PdfPreview
          cards={cards}
          sizeId={activeCollection?.size}
          backMode={activeCollection?.backMode}
          sharedBacks={activeCollection?.sharedBacks}
          options={pdfOptions}
          onClose={() => setPdfPreviewOpen(false)}
        />
      )}

      {snapshotsOpen && (
        <SnapshotsModal
          snapshots={snapshotsApi.snapshots}
          onSave={handleSaveSnapshot}
          onRestore={handleRestoreSnapshot}
          onDelete={snapshotsApi.remove}
          onClose={() => setSnapshotsOpen(false)}
        />
      )}

      <HiddenExportArea
        cards={cards}
        gameName={activeCollection?.name ?? ''}
        sizeId={activeCollection?.size}
        backMode={activeCollection?.backMode}
        sharedBacks={activeCollection?.sharedBacks}
        onOverflowChange={handleOverflowChange}
      />
    </div>
  )
}
