import { newEntry } from '../lib/tablesLibrary.js'

export default function TableEditor({ table, lastResult, onChange, onRoll }) {
  const update = (patch) => onChange({ ...table, ...patch })

  const updateEntry = (id, patch) =>
    update({
      entries: table.entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    })

  const removeEntry = (id) =>
    update({ entries: table.entries.filter((e) => e.id !== id) })

  const addEntry = () => update({ entries: [...table.entries, newEntry()] })

  const totalWeight = table.entries.reduce(
    (s, e) => s + (e.text.trim() ? e.weight : 0),
    0,
  )

  return (
    <section className="table-editor">
      <header className="table-editor__head">
        <input
          type="text"
          className="table-editor__name"
          value={table.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="Table name"
        />
        <button className="table-editor__roll" onClick={() => onRoll(table)}>
          🎲 Roll
        </button>
      </header>

      <textarea
        className="table-editor__description"
        value={table.description}
        onChange={(e) => update({ description: e.target.value })}
        rows={2}
        placeholder="Optional description (what is this table for?)"
      />

      {lastResult && lastResult.tableId === table.id && (
        <div className="table-editor__result">
          <span className="table-editor__result-label">Last roll:</span>
          <span className="table-editor__result-text">{lastResult.text}</span>
        </div>
      )}

      <div className="entries">
        <div className="entries__head">
          <span>Entries</span>
          <span className="hint">Total weight: {totalWeight}</span>
        </div>
        {table.entries.map((e) => (
          <div key={e.id} className="entry-row">
            <input
              type="text"
              value={e.text}
              onChange={(ev) => updateEntry(e.id, { text: ev.target.value })}
              placeholder="Entry text"
              className="entry-row__text"
            />
            <input
              type="number"
              min="0"
              max="1000"
              value={e.weight}
              onChange={(ev) =>
                updateEntry(e.id, {
                  weight: Math.max(0, Math.min(1000, Number(ev.target.value) || 0)),
                })
              }
              className="entry-row__weight"
              title="Weight (higher = more likely)"
            />
            <button
              className="icon-button"
              onClick={() => removeEntry(e.id)}
              title="Remove entry"
              aria-label="Remove"
            >
              ×
            </button>
          </div>
        ))}
        <button type="button" className="link" onClick={addEntry}>
          + Add entry
        </button>
      </div>
    </section>
  )
}
