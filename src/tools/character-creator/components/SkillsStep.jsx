import { useState } from 'react'
import { epRaiseCost, SPELLS, MAGIC_DISCIPLINES, MAGIC_FLAG_NAMES, spellLearnCost } from '../lib/dodData.js'
import { availableYrkesSkills } from '../lib/characterLibrary.js'
import FilterInput, { matches } from './FilterInput.jsx'

export default function SkillsStep({ state, update, derived }) {
  const [labels, setLabels] = useState({}) // group skillId -> draft label text
  const [skillQ, setSkillQ] = useState('')

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
          <FilterInput value={skillQ} onChange={setSkillQ} placeholder="Sök färdighet…" />
          <ul className="cc-pick-list">
            {avail.filter((s) => matches(s.namn, skillQ)).map((s) => {
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
  const [spellQ, setSpellQ] = useState('')
  const m = (sp) => matches(sp.namn, spellQ)
  const chosen = new Set(state.spells || [])
  const canMagic = magic.capable || avail.some((s) => s.id === 'magiskola')
  if (!canMagic && chosen.size === 0) return null

  const toggle = (id) => {
    const next = new Set(chosen)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    update({ spells: [...next] })
  }

  const knownMainIds = new Set(magic.schools.map((s) => s.id))
  const isSpecialised = (namn) => magic.specialiseringar.some((s) => s.namn === namn)
  // Specialisering: högst en underskola per huvudskola.
  const toggleSpecial = (disc) => {
    const others = (state.specialiseringar || []).filter((n) => {
      const d = MAGIC_DISCIPLINES.find((x) => x.namn === n)
      return !d || d.skola !== disc.skola
    })
    update({ specialiseringar: isSpecialised(disc.namn) ? others : [...others, disc.namn] })
  }

  // Visade besvärjelser: Allmänna (om magiker) + allt i kända huvudskolor
  // (huvudskolan omfattar sina underskolor).
  const shownIds = new Set(SPELLS.filter((sp) =>
    (sp.skola === 'allman' && magic.capable) || knownMainIds.has(sp.skola),
  ).map((sp) => sp.id))
  const orphanSpells = SPELLS.filter((sp) => chosen.has(sp.id) && !shownIds.has(sp.id))

  // En besvärjelse-rad. effFv = det FV som gäller (halverat för underskolor).
  const renderSpell = (sp, effFv) => {
    const picked = chosen.has(sp.id)
    const cost = spellLearnCost(sp.niva)
    const locked = sp.niva > (effFv ?? 0)
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
            {sp.source === 'MH' && <span className="cc-src-badge cc-src-badge--xs">MH</span>}
            {sp.register && <span className="cc-src-badge cc-src-badge--xs" title="Registerbesvärjelse — beskrivs i källboken">reg</span>}
            {sp.minimagi && <span className="cc-src-badge cc-src-badge--xs" title="Minimagi">M</span>}
          </span>
          <span className="cc-spell__cost">{locked ? `kräv FV ${sp.niva}` : `${cost} EP`}</span>
        </label>
        <span className="cc-pick__note">{sp.rackvidd} · {sp.varaktighet} — {sp.desc}</span>
      </li>
    )
  }

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
          Underskolor (t.ex. Djurhamn, Eldmagi) ingår i sin huvudskola — gratis upp
          till FV {magic.freeDiscFv}; specialisera dig på en underskola per huvudskola
          för att nå högre. Varje besvärjelse kostar EP efter sitt skolvärde. Flaggor:
          {' '}<em>F</em> = Fysisk, <em>K</em> = Kvick, <em>R</em> = Ritual.
        </p>
      )}

      <FilterInput value={spellQ} onChange={setSpellQ} placeholder="Sök besvärjelse…" />
      <div className="cc-magic-grid">
        {magic.capable && (
          <div className="cc-magic-school">
            <h4>Allmänna besvärjelser <span className="cc-magic-fv">FV {magic.allmanFv}</span></h4>
            <ul className="cc-pick-list">{SPELLS.filter((sp) => sp.skola === 'allman' && m(sp)).map((sp) => renderSpell(sp, magic.allmanFv))}</ul>
          </div>
        )}
        {magic.schools.map((b) => {
          const mainSpells = SPELLS.filter((sp) => sp.skola === b.id && !sp.disciplin && m(sp))
          const disciplines = MAGIC_DISCIPLINES.filter((d) => d.skola === b.id)
          const discLists = disciplines.map((d) => ({ d, spells: SPELLS.filter((sp) => sp.disciplin === d.namn && m(sp)) }))
          if (spellQ && mainSpells.length === 0 && discLists.every((x) => x.spells.length === 0)) return null
          return (
            <div key={b.id} className="cc-magic-school">
              <h4>{b.namn} <span className="cc-magic-fv">FV {b.fv}</span></h4>
              {b.register && (
                <p className="cc-note cc-magic-regnote">Specialskola ur Magikerns Handboks register (s. 91–93). Besvärjelserna beskrivs i <strong>{b.sourceBook}</strong>; namnen är OCR-tolkade och kan innehålla fel.</p>
              )}
              {mainSpells.length > 0 && (
                <ul className="cc-pick-list">{mainSpells.map((sp) => renderSpell(sp, b.fv))}</ul>
              )}
              {discLists.map(({ d, spells: discSpells }) => {
                if (!discSpells.length) return null
                const spec = isSpecialised(d.namn)
                const cap = spec ? b.fv : Math.min(b.fv, magic.freeDiscFv)
                return (
                  <div key={d.namn} className="cc-magic-disc">
                    <h5>
                      <span className="cc-magic-disc__namn">{d.namn}</span>
                      <span className="cc-magic-fv" title={spec ? 'Specialiserad underskola — full huvudskole-FV' : `Underskola — gratis upp till FV ${magic.freeDiscFv}`}>FV {cap}</span>
                      <button type="button" className={`cc-spec-btn ${spec ? 'is-on' : ''}`} onClick={() => toggleSpecial(d)} title="Specialisera dig på denna underskola (högst en per huvudskola)">{spec ? '★ specialiserad' : '☆ specialisera'}</button>
                    </h5>
                    <ul className="cc-pick-list">{discSpells.map((sp) => renderSpell(sp, cap))}</ul>
                  </div>
                )
              })}
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
