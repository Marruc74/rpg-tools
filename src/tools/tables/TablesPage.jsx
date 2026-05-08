import { useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import './tablesPage.css'
import { useIndexedDBState } from '../../shared/hooks/useIndexedDBState.js'
import {
  TABLES_KEY,
  emptyLibrary,
  migrateLibrary,
  newTable,
  rollTable as rollTableLib,
  addHistoryEntry,
  applyStarterPack,
  downloadTableJson,
  downloadLibraryJson,
  readJsonFile,
} from './lib/tablesLibrary.js'
import TableList from './components/TableList.jsx'
import TableEditor from './components/TableEditor.jsx'

export default function TablesPage() {
  const [library, setLibrary, isReady] = useIndexedDBState(
    TABLES_KEY,
    emptyLibrary(),
    migrateLibrary,
  )
  const [lastResult, setLastResult] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const tables = library.tables
  const activeTable =
    tables.find((t) => t.id === library.activeTableId) ?? tables[0] ?? null

  const updateTable = (id, patch) =>
    setLibrary({
      ...library,
      tables: tables.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })

  const handleSelect = (id) => setLibrary({ ...library, activeTableId: id })

  const handleNew = () => {
    const t = newTable({ name: `Table ${tables.length + 1}` })
    setLibrary({
      ...library,
      tables: [...tables, t],
      activeTableId: t.id,
    })
  }

  const handleDuplicate = (id) => {
    const original = tables.find((t) => t.id === id)
    if (!original) return
    const copy = {
      ...structuredClone(original),
      id: uuid(),
      name: `${original.name} (copy)`,
      entries: original.entries.map((e) => ({ ...e, id: uuid() })),
    }
    const idx = tables.findIndex((t) => t.id === id)
    const next = [...tables]
    next.splice(idx + 1, 0, copy)
    setLibrary({ ...library, tables: next, activeTableId: copy.id })
  }

  const handleRemove = (id) => {
    const remaining = tables.filter((t) => t.id !== id)
    setLibrary({
      ...library,
      tables: remaining,
      activeTableId:
        library.activeTableId === id ? remaining[0]?.id ?? null : library.activeTableId,
    })
  }

  const handleRename = (id, name) => updateTable(id, { name })

  const handleRoll = (table) => {
    const result = rollTableLib(table)
    if (!result) {
      setError('No usable entries — add some text and a weight > 0.')
      return
    }
    setError(null)
    setLastResult({ tableId: table.id, text: result.text })
    setLibrary(addHistoryEntry(library, table.id, table.name, result))
  }

  const handleClearHistory = () => {
    if (!confirm('Clear roll history?')) return
    setLibrary({ ...library, history: [] })
  }

  const handleAddStarterPack = () => {
    const { library: next, addedCount } = applyStarterPack(library)
    if (addedCount === 0) {
      alert('All starter tables are already in your library.')
      return
    }
    setLibrary(next)
    alert(`Added ${addedCount} starter table${addedCount === 1 ? '' : 's'}.`)
  }

  const handleExportTable = () => {
    if (!activeTable) return
    downloadTableJson(activeTable)
  }

  const handleExportLibrary = () => downloadLibraryJson(library)

  const handleImportClick = () => fileInputRef.current?.click()

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const parsed = await readJsonFile(file)
      if (parsed.kind === 'table') {
        setLibrary({
          ...library,
          tables: [...library.tables, parsed.table],
          activeTableId: parsed.table.id,
        })
        return
      }
      if (parsed.kind === 'library') {
        const replace =
          tables.length === 0
            ? true
            : confirm('Replace your current tables with the imported library? Click Cancel to merge by name (existing tables kept, new ones added).')
        if (replace) {
          setLibrary(parsed.library)
        } else {
          const existing = new Set(tables.map((t) => t.name.trim().toLowerCase()))
          const merged = [
            ...tables,
            ...parsed.library.tables.filter(
              (t) => !existing.has(t.name.trim().toLowerCase()),
            ),
          ]
          setLibrary({ ...library, tables: merged })
        }
      }
    } catch (err) {
      alert(`Import failed: ${err.message}`)
    }
  }

  if (!isReady) {
    return (
      <div className="tables">
        <header className="tables__header"><h1>Random tables</h1></header>
        <main className="tables__main"><p className="hint">Loading…</p></main>
      </div>
    )
  }

  return (
    <div className="tables">
      <header className="tables__header">
        <h1>Random tables</h1>
        <div className="tables__toolbar">
          <button onClick={handleExportTable} disabled={!activeTable} title="Export the active table as JSON">
            Export table
          </button>
          <button onClick={handleExportLibrary} disabled={tables.length === 0} title="Export the entire library as JSON">
            Export library
          </button>
          <button onClick={handleImportClick} title="Import a table or library JSON">
            Import…
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleImportFile}
            style={{ display: 'none' }}
          />
        </div>
      </header>

      <main className="tables__main">
        <TableList
          tables={tables}
          activeId={activeTable?.id}
          onSelect={handleSelect}
          onNew={handleNew}
          onDuplicate={handleDuplicate}
          onRemove={handleRemove}
          onRename={handleRename}
          onAddStarterPack={handleAddStarterPack}
        />

        {activeTable ? (
          <TableEditor
            table={activeTable}
            lastResult={lastResult}
            history={library.history}
            onChange={(next) => updateTable(activeTable.id, next)}
            onRoll={handleRoll}
            onClearHistory={handleClearHistory}
          />
        ) : (
          <div className="empty-state">
            <p>No tables yet.</p>
            <button onClick={handleNew} className="primary">+ Create your first table</button>
          </div>
        )}
      </main>

      {error && <div className="tables__error">{error}</div>}
    </div>
  )
}
