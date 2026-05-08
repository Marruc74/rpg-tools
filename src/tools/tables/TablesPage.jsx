import { useState } from 'react'
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
} from './lib/tablesLibrary.js'
import TableList from './components/TableList.jsx'
import TableEditor from './components/TableEditor.jsx'
import RollHistory from './components/RollHistory.jsx'

export default function TablesPage() {
  const [library, setLibrary, isReady] = useIndexedDBState(
    TABLES_KEY,
    emptyLibrary(),
    migrateLibrary,
  )
  const [lastResult, setLastResult] = useState(null)
  const [error, setError] = useState(null)

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
        />

        {activeTable ? (
          <TableEditor
            table={activeTable}
            lastResult={lastResult}
            onChange={(next) => updateTable(activeTable.id, next)}
            onRoll={handleRoll}
          />
        ) : (
          <div className="empty-state">
            <p>No tables yet.</p>
            <button onClick={handleNew} className="primary">+ Create your first table</button>
          </div>
        )}

        <RollHistory history={library.history} onClear={handleClearHistory} />
      </main>

      {error && <div className="tables__error">{error}</div>}
    </div>
  )
}
