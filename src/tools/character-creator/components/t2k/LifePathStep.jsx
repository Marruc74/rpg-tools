import { SKILLS, skillById, specialtyById, ATTR_KEYS, ATTRIBUTES, DIE, rankIndex } from '../../lib/t2kData.js'
import {
  CHILDHOODS, childhoodById, CATEGORIES, CAREERS, careerById,
  GENERAL_SKILLS, AT_WAR_SPECIALTIES, atWarColumn,
} from '../../lib/t2kLifePathData.js'

const d6 = () => 1 + Math.floor(Math.random() * 6)
const d8 = () => 1 + Math.floor(Math.random() * 8)
const sname = (id) => skillById(id)?.name || id
const spname = (id) => specialtyById(id)?.name || id

// Build the requirement-check context from the state up to (but not including)
// a given term index, so the career picker can flag unmet requirements.
function reqContext(state, derived) {
  const careerIds = state.terms.map((t) => t.careerId)
  const categories = careerIds.map((id) => careerById(id)?.category).filter(Boolean)
  return {
    attrs: derived.attrs,
    careerIds,
    categories,
    eduSciences: careerIds.filter((id) => id === 'sciences').length,
    eduLiberal: careerIds.filter((id) => id === 'liberal-arts').length,
  }
}

// Step 3 (life path) — the term-by-term engine.
export default function LifePathStep({ state, update, derived }) {
  const ch = state.childhood || {}
  const childhood = childhoodById(ch.id)
  const terms = state.terms || []
  const ctx = reqContext(state, derived)

  // ── Childhood ──
  const setChildhood = (id) => update({ childhood: { id, skill: null, specialty: null } })
  const rollChildhood = () => setChildhood(CHILDHOODS[d6() - 1].id)
  const setChSkill = (skill) => update({ childhood: { ...ch, skill } })
  const setChSpec = (specialty) => update({ childhood: { ...ch, specialty } })
  const rollChSpec = () => childhood && setChSpec(childhood.specialties[d6() - 1])

  // ── Terms ──
  const newId = () => `t${terms.length}-${Math.floor(Math.random() * 1e6)}`
  const addTerm = (careerId) => update({ terms: [...terms, { id: newId(), careerId, increases: [], promotion: null, ageRoll: null, agePenaltyAttr: null, warRoll: null }], nextPrison: false })
  const patchTerm = (i, patch) => update({ terms: terms.map((t, j) => (j === i ? { ...t, ...patch } : t)) })
  const removeTerm = (i) => update({ terms: terms.filter((_, j) => j !== i), warOut: false, atWar: { increases: [], specialty: null, draft: false } })

  const firstMilitaryIndex = terms.findIndex((t) => careerById(t.careerId)?.military)

  const availSkills = (careerId) => {
    const car = careerById(careerId)
    const ids = [...new Set([...(car?.skills || []), ...GENERAL_SKILLS])]
    // NCO (Corporal+) may always pick Command.
    if (rankIndexOfRank(derived.rank) >= 2 && !ids.includes('command')) ids.push('command')
    return ids
  }

  const setMode = (i, mode) => patchTerm(i, { increases: mode === 'one' ? [{ skill: null, steps: 2 }] : [{ skill: null, steps: 1 }, { skill: null, steps: 1 }] })
  const setInc = (i, slot, skill) => {
    const t = terms[i]
    const increases = t.increases.map((inc, k) => (k === slot ? { ...inc, skill } : inc))
    patchTerm(i, { increases })
  }

  const rollPromotion = (i, skillId) => {
    const row = derived.skills.find((s) => s.id === skillId)
    if (!row) return
    const a = 1 + Math.floor(Math.random() * row.attrDie)
    const s = row.skillDie ? 1 + Math.floor(Math.random() * row.skillDie) : 0
    const success = a >= 6 || s >= 6
    const car = careerById(terms[i].careerId)
    patchTerm(i, { promotion: { success, rolledSkill: skillId, dice: [a, s], specialty: success ? car.specialties[d6() - 1] : null } })
  }
  const setPromoSpec = (i, specialty) => patchTerm(i, { promotion: { ...terms[i].promotion, specialty } })

  const rollAge = (i) => {
    const ageRoll = d6()
    const effect = d8()
    const termsCompleted = i + 1
    patchTerm(i, { ageRoll, ageEffect: effect, agePenaltyAttr: effect < termsCompleted ? (terms[i].agePenaltyAttr || ATTR_KEYS[0]) : null })
  }
  const rollWar = (i) => {
    const warRoll = d8()
    const termsCompleted = i + 1
    const out = warRoll < termsCompleted
    patchTerm(i, { warRoll })
    if (out) update({ warOut: true })
  }
  // Crime term, no war → roll D6; odd result sends you to prison next term.
  const rollPrison = (i) => {
    const roll = d6()
    patchTerm(i, { prisonRoll: roll })
    update({ nextPrison: roll % 2 === 1 })
  }

  // ── At War ── (always two skills, one step each)
  const aw = state.atWar || { increases: [], specialty: null }
  const awIncs = aw.increases.length === 2 ? aw.increases : [{ skill: null, steps: 1 }, { skill: null, steps: 1 }]
  const setAwInc = (slot, skill) => update({ atWar: { ...aw, increases: awIncs.map((inc, k) => (k === slot ? { ...inc, skill } : inc)) } })
  const lastCareer = terms.length ? careerById(terms[terms.length - 1].careerId) : null
  const awColumn = atWarColumn(lastCareer?.category)
  const rollAwSpec = () => update({ atWar: { ...aw, specialty: AT_WAR_SPECIALTIES[awColumn][d6() - 1] } })

  return (
    <div className="cc-step">
      <h2>Life path</h2>
      <p className="cc-step__lede">
        Build your survivor through a childhood and a series of D6-year career terms. Each term grants
        skill increases and a chance at a specialty; aging and the war loom larger every term. When war
        breaks out, finish with an At War term.
      </p>

      {/* Childhood */}
      <section className="cc-bg-sec">
        <div className="cc-minihead"><h3>Childhood</h3>
          <button type="button" className="cc-btn cc-btn--ghost" onClick={rollChildhood}>🎲 D6</button>
        </div>
        <div className="cc-t2k-reco">
          {CHILDHOODS.map((c) => (
            <button key={c.id} type="button" className={`cc-chip ${ch.id === c.id ? 'is-on' : ''}`} onClick={() => setChildhood(c.id)}>{c.name}</button>
          ))}
        </div>
        {childhood && (
          <div className="cc-lp-childhood">
            <div className="cc-lp-line"><span className="cc-lp-label">Skill (level D):</span>
              {childhood.skills.map((sk) => (
                <button key={sk} type="button" className={`cc-chip ${ch.skill === sk ? 'is-on' : ''}`} onClick={() => setChSkill(sk)}>{sname(sk)}</button>
              ))}
            </div>
            <div className="cc-lp-line"><span className="cc-lp-label">Specialty:</span>
              <select value={ch.specialty || ''} onChange={(e) => setChSpec(e.target.value)}>
                <option value="">— choose —</option>
                {childhood.specialties.map((sp) => <option key={sp} value={sp}>{spname(sp)}</option>)}
              </select>
              <button type="button" className="cc-btn cc-btn--ghost" onClick={rollChSpec}>🎲 D6</button>
            </div>
          </div>
        )}
      </section>

      {/* Career terms */}
      <section className="cc-bg-sec">
        <div className="cc-minihead"><h3>Career terms</h3><span className="cc-count">{terms.length} term{terms.length !== 1 ? 's' : ''} · age {derived.age}{derived.rank ? ` · ${derived.rank}` : ''} · CUF {derived.cuf}</span></div>

        {terms.map((t, i) => {
          const car = careerById(t.careerId)
          const skillsForTerm = availSkills(t.careerId)
          const oneMode = t.increases.length === 1
          const needsRanged = i === firstMilitaryIndex && car?.military && !t.increases.some((inc) => inc.skill === 'ranged-combat')
          return (
            <div key={t.id} className="cc-lp-term">
              <div className="cc-lp-term__head">
                <strong>Term {i + 1}: {car?.name}</strong>
                <span className="cc-lp-cat">{CATEGORIES.find((c) => c.id === car?.category)?.name}{car?.startingRank ? ` · ${car.startingRank}` : ''}</span>
                <button type="button" className="cc-spec-btn" onClick={() => removeTerm(i)} title="Remove this term and everything after">✕</button>
              </div>

              <div className="cc-lp-line">
                <span className="cc-lp-label">Increases:</span>
                <button type="button" className={`cc-chip cc-chip--sm ${!oneMode ? 'is-on' : ''}`} onClick={() => setMode(i, 'two')}>two +1</button>
                <button type="button" className={`cc-chip cc-chip--sm ${oneMode ? 'is-on' : ''}`} onClick={() => setMode(i, 'one')}>one +2</button>
                {t.increases.map((inc, slot) => (
                  <select key={slot} value={inc.skill || ''} onChange={(e) => setInc(i, slot, e.target.value)}>
                    <option value="">— skill —</option>
                    {skillsForTerm.map((sk) => <option key={sk} value={sk}>{sname(sk)}</option>)}
                  </select>
                ))}
              </div>
              {needsRanged && <p className="cc-note cc-warn">First military term: one increase must be Ranged Combat.</p>}

              <div className="cc-lp-line">
                <span className="cc-lp-label">Promotion:</span>
                {t.increases.filter((inc) => inc.skill).map((inc) => (
                  <button key={inc.skill} type="button" className="cc-btn cc-btn--ghost" onClick={() => rollPromotion(i, inc.skill)}>roll {sname(inc.skill)}</button>
                ))}
                {t.promotion && (
                  <span className={`cc-lp-result ${t.promotion.success ? 'is-ok' : ''}`}>
                    {t.promotion.success ? `promoted! → ${spname(t.promotion.specialty)}` : 'no promotion'}
                  </span>
                )}
                {t.promotion?.success && (
                  <select value={t.promotion.specialty || ''} onChange={(e) => setPromoSpec(i, e.target.value)}>
                    {car.specialties.map((sp) => <option key={sp} value={sp}>{spname(sp)}</option>)}
                  </select>
                )}
              </div>

              <div className="cc-lp-line">
                <span className="cc-lp-label">Age &amp; war:</span>
                <button type="button" className="cc-btn cc-btn--ghost" onClick={() => rollAge(i)}>🎲 age</button>
                {t.ageRoll != null && <span className="cc-lp-result">+{t.ageRoll}y{t.agePenaltyAttr ? '' : ''}</span>}
                {t.agePenaltyAttr && (
                  <select value={t.agePenaltyAttr} onChange={(e) => patchTerm(i, { agePenaltyAttr: e.target.value })} title="Age caught up — reduce one attribute">
                    {ATTR_KEYS.map((k) => <option key={k} value={k}>-1 {k}</option>)}
                  </select>
                )}
                {!state.warOut && <button type="button" className="cc-btn cc-btn--ghost" onClick={() => rollWar(i)}>🎲 war</button>}
                {t.warRoll != null && <span className={`cc-lp-result ${t.warRoll < i + 1 ? 'is-war' : ''}`}>war d8={t.warRoll}{t.warRoll < i + 1 ? ' — WAR!' : ''}</span>}
                {!state.warOut && car?.category === 'crime' && t.warRoll != null && t.warRoll >= i + 1 && (
                  <button type="button" className="cc-btn cc-btn--ghost" onClick={() => rollPrison(i)} title="Crime term, no war: roll D6 — odd = prison next term">🎲 prison</button>
                )}
                {t.prisonRoll != null && <span className={`cc-lp-result ${t.prisonRoll % 2 === 1 ? 'is-war' : ''}`}>prison d6={t.prisonRoll}{t.prisonRoll % 2 === 1 ? ' — prison!' : ' — free'}</span>}
              </div>
            </div>
          )
        })}

        {!state.warOut && (
          <div className="cc-lp-addterm">
            <span className="cc-lp-label">Add a term:</span>
            <select value="" onChange={(e) => e.target.value && addTerm(e.target.value)}>
              <option value="">— choose a career —</option>
              {CATEGORIES.map((cat) => (
                <optgroup key={cat.id} label={cat.name}>
                  {CAREERS.filter((c) => c.category === cat.id).map((c) => {
                    const ok = c.reqCheck(ctx)
                    return <option key={c.id} value={c.id} disabled={!ok && !state.lpOverrideReqs}>{c.name}{ok ? '' : `  (needs: ${c.req})`}</option>
                  })}
                </optgroup>
              ))}
            </select>
            <label className="cc-check"><input type="checkbox" checked={!!state.lpOverrideReqs} onChange={(e) => update({ lpOverrideReqs: e.target.checked })} /> Allow careers I don't qualify for (GM override)</label>
            {state.nextPrison && <p className="cc-note cc-warn">Your last crime caught up with you — your next term should be <strong>Prisoner</strong>.</p>}
            <span className="cc-note">Roll D8 for war each term — it breaks out when the roll is under your term count.</span>
          </div>
        )}
      </section>

      {/* At War */}
      {state.warOut && (
        <section className="cc-bg-sec cc-lp-atwar">
          <div className="cc-minihead"><h3>☢ At War — final term</h3></div>
          <p className="cc-note">Increase any two skills one step each (you cannot raise one skill two steps), then take a final specialty (column: {awColumn.replace('-', ' ')}).</p>
          <label className="cc-check"><input type="checkbox" checked={!!aw.draft} onChange={(e) => update({ atWar: { ...aw, draft: e.target.checked } })} /> Drafted (civilian final term, non-local): one increase must be Ranged Combat; gear as Combat Arms</label>
          <div className="cc-lp-line">
            <span className="cc-lp-label">Increases:</span>
            {awIncs.map((inc, slot) => (
              <select key={slot} value={inc.skill || ''} onChange={(e) => setAwInc(slot, e.target.value)}>
                <option value="">— skill —</option>
                {SKILLS.map((sk) => <option key={sk.id} value={sk.id}>{sk.name}</option>)}
              </select>
            ))}
          </div>
          <div className="cc-lp-line">
            <span className="cc-lp-label">Specialty:</span>
            <select value={aw.specialty || ''} onChange={(e) => update({ atWar: { ...aw, specialty: e.target.value } })}>
              <option value="">— choose —</option>
              {AT_WAR_SPECIALTIES[awColumn].map((sp) => <option key={sp} value={sp}>{spname(sp)}</option>)}
            </select>
            <button type="button" className="cc-btn cc-btn--ghost" onClick={rollAwSpec}>🎲 D6</button>
          </div>
        </section>
      )}
    </div>
  )
}

// Rank index helper for the NCO/Command rule (Corporal+ → index ≥ 2).
function rankIndexOfRank(rank) {
  const ENLISTED = ['Private', 'Private First Class', 'Corporal', 'Sergeant', 'Staff Sergeant', 'Sergeant First Class', 'Master Sergeant', 'First Sergeant', 'Sergeant Major']
  const i = ENLISTED.indexOf(rank)
  return i >= 0 ? i : (rank ? 99 : -1)
}
