export default function TemplateList({
  templates,
  activeId,
  onSelect,
  onNew,
  onDuplicate,
  onDelete,
  onRename,
}) {
  return (
    <aside className="template-list">
      <div className="template-list__header">
        <button className="primary" onClick={onNew}>+ New template</button>
      </div>
      <ul className="template-list__items">
        {templates.map((t) => {
          const isActive = t.id === activeId
          const boxCount = (t.pages ?? []).reduce(
            (n, p) => n + (p.boxes?.length ?? 0),
            0,
          )
          const sides = (t.pages ?? []).length === 2 ? '2 sides' : '1 side'
          return (
            <li
              key={t.id}
              className={isActive ? 'is-selected' : ''}
              onClick={() => onSelect(t.id)}
            >
              <input
                className="template-list__name"
                value={t.name}
                onChange={(e) => onRename(t.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="Template name"
              />
              <div className="template-list__meta">
                {boxCount} box{boxCount === 1 ? '' : 'es'} · {sides}
              </div>
              <div className="template-list__actions">
                <button
                  className="icon-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDuplicate(t.id)
                  }}
                  title="Duplicate template"
                  aria-label="Duplicate template"
                >
                  ⧉
                </button>
                {templates.length > 1 && (
                  <button
                    className="icon-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm(`Delete template "${t.name}"?`)) onDelete(t.id)
                    }}
                    title="Delete template"
                    aria-label="Delete template"
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
