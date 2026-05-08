import { useMemo, useState } from 'react'
import SideEditor from './SideEditor.jsx'
import StyleFields from './StyleFields.jsx'
import { DEFAULT_STYLE } from '../lib/newCard.js'
import { DEFAULT_CATEGORIES } from '../lib/library.js'

export default function CardEditor({ card, collectionStyle, categories, onChange }) {
  const [activeSide, setActiveSide] = useState('front')

  const style = card.style ?? collectionStyle ?? DEFAULT_STYLE

  // Always include the card's current category so a user-renamed or
  // collection-scoped category isn't silently lost from the dropdown.
  const options = useMemo(() => {
    const base = categories?.length ? categories : DEFAULT_CATEGORIES
    return card.category && !base.includes(card.category)
      ? [card.category, ...base]
      : base
  }, [categories, card.category])

  const updateField = (patch) => onChange({ ...card, ...patch })
  const updateSide = (sideKey, side) => onChange({ ...card, [sideKey]: side })

  return (
    <section className="card-editor">
      <h2>Edit card</h2>

      <div className="row">
        <label className="field">
          <span>Name</span>
          <input
            type="text"
            value={card.name}
            onChange={(e) => updateField({ name: e.target.value })}
          />
        </label>
        <label className="field">
          <span>Category</span>
          <select
            value={card.category}
            onChange={(e) => updateField({ category: e.target.value })}
          >
            {options.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="style-fields">
        <legend>Style (this card)</legend>
        <StyleFields
          style={style}
          onChange={(next) => updateField({ style: next })}
          onReset={() =>
            updateField({ style: { ...(collectionStyle ?? DEFAULT_STYLE) } })
          }
        />
      </fieldset>

      <div className="tabs">
        <button
          className={activeSide === 'front' ? 'is-active' : ''}
          onClick={() => setActiveSide('front')}
        >
          Front
        </button>
        <button
          className={activeSide === 'back' ? 'is-active' : ''}
          onClick={() => setActiveSide('back')}
        >
          Back
        </button>
      </div>

      <SideEditor
        side={card[activeSide]}
        onChange={(side) => updateSide(activeSide, side)}
        hideImage={activeSide === 'back'}
        hideTitle={activeSide === 'back'}
      />
    </section>
  )
}
