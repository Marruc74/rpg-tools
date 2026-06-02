import { MUTANT_POWERS, SECRET_SOCIETIES, rollSociety } from '../../lib/paranoiaData.js'

const d20 = () => 1 + Math.floor(Math.random() * 20)

// Step 5 — the back of the sheet: your treasonous secrets. Every clone in Alpha
// Complex has a mutant power and belongs to a secret society… whether they know
// it or not. Keep this away from the rest of the team.
export default function SecretsStep({ state, update }) {
  const rollMutant = () => { const r = d20(); update({ mutantRoll: r, mutantPower: MUTANT_POWERS[r - 1] }) }
  const rollSoc = () => { const r = d20(); update({ societyRoll: r, society: rollSociety(r) }) }

  return (
    <div className="cc-step">
      <h2>Secret stuff <span className="cc-src-badge cc-treason">ULTRAVIOLET</span></h2>
      <p className="cc-step__lede">
        Record this on the back of the sheet and show no one. The Computer says mutants and secret
        societies are treason — but, between us, everyclone has both. Hide it, register it, or stay
        discreet. Your call, Citizen.
      </p>

      <section className="cc-bg-sec">
        <h3>Mutant Power</h3>
        <div className="cc-roll-bar">
          <button className="cc-btn" onClick={rollMutant}>🎲 Roll d20</button>
          <select value={state.mutantPower} onChange={(e) => update({ mutantPower: e.target.value, mutantRoll: null })}>
            <option value="">— None / undecided —</option>
            {MUTANT_POWERS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          {state.mutantRoll && <span className="cc-note">rolled {state.mutantRoll}</span>}
        </div>
        {state.mutantPower && (
          <label className="cc-check">
            <input type="checkbox" checked={!!state.treasonRegistered} onChange={(e) => update({ treasonRegistered: e.target.checked })} />
            Registered with the Computer (mutant stripe — “Sin No More”)
          </label>
        )}
      </section>

      <section className="cc-bg-sec">
        <h3>Secret Society</h3>
        <div className="cc-roll-bar">
          <button className="cc-btn" onClick={rollSoc}>🎲 Roll d20</button>
          <select value={state.society} onChange={(e) => update({ society: e.target.value, societyRoll: null })}>
            <option value="">— None —</option>
            {SECRET_SOCIETIES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {state.societyRoll && <span className="cc-note">rolled {state.societyRoll}{state.societyRoll >= 18 ? ' — Unknown!' : ''}</span>}
        </div>
        {state.society && (
          <label className="cc-inline-num">
            Society rank
            <input type="number" min={1} max={10} value={state.societyRank}
              onChange={(e) => update({ societyRank: Math.max(1, Math.min(10, Number(e.target.value) || 1)) })} />
            <span className="cc-note">Most Troubleshooters start at rank 1.</span>
          </label>
        )}
      </section>

      <p className="cc-note">Both of these are optional in the tool, but the gamemaster is going to assign them anyway. They always do.</p>
    </div>
  )
}
