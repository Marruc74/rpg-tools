export default function TableList({ tables, activeId, onSelect, onNew, onDuplicate, onRemove, onRename }) {
  return (
    <aside className="tables-list">
      <div className="tables-list__header">
        <button className="primary" onClick={onNew}>+ New table</button>
      </div>
      <ul className="tables-list__items">
        {tables.length === 0 && <li className="tables-list__empty">No tables yet.</li>}
        {tables.map((t) => {
          const active = t.id === activeId
          return (
            <li
              key={t.id}
              className={active ? 'is-selected' : ''}
              onClick={() => onSelect(t.id)}
            >
              <input
                className="tables-list__name"
                value={t.name}
                onChange={(e) => onRename(t.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="Table name"
              />
              <div className="tables-list__meta">
                {t.entries.length} entr{t.entries.length === 1 ? 'y' : 'ies'}
              </div>
              <div className="tables-list__actions">
                <button
                  className="icon-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDuplicate(t.id)
                  }}
                  title="Duplicate table"
                  aria-label="Duplicate"
                >
                  ⧉
                </button>
                <button
                  className="icon-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`Delete table "${t.name}"?`)) onRemove(t.id)
                  }}
                  title="Delete table"
                  aria-label="Delete"
                >
                  ×
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
