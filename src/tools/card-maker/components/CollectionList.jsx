import StyleFields from './StyleFields.jsx'
import { DEFAULT_STYLE } from '../lib/newCard.js'
import { CARD_SIZES, DEFAULT_SIZE_ID, isCustomSize } from '../lib/cardSizes.js'
import { DEFAULT_CATEGORIES } from '../lib/library.js'

export default function CollectionList({
  collections,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onDuplicate,
  onRename,
  onUpdateStyle,
  onUpdateSize,
  onUpdateCategories,
}) {
  const active = collections.find((c) => c.id === activeId) ?? collections[0]

  return (
    <aside className="collection-list">
      <div className="collection-list__header">
        <button className="primary" onClick={onNew}>+ New collection</button>
      </div>

      <ul className="collection-list__items">
        {collections.map((col) => {
          const isActive = col.id === activeId
          return (
            <li
              key={col.id}
              className={isActive ? 'is-selected' : ''}
              onClick={() => onSelect(col.id)}
            >
              <div className="collection-list__body">
                <input
                  className="collection-list__name"
                  value={col.name}
                  onChange={(e) => onRename(col.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Collection name"
                />
                <div className="collection-list__meta">
                  {col.cards.length} card{col.cards.length === 1 ? '' : 's'}
                </div>
              </div>
              <div className="collection-list__actions">
                <button
                  className="icon-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDuplicate(col.id)
                  }}
                  title="Duplicate collection"
                  aria-label="Duplicate collection"
                >
                  ⧉
                </button>
                {collections.length > 1 && (
                  <button
                    className="icon-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (
                        confirm(
                          `Delete collection "${col.name}" and its ${col.cards.length} card(s)?`,
                        )
                      ) {
                        onDelete(col.id)
                      }
                    }}
                    title="Delete collection"
                  >
                    ×
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      {active && (
        <fieldset className="collection-list__style">
          <legend>Defaults</legend>
          <p className="hint">
            Applied to <strong>{active.name || 'this collection'}</strong>.
          </p>
          <SizeField
            size={active.size}
            onChange={(next) => onUpdateSize(active.id, next)}
          />
          <StyleFields
            style={active.style ?? DEFAULT_STYLE}
            onChange={(next) => onUpdateStyle(active.id, next)}
          />
          <CategoryEditor
            categories={active.categories ?? DEFAULT_CATEGORIES}
            onChange={(next) => onUpdateCategories(active.id, next)}
          />
        </fieldset>
      )}
    </aside>
  )
}

function SizeField({ size, onChange }) {
  const isCustom = isCustomSize(size)
  const dropdownValue = isCustom ? '__custom__' : (size ?? DEFAULT_SIZE_ID)

  const handleSelect = (value) => {
    if (value === '__custom__') {
      onChange({ w: 63, h: 88, orientation: 'portrait' })
    } else {
      onChange(value)
    }
  }

  const updateDim = (key, raw) => {
    const num = Math.max(1, Math.min(500, Number(raw) || 0))
    const next = { ...(typeof size === 'object' ? size : {}), [key]: num }
    next.orientation = next.w > next.h ? 'landscape' : 'portrait'
    onChange(next)
  }

  return (
    <>
      <label className="field field--inline">
        <span>Card size</span>
        <select
          value={dropdownValue}
          onChange={(e) => handleSelect(e.target.value)}
        >
          {CARD_SIZES.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
          <option value="__custom__">Custom…</option>
        </select>
      </label>
      {isCustom && (
        <div className="custom-size-row">
          <label className="field field--inline">
            <span>W (mm)</span>
            <input
              type="number"
              min="10"
              max="500"
              value={size.w}
              onChange={(e) => updateDim('w', e.target.value)}
            />
          </label>
          <label className="field field--inline">
            <span>H (mm)</span>
            <input
              type="number"
              min="10"
              max="500"
              value={size.h}
              onChange={(e) => updateDim('h', e.target.value)}
            />
          </label>
        </div>
      )}
    </>
  )
}

function CategoryEditor({ categories, onChange }) {
  const updateAt = (i, value) => {
    const next = categories.slice()
    next[i] = value
    onChange(next)
  }
  const removeAt = (i) => onChange(categories.filter((_, idx) => idx !== i))
  const add = () => onChange([...categories, 'New category'])

  return (
    <div className="field">
      <span>Categories</span>
      {categories.length === 0 && (
        <p className="hint">No categories. Add one to use it on cards.</p>
      )}
      {categories.map((cat, i) => (
        <div key={i} className="stat-row stat-row--single">
          <input
            type="text"
            value={cat}
            onChange={(e) => updateAt(i, e.target.value)}
            placeholder="Category name"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="icon-button"
            onClick={(e) => {
              e.stopPropagation()
              removeAt(i)
            }}
            title="Remove category"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        className="link"
        onClick={(e) => {
          e.stopPropagation()
          add()
        }}
      >
        + Add category
      </button>
      <p className="hint">
        Renaming a category here doesn't update existing cards. Cards keep their
        current category text.
      </p>
    </div>
  )
}
