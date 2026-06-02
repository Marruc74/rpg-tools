import { useRef } from 'react'
import { CHARACTERISTICS } from '../../lib/wfrpData.js'
import { useSheetExport } from '../../lib/sheetExport.js'

export default function WfrpSheetView({ state, derived }) {
  const ref = useRef(null)
  const { species, career, klass, careerLevelInfo, finalChars, bonuses, skills, talents, trappings } = derived
  const { busy, exportPng, exportPdf } = useSheetExport(ref, () => state.name || 'character')

  const money = state.moneyRoll

  return (
    <div className="cc-step">
      <div className="cc-sheet-bar">
        <h2>Character Sheet</h2>
        <div>
          {derived.valid
            ? <span className="cc-ok-badge">Complete ✓</span>
            : <span className="cc-warn-badge">{derived.issues.length} to resolve</span>}
          <button className="cc-btn" onClick={exportPdf} disabled={busy}>{busy ? 'Exporting…' : 'Export PDF'}</button>
          <button className="cc-btn cc-btn--ghost" onClick={exportPng} disabled={busy}>PNG</button>
        </div>
      </div>
      {derived.issues.length > 0 && <ul className="cc-issues">{derived.issues.map((i) => <li key={i}>{i}</li>)}</ul>}

      <div className="cc-sheet" ref={ref}>
        <div className="cc-sheet__title">
          <div>
            <h3>{state.name || 'Unnamed Character'}</h3>
            <p>
              {species ? species.name : '—'} · {career ? `${career.name} (${careerLevelInfo.title})` : '—'}
              {klass ? ` · ${klass.name}` : ''}{state.age ? ` · age ${state.age}` : ''}
            </p>
          </div>
          <div className="cc-sheet__game">Warhammer Fantasy Roleplay 4e</div>
        </div>

        <div className="cc-sheet__cols">
          <div className="cc-sheet__col">
            <table className="cc-sheet-tbl">
              <caption>Characteristics</caption>
              <thead><tr><th>Characteristic</th><td>Value</td><td>Bonus</td></tr></thead>
              <tbody>
                {CHARACTERISTICS.map((c) => (
                  <tr key={c.key}><th>{c.name} <em>{c.key}</em></th><td>{finalChars[c.key] || '—'}</td><td>{bonuses[c.key]}</td></tr>
                ))}
              </tbody>
            </table>

            <table className="cc-sheet-tbl">
              <caption>Attributes</caption>
              <tbody>
                <tr><th>Wounds</th><td>{derived.wounds ?? '—'}</td></tr>
                <tr><th>Movement</th><td>{derived.movement ?? '—'} (Walk {derived.walk ?? '—'} / Run {derived.run ?? '—'})</td></tr>
                <tr><th>Fate / Fortune</th><td>{derived.fate} / {derived.fortune}</td></tr>
                <tr><th>Resilience / Resolve</th><td>{derived.resilience} / {derived.resolve}</td></tr>
                <tr><th>Motivation</th><td>{state.motivation || '—'}</td></tr>
                <tr><th>XP available</th><td>{derived.xpAvailable}</td></tr>
                <tr><th>XP total / spent</th><td>{derived.xpTotal} / {derived.xpSpentAdv}</td></tr>
              </tbody>
            </table>

            <table className="cc-sheet-tbl">
              <caption>Wealth</caption>
              <tbody>
                <tr><th>Status</th><td>{derived.status || '—'}</td></tr>
                <tr><th>Money</th><td>{money ? money.text : '—'}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="cc-sheet__col cc-sheet__col--wide">
            <table className="cc-sheet-tbl cc-sheet-tbl--skills">
              <caption>Skills</caption>
              <thead><tr><th>Skill</th><td>Char</td><td>Adv</td><td>Total</td></tr></thead>
              <tbody>
                {skills.map((s) => (
                  <tr key={s.name}>
                    <th>{s.name}</th>
                    <td>{s.char || '—'}</td>
                    <td>{s.advances || 0}</td>
                    <td className="cc-fvcell">{s.total ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {talents.length > 0 && (
          <div className="cc-sheet__block">
            <h4>Talents</h4>
            <ul className="cc-tag-list">
              {talents.map((t, i) => <li key={`${t.name}-${i}`}>{t.name}</li>)}
            </ul>
          </div>
        )}

        {trappings.length > 0 && (
          <div className="cc-sheet__block">
            <h4>Trappings</h4>
            <ul className="cc-sheet-inv">
              {trappings.map((t, i) => <li key={i}>{t.text}</li>)}
            </ul>
          </div>
        )}

        {(state.shortAmbition || state.longAmbition) && (
          <div className="cc-sheet__block">
            <h4>Ambitions</h4>
            {state.shortAmbition && <p><strong>Short-term:</strong> {state.shortAmbition}</p>}
            {state.longAmbition && <p><strong>Long-term:</strong> {state.longAmbition}</p>}
          </div>
        )}

        {(state.height || state.hair || state.eyes || state.background) && (
          <div className="cc-sheet__block">
            {(state.height || state.hair || state.eyes) && (
              <p>
                {state.height && <span><strong>Height:</strong> {state.height} </span>}
                {state.hair && <span><strong>Hair:</strong> {state.hair} </span>}
                {state.eyes && <span><strong>Eyes:</strong> {state.eyes}</span>}
              </p>
            )}
            {state.background && <p><strong>Background:</strong> {state.background}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
