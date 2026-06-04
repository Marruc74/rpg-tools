import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { rollStartingWealth } from '../../lib/wfrpLibrary.js'
import { UIA_EQUIPMENT, equipmentItemText } from '../../lib/wfrpData.js'
import FilterInput, { matches } from '../FilterInput.jsx'

export default function TrappingsStep({ state, update, setState, derived }) {
  const { species, career, klass, careerL1 } = derived
  const [catGroup, setCatGroup] = useState(UIA_EQUIPMENT[0].group)
  const [catQuery, setCatQuery] = useState('')

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
      {career.trappings ? (
        <p className="cc-note">
          <strong>{careerL1.title} career:</strong> {career.trappings.join(', ')}.
          {' '}Add them — and anything else you start with — below.
        </p>
      ) : (
        <p className="cc-note">
          Your career also grants its first-level trappings (see the {career.name} entry in the rulebook).
          Add them — and anything else you start with — below.
        </p>
      )}
      <div className="cc-inv">
        {state.extraTrappings.map((it) => (
          <div key={it.id} className="cc-inv-row">
            <input value={it.text} placeholder="e.g. Crossbow with 10 Bolts, Leather Jack" onChange={(e) => setItem(it.id, e.target.value)} />
            <button className="cc-btn cc-btn--ghost" onClick={() => delItem(it.id)}>✕</button>
          </div>
        ))}
        <button className="cc-btn cc-btn--ghost" onClick={addItem}>+ Add trapping</button>
        {career.trappings && (
          <button
            className="cc-btn cc-btn--ghost"
            onClick={() => setState((s) => ({
              ...s,
              extraTrappings: [
                ...s.extraTrappings,
                ...career.trappings
                  .filter((t) => !s.extraTrappings.some((it) => it.text === t))
                  .map((t) => ({ id: uuid(), text: t })),
              ],
            }))}
          >
            + Add all {careerL1.title} trappings
          </button>
        )}
      </div>

      <h3 className="cc-subhead">Equipment catalogue — Up in Arms</h3>
      <p className="cc-note">Gear and weapons from the Quartermaster&apos;s Store. Click an item to add it to your trappings.</p>
      <div className="cc-roll-bar">
        <div className="cc-seg cc-seg--wrap">
          {UIA_EQUIPMENT.map((g) => (
            <button key={g.group} className={catGroup === g.group ? 'is-on' : ''} onClick={() => setCatGroup(g.group)}>{g.group}</button>
          ))}
        </div>
      </div>
      <FilterInput value={catQuery} onChange={setCatQuery} placeholder="Search equipment…" />
      <div className="cc-skill-list" style={{ marginTop: 8 }}>
        {(UIA_EQUIPMENT.find((g) => g.group === catGroup)?.items || [])
          .filter((it) => matches(`${it.name} ${it.qualities || ''}`, catQuery))
          .map((it) => {
            const added = state.extraTrappings.some((t) => t.text === equipmentItemText(it))
            const detail = [
              it.price !== 'N/A' && it.price, it.enc !== 0 && it.enc != null && `Enc ${it.enc}`, it.avail !== 'N/A' && it.avail,
              it.reach && it.reach !== 'N/A' && `Reach ${it.reach}`, it.range && `Range ${it.range}`,
              it.dmg && it.dmg !== '–' && `Dmg ${it.dmg}`, it.qualities,
            ].filter(Boolean).join(' · ')
            return (
              <div key={it.name} className="cc-skill-row">
                <span className="cc-skill-row__name">
                  <strong>{it.name}</strong>
                  <span className="cc-note" style={{ display: 'block', margin: 0 }}>{detail}</span>
                </span>
                <button
                  className="cc-btn cc-btn--ghost"
                  disabled={added}
                  title={added ? 'Already in your trappings' : 'Add to trappings'}
                  onClick={() => setState((s) => ({ ...s, extraTrappings: [...s.extraTrappings, { id: uuid(), text: equipmentItemText(it) }] }))}
                >
                  {added ? '✓' : '+'}
                </button>
              </div>
            )
          })}
      </div>
    </div>
  )
}
