import { useState } from 'react'
import { CLASSES, CAREERS, careersByClass, careerById, classById, speciesById } from '../../lib/wfrpData.js'

// Expansion careers carry a species eligibility list — random rolls skip illegal combos.
const randomCareer = (speciesId) => {
  const pool = CAREERS.filter((c) => !c.species || !speciesId || c.species.includes(speciesId))
  return pool[Math.floor(Math.random() * pool.length)]
}

export default function CareerStep({ state, setState, derived }) {
  const career = careerById(state.careerId)
  const [openClass, setOpenClass] = useState(career ? career.classId : 'academics')
  const [rolled, setRolled] = useState([]) // pick-of-three options

  const pick = (id, method) => {
    setState((s) => ({
      ...s,
      careerId: id,
      careerMethod: method,
      careerSkillAdv: {}, // advances depend on the career skill list
      careerTalent: null,
    }))
    const c = careerById(id)
    if (c) setOpenClass(c.classId)
  }

  const rollOne = () => { setRolled([]); pick(randomCareer(state.speciesId).id, 'firstRoll') }
  const rollThree = () => {
    const picks = []
    while (picks.length < 3) {
      const c = randomCareer(state.speciesId)
      if (!picks.includes(c.id)) picks.push(c.id)
    }
    setRolled(picks)
  }

  const list = careersByClass(openClass)
  // A career is open to the chosen species when it has no restriction list or
  // the species is on it (no species chosen yet = everything selectable).
  const eligible = (c) => !c.species || !state.speciesId || c.species.includes(state.speciesId)
  const speciesName = (id) => speciesById(id)?.name.replace(/\s*\(.*\)$/, '') || id

  return (
    <div className="cc-step">
      <h2>Class &amp; Career</h2>
      <p className="cc-step__lede">
        Pick a Class, then a Career — or roll. <strong>Accept the first roll for +50&nbsp;XP</strong>,
        or <strong>roll three and pick one for +25&nbsp;XP</strong>. You begin at the first Career level.
      </p>

      <div className="cc-roll-bar">
        <button className="cc-btn" onClick={rollOne}>🎲 Roll a career (+50 XP)</button>
        <button className="cc-btn cc-btn--ghost" onClick={rollThree}>🎲 Roll three (+25 XP)</button>
        {state.careerId && (
          <span className="cc-note">
            {state.careerMethod === 'firstRoll' && '+50 XP (kept first roll)'}
            {state.careerMethod === 'pickOfThree' && '+25 XP (picked from three)'}
            {state.careerMethod === 'choose' && 'Chosen (no bonus XP)'}
          </span>
        )}
      </div>

      {rolled.length > 0 && (
        <div className="cc-three">
          <span className="cc-note">Pick one of these three (+25 XP):</span>
          {rolled.map((id) => {
            const c = careerById(id)
            return (
              <button key={id} className="cc-btn cc-btn--ghost" onClick={() => { pick(id, 'pickOfThree'); setRolled([]) }}>
                {c.name} <em>({classById(c.classId).name})</em>
              </button>
            )
          })}
        </div>
      )}

      <div className="cc-tiers cc-tiers--wrap">
        {CLASSES.map((k) => (
          <button
            key={k.id}
            className={`cc-tier ${openClass === k.id ? 'is-selected' : ''}`}
            onClick={() => setOpenClass(k.id)}
          >
            <span className="cc-tier__name">{k.name}</span>
            <span className="cc-tier__detail">{careersByClass(k.id).filter(eligible).length} careers</span>
          </button>
        ))}
      </div>

      <p className="cc-note">{classById(openClass).desc} <strong>Class trappings:</strong> {classById(openClass).trappings.join(', ')}.</p>

      <div className="cc-cards">
        {list.map((c) => {
          const sel = state.careerId === c.id
          // Careers closed to the chosen species (per the rulebook's Random
          // Class and Career Table) are shown greyed-out and unselectable.
          const locked = !eligible(c)
          return (
            <button
              key={c.id}
              className={`cc-card ${sel ? 'is-selected' : ''}`}
              disabled={locked}
              title={locked ? `Not available to ${speciesName(state.speciesId)}` : undefined}
              onClick={() => pick(c.id, 'choose')}
            >
              <div className="cc-card__head">
                <span className="cc-card__name">{c.name}</span>
                <span>
                  {c.book && <span className="cc-pill" title={`From ${c.book}`}>{c.book}</span>}
                  {' '}
                  <span className="cc-card__cost">{c.levels[0].status}</span>
                </span>
              </div>
              {c.species && (
                <div className="cc-card__bonus">
                  <strong>Species:</strong> {c.species.map(speciesName).join(', ')}
                  {locked && <em> — not available to {speciesName(state.speciesId)}</em>}
                </div>
              )}
              <div className="cc-career-levels">
                {c.levels.map((lv, i) => (
                  <span key={i} className={`cc-career-level ${i === 0 ? 'is-first' : ''}`}>
                    {i + 1}. {lv.title} <em>{lv.status}</em>
                  </span>
                ))}
              </div>
              <div className="cc-card__bonus">
                <strong>Skills:</strong> {c.skills.join(', ')}
              </div>
              <div className="cc-card__bonus">
                <strong>Talents:</strong> {c.talents.join(', ')}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
