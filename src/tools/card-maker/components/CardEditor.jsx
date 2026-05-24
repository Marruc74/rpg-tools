import { useEffect, useMemo, useState } from 'react'
import SideEditor from './SideEditor.jsx'
import StyleFields from './StyleFields.jsx'
import { DEFAULT_STYLE } from '../lib/newCard.js'
import { BACK_MODES, DEFAULT_CATEGORIES } from '../lib/library.js'

export default function CardEditor({ card, collectionStyle, categories, backMode, onChange }) {
  const [activeSide, setActiveSide] = useState('front')
  const sharedBack = backMode === BACK_MODES.SHARED

  // If the collection switches to shared backs while the user is on the
  // back tab, snap back to the front so they don't see a disabled tab.
  useEffect(() => {
    if (sharedBack && activeSide === 'back') setActiveSide('front')
  }, [sharedBack, activeSide])

  const style = card.style ?? collectionStyle ?? DEFAULT_STYLE
  const locked = !!card.locked

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
    <section className={`card-editor${locked ? ' card-editor--locked' : ''}`}>
      <div className="card-editor__header">
        <h2>Edit card</h2>
        <button
          type="button"
          className={`lock-toggle${locked ? ' is-locked' : ''}`}
          onClick={() => updateField({ locked: !locked })}
          title={locked ? 'Unlock card to edit' : 'Lock card to prevent edits'}
        >
          {locked ? '🔒 Locked' : '🔓 Unlocked'}
        </button>
      </div>

      <fieldset disabled={locked} className="card-editor__fieldset">

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
        {!sharedBack && (
          <button
            className={activeSide === 'back' ? 'is-active' : ''}
            onClick={() => setActiveSide('back')}
          >
            Back
          </button>
        )}
      </div>

      {sharedBack && (
        <p className="hint">
          Back is shared across this collection — edit it in the collection panel on the left.
        </p>
      )}

      <SideEditor
        side={card[activeSide]}
        onChange={(side) => updateSide(activeSide, side)}
        hideImage={activeSide === 'back'}
        hideTitle={activeSide === 'back'}
      />
      </fieldset>
    </section>
  )
}
