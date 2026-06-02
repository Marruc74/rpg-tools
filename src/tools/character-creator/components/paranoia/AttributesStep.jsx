import {
  ATTRIBUTES, ATTR_KEYS, ATTR_MIN, ATTR_MAX, ATTR_POINTS,
  skillBase, lookupStrength, lookupEndurance,
} from '../../lib/paranoiaData.js'

const d10 = () => 1 + Math.floor(Math.random() * 10)

// Step 2 — eight attributes (1–10): point allocation (60) or roll 1d10 each.
export default function AttributesStep({ state, update, derived }) {
  const isPoints = state.genMode === 'points'

  const setMode = (mode) => {
    if (mode === state.genMode) return
    update({ genMode: mode })
  }

  const setAttr = (k, v) => {
    const val = Math.max(ATTR_MIN, Math.min(ATTR_MAX, v))
    update({ attrs: { ...state.attrs, [k]: val } })
  }

  const rollAll = () => {
    const attrs = {}, attrRolls = {}
    for (const k of ATTR_KEYS) { const r = d10(); attrs[k] = r; attrRolls[k] = r }
    update({ attrs, attrRolls, rerollUsed: false })
  }
  const reroll = (k) => {
    if (state.rerollUsed) return
    const r = d10()
    update({ attrs: { ...state.attrs, [k]: r }, attrRolls: { ...state.attrRolls, [k]: r }, rerollUsed: true })
  }

  const rolled = Object.keys(state.attrRolls || {}).length === ATTR_KEYS.length

  return (
    <div className="cc-step">
      <h2>Attributes</h2>
      <p className="cc-step__lede">
        Eight attributes, each 1–10. Either spread <strong>{ATTR_POINTS} points</strong> across them, or
        roll <strong>1d10</strong> for each (you may reroll exactly one — and you must keep the reroll).
        Power may never be zero, in the unlikely event you have a mutant power.
      </p>

      <div className="cc-system-switch cc-genmode">
        <button className={`cc-system-switch__btn ${isPoints ? 'is-active' : ''}`} onClick={() => setMode('points')}>Point allocation (60)</button>
        <button className={`cc-system-switch__btn ${!isPoints ? 'is-active' : ''}`} onClick={() => setMode('roll')}>Roll 1d10 each</button>
      </div>

      {!isPoints && (
        <div className="cc-roll-bar">
          <button className="cc-btn" onClick={rollAll}>🎲 Roll all attributes</button>
          {rolled && <span className="cc-note">{state.rerollUsed ? 'Reroll spent.' : 'You may reroll one attribute (click ⟳).'}</span>}
        </div>
      )}

      <div className="cc-cards cc-attr-grid">
        {ATTRIBUTES.map((a) => {
          const v = state.attrs[a.key] ?? ATTR_MIN
          return (
            <div key={a.key} className="cc-card cc-attr-card">
              <div className="cc-card__head">
                <span className="cc-card__name">{a.name} <em>{a.key}</em></span>
                <span className="cc-attr-val">{v}</span>
              </div>
              {isPoints ? (
                <div className="cc-stepper">
                  <button className="cc-step-btn" disabled={v <= ATTR_MIN} onClick={() => setAttr(a.key, v - 1)}>−</button>
                  <input type="number" min={ATTR_MIN} max={ATTR_MAX} value={v} onChange={(e) => setAttr(a.key, Number(e.target.value) || ATTR_MIN)} />
                  <button className="cc-step-btn" disabled={v >= ATTR_MAX} onClick={() => setAttr(a.key, v + 1)}>+</button>
                </div>
              ) : (
                <div className="cc-stepper">
                  <button className="cc-step-btn" disabled={!rolled || state.rerollUsed} onClick={() => reroll(a.key)} title="Reroll this attribute (once)">⟳</button>
                </div>
              )}
              {a.hasSkills && <div className="cc-card__bonus"><span>Skill base {skillBase(v)}</span></div>}
              {a.key === 'STR' && <div className="cc-card__bonus"><span>Carry {lookupStrength(v).carry} kg · HTH {lookupStrength(v).hth}</span></div>}
              {a.key === 'END' && <div className="cc-card__bonus"><span>Macho {lookupEndurance(v).macho} · Wounds {lookupEndurance(v).wounds}</span></div>}
              <p className="cc-card__desc">{a.desc}</p>
            </div>
          )
        })}
      </div>

      <div className={`cc-krav ${derived.pointsOk && derived.powerOk ? 'is-ok' : 'is-fail'}`}>
        {isPoints
          ? `Points spent: ${derived.attrPointsUsed} / ${ATTR_POINTS}`
          : (rolled ? 'All attributes rolled.' : 'Roll your attributes.')}
        {!derived.powerOk && ' · Power must be at least 1!'}
      </div>
    </div>
  )
}
