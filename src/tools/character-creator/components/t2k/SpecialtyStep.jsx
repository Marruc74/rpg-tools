import { useState } from 'react'
import { SPECIALTIES, SKILLS, specialtyById } from '../../lib/t2kData.js'
import FilterInput, { matches } from '../FilterInput.jsx'

// Step 4 — pick one starting specialty (recommended ones come from your
// archetype, but you may take any with the Referee's blessing).
export default function SpecialtyStep({ state, update, derived }) {
  const arch = derived.archetype
  const recommended = arch ? arch.specialties : []
  const [q, setQ] = useState('')
  const grouped = SKILLS
    .map((sk) => ({ skill: sk, list: SPECIALTIES.filter((sp) => sp.skill === sk.id && matches(sp.name, q)) }))
    .filter((g) => g.list.length > 0)

  return (
    <div className="cc-step">
      <h2>Specialty &amp; nerve</h2>
      <p className="cc-step__lede">
        Specialties are narrow abilities that give you an edge. Choose <strong>one</strong> to start.
        Your archetype recommends a few, but any specialty is allowed if your Referee agrees.
      </p>

      {arch && (
        <div className="cc-t2k-reco">
          <span className="cc-t2k-reco__label">Recommended for {arch.name}:</span>
          {recommended.map((id) => {
            const sp = specialtyById(id)
            if (!sp) return null
            return (
              <button key={id} type="button" className={`cc-chip ${state.specialty === id ? 'is-on' : ''}`} onClick={() => update({ specialty: id })}>{sp.name}</button>
            )
          })}
        </div>
      )}

      <div className="cc-t2k-allspec">
        <span className="cc-t2k-reco__label">Or choose any specialty:</span>
        <FilterInput value={q} onChange={setQ} placeholder="Filter specialties…" />
        <div className="cc-t2k-spec-groups">
          {grouped.map((g) => (
            <div key={g.skill.id} className="cc-t2k-spec-group">
              <h5>{g.skill.name}</h5>
              <div className="cc-t2k-reco">
                {g.list.map((sp) => (
                  <button key={sp.id} type="button" className={`cc-chip cc-chip--sm ${state.specialty === sp.id ? 'is-on' : ''}`} onClick={() => update({ specialty: sp.id })}>{sp.name}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="cc-bg-sec cc-t2k-nerve">
        <div className="cc-xp"><span>Coolness Under Fire (CUF)</span><strong>{derived.cuf || '—'}</strong></div>
        <p className="cc-note">
          CUF is set by your archetype. Your group’s <strong>unit morale</strong> equals the highest Command
          skill level in the group — track it on the character with the best Command.
        </p>
      </section>
    </div>
  )
}
