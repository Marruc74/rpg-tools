import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { ATTRIBUTES, DIE } from '../../lib/t2kData.js'

// Final step — the survivor's character sheet, with PNG export.
export default function T2kSheetView({ state, update, derived }) {
  const ref = useRef(null)
  const [busy, setBusy] = useState(false)
  const arch = derived.archetype

  const exportPng = async () => {
    if (!ref.current || busy) return
    setBusy(true)
    try {
      const url = await toPng(ref.current, { pixelRatio: 2, backgroundColor: '#fdfaf2' })
      const a = document.createElement('a')
      a.href = url
      a.download = `${(state.name || 'survivor').replace(/[^\w\-]/g, '') || 'survivor'}.png`
      a.click()
    } catch (err) {
      alert('Could not export image: ' + (err?.message || err))
    } finally {
      setBusy(false)
    }
  }

  const lifepath = derived.method === 'lifepath'
  const issues = []
  if (!derived.nameOk) issues.push('No name')
  if (!derived.attrValid) issues.push('Attribute increases not fully/legally allocated')
  if (lifepath) {
    if (!derived.coreValid) issues.push('Life path incomplete (childhood, ≥1 term, war + At War term)')
  } else {
    if (!arch) issues.push('No archetype chosen')
    if (!derived.spreadOk) issues.push('Skills must be exactly one B, two C, three D')
    if (derived.skillCounts.B > 0 && !derived.bSkillOk) issues.push('Your B-level skill must be a key skill')
    if (!derived.specialty) issues.push('Choose a specialty')
  }

  const trained = derived.skills.filter((s) => s.level !== 'F')

  return (
    <div className="cc-step">
      <div className="cc-sheet-bar">
        <h2>Character sheet</h2>
        <div>
          {issues.length === 0
            ? <span className="cc-ok-badge">Ready to deploy ✓</span>
            : <span className="cc-warn-badge">{issues.length} to fix</span>}
          <button className="cc-btn" onClick={exportPng} disabled={busy}>{busy ? 'Exporting…' : 'Export PNG'}</button>
        </div>
      </div>
      {issues.length > 0 && <ul className="cc-issues">{issues.map((i) => <li key={i}>{i}</li>)}</ul>}

      <div className="cc-sheet cc-sheet--t2k" ref={ref}>
        <div className="cc-sheet__title">
          <div>
            <h3>{state.name || 'Unnamed survivor'}{state.nickname ? ` “${state.nickname}”` : ''}</h3>
            <p>
              {lifepath ? `Life path · age ${derived.age}` : (arch ? arch.name : '—')} · {derived.nationality ? derived.nationality.name : '—'}
              {lifepath ? (derived.rank ? ` · ${derived.rank}` : '') : `${state.branch ? ` · ${state.branch}` : ''}${state.rank ? ` · ${state.rank}` : ''}`}
            </p>
          </div>
          <div className="cc-sheet__game">TWILIGHT: 2000</div>
        </div>

        <div className="cc-sheet__cols">
          <div className="cc-sheet__col">
            <table className="cc-sheet-tbl">
              <caption>Attributes</caption>
              <tbody>
                {ATTRIBUTES.map((a) => (
                  <tr key={a.key}><th>{a.name} <em>{a.key}</em></th><td>{derived.attrs[a.key]} <span className="cc-base-note">D{DIE[derived.attrs[a.key]]}</span></td></tr>
                ))}
              </tbody>
            </table>
            <table className="cc-sheet-tbl">
              <caption>Condition</caption>
              <tbody>
                {lifepath && <tr><th>Age</th><td>{derived.age}</td></tr>}
                {lifepath && <tr><th>Rank</th><td>{derived.rank || '—'}</td></tr>}
                <tr><th>Hit capacity</th><td>{derived.hitCap}</td></tr>
                <tr><th>Stress capacity</th><td>{derived.stressCap}</td></tr>
                <tr><th>Coolness Under Fire</th><td>{derived.cuf || '—'}</td></tr>
                <tr><th>Permanent rads</th><td>{state.rads ?? '—'}</td></tr>
                <tr><th>Language</th><td>{derived.nationality ? derived.nationality.language : '—'}</td></tr>
              </tbody>
            </table>
            <table className="cc-sheet-tbl">
              <caption>Specialties</caption>
              <tbody>
                {derived.specialties.length === 0 && <tr><td className="cc-empty">None</td></tr>}
                {derived.specialties.map((sp) => <tr key={sp.id}><th>{sp.name}</th><td>{sp.skill ? sp.skill.replace(/-/g, ' ') : ''}</td></tr>)}
              </tbody>
            </table>
          </div>

          <div className="cc-sheet__col cc-sheet__col--wide">
            <table className="cc-sheet-tbl cc-sheet-tbl--skills">
              <caption>Trained skills (attribute die + skill die)</caption>
              <tbody>
                {trained.length === 0 && <tr><td className="cc-empty">No trained skills yet.</td></tr>}
                {trained.map((s) => (
                  <tr key={s.id}><th>{s.name} <em>{s.attr}</em></th><td className="cc-fvcell">{s.level} <span className="cc-base-note">D{s.attrDie}+D{s.skillDie}</span></td></tr>
                ))}
              </tbody>
            </table>
            {derived.gear && derived.gear.length > 0 && (
              <div className="cc-sheet__block">
                <h4>Starting gear{lifepath && derived.gearCareer ? ` — ${derived.gearCareer.name}` : ''}</h4>
                <ul className="cc-sheet-inv">{derived.gear.map((g) => <li key={g}>{g}</li>)}</ul>
              </div>
            )}
          </div>
        </div>

        {(state.moralCode || state.bigDream) && (
          <div className="cc-sheet__block">
            {state.moralCode && <p><strong>Moral code:</strong> {state.moralCode}</p>}
            {state.bigDream && <p><strong>Big dream:</strong> {state.bigDream}</p>}
            {state.buddy && <p><strong>Buddy:</strong> {state.buddy}</p>}
          </div>
        )}
        {(state.appearance || state.howMet) && (
          <div className="cc-sheet__block">
            {state.appearance && <p><strong>Appearance:</strong> {state.appearance}</p>}
            {state.howMet && <p><strong>How we met:</strong> {state.howMet}</p>}
          </div>
        )}

        <div className="cc-sheet__block">
          <h4>Notes</h4>
          <textarea className="cc-sheet-notes" value={state.notes} onChange={(e) => update({ notes: e.target.value })} placeholder="Mission notes, contacts, debts owed…" />
        </div>
      </div>
    </div>
  )
}
