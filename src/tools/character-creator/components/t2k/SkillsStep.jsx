import { ATTRIBUTES } from '../../lib/t2kData.js'

// Step 3 — assign one B, two C and three D skill levels. The B-level skill must
// be one of your archetype's key skills, so B is only offered for those.
export default function SkillsStep({ state, update, derived }) {
  const arch = derived.archetype
  const keySkills = arch ? arch.keySkills : []

  const setLevel = (id, lvl) => {
    const next = { ...state.skills }
    if (lvl === 'F') delete next[id]; else next[id] = lvl
    update({ skills: next })
  }

  const c = derived.skillCounts
  const tracker = (lvl, need) => {
    const have = c[lvl]
    return <span className={`cc-t2k-track ${have === need ? 'is-ok' : 'is-fail'}`}>{lvl}: {have}/{need}</span>
  }

  return (
    <div className="cc-step">
      <h2>Skills</h2>
      <p className="cc-step__lede">
        Choose your starting skills: <strong>one B</strong>, <strong>two C</strong>, and <strong>three D</strong>.
        Your B-level skill must be one of your archetype’s key skills (marked ★). Everything else stays
        untrained (F). A skill roll uses the attribute die + the skill die.
      </p>

      <div className={`cc-krav ${derived.skillsValid ? 'is-ok' : 'is-fail'}`}>
        {tracker('B', derived.SKILL_SPREAD.B)} {tracker('C', derived.SKILL_SPREAD.C)} {tracker('D', derived.SKILL_SPREAD.D)}
        {derived.skillCounts.B > 0 && !derived.bSkillOk && <span className="cc-t2k-track is-fail"> · B must be a key skill</span>}
      </div>

      <div className="cc-magic-grid">
        {ATTRIBUTES.map((a) => {
          const rows = derived.skills.filter((s) => s.attr === a.key)
          return (
            <div key={a.key} className="cc-magic-school">
              <h4>{a.name} <span className="cc-magic-fv">{a.key} · D{derived.skills.find((s) => s.attr === a.key)?.attrDie}</span></h4>
              <ul className="cc-pick-list">
                {rows.map((s) => {
                  const isKey = keySkills.includes(s.id)
                  return (
                    <li key={s.id} className={`cc-pick cc-spell ${s.level !== 'F' ? 'is-picked' : ''}`}>
                      <div className="cc-pick__row">
                        <span className="cc-pick__name">{isKey && <span className="cc-t2k-star" title="Key skill">★</span>}{s.name}</span>
                        <span className="cc-skill-breakdown">{s.level !== 'F' ? `D${s.attrDie}+D${s.skillDie}` : `D${s.attrDie}`}</span>
                        <select className="cc-t2k-lvl" value={s.level} onChange={(e) => setLevel(s.id, e.target.value)}>
                          <option value="F">F — untrained</option>
                          <option value="D">D — Novice</option>
                          <option value="C">C — Experienced</option>
                          {isKey && <option value="B">B — Veteran</option>}
                        </select>
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
