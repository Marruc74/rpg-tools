import { CHARACTERISTICS, SPECIES, RANDOM_SPECIES, speciesById } from '../../lib/wfrpData.js'

function fmtMod(n) {
  if (n > 0) return `+${n}`
  if (n < 0) return `${n}`
  return '±0'
}

// Roll 1d100 and map to a species via the Random Species table.
function rollSpecies() {
  const r = 1 + Math.floor(Math.random() * 100)
  // ranges: 1-90 human, 91-94 halfling, 95-98 dwarf, 99 high-elf, 100 wood-elf
  if (r <= 90) return 'human'
  if (r <= 94) return 'halfling'
  if (r <= 98) return 'dwarf'
  if (r === 99) return 'high-elf'
  return 'wood-elf'
}

export default function SpeciesStep({ state, update, setState }) {
  const choose = (id, random) => {
    setState((s) => ({
      ...s,
      speciesId: id,
      speciesRandom: !!random,
      // Skill/talent choices depend on the species list — reset them.
      speciesSkillAdv: {},
      speciesTalentChoices: {},
      speciesRandomTalents: [],
      fateExtra: 0,
      resilienceExtra: 0,
    }))
  }

  return (
    <div className="cc-step">
      <h2>Species</h2>
      <p className="cc-step__lede">
        Choose one of the five Species, or <strong>roll randomly for +20&nbsp;XP</strong>.
        Your Species sets the modifiers added to your 2d10 characteristic rolls, your
        starting Fate &amp; Resilience, Movement, and your species Skills and Talents.
      </p>

      <div className="cc-identity">
        <label>Name
          <input value={state.name} onChange={(e) => update({ name: e.target.value })} placeholder="Character name" />
        </label>
        <label>Player
          <input value={state.player} onChange={(e) => update({ player: e.target.value })} placeholder="Your name" />
        </label>
      </div>

      <div className="cc-roll-bar">
        <button className="cc-btn" onClick={() => choose(rollSpecies(), true)}>🎲 Roll species (+20 XP)</button>
        {state.speciesId && (
          <span className="cc-note">
            {state.speciesRandom
              ? `Random — ${speciesById(state.speciesId)?.name} (+20 XP)`
              : `Chosen — ${speciesById(state.speciesId)?.name} (no bonus XP)`}
          </span>
        )}
      </div>

      <div className="cc-cards">
        {SPECIES.map((sp) => {
          const sel = state.speciesId === sp.id
          return (
            <button key={sp.id} className={`cc-card ${sel ? 'is-selected' : ''}`} onClick={() => choose(sp.id, false)}>
              <div className="cc-card__head">
                <span className="cc-card__name">{sp.name}</span>
                <span className="cc-card__cost">M {sp.movement}</span>
              </div>
              <div className="cc-card__mods">
                {CHARACTERISTICS.map((c) => (
                  <span key={c.key} className={`cc-card__mod ${sp.mods[c.key] ? '' : 'is-zero'}`}>
                    {c.key} {fmtMod(sp.mods[c.key])}
                  </span>
                ))}
              </div>
              <div className="cc-card__bonus">
                <span>Fate {sp.fate}</span>
                <span>Resilience {sp.resilience}</span>
                <span>+{sp.extra} to distribute</span>
                <span>{sp.talents.random} random talent{sp.talents.random === 1 ? '' : 's'}</span>
              </div>
              <p className="cc-card__desc">{sp.desc}</p>
            </button>
          )
        })}
      </div>

      <p className="cc-note">
        Random Species table: {RANDOM_SPECIES.map((r) => `${r.range} ${speciesById(r.id)?.name}`).join(' · ')}
      </p>
    </div>
  )
}
