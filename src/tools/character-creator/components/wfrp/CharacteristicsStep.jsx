import { CHARACTERISTICS, charBonus } from '../../lib/wfrpData.js'

const roll2d10 = () => (1 + Math.floor(Math.random() * 10)) + (1 + Math.floor(Math.random() * 10))

export default function CharacteristicsStep({ state, setState, derived }) {
  const species = derived.species

  const rollAll = () => {
    const rolls = CHARACTERISTICS.map(() => roll2d10())
    const charBase = {}
    CHARACTERISTICS.forEach((c, i) => { charBase[c.key] = rolls[i] })
    setState((s) => ({ ...s, charRolls: rolls, charBase }))
  }

  const setBase = (key, value) => {
    const v = value === '' ? '' : Math.max(2, Math.min(20, Number(value)))
    setState((s) => ({ ...s, charBase: { ...s.charBase, [key]: v } }))
  }

  if (!species) {
    return (
      <div className="cc-step">
        <h2>Characteristics</h2>
        <p className="hint">Choose a species first — its modifiers are added to your rolls.</p>
      </div>
    )
  }

  const methodLabel = {
    keep: 'Kept rolled order — +50 XP',
    rearrange: 'Rearranged the rolls — +25 XP',
    manual: 'Manually set — no bonus XP',
  }[derived.charMethod]

  return (
    <div className="cc-step">
      <h2>Characteristics</h2>
      <p className="cc-step__lede">
        Roll 2d10 for each characteristic and add the species modifier. <strong>Keep the
        rolls in order for +50&nbsp;XP</strong>, <strong>rearrange the same values for
        +25&nbsp;XP</strong>, or set them by hand for no bonus. The Bonus is the tens digit.
      </p>

      <div className="cc-roll-bar">
        <button className="cc-btn" onClick={rollAll}>🎲 Roll 2d10 ×10</button>
        <span className="cc-note">{methodLabel}</span>
      </div>

      <div className="cc-char-grid">
        <div className="cc-char-grid__head">
          <span>Characteristic</span><span>2d10</span><span>Species</span><span>Total</span><span>Bonus</span>
        </div>
        {CHARACTERISTICS.map((c) => {
          const base = state.charBase[c.key]
          const mod = species.mods[c.key] ?? 0
          const total = (base === '' || base == null) ? null : Number(base) + mod
          return (
            <div key={c.key} className="cc-char-row">
              <span className="cc-char-row__name">{c.name} <em>{c.key}</em></span>
              <input
                className="cc-char-row__base"
                type="number" min={2} max={20}
                value={base ?? ''}
                onChange={(e) => setBase(c.key, e.target.value)}
              />
              <span className="cc-char-row__mod">+{mod}</span>
              <span className="cc-char-row__total">{total ?? '—'}</span>
              <span className="cc-char-row__bonus">{total != null ? charBonus(total) : '—'}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
