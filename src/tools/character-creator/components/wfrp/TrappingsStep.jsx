import { v4 as uuid } from 'uuid'
import { rollStartingWealth } from '../../lib/wfrpLibrary.js'

export default function TrappingsStep({ state, update, setState, derived }) {
  const { species, career, klass, careerL1 } = derived

  if (!species || !career) {
    return (
      <div className="cc-step">
        <h2>Trappings</h2>
        <p className="hint">Choose a species and a career first.</p>
      </div>
    )
  }

  const extraLeft = derived.extraAllowed - derived.extraSpent
  const setFate = (d) => setState((s) => ({ ...s, fateExtra: Math.max(0, (s.fateExtra || 0) + d) }))
  const setRes = (d) => setState((s) => ({ ...s, resilienceExtra: Math.max(0, (s.resilienceExtra || 0) + d) }))

  const rollMoney = () => update({ moneyRoll: rollStartingWealth(careerL1.status) })

  const addItem = () => setState((s) => ({ ...s, extraTrappings: [...s.extraTrappings, { id: uuid(), text: '' }] }))
  const setItem = (id, text) => setState((s) => ({ ...s, extraTrappings: s.extraTrappings.map((it) => it.id === id ? { ...it, text } : it) }))
  const delItem = (id) => setState((s) => ({ ...s, extraTrappings: s.extraTrappings.filter((it) => it.id !== id) }))

  return (
    <div className="cc-step">
      <h2>Trappings &amp; Resources</h2>

      <h3 className="cc-subhead">
        Fate &amp; Resilience — distribute {derived.extraAllowed} extra point{derived.extraAllowed === 1 ? '' : 's'}
        <span className={`cc-pill ${extraLeft === 0 ? 'is-ok' : ''}`}>{derived.extraSpent}/{derived.extraAllowed}</span>
      </h3>
      <div className="cc-fr">
        <div className="cc-fr__item">
          <span>Fate</span>
          <div className="cc-stepper">
            <button onClick={() => setFate(-1)} disabled={derived.fateExtra <= 0}>−</button>
            <strong>{derived.fate}</strong>
            <button onClick={() => setFate(1)} disabled={extraLeft <= 0}>+</button>
          </div>
          <span className="cc-note">Fortune {derived.fortune}</span>
        </div>
        <div className="cc-fr__item">
          <span>Resilience</span>
          <div className="cc-stepper">
            <button onClick={() => setRes(-1)} disabled={derived.resilienceExtra <= 0}>−</button>
            <strong>{derived.resilience}</strong>
            <button onClick={() => setRes(1)} disabled={extraLeft <= 0}>+</button>
          </div>
          <span className="cc-note">Resolve {derived.resolve}</span>
        </div>
      </div>

      <h3 className="cc-subhead">Starting wealth — {careerL1.title} ({careerL1.status})</h3>
      <div className="cc-roll-bar">
        <button className="cc-btn" onClick={rollMoney}>🎲 Roll starting wealth</button>
        {state.moneyRoll && <span className="cc-note">{state.moneyRoll.text}</span>}
      </div>

      <h3 className="cc-subhead">Trappings</h3>
      <p className="cc-note"><strong>{klass.name} class:</strong> {klass.trappings.join(', ')}.</p>
      <p className="cc-note">
        Your career also grants its first-level trappings (see the {career.name} entry in the rulebook).
        Add them — and anything else you start with — below.
      </p>
      <div className="cc-inv">
        {state.extraTrappings.map((it) => (
          <div key={it.id} className="cc-inv-row">
            <input value={it.text} placeholder="e.g. Crossbow with 10 Bolts, Leather Jack" onChange={(e) => setItem(it.id, e.target.value)} />
            <button className="cc-btn cc-btn--ghost" onClick={() => delItem(it.id)}>✕</button>
          </div>
        ))}
        <button className="cc-btn cc-btn--ghost" onClick={addItem}>+ Add trapping</button>
      </div>
    </div>
  )
}
