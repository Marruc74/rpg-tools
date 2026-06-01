import {
  rollRandomTalent, SPECIES_SKILL_RULE, CAREER_SKILL_ADVANCES, CAREER_SKILL_CAP,
} from '../../lib/wfrpData.js'

export default function SkillsTalentsStep({ state, setState, derived }) {
  const species = derived.species
  const career = derived.career

  if (!species || !career) {
    return (
      <div className="cc-step">
        <h2>Skills &amp; Talents</h2>
        <p className="hint">Choose a species and a career first.</p>
      </div>
    )
  }

  const setSpeciesAdv = (name, val) => {
    setState((s) => {
      const next = { ...s.speciesSkillAdv }
      if (val) next[name] = val; else delete next[name]
      return { ...s, speciesSkillAdv: next }
    })
  }
  const setCareerAdv = (name, value) => {
    const v = Math.max(0, Math.min(CAREER_SKILL_CAP, Number(value) || 0))
    setState((s) => {
      const next = { ...s.careerSkillAdv }
      if (v) next[name] = v; else delete next[name]
      return { ...s, careerSkillAdv: next }
    })
  }
  const setTalentChoice = (i, talent) => {
    setState((s) => ({ ...s, speciesTalentChoices: { ...s.speciesTalentChoices, [i]: talent } }))
  }
  const setRandomTalent = (i, talent) => {
    setState((s) => {
      const next = [...(s.speciesRandomTalents || [])]
      next[i] = talent
      return { ...s, speciesRandomTalents: next }
    })
  }

  const at5Left = SPECIES_SKILL_RULE.at5 - derived.speciesAt5
  const at3Left = SPECIES_SKILL_RULE.at3 - derived.speciesAt3

  return (
    <div className="cc-step">
      <h2>Skills &amp; Talents</h2>

      {/* ── Species skills ── */}
      <h3 className="cc-subhead">
        Species skills — choose {SPECIES_SKILL_RULE.at5} at +5 and {SPECIES_SKILL_RULE.at3} at +3
        <span className={`cc-pill ${derived.speciesAdvValid ? 'is-ok' : ''}`}>
          +5: {derived.speciesAt5}/{SPECIES_SKILL_RULE.at5} · +3: {derived.speciesAt3}/{SPECIES_SKILL_RULE.at3}
        </span>
      </h3>
      <div className="cc-skill-list">
        {species.skills.map((name) => {
          const v = state.speciesSkillAdv[name] || 0
          const disable5 = v !== 5 && at5Left <= 0
          const disable3 = v !== 3 && at3Left <= 0
          return (
            <div key={name} className="cc-skill-row">
              <span className="cc-skill-row__name">{name}</span>
              <div className="cc-seg">
                <button className={v === 0 ? 'is-on' : ''} onClick={() => setSpeciesAdv(name, 0)}>—</button>
                <button className={v === 3 ? 'is-on' : ''} disabled={disable3} onClick={() => setSpeciesAdv(name, 3)}>+3</button>
                <button className={v === 5 ? 'is-on' : ''} disabled={disable5} onClick={() => setSpeciesAdv(name, 5)}>+5</button>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Career skills ── */}
      <h3 className="cc-subhead">
        Career skills — distribute {CAREER_SKILL_ADVANCES} advances (max {CAREER_SKILL_CAP} each)
        <span className={`cc-pill ${derived.careerAdvSpent === CAREER_SKILL_ADVANCES && !derived.careerOverCap.length ? 'is-ok' : ''}`}>
          {derived.careerAdvSpent}/{CAREER_SKILL_ADVANCES}
        </span>
      </h3>
      <div className="cc-skill-list">
        {career.skills.map((name) => (
          <div key={name} className="cc-skill-row">
            <span className="cc-skill-row__name">{name}</span>
            <input
              className="cc-skill-row__num"
              type="number" min={0} max={CAREER_SKILL_CAP}
              value={state.careerSkillAdv[name] || 0}
              onChange={(e) => setCareerAdv(name, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* ── Talents ── */}
      <h3 className="cc-subhead">Talents</h3>
      <div className="cc-talents">
        <div className="cc-talent-block">
          <span className="cc-talent-block__label">Always gained</span>
          <p>{species.talents.fixed.join(', ')}</p>
        </div>

        {species.talents.choices.map((pair, i) => (
          <div key={i} className="cc-talent-block">
            <span className="cc-talent-block__label">Choose one</span>
            <div className="cc-seg">
              {pair.map((t) => (
                <button key={t} className={state.speciesTalentChoices[i] === t ? 'is-on' : ''} onClick={() => setTalentChoice(i, t)}>{t}</button>
              ))}
            </div>
          </div>
        ))}

        {species.talents.random > 0 && (
          <div className="cc-talent-block">
            <span className="cc-talent-block__label">{species.talents.random} random talent{species.talents.random === 1 ? '' : 's'}</span>
            {Array.from({ length: species.talents.random }).map((_, i) => (
              <div key={i} className="cc-skill-row">
                <input
                  className="cc-skill-row__name cc-talent-input"
                  value={state.speciesRandomTalents[i] || ''}
                  placeholder="Roll or type a talent"
                  onChange={(e) => setRandomTalent(i, e.target.value)}
                />
                <button className="cc-btn cc-btn--ghost" onClick={() => setRandomTalent(i, rollRandomTalent())}>🎲</button>
              </div>
            ))}
          </div>
        )}

        <div className="cc-talent-block">
          <span className="cc-talent-block__label">Career talent — choose one</span>
          <div className="cc-seg cc-seg--wrap">
            {career.talents.map((t) => (
              <button key={t} className={state.careerTalent === t ? 'is-on' : ''} onClick={() => setState((s) => ({ ...s, careerTalent: t }))}>{t}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
