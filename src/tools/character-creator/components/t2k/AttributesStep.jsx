import { ATTRIBUTES, RANKS, DIE, RANK_DESC, rankIndex } from '../../lib/t2kData.js'

// Step 2 — start at C in all four; make three increases (one step each, up to A);
// you may drop one attribute to D for one extra increase.
export default function AttributesStep({ state, update, derived }) {
  const arch = derived.archetype
  const setAttr = (k, r) => update({ attrs: { ...state.attrs, [k]: r } })
  const bump = (k, dir) => {
    const order = RANKS // A,B,C,D  (index 0 = best)
    const i = order.indexOf(state.attrs[k])
    const ni = Math.max(0, Math.min(order.length - 1, i - dir)) // dir +1 = improve
    setAttr(k, order[ni])
  }

  return (
    <div className="cc-step">
      <h2>Attributes</h2>
      <p className="cc-step__lede">
        Everyone starts at <strong>C</strong> in all four attributes. Make <strong>{derived.increasesAllowed} increases</strong> of
        one step each (up to A). You may drop one attribute to D to earn one extra increase
        {arch && <> — your key attribute is <strong>{arch.keyAttr}</strong></>}.
      </p>

      <div className={`cc-krav ${derived.attrValid ? 'is-ok' : 'is-fail'}`}>
        Increases used: {derived.increasesUsed} / {derived.increasesAllowed}
        {derived.decreasesUsed > 1 && ' · only one attribute may be dropped to D'}
      </div>

      <div className="cc-cards cc-attr-grid">
        {ATTRIBUTES.map((a) => {
          const r = state.attrs[a.key]
          const isKey = arch && arch.keyAttr === a.key
          return (
            <div key={a.key} className={`cc-card cc-attr-card ${isKey ? 'is-key' : ''}`}>
              <div className="cc-card__head">
                <span className="cc-card__name">{a.name} <em>{a.key}</em>{isKey && <span className="cc-src-badge cc-src-badge--xs">KEY</span>}</span>
                <span className="cc-attr-val">{r} <small>D{DIE[r]}</small></span>
              </div>
              <div className="cc-stepper">
                <button className="cc-step-btn" disabled={rankIndex(r) <= 0} onClick={() => bump(a.key, -1)} title="Lower">−</button>
                <span className="cc-rank-letter">{r}</span>
                <button className="cc-step-btn" disabled={rankIndex(r) >= 3} onClick={() => bump(a.key, 1)} title="Raise">+</button>
              </div>
              <div className="cc-card__bonus"><span>{RANK_DESC[r]}</span></div>
              <p className="cc-card__desc">{a.desc}</p>
            </div>
          )
        })}
      </div>

      <div className="cc-t2k-derived">
        <div className="cc-xp"><span>Hit capacity</span><strong>{derived.hitCap}</strong></div>
        <div className="cc-xp"><span>Stress capacity</span><strong>{derived.stressCap}</strong></div>
      </div>
      <p className="cc-note">Hit capacity = (STR die + AGL die) ÷ 4, rounded up. Stress capacity = (INT die + EMP die) ÷ 4, rounded up.</p>
    </div>
  )
}
