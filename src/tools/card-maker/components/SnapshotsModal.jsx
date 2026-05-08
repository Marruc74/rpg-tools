import { useState } from 'react'

function formatDate(ts) {
  return new Date(ts).toLocaleString()
}

function summarize(library) {
  const collections = library.collections?.length ?? 0
  const cards = (library.collections ?? []).reduce(
    (sum, c) => sum + (c.cards?.length ?? 0),
    0,
  )
  return `${collections} collection${collections === 1 ? '' : 's'}, ${cards} card${cards === 1 ? '' : 's'}`
}

export default function SnapshotsModal({
  snapshots,
  onSave,
  onRestore,
  onDelete,
  onClose,
}) {
  const [name, setName] = useState('')
  const [error, setError] = useState(null)

  const handleSave = async () => {
    setError(null)
    try {
      await onSave(name.trim() || `Snapshot ${snapshots.length + 1}`)
      setName('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal__header">
          <h2>Snapshots</h2>
          <button type="button" className="link" onClick={onClose}>Close</button>
        </header>

        <div className="modal__section">
          <h3>Save current</h3>
          <div className="row">
            <input
              type="text"
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <button onClick={handleSave}>Save snapshot</button>
          </div>
          {error && <p className="modal__error">{error}</p>}
        </div>

        <div className="modal__section">
          <h3>Saved ({snapshots.length})</h3>
          {snapshots.length === 0 ? (
            <p className="hint">No snapshots yet.</p>
          ) : (
            <ul className="snapshot-list">
              {snapshots
                .slice()
                .sort((a, b) => b.createdAt - a.createdAt)
                .map((s) => (
                  <li key={s.id}>
                    <div className="snapshot-list__body">
                      <div className="snapshot-list__name">{s.name}</div>
                      <div className="snapshot-list__meta">
                        {formatDate(s.createdAt)} · {summarize(s.library)}
                      </div>
                    </div>
                    <div className="snapshot-list__actions">
                      <button
                        onClick={() => {
                          if (confirm(`Restore "${s.name}"? This replaces your current library.`)) {
                            onRestore(s.id)
                          }
                        }}
                      >
                        Restore
                      </button>
                      <button
                        className="link"
                        onClick={() => {
                          if (confirm(`Delete "${s.name}"?`)) {
                            onDelete(s.id)
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
