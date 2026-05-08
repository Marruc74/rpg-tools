function formatShortDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

export default function EntryList({
  entries,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onDuplicate,
}) {
  return (
    <aside className="entry-list">
      <div className="entry-list__header">
        <button className="primary" onClick={onNew}>+ New entry</button>
      </div>
      <ul className="entry-list__items">
        {entries.length === 0 && (
          <li className="entry-list__empty">No entries yet.</li>
        )}
        {entries.map((entry) => {
          const isActive = entry.id === activeId
          return (
            <li
              key={entry.id}
              className={isActive ? 'is-selected' : ''}
              onClick={() => onSelect(entry.id)}
            >
              <div className="entry-list__body">
                <div className="entry-list__title">{entry.title || '(untitled)'}</div>
                <div className="entry-list__meta">{formatShortDate(entry.date)}</div>
              </div>
              <div className="entry-list__actions">
                <button
                  className="icon-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDuplicate(entry.id)
                  }}
                  title="Duplicate entry"
                  aria-label="Duplicate entry"
                >
                  ⧉
                </button>
                {entries.length > 1 && (
                  <button
                    className="icon-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm(`Delete "${entry.title || 'this entry'}"?`)) {
                        onDelete(entry.id)
                      }
                    }}
                    title="Delete entry"
                    aria-label="Delete entry"
                  >
                    ×
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
