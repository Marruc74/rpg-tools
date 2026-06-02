import { GROUP_GEAR, rollVehicle } from '../../lib/t2kLifePathData.js'

// Step 5 — the human details: moral code, big dream, how you met, appearance,
// buddy, starting rads, and the shared group gear & vehicle.
export default function ProfileStep({ state, update }) {
  const rollRads = () => update({ rads: 1 + Math.floor(Math.random() * 6) })
  const partySize = state.partySize || 4
  const groupGear = state.groupGear || []
  const toggleGear = (g) => update({ groupGear: groupGear.includes(g) ? groupGear.filter((x) => x !== g) : [...groupGear, g] })

  const field = (key, label, placeholder, rows = 2) => (
    <label className="cc-t2k-field">
      {label}
      <textarea rows={rows} value={state[key]} onChange={(e) => update({ [key]: e.target.value })} placeholder={placeholder} />
    </label>
  )

  return (
    <div className="cc-step">
      <h2>Profile &amp; radiation</h2>
      <p className="cc-step__lede">
        The numbers don’t make a survivor — these do. Define what drives your character, then finish
        character creation by rolling for the radiation you’ve already soaked up in this broken world.
      </p>

      <div className="cc-t2k-profile">
        {field('moralCode', 'Moral code', 'A single sentence you live by — following it earns XP, betraying it costs stress.')}
        {field('bigDream', 'Big dream', 'Your long-term motivation. Acting toward it earns extra XP.')}
        {field('appearance', 'Appearance', 'Distinctive features, clothing, or mannerisms.')}
        {field('howMet', 'How you met the group', 'A sentence or two — no mechanical effect.')}
        <label className="cc-t2k-field">Buddy
          <input value={state.buddy} onChange={(e) => update({ buddy: e.target.value })} placeholder="The PC you feel closest to" />
        </label>
      </div>

      <section className="cc-bg-sec cc-t2k-nerve">
        <div className="cc-roll-bar">
          <button type="button" className="cc-btn" onClick={rollRads}>☢ Roll starting rads (D6)</button>
          <span className="cc-xp"><span>Permanent rads</span><strong>{state.rads ?? '—'}</strong></span>
        </div>
        <p className="cc-note">Chances are you’ve already been irradiated before the game starts. This is your permanent radiation total.</p>
      </section>

      <section className="cc-bg-sec">
        <h3>Group gear &amp; vehicle</h3>
        <p className="cc-note">Shared by the whole team. Pick a number of group items equal to the number of PCs, and roll once for a starting vehicle.</p>
        <div className="cc-roll-bar">
          <span className="cc-lp-label">Party size</span>
          <span className="cc-stepper">
            <button type="button" className="cc-step-btn" disabled={partySize <= 1} onClick={() => update({ partySize: partySize - 1 })}>−</button>
            <span className="cc-rank-n">{partySize}</span>
            <button type="button" className="cc-step-btn" onClick={() => update({ partySize: partySize + 1 })}>+</button>
          </span>
          <button type="button" className="cc-btn" onClick={() => update({ vehicle: rollVehicle(partySize) })}>🎲 Roll vehicle (2D6+{partySize})</button>
          {state.vehicle && <span className="cc-note"><strong>{state.vehicle.vehicle}</strong> (rolled {state.vehicle.total})</span>}
        </div>
        <div className="cc-t2k-reco">
          {GROUP_GEAR.map((g) => (
            <button key={g} type="button" className={`cc-chip cc-chip--sm ${groupGear.includes(g) ? 'is-on' : ''}`} onClick={() => toggleGear(g)}>{g}</button>
          ))}
        </div>
        <p className={`cc-note ${groupGear.length > partySize ? 'cc-warn' : ''}`}>Group items chosen: {groupGear.length} / {partySize}</p>
      </section>

      <label className="cc-t2k-field">Notes
        <textarea rows={3} value={state.notes} onChange={(e) => update({ notes: e.target.value })} placeholder="Anything else worth recording." />
      </label>
    </div>
  )
}
