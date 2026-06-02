import { useState } from 'react'
import { ATTRIBUTES, SKILL_ATTRS, SKILL_POINTS, MAX_RANK } from '../../lib/paranoiaData.js'
import FilterInput, { matches } from '../FilterInput.jsx'

// Step 4 — spend 10 skill points on ranks (1 point = 1 rank). No skill may
// exceed five ranks. Service-group training ranks are already baked in.
export default function SkillsStep({ state, update, derived }) {
  const [q, setQ] = useState('')
  const remaining = SKILL_POINTS - derived.skillPointsUsed
  const setRank = (id, n) => {
    const next = { ...state.skillRanks }
    if (n <= 0) delete next[id]; else next[id] = n
    update({ skillRanks: next })
  }
  const byAttr = (k) => derived.skills.filter((s) => s.attr === k && matches(s.name, q))

  return (
    <div className="cc-step">
      <h2>Skills</h2>
      <p className="cc-step__lede">
        You have <strong>{SKILL_POINTS} skill points</strong> — each buys one rank in any skill. A skill
        may not be raised past <strong>{MAX_RANK} ranks</strong>. Skill value = skill base (½ attribute)
        + service-group ranks + bought ranks. Spend them all now; no saving for later.
      </p>

      <div className={`cc-krav ${derived.skillsSpent && derived.noRankOver5 ? 'is-ok' : 'is-fail'}`}>
        Skill points: {derived.skillPointsUsed} / {SKILL_POINTS} ({remaining} left)
        {!derived.noRankOver5 && ' · a skill exceeds 5 ranks!'}
      </div>

      <FilterInput value={q} onChange={setQ} placeholder="Filter skills…" />
      <div className="cc-magic-grid">
        {SKILL_ATTRS.map((k) => {
          const attr = ATTRIBUTES.find((a) => a.key === k)
          const list = byAttr(k)
          if (q && list.length === 0) return null
          return (
            <div key={k} className="cc-magic-school">
              <h4>{attr.name} <span className="cc-magic-fv">base {derived.skillBases[k]}</span></h4>
              <ul className="cc-pick-list">
                {list.map((s) => {
                  const canAdd = remaining > 0 && s.ranks < MAX_RANK
                  return (
                    <li key={s.id} className={`cc-pick cc-spell ${s.boughtRanks > 0 ? 'is-picked' : ''} ${s.overCap ? 'is-locked' : ''}`}>
                      <div className="cc-pick__row">
                        <span className="cc-spell__niva" title="Skill value">{s.value}</span>
                        <span className="cc-pick__name">
                          {s.name}
                          {s.treason && <span className="cc-src-badge cc-src-badge--xs cc-treason" title="Treasonous skill — the Computer is watching">!</span>}
                        </span>
                        <span className="cc-skill-breakdown" title="base + service group + bought">
                          {s.base}{s.sgRanks ? ` +${s.sgRanks}sg` : ''}{s.boughtRanks ? ` +${s.boughtRanks}` : ''}
                        </span>
                        <span className="cc-stepper cc-stepper--sm">
                          <button className="cc-step-btn" disabled={s.boughtRanks <= 0} onClick={() => setRank(s.id, s.boughtRanks - 1)}>−</button>
                          <span className="cc-rank-n">{s.boughtRanks}</span>
                          <button className="cc-step-btn" disabled={!canAdd} onClick={() => setRank(s.id, s.boughtRanks + 1)}>+</button>
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
