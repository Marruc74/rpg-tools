import { useState } from 'react'
import { epRaiseCost, SPELLS, MAGIC_SCHOOLS, MAGIC_FLAG_NAMES, spellLearnCost } from '../lib/dodData.js'
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
                      {s.options ? (
                        <select
                          value={labels[s.id] || ''}
                          onChange={(e) => setLabels((l) => ({ ...l, [s.id]: e.target.value }))}
                        >
                          <option value="">Välj skola…</option>
                          {s.options.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input
                          value={labels[s.id] || ''}
                          placeholder="t.ex. Svärd, Alviska…"
                          onChange={(e) => setLabels((l) => ({ ...l, [s.id]: e.target.value }))}
                          onKeyDown={(e) => { if (e.key === 'Enter') addGroup(s) }}
                        />
                      )}
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

      <MagicSection state={state} update={update} derived={derived} avail={avail} />
    </div>
  )
}

// Besvärjelser — visas för rollpersoner som kan lära magi. Kända magiskolor
// (och därmed FV-gränsen för vilka besvärjelser som kan läras) härleds av de
// magiskole-yrkesfärdigheter som valts ovan; varje lärd besvärjelse kostar EP.
function MagicSection({ state, update, derived, avail }) {
  const { magic } = derived
  const chosen = new Set(state.spells || [])
  const canMagic = magic.capable || avail.some((s) => s.id === 'magiskola')
  if (!canMagic && chosen.size === 0) return null

  const toggle = (id) => {
    const next = new Set(chosen)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    update({ spells: [...next] })
  }

  // Visningsordning: Allmänna besvärjelser först, sedan kända skolor i tur.
  const blocks = []
  if (magic.capable) blocks.push({ id: 'allman', namn: 'Allmänna besvärjelser', fv: magic.allmanFv })
  for (const s of magic.schools) blocks.push({ id: s.id, namn: s.namn, fv: s.fv })

  // Fallback: lärda besvärjelser vars skola inte längre är känd (t.ex. om
  // magiskolan tagits bort) — visas så de kan avmarkeras i stället för att fastna.
  const shownIds = new Set(blocks.flatMap((b) => SPELLS.filter((sp) => sp.skola === b.id).map((sp) => sp.id)))
  const orphanSpells = SPELLS.filter((sp) => chosen.has(sp.id) && !shownIds.has(sp.id))

  return (
    <div className="cc-magic">
      <h3>
        Besvärjelser
        <span className={`cc-count ${magic.overSpells.length ? 'is-over' : ''}`}>
          {(state.spells || []).length} lärda · {magic.spellEp} EP
        </span>
      </h3>
      {!magic.capable ? (
        <p className="cc-note">Lägg till en <strong>Magiskola</strong> bland yrkesfärdigheterna ovan för att kunna lära besvärjelser. FV i skolan avgör vilka besvärjelser du kan lära.</p>
      ) : (
        <p className="cc-step__lede">
          Du kan lära besvärjelser vars skolvärde inte överstiger ditt FV i skolan.
          Varje besvärjelse kostar EP efter sitt skolvärde. Flaggor:
          {' '}<em>F</em> = Fysisk, <em>K</em> = Kvick, <em>R</em> = Ritual.
        </p>
      )}

      <div className="cc-magic-grid">
        {blocks.map((b) => {
          const spells = SPELLS.filter((sp) => sp.skola === b.id)
          if (!spells.length) return null
          return (
            <div key={b.id} className="cc-magic-school">
              <h4>{b.namn} <span className="cc-magic-fv">FV {b.fv}</span></h4>
              <ul className="cc-pick-list">
                {spells.map((sp) => {
                  const picked = chosen.has(sp.id)
                  const cost = spellLearnCost(sp.niva)
                  const locked = sp.niva > (b.fv ?? 0)
                  const tooPricey = !picked && cost > derived.epRemaining
                  const disabled = !picked && (locked || tooPricey)
                  return (
                    <li key={sp.id} className={`cc-pick cc-spell ${picked ? 'is-picked' : ''} ${locked ? 'is-locked' : ''}`} title={sp.desc}>
                      <label className="cc-pick__row">
                        <input type="checkbox" checked={picked} disabled={disabled} onChange={() => toggle(sp.id)} />
                        <span className="cc-spell__niva" title="Skolvärde">{sp.niva}</span>
                        <span className="cc-pick__name">
                          {sp.namn}
                          {sp.flags.map((f) => <em key={f} className="cc-spell__flag" title={MAGIC_FLAG_NAMES[f]}>{f}</em>)}
                        </span>
                        <span className="cc-spell__cost">{locked ? `kräv FV ${sp.niva}` : `${cost} EP`}</span>
                      </label>
                      <span className="cc-pick__note">{sp.rackvidd} · {sp.varaktighet} — {sp.desc}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>

      {orphanSpells.length > 0 && (
        <div className="cc-magic-school cc-magic-orphan">
          <h4>Lärda utan känd skola <span className="cc-magic-fv is-warn">kräver magiskola</span></h4>
          <ul className="cc-pick-list">
            {orphanSpells.map((sp) => (
              <li key={sp.id} className="cc-pick cc-spell is-picked is-locked" title={sp.desc}>
                <label className="cc-pick__row">
                  <input type="checkbox" checked onChange={() => toggle(sp.id)} />
                  <span className="cc-spell__niva">{sp.niva}</span>
                  <span className="cc-pick__name">{sp.namn}</span>
                  <span className="cc-spell__cost">{spellLearnCost(sp.niva)} EP</span>
                </label>
                <span className="cc-pick__note">Skolan {sp.skola} är inte längre vald — lägg till den igen eller ta bort besvärjelsen.</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
