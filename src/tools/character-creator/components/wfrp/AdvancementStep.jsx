import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import {
  CHARACTERISTICS, charAdvanceCost, skillAdvanceCost, talentCost, SKILL_CHAR,
  CLASSES, careersByClass, careerById, careerChangeCost,
} from '../../lib/wfrpData.js'

export default function AdvancementStep({ state, update, setState, derived }) {
  const { species, career } = derived
  const [talentName, setTalentName] = useState('')
  const [skillName, setSkillName] = useState('')
  const [targetCareer, setTargetCareer] = useState('')

  if (!species || !career) {
    return (
      <div className="cc-step">
        <h2>Advancement</h2>
        <p className="hint">Finish creating the character first — then spend XP here to improve it.</p>
      </div>
    )
  }

  const avail = derived.xpAvailable

  const bumpChar = (key, d) => setState((s) => {
    const cur = s.advChar[key] || 0
    const next = Math.max(0, cur + d)
    const advChar = { ...s.advChar }
    if (next) advChar[key] = next; else delete advChar[key]
    return { ...s, advChar }
  })
  const bumpSkill = (name, d) => setState((s) => {
    const cur = s.advSkill[name] || 0
    const next = Math.max(0, cur + d)
    const advSkill = { ...s.advSkill }
    if (next) advSkill[name] = next; else delete advSkill[name]
    return { ...s, advSkill }
  })
  const addSkill = (name) => {
    const n = name.trim()
    if (!n) return
    setState((s) => (s.extraSkills.includes(n) ? s : { ...s, extraSkills: [...s.extraSkills, n] }))
    setSkillName('')
  }
  const removeSkill = (name) => setState((s) => {
    const advSkill = { ...s.advSkill }
    delete advSkill[name]
    return { ...s, extraSkills: s.extraSkills.filter((x) => x !== name), advSkill }
  })
  const buyTalent = (name) => {
    const n = name.trim()
    if (!n) return
    setState((s) => ({ ...s, boughtTalents: [...s.boughtTalents, { id: uuid(), name: n }] }))
    setTalentName('')
  }
  const removeTalent = (id) => setState((s) => ({ ...s, boughtTalents: s.boughtTalents.filter((t) => t.id !== id) }))
  const setCareerLevel = (idx) => update({ careerLevel: idx })

  const target = targetCareer ? careerById(targetCareer) : null
  const targetCost = target ? careerChangeCost(derived.careerCompleted, target.classId === career.classId) : null
  const changeCareer = () => {
    if (!target || target.id === career.id || targetCost > avail) return
    const lv1 = target.levels[0]
    if (!confirm(`Change career to ${target.name} (${lv1.title}, ${lv1.status})? Costs ${targetCost} XP. You enter at level 1 and keep all your advances.`)) return
    setState((s) => ({
      ...s,
      // Lock in the current career's level-up XP, then add the change cost.
      careerChangeXp: (s.careerChangeXp || 0) + derived.careerLevelIdx * derived.careerChangeCost + targetCost,
      careerId: target.id,
      careerLevel: 0,
    }))
    setTargetCareer('')
  }

  // Talent "times taken" so far (creation copies + already-bought), per name.
  const talentTimes = {}
  for (const t of derived.talents) {
    if (t.source !== 'bought') talentTimes[t.name] = (talentTimes[t.name] || 0) + 1
  }
  const boughtCount = {}
  for (const t of state.boughtTalents) boughtCount[t.name] = (boughtCount[t.name] || 0) + 1
  const nextTalentCost = (name) => talentCost((talentTimes[name] || 0) + (boughtCount[name] || 0))

  const talentSuggestions = Array.from(new Set([
    ...career.talents, ...species.talents.fixed,
    ...species.talents.choices.flat(), ...state.speciesRandomTalents.filter(Boolean),
  ]))
  const haveSkill = new Set(derived.skills.map((s) => s.name))
  const skillSuggestions = Object.keys(SKILL_CHAR).filter((n) => !haveSkill.has(n))

  const { completion, careerLevelInfo, careerLevelIdx, maxLevelIdx, careerChangeCost: levelUpCost } = derived
  const nextLevel = careerLevelIdx < maxLevelIdx ? career.levels[careerLevelIdx + 1] : null

  return (
    <div className="cc-step">
      <h2>Advancement</h2>
      <p className="cc-step__lede">
        Spend Experience Points to improve your character. Your <strong>starting XP</strong> comes from
        the random choices you made; add any <strong>XP earned in play</strong> below. Costs follow the
        rulebook — characteristics and skills get pricier the more advances you buy, a talent costs more
        each time, and brand-new (non-career) skills cost double.
      </p>

      <div className="cc-xp-board">
        <div><span>Starting</span><strong>{derived.xpStarting}</strong></div>
        <div className="cc-xp-board__add">
          <span>+ Earned in play</span>
          <input
            type="number" min={0}
            value={state.xpAdded}
            onChange={(e) => update({ xpAdded: Math.max(0, Number(e.target.value) || 0) })}
          />
        </div>
        <div><span>Total</span><strong>{derived.xpTotal}</strong></div>
        <div><span>Spent</span><strong>{derived.xpSpentAdv}</strong></div>
        <div className={`cc-xp-board__avail ${avail < 0 ? 'is-over' : ''}`}><span>Available</span><strong>{avail}</strong></div>
      </div>

      {/* ── Status / career level ── */}
      <h3 className="cc-subhead">Status — {careerLevelInfo.title} <span className="cc-pill">{derived.status}</span></h3>
      <div className="cc-status">
        <p className="cc-note">
          To complete this career level (and raise your Status) you need <strong>{completion.req} advances</strong> in
          all your career characteristics, in eight career skills, and at least one career talent. We approximate
          "all characteristics" as any three.
        </p>
        <ul className="cc-checklist">
          <li className={completion.charsOk ? 'is-ok' : ''}>{completion.charsOk ? '✓' : '○'} Characteristics at +{completion.req}: {completion.charsAtReq}/{completion.charsNeeded}</li>
          <li className={completion.skillsOk ? 'is-ok' : ''}>{completion.skillsOk ? '✓' : '○'} Career skills at +{completion.req}: {completion.skillsAtReq}/{completion.skillsNeeded}</li>
          <li className={completion.talentOk ? 'is-ok' : ''}>{completion.talentOk ? '✓' : '○'} A career talent</li>
        </ul>
        <div className="cc-roll-bar">
          {nextLevel ? (
            <button
              className="cc-btn"
              disabled={!derived.canAdvanceLevel}
              onClick={() => setCareerLevel(careerLevelIdx + 1)}
              title={derived.careerCompleted ? '' : 'Complete the current level first'}
            >
              ▲ Advance to {nextLevel.title} ({nextLevel.status}) — {levelUpCost} XP
            </button>
          ) : <span className="cc-note">Top of the career path.</span>}
          {careerLevelIdx > 0 && (
            <button className="cc-btn cc-btn--ghost" onClick={() => setCareerLevel(careerLevelIdx - 1)}>
              ▼ Step down (refund {levelUpCost} XP)
            </button>
          )}
        </div>

        <div className="cc-change-career">
          <label>Change to another career
            <select value={targetCareer} onChange={(e) => setTargetCareer(e.target.value)}>
              <option value="">Choose a career…</option>
              {CLASSES.map((k) => (
                <optgroup key={k.id} label={k.name}>
                  {careersByClass(k.id).map((c) => (
                    <option key={c.id} value={c.id} disabled={c.id === career.id}>
                      {c.name}{c.id === career.id ? ' (current)' : ''}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <button className="cc-btn" disabled={!target || target.id === career.id || targetCost > avail} onClick={changeCareer}>
            Change{target && target.id !== career.id ? ` — ${targetCost} XP` : ''}
          </button>
        </div>
        <p className="cc-note">
          Changing career costs {derived.careerCompleted ? 100 : 200} XP{derived.careerCompleted ? '' : ' (current level not completed)'} +100 if it's a
          different class. You enter the new career at level 1; characteristics, skills and talents carry over —
          your old career's skills become non-career (×2 to advance).
        </p>
      </div>

      <h3 className="cc-subhead">Characteristics</h3>
      <div className="cc-adv-grid">
        {CHARACTERISTICS.map((c) => {
          const bought = state.advChar[c.key] || 0
          const cost = charAdvanceCost(bought)
          return (
            <div key={c.key} className="cc-adv-row">
              <span className="cc-adv-row__name">{c.name} <em>{c.key}</em></span>
              <span className="cc-adv-row__val">{derived.finalChars[c.key]}</span>
              <span className="cc-adv-row__bought">{bought ? `+${bought}` : '—'}</span>
              <span className="cc-adv-row__cost">next {cost}</span>
              <div className="cc-stepper cc-stepper--sm">
                <button onClick={() => bumpChar(c.key, -1)} disabled={bought <= 0}>−</button>
                <button onClick={() => bumpChar(c.key, 1)} disabled={cost > avail}>+</button>
              </div>
            </div>
          )
        })}
      </div>

      <h3 className="cc-subhead">Skills</h3>
      <div className="cc-adv-grid">
        {derived.skills.map((sk) => {
          const cost = skillAdvanceCost(sk.advances) * (sk.nonCareer ? 2 : 1)
          const canRemove = sk.source === 'extra' && sk.purchasedAdv <= 0
          return (
            <div key={sk.name} className="cc-adv-row">
              <span className="cc-adv-row__name">
                {sk.name} {sk.char && <em>{sk.char}</em>}
                {sk.nonCareer && <span className="cc-x2" title="Non-career skill: double cost">×2</span>}
              </span>
              <span className="cc-adv-row__val">{sk.total ?? '—'}</span>
              <span className="cc-adv-row__bought">{sk.purchasedAdv ? `+${sk.purchasedAdv}` : '—'}</span>
              <span className="cc-adv-row__cost">next {cost}</span>
              <div className="cc-stepper cc-stepper--sm">
                {canRemove
                  ? <button onClick={() => removeSkill(sk.name)} title="Remove this added skill">×</button>
                  : <button onClick={() => bumpSkill(sk.name, -1)} disabled={sk.purchasedAdv <= 0}>−</button>}
                <button onClick={() => bumpSkill(sk.name, 1)} disabled={cost > avail}>+</button>
              </div>
            </div>
          )
        })}
      </div>
      <div className="cc-buy-talent">
        <input
          list="cc-skill-suggestions"
          value={skillName}
          placeholder="Add a new skill (e.g. Lore (Politics), Melee (Polearm))"
          onChange={(e) => setSkillName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') addSkill(skillName) }}
        />
        <datalist id="cc-skill-suggestions">
          {skillSuggestions.map((n) => <option key={n} value={n} />)}
        </datalist>
        <button className="cc-btn cc-btn--ghost" disabled={!skillName.trim()} onClick={() => addSkill(skillName)}>+ Add skill</button>
      </div>
      <p className="cc-note">Added skills are treated as non-career (double XP cost). Remove one with ✕ while it has no purchased advances.</p>

      <h3 className="cc-subhead">Talents</h3>
      <div className="cc-buy-talent">
        <input
          list="cc-talent-suggestions"
          value={talentName}
          placeholder="Talent name"
          onChange={(e) => setTalentName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') buyTalent(talentName) }}
        />
        <datalist id="cc-talent-suggestions">
          {talentSuggestions.map((t) => <option key={t} value={t} />)}
        </datalist>
        <button
          className="cc-btn"
          disabled={!talentName.trim() || nextTalentCost(talentName.trim()) > avail}
          onClick={() => buyTalent(talentName)}
        >
          Buy{talentName.trim() ? ` (${nextTalentCost(talentName.trim())} XP)` : ''}
        </button>
      </div>
      {state.boughtTalents.length > 0 && (
        <ul className="cc-bought-list">
          {state.boughtTalents.map((t) => (
            <li key={t.id}>
              <span>{t.name}</span>
              <button className="cc-x" onClick={() => removeTalent(t.id)} aria-label={`Remove ${t.name}`}>×</button>
            </li>
          ))}
        </ul>
      )}
      <p className="cc-note">Talents already gained at creation are shown on the sheet; buying one you already have raises its cost (+100 XP each time).</p>
    </div>
  )
}
