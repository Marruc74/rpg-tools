import { NAME_POOLS, rollHeight, rollHairColour, rollEyeColour } from '../../lib/wfrpData.js'

// Roll an "NdM" dice string (e.g. "10d10").
function rollDice(spec) {
  const m = String(spec).match(/(\d+)d(\d+)/i)
  if (!m) return 0
  const n = Number(m[1]), d = Number(m[2])
  let total = 0
  for (let i = 0; i < n; i += 1) total += 1 + Math.floor(Math.random() * d)
  return total
}

export default function DetailStep({ state, update, derived }) {
  const species = derived.species

  const rollName = () => {
    const pool = species ? NAME_POOLS[species.id] : NAME_POOLS.human
    update({ name: pool[Math.floor(Math.random() * pool.length)] })
  }
  const rollAge = () => {
    if (!species) return
    update({ age: String(species.age.base + rollDice(species.age.dice)) })
  }
  const rollHeightVal = () => { if (species) update({ height: rollHeight(species) }) }
  const rollHair = () => { if (species) update({ hair: rollHairColour(species.id) }) }
  const rollEyes = () => { if (species) update({ eyes: rollEyeColour(species.id) }) }

  return (
    <div className="cc-step">
      <h2>Adding Detail</h2>
      <p className="cc-step__lede">
        Flesh out your character. A <strong>Motivation</strong> is required — a word or
        phrase that drives you and lets you regain Resolve in play. Short- and long-term
        Ambitions earn XP as you pursue them.
      </p>

      <div className="cc-identity">
        <label>Name
          <div className="cc-inline">
            <input value={state.name} onChange={(e) => update({ name: e.target.value })} placeholder="Character name" />
            <button className="cc-btn cc-btn--ghost" onClick={rollName}>🎲</button>
          </div>
        </label>
        <label>Age
          <div className="cc-inline">
            <input value={state.age} onChange={(e) => update({ age: e.target.value })} placeholder={species ? `${species.age.base} + ${species.age.dice}` : ''} />
            <button className="cc-btn cc-btn--ghost" onClick={rollAge}>🎲</button>
          </div>
        </label>
        <label>Height
          <div className="cc-inline">
            <input value={state.height} onChange={(e) => update({ height: e.target.value })} placeholder={species ? species.height : ''} />
            <button className="cc-btn cc-btn--ghost" onClick={rollHeightVal}>🎲</button>
          </div>
        </label>
        <label>Hair
          <div className="cc-inline">
            <input value={state.hair} onChange={(e) => update({ hair: e.target.value })} placeholder="Hair colour" />
            <button className="cc-btn cc-btn--ghost" onClick={rollHair}>🎲</button>
          </div>
        </label>
        <label>Eyes
          <div className="cc-inline">
            <input value={state.eyes} onChange={(e) => update({ eyes: e.target.value })} placeholder="Eye colour" />
            <button className="cc-btn cc-btn--ghost" onClick={rollEyes}>🎲</button>
          </div>
        </label>
        <label>Motivation
          <input value={state.motivation} onChange={(e) => update({ motivation: e.target.value })} placeholder="e.g. Thrillseeker, Protect the weak" />
        </label>
      </div>

      <div className="cc-identity">
        <label>Short-term Ambition
          <input value={state.shortAmbition} onChange={(e) => update({ shortAmbition: e.target.value })} placeholder="Achievable in a few sessions" />
        </label>
        <label>Long-term Ambition
          <input value={state.longAmbition} onChange={(e) => update({ longAmbition: e.target.value })} placeholder="The dream of a lifetime" />
        </label>
      </div>

      <label className="cc-textarea-label">Background
        <textarea
          rows={5}
          value={state.background}
          onChange={(e) => update({ background: e.target.value })}
          placeholder="Where are you from? What is your family like? Why did you leave home? Who are your friends?"
        />
      </label>
    </div>
  )
}
