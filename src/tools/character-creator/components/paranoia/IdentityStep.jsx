import { CLEARANCES, randomNameParts } from '../../lib/paranoiaData.js'

// Step 1 — the clone's name designation: First-CLEARANCE-SECTOR-clone#.
export default function IdentityStep({ state, update, derived }) {
  const scramble = () => update(randomNameParts())
  return (
    <div className="cc-step">
      <h2>Clone designation</h2>
      <p className="cc-step__lede">
        Every citizen’s name encodes everything the right person needs to know — first name,
        security clearance, sector of origin, and clone number. Troubleshooters start at
        <strong> Red</strong> clearance, clone <strong>1</strong>. Stay happy. Happiness is mandatory.
      </p>

      <div className="cc-identity">
        <label>First name
          <input value={state.firstName} onChange={(e) => update({ firstName: e.target.value })} placeholder="e.g. Lepp" />
        </label>
        <label>Security clearance
          <select value={state.clearance} onChange={(e) => update({ clearance: e.target.value })}>
            {CLEARANCES.map((c) => <option key={c.letter} value={c.letter}>{c.name}{c.letter !== 'IR' ? ` (${c.letter})` : ''}</option>)}
          </select>
        </label>
        <label>Sector of origin
          <input
            value={state.sector}
            onChange={(e) => update({ sector: e.target.value.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() })}
            placeholder="3 letters, e.g. OUS"
            maxLength={3}
            className={state.sector && !derived.sectorOk ? 'is-bad' : ''}
          />
        </label>
        <label>Clone #
          <input type="number" min={1} max={6} value={state.cloneNumber}
            onChange={(e) => update({ cloneNumber: Math.max(1, Math.min(6, Number(e.target.value) || 1)) })} />
        </label>
      </div>

      <div className="cc-pdq-name">
        <span className="cc-pdq-name__label">Designation</span>
        <span className="cc-pdq-name__value">{derived.fullName}</span>
        <button type="button" className="cc-btn cc-btn--ghost" onClick={scramble}>⟳ Scramble</button>
      </div>
      <p className="cc-note">A clone six-pack: when this clone dies, the next (clone {Math.min(6, (state.cloneNumber || 1) + 1)}) is activated. Six and you’re out.</p>
    </div>
  )
}
