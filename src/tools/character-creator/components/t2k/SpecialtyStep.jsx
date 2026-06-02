import { SPECIALTIES, SKILLS, specialtyById } from '../../lib/t2kData.js'

// Step 4 — pick one starting specialty (recommended ones come from your
// archetype, but you may take any with the Referee's blessing).
export default function SpecialtyStep({ state, update, derived }) {
  const arch = derived.archetype
  const recommended = arch ? arch.specialties : []
  const grouped = SKILLS.map((sk) => ({ skill: sk, list: SPECIALTIES.filter((sp) => sp.skill === sk.id) }))

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

      <label className="cc-t2k-allspec">Or choose any specialty
        <select value={state.specialty} onChange={(e) => update({ specialty: e.target.value })}>
          <option value="">— none chosen —</option>
          {grouped.map((g) => (
            <optgroup key={g.skill.id} label={g.skill.name}>
              {g.list.map((sp) => <option key={sp.id} value={sp.id}>{sp.name}</option>)}
            </optgroup>
          ))}
        </select>
      </label>

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
