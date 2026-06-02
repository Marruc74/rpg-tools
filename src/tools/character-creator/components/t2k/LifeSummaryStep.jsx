import { careerById } from '../../lib/t2kLifePathData.js'

// Step 4 (life path) — read-only summary of the life the engine assembled.
export default function LifeSummaryStep({ derived }) {
  const trained = derived.skills.filter((s) => s.level !== 'F')
  return (
    <div className="cc-step">
      <h2>Life summary</h2>
      <p className="cc-step__lede">
        Everything below was assembled by your life path. Skills, specialties, rank, CUF and age are
        accumulated from your childhood and career terms. Add the human details in the next step.
      </p>

      {!derived.coreValid && (
        <div className="cc-krav is-fail">
          Life path incomplete — set a childhood, complete at least one career term, and let the war break out (then take the At War term).
        </div>
      )}

      <div className="cc-t2k-derived">
        <div className="cc-xp"><span>Age</span><strong>{derived.age}</strong></div>
        <div className="cc-xp"><span>Rank</span><strong>{derived.rank || '—'}</strong></div>
        <div className="cc-xp"><span>CUF</span><strong>{derived.cuf}</strong></div>
        <div className="cc-xp"><span>Terms</span><strong>{derived.termsCount}{derived.warOut ? ' + war' : ''}</strong></div>
      </div>

      <section className="cc-bg-sec">
        <h3>Skills</h3>
        <ul className="cc-pick-list cc-lp-summary-skills">
          {trained.length === 0 && <li className="cc-note">No trained skills yet.</li>}
          {trained.map((s) => (
            <li key={s.id} className="cc-pick"><span className="cc-pick__name">{s.name} <em>{s.attr}</em></span><span className="cc-skill-breakdown">{s.level} · D{s.attrDie}+D{s.skillDie}</span></li>
          ))}
        </ul>
      </section>

      <section className="cc-bg-sec">
        <h3>Specialties</h3>
        <div className="cc-t2k-reco">
          {derived.specialties.length === 0 && <span className="cc-note">None yet.</span>}
          {derived.specialties.map((sp) => <span key={sp.id} className="cc-chip is-on">{sp.name}</span>)}
        </div>
      </section>

      {derived.gearCareer && (
        <section className="cc-bg-sec">
          <h3>Starting gear — {careerById(derived.gearCareer.id)?.name}</h3>
          <ul className="cc-sheet-inv">{derived.gearCareer.gear.map((g) => <li key={g}>{g}</li>)}</ul>
        </section>
      )}
    </div>
  )
}
