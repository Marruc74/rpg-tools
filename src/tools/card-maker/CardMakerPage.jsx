import { useEffect, useMemo, useRef, useState } from 'react'
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
import { useUndoableState } from './hooks/useUndoableState.js'
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

  const handleRenameCollection = (id, name) => updateCollection(id, { name })

  const handleUpdateCollectionStyle = (id, style) =>
    updateCollection(id, { style })

  const handleUpdateCollectionSize = (id, size) =>
    updateCollection(id, { size })

  const handleUpdateCollectionCategories = (id, categories) =>
    updateCollection(id, { categories })

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

  const handleExportPdf = async () => {
    if (cards.length === 0) return
    await exportLibraryPdf(cards, activeCollection?.size)
  }

  const handleExportLibraryJson = () => downloadJson(library)

  const handleExportCollectionJson = () => {
    if (!activeCollection) return
    downloadCollectionJson(activeCollection)
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

  return (
    <div className="app">
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
          hasSelection={!!selected}
          hasCollection={!!activeCollection}
          cardCount={cards.length}
        />
      </header>

      <main className="app__main">
        <CollectionList
          collections={collections}
          activeId={activeCollection?.id}
          onSelect={handleSelectCollection}
          onNew={handleNewCollection}
          onDelete={handleDeleteCollection}
          onRename={handleRenameCollection}
          onUpdateStyle={handleUpdateCollectionStyle}
          onUpdateSize={handleUpdateCollectionSize}
          onUpdateCategories={handleUpdateCollectionCategories}
        />

        <CardList
          cards={cards}
          selectedId={selectedId}
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
              onChange={updateCard}
            />
            <CardPreview
              card={selected}
              gameName={activeCollection?.name ?? ''}
              sizeId={activeCollection?.size}
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

      <HiddenExportArea
        cards={cards}
        gameName={activeCollection?.name ?? ''}
        sizeId={activeCollection?.size}
      />
    </div>
  )
}
