import { useMemo, useState } from 'react'

const SORT_OPTIONS = [
  { value: 'manual', label: 'Manual order' },
  { value: 'name-asc', label: 'Name A → Z' },
  { value: 'name-desc', label: 'Name Z → A' },
  { value: 'category', label: 'Category' },
]

function sortCards(cards, mode) {
  if (mode === 'manual') return cards
  const copy = cards.slice()
  if (mode === 'name-asc') {
    copy.sort((a, b) => a.name.localeCompare(b.name))
  } else if (mode === 'name-desc') {
    copy.sort((a, b) => b.name.localeCompare(a.name))
  } else if (mode === 'category') {
    copy.sort(
      (a, b) =>
        (a.category || '').localeCompare(b.category || '') ||
        a.name.localeCompare(b.name),
    )
  }
  return copy
}

export default function CardList({
  cards,
  selectedId,
  onSelect,
  onNew,
  onDelete,
  onDuplicate,
  onReorder,
}) {
  const [filter, setFilter] = useState('')
  const [sort, setSort] = useState('manual')
  const [dragId, setDragId] = useState(null)
  const [dropId, setDropId] = useState(null)

  const visible = useMemo(() => {
    const filtered = filter.trim()
      ? cards.filter((c) => {
          const q = filter.toLowerCase()
          return (
            c.name.toLowerCase().includes(q) ||
            (c.category || '').toLowerCase().includes(q)
          )
        })
      : cards
    return sortCards(filtered, sort)
  }, [cards, filter, sort])

  const canDrag = sort === 'manual' && !filter.trim()

  return (
    <aside className="card-list">
      <div className="card-list__header">
        <button className="primary" onClick={onNew}>+ New card</button>
        <input
          type="search"
          placeholder="Filter…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select
          className="card-list__sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          title="Sort cards"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <ul className="card-list__items">
        {visible.length === 0 && (
          <li className="card-list__empty">
            {cards.length === 0 ? 'No cards yet. Click "New card" to begin.' : 'No matches.'}
          </li>
        )}
        {visible.map((card) => {
          const classes = [
            card.id === selectedId ? 'is-selected' : '',
            dropId === card.id && dragId !== card.id ? 'is-drop-target' : '',
            dragId === card.id ? 'is-dragging' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <li
              key={card.id}
              className={classes}
              draggable={canDrag}
              onDragStart={(e) => {
                if (!canDrag) return
                setDragId(card.id)
                e.dataTransfer.effectAllowed = 'move'
                e.dataTransfer.setData('text/plain', card.id)
              }}
              onDragEnter={(e) => {
                if (!canDrag || !dragId) return
                e.preventDefault()
                setDropId(card.id)
              }}
              onDragOver={(e) => {
                if (!canDrag || !dragId) return
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
              }}
              onDrop={(e) => {
                if (!canDrag || !dragId) return
                e.preventDefault()
                onReorder(dragId, card.id)
                setDragId(null)
                setDropId(null)
              }}
              onDragEnd={() => {
                setDragId(null)
                setDropId(null)
              }}
              onClick={() => onSelect(card.id)}
            >
              <div className="card-list__body">
                <div className="card-list__name">{card.name || '(unnamed)'}</div>
                <div className="card-list__category">{card.category}</div>
              </div>
              <div className="card-list__actions">
                <button
                  className="icon-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDuplicate(card.id)
                  }}
                  title="Duplicate"
                  aria-label="Duplicate card"
                >
                  ⧉
                </button>
                <button
                  className="icon-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`Delete "${card.name}"?`)) onDelete(card.id)
                  }}
                  title="Delete"
                  aria-label="Delete card"
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
