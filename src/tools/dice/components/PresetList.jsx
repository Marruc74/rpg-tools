import { useState } from 'react'

export default function PresetList({ presets, onRoll, onUpdate, onRemove, onAdd }) {
  const [editingId, setEditingId] = useState(null)

  return (
    <section className="presets">
      <header className="presets__header">
        <h2>Presets</h2>
        <button className="link" onClick={onAdd}>+ New preset</button>
      </header>
      {presets.length === 0 && (
        <p className="hint">No presets yet. Save an expression with the “+ Save” button to add one.</p>
      )}
      <ul className="presets__list">
        {presets.map((p) => {
          const isEditing = p.id === editingId
          return (
            <li key={p.id} className="preset">
              {isEditing ? (
                <div className="preset__editor">
                  <input
                    className="preset__name-input"
                    value={p.name}
                    onChange={(e) => onUpdate(p.id, { name: e.target.value })}
                    placeholder="Name"
                    autoFocus
                  />
                  <input
                    className="preset__expr-input"
                    value={p.expression}
                    onChange={(e) => onUpdate(p.id, { expression: e.target.value })}
                    placeholder="Expression"
                    spellCheck={false}
                  />
                  <button className="link" onClick={() => setEditingId(null)}>Done</button>
                </div>
              ) : (
                <button className="preset__roll" onClick={() => onRoll(p)}>
                  <span className="preset__name">{p.name}</span>
                  <span className="preset__expr">{p.expression}</span>
                </button>
              )}
              {!isEditing && (
                <div className="preset__actions">
                  <button className="icon-button" onClick={() => setEditingId(p.id)} title="Edit">✎</button>
                  <button
                    className="icon-button"
                    onClick={() => {
                      if (confirm(`Delete preset "${p.name}"?`)) onRemove(p.id)
                    }}
                    title="Delete"
                  >×</button>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
