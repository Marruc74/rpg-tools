import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { ATTRIBUTES, SKILL_ATTRS, clearanceByLetter } from '../../lib/paranoiaData.js'

// Final step — the Troubleshooter dossier, with PNG export (mirrors the DoD
// SheetView export pattern).
export default function ParanoiaSheetView({ state, update, derived }) {
  const ref = useRef(null)
  const [busy, setBusy] = useState(false)
  const clear = clearanceByLetter(state.clearance)

  const exportPng = async () => {
    if (!ref.current || busy) return
    setBusy(true)
    try {
      const url = await toPng(ref.current, { pixelRatio: 2, backgroundColor: '#fdfaf2' })
      const a = document.createElement('a')
      a.href = url
      a.download = `${derived.fullName.replace(/[^\w\-]/g, '') || 'troubleshooter'}.png`
      a.click()
    } catch (err) {
      alert('Could not export image: ' + (err?.message || err))
    } finally {
      setBusy(false)
    }
  }

  const issues = []
  if (!derived.nameOk) issues.push('Incomplete designation (first name + 3-letter sector)')
  if (!derived.pointsOk) issues.push(derived.isPoints ? `Attribute points must total ${derived.attrPointsTotal}` : 'Roll all attributes')
  if (!derived.powerOk) issues.push('Power must be at least 1')
  if (!derived.sgComplete) issues.push('Service Group not chosen, or fewer than 5 training rolls')
  if (!derived.skillsSpent) issues.push(`Spend all ${derived.skillPointsTotal} skill points`)
  if (!derived.noRankOver5) issues.push('A skill exceeds 5 ranks')

  const ranked = derived.skills.filter((s) => s.ranks > 0)

  return (
    <div className="cc-step">
      <div className="cc-sheet-bar">
        <h2>Troubleshooter dossier</h2>
        <div>
          {issues.length === 0
            ? <span className="cc-ok-badge">Cleared for duty ✓</span>
            : <span className="cc-warn-badge">{issues.length} to fix</span>}
          <button className="cc-btn" onClick={exportPng} disabled={busy}>{busy ? 'Exporting…' : 'Export PNG'}</button>
        </div>
      </div>
      {issues.length > 0 && <ul className="cc-issues">{issues.map((i) => <li key={i}>{i}</li>)}</ul>}

      <div className="cc-sheet cc-sheet--paranoia" ref={ref}>
        <div className="cc-sheet__title">
          <div>
            <h3>{derived.fullName}</h3>
            <p>
              <span className="cc-clearance-badge" style={{ background: clear.color }}>{clear.name}</span>
              {' '}clone #{state.cloneNumber} · {derived.serviceGroup ? derived.serviceGroup.name : 'No Service Group'}
            </p>
          </div>
          <div className="cc-sheet__game">PARANOIA</div>
        </div>

        <div className="cc-sheet__cols">
          <div className="cc-sheet__col">
            <table className="cc-sheet-tbl">
              <caption>Attributes</caption>
              <tbody>
                {ATTRIBUTES.map((a) => (
                  <tr key={a.key}>
                    <th>{a.name} <em>{a.key}</em></th>
                    <td>{derived.attrs[a.key]}{a.hasSkills ? <span className="cc-base-note"> (base {derived.skillBases[a.key]})</span> : null}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <table className="cc-sheet-tbl">
              <caption>Derived</caption>
              <tbody>
                <tr><th>Carrying capacity</th><td>{derived.derivedStats.carry} kg</td></tr>
                <tr><th>HTH damage</th><td>{derived.derivedStats.hth}</td></tr>
                <tr><th>Macho stat</th><td>{derived.derivedStats.macho}</td></tr>
                <tr><th>Wound levels</th><td>{derived.derivedStats.wounds}</td></tr>
              </tbody>
            </table>

            <table className="cc-sheet-tbl">
              <caption>Secret stuff</caption>
              <tbody>
                <tr><th>Mutant power</th><td>{state.mutantPower || '— none —'}{state.mutantPower && state.treasonRegistered ? ' (registered)' : ''}</td></tr>
                <tr><th>Secret society</th><td>{state.society ? `${state.society} (rank ${state.societyRank})` : '— none —'}</td></tr>
                <tr><th>Equipment</th><td>Standard Troubleshooter issue — see GM</td></tr>
              </tbody>
            </table>
          </div>

          <div className="cc-sheet__col cc-sheet__col--wide">
            <table className="cc-sheet-tbl cc-sheet-tbl--skills">
              <caption>Trained skills (base + ranks = value)</caption>
              <tbody>
                {ranked.length === 0 && <tr><td className="cc-empty">No ranks yet — every skill defaults to its skill base.</td></tr>}
                {SKILL_ATTRS.flatMap((k) => {
                  const rows = ranked.filter((s) => s.attr === k)
                  return rows.map((s) => (
                    <tr key={s.id}>
                      <th>{s.name}{s.treason && <span className="cc-src-badge cc-src-badge--xs cc-treason" title="Treasonous">!</span>}</th>
                      <td className="cc-fvcell">{s.value}<span className="cc-base-note"> ({s.base}+{s.ranks})</span></td>
                    </tr>
                  ))
                })}
              </tbody>
            </table>

            <table className="cc-sheet-tbl cc-sheet-tbl--skills">
              <caption>Skill bases (untrained skills use these)</caption>
              <tbody>
                {SKILL_ATTRS.map((k) => (
                  <tr key={k}><th>{ATTRIBUTES.find((a) => a.key === k).name}</th><td className="cc-fvcell">{derived.skillBases[k]}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="cc-sheet__block">
          <h4>Notes</h4>
          <textarea
            className="cc-sheet-notes"
            value={state.notes}
            onChange={(e) => update({ notes: e.target.value })}
            placeholder="Mandatory bonus duties, mission briefings, who you suspect of being a Commie mutant traitor…"
          />
        </div>
      </div>
    </div>
  )
}
