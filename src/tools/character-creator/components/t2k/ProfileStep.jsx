// Step 5 — the human details: moral code, big dream, how you met, appearance,
// buddy, and your starting permanent radiation (roll D6).
export default function ProfileStep({ state, update }) {
  const rollRads = () => update({ rads: 1 + Math.floor(Math.random() * 6) })

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

      <label className="cc-t2k-field">Notes
        <textarea rows={3} value={state.notes} onChange={(e) => update({ notes: e.target.value })} placeholder="Anything else worth recording." />
      </label>
    </div>
  )
}
