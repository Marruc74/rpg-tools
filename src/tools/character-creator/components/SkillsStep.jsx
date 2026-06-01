import { useState } from 'react'
import { epRaiseCost } from '../lib/dodData.js'
import { availableYrkesSkills } from '../lib/characterLibrary.js'

export default function SkillsStep({ state, update, derived }) {
  const [labels, setLabels] = useState({}) // group skillId -> draft label text

  if (!state.yrkeId) {
    return <div className="cc-step"><h2>Färdigheter</h2><p className="cc-note">Välj yrke först.</p></div>
  }

  const avail = availableYrkesSkills(state.yrkeId)
  const limit = derived.yrkesLimit
  const chosen = state.yrkesSkills
  const atLimit = chosen.length >= limit

  const isPicked = (key) => chosen.some((y) => y.key === key)
  const instancesOf = (skillId) => chosen.filter((y) => y.skillId === skillId)

  const togglePlain = (s) => {
    if (isPicked(s.id)) {
      update({ yrkesSkills: chosen.filter((y) => y.key !== s.id) })
    } else if (!atLimit) {
      update({ yrkesSkills: [...chosen, { key: s.id, skillId: s.id, label: '' }] })
    }
  }

  const addGroup = (s) => {
    const label = (labels[s.id] || '').trim()
    if (!label || atLimit) return
    const key = `${s.id}::${label}`
    if (isPicked(key)) return
    if (instancesOf(s.id).length >= s.maxPicks) return
    update({ yrkesSkills: [...chosen, { key, skillId: s.id, label }] })
    setLabels((l) => ({ ...l, [s.id]: '' }))
  }

  const removeKey = (key) => {
    const { [key]: _drop, ...rest } = state.fvBoost
    update({ yrkesSkills: chosen.filter((y) => y.key !== key), fvBoost: rest })
  }

  const setBoost = (key, next) => {
    const v = Math.max(0, next)
    const fvBoost = { ...state.fvBoost }
    if (v === 0) delete fvBoost[key]
    else fvBoost[key] = v
    update({ fvBoost })
  }

  return (
    <div className="cc-step">
      <h2>Färdigheter</h2>
      <p className="cc-step__lede">
        Välj {limit} yrkesfärdigheter ur listan. Grupper (språk, vapen, hantverk,
        instrument) anges per styck — siffran visar hur många du får ta. Höj sedan
        färdighetsvärden (FV) med dina erfarenhetspoäng (EP) — kostnaden per steg
        ökar med FV enligt bokens kostnadstabell. Högst FV {derived.maxFV} vid start.
      </p>

      <div className="cc-skills-grid">
        {/* ── Vänster: välj yrkesfärdigheter ── */}
        <div className="cc-skills-col">
          <h3>Yrkesfärdigheter <span className={`cc-count ${chosen.length > limit ? 'is-over' : ''}`}>{chosen.length} / {limit}</span></h3>
          <ul className="cc-pick-list">
            {avail.map((s) => {
              if (s.group) {
                const inst = instancesOf(s.id)
                return (
                  <li key={s.id} className="cc-pick cc-pick--group">
                    <div className="cc-pick__row">
                      <span className="cc-pick__name">{s.namn} <span className="cc-pick__grund">{s.grund}</span></span>
                      <span className="cc-pick__cap">max {s.maxPicks === Infinity ? '∞' : s.maxPicks}</span>
                    </div>
                    {s.note && <span className="cc-pick__note">{s.note}</span>}
                    <div className="cc-pick__add">
                      <input
                        value={labels[s.id] || ''}
                        placeholder="t.ex. Svärd, Alviska…"
                        onChange={(e) => setLabels((l) => ({ ...l, [s.id]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === 'Enter') addGroup(s) }}
                      />
                      <button className="cc-btn cc-btn--sm" onClick={() => addGroup(s)} disabled={atLimit || inst.length >= s.maxPicks}>Lägg till</button>
                    </div>
                    {inst.map((y) => (
                      <span key={y.key} className="cc-chip">
                        {y.label}
                        <button onClick={() => removeKey(y.key)} aria-label="Ta bort">×</button>
                      </span>
                    ))}
                  </li>
                )
              }
              const picked = isPicked(s.id)
              return (
                <li key={s.id} className={`cc-pick ${picked ? 'is-picked' : ''}`}>
                  <label className="cc-pick__row">
                    <input type="checkbox" checked={picked} disabled={!picked && atLimit} onChange={() => togglePlain(s)} />
                    <span className="cc-pick__name">{s.namn} <span className="cc-pick__grund">{s.grund}</span></span>
                  </label>
                  {s.note && <span className="cc-pick__note">{s.note}</span>}
                </li>
              )
            })}
          </ul>
        </div>

        {/* ── Höger: höj FV med EP ── */}
        <div className="cc-skills-col">
          <h3>Färdighetsvärden (FV) <span className={`cc-count ${derived.epRemaining < 0 ? 'is-over' : ''}`}>{derived.epRemaining} EP kvar</span></h3>
          <ul className="cc-fv-list">
            {derived.skills.map((sk) => {
              const sensesAdd = sk.sensesAdd || 0
              const floor = sk.fv - sk.boost - sensesAdd
              const bought = floor + sk.boost
              const nextCost = epRaiseCost(floor, bought + 1) - epRaiseCost(floor, bought)
              const canRaise = bought < derived.maxFV && derived.epRemaining >= nextCost && !sk.typ.includes('ras')
              const canLower = sk.boost > 0
              return (
                <li key={sk.key} className="cc-fv">
                  <span className="cc-fv__name">{sk.namn}</span>
                  <span className="cc-fv__type">{sk.typ}</span>
                  <span className="cc-fv__bc" title="Baschans / rasbonus">BC {floor}</span>
                  <span className="cc-fv__cost" title="EP för nästa steg">{bought < derived.maxFV && !sk.typ.includes('ras') ? `+${nextCost} EP` : ''}</span>
                  <div className="cc-stepper cc-stepper--sm">
                    <button onClick={() => setBoost(sk.key, sk.boost - 1)} disabled={!canLower}>−</button>
                    <span>{sk.fv}</span>
                    <button onClick={() => setBoost(sk.key, sk.boost + 1)} disabled={!canRaise}>+</button>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
