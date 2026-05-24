import { useEffect, useMemo, useState } from 'react'
import SideEditor from './SideEditor.jsx'
import StyleFields from './StyleFields.jsx'
import { DEFAULT_STYLE, emptySide } from '../lib/newCard.js'
import { CARD_SIZES, DEFAULT_SIZE_ID, isCustomSize } from '../lib/cardSizes.js'
import { BACK_MODES, DEFAULT_CATEGORIES } from '../lib/library.js'

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
  onUpdateBackMode,
  onUpdateSharedBack,
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
          <BackModeField
            backMode={active.backMode ?? BACK_MODES.PER_CARD}
            onChange={(next) => onUpdateBackMode(active.id, next)}
          />
        </fieldset>
      )}

      {active && (active.backMode ?? BACK_MODES.PER_CARD) === BACK_MODES.SHARED && (
        <SharedBackPanel
          collection={active}
          onUpdate={(category, side) => onUpdateSharedBack(active.id, category, side)}
        />
      )}
    </aside>
  )
}

function SharedBackPanel({ collection, onUpdate }) {
  const categories = useMemo(() => {
    const base =
      Array.isArray(collection.categories) && collection.categories.length > 0
        ? collection.categories
        : DEFAULT_CATEGORIES
    // Surface any orphaned categories (defined in sharedBacks but removed
    // from the collection's category list) so the user can still see/edit
    // them.
    const fromBacks = Object.keys(collection.sharedBacks ?? {})
    const seen = new Set(base)
    const extras = fromBacks.filter((c) => !seen.has(c))
    return [...base, ...extras]
  }, [collection.categories, collection.sharedBacks])

  const [selected, setSelected] = useState(categories[0] ?? '')

  // If the selected category disappears (renamed/deleted), fall back to the
  // first available one so the editor doesn't get stuck on a stale name.
  useEffect(() => {
    if (!categories.includes(selected)) {
      setSelected(categories[0] ?? '')
    }
  }, [categories, selected])

  const side = collection.sharedBacks?.[selected] ?? emptySide()

  return (
    <fieldset
      className="collection-list__style collection-list__shared-back"
      onClick={(e) => e.stopPropagation()}
    >
      <legend>Shared back</legend>
      <p className="hint">
        Pick a category and design the back used by every card with that category in{' '}
        <strong>{collection.name || 'this collection'}</strong>.
      </p>
      <label className="field shared-back__category">
        <span>Category</span>
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          {categories.length === 0 && <option value="">(no categories)</option>}
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
              {collection.sharedBacks?.[cat] ? ' ✓' : ''}
            </option>
          ))}
        </select>
      </label>
      {selected ? (
        <SideEditor
          side={side}
          onChange={(next) => onUpdate(selected, next)}
        />
      ) : (
        <p className="hint">Add a category above to create a shared back for it.</p>
      )}
    </fieldset>
  )
}

function BackModeField({ backMode, onChange }) {
  return (
    <label className="field field--inline" onClick={(e) => e.stopPropagation()}>
      <span>Card back</span>
      <select
        value={backMode}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value={BACK_MODES.PER_CARD}>Per-card</option>
        <option value={BACK_MODES.SHARED}>Shared</option>
      </select>
    </label>
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
