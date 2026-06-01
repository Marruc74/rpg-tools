import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { ALL_ATTRS, ATTR_NAMES, KP_LOCATIONS, svardshand } from '../lib/dodData.js'

export default function SheetView({ state, derived }) {
  const ref = useRef(null)
  const [busy, setBusy] = useState(false)
  const { race, prof, age, tier, finalAttrs, derived: d, social, slutKapital, skills, silverKvar, synBonus, horselBonus } = derived
  const inventory = state.inventory || []

  const exportPng = async () => {
    if (!ref.current || busy) return
    setBusy(true)
    try {
      const url = await toPng(ref.current, { pixelRatio: 2, backgroundColor: '#fdfaf2' })
      const a = document.createElement('a')
      a.href = url
      a.download = `${(state.namn || 'rollperson').replace(/[^\w\-åäöÅÄÖ ]/g, '').trim() || 'rollperson'}.png`
      a.click()
    } catch (err) {
      alert('Kunde inte exportera bilden: ' + (err?.message || err))
    } finally {
      setBusy(false)
    }
  }

  const primarySkills = skills.filter((s) => s.typ.startsWith('Primär'))
  const yrkesSkills = skills.filter((s) => s.typ === 'Yrkesfärdighet')
  const issues = []
  if (!race) issues.push('Ingen ras vald')
  if (!prof) issues.push('Inget yrke valt')
  if (derived.bpRemaining < 0) issues.push(`${-derived.bpRemaining} BP för mycket spenderade`)
  if (derived.epRemaining < 0) issues.push(`${-derived.epRemaining} EP för mycket spenderade`)
  if (derived.kravFail.length) issues.push('Yrkets grundegenskapskrav ej uppfyllda')
  if (derived.yrkesChosen > derived.yrkesLimit) issues.push('För många yrkesfärdigheter')
  if (derived.overFV.length) issues.push(`FV över max (${derived.maxFV}) på ${derived.overFV.length} färdighet(er)`)

  return (
    <div className="cc-step">
      <div className="cc-sheet-bar">
        <h2>Rollformulär</h2>
        <div>
          {issues.length === 0
            ? <span className="cc-ok-badge">Klar rollperson ✓</span>
            : <span className="cc-warn-badge">{issues.length} att åtgärda</span>}
          <button className="cc-btn" onClick={exportPng} disabled={busy}>{busy ? 'Exporterar…' : 'Exportera PNG'}</button>
        </div>
      </div>
      {issues.length > 0 && <ul className="cc-issues">{issues.map((i) => <li key={i}>{i}</li>)}</ul>}

      <div className="cc-sheet" ref={ref}>
        <div className="cc-sheet__title">
          <div>
            <h3>{state.namn || 'Namnlös rollperson'}</h3>
            <p>{race ? race.namn : '—'} · {prof ? prof.namn : '—'} · {state.kon} · {age.namn}{state.alderAr ? ` (${state.alderAr} år)` : ''} · {tier.namn}</p>
          </div>
          <div className="cc-sheet__game">Drakar och Demoner</div>
        </div>

        <div className="cc-sheet__cols">
          <div className="cc-sheet__col">
            <table className="cc-sheet-tbl">
              <caption>Grundegenskaper</caption>
              <tbody>
                {ALL_ATTRS.map((a) => (
                  <tr key={a}><th>{ATTR_NAMES[a]} <em>{a}</em></th><td>{finalAttrs[a]}</td></tr>
                ))}
              </tbody>
            </table>

            <table className="cc-sheet-tbl">
              <caption>Härledda värden</caption>
              <tbody>
                <tr><th>Kroppspoäng (KP)</th><td>{d.totalKP}</td></tr>
                <tr><th>Skadebonus</th><td>{d.skadebonus}</td></tr>
                <tr><th>Förflyttning</th><td>{d.forflyttning}</td></tr>
              </tbody>
            </table>

            {d.body && (
              <table className="cc-sheet-tbl">
                <caption>KP per träffområde</caption>
                <tbody>
                  {KP_LOCATIONS.map((loc) => (
                    <tr key={loc}><th>{loc}</th><td>{d.body[loc]}</td></tr>
                  ))}
                </tbody>
              </table>
            )}

            <table className="cc-sheet-tbl">
              <caption>Bakgrund</caption>
              <tbody>
                <tr><th>Socialt stånd</th><td>{social ? social.namn : '—'}</td></tr>
                <tr><th>Startkapital</th><td>{slutKapital != null ? `${slutKapital.toLocaleString('sv-SE')} sm` : '—'}</td></tr>
                {silverKvar != null && <tr><th>Pengar kvar</th><td>{silverKvar.toLocaleString('sv-SE')} sm</td></tr>}
                <tr><th>Svärdshand</th><td>{state.svardshandRoll ? svardshand(state.svardshandRoll.total + state.svardshandBP) : '—'}</td></tr>
                {state.synRoll && <tr><th>Syn</th><td>{synBonus >= 0 ? `+${synBonus}` : synBonus}</td></tr>}
                {state.horselRoll && <tr><th>Hörsel</th><td>{horselBonus >= 0 ? `+${horselBonus}` : horselBonus}</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="cc-sheet__col cc-sheet__col--wide">
            <table className="cc-sheet-tbl cc-sheet-tbl--skills">
              <caption>Primära färdigheter</caption>
              <tbody>
                {primarySkills.map((s) => (
                  <tr key={s.key}><th>{s.namn}</th><td className="cc-fvcell">{s.fv}</td></tr>
                ))}
              </tbody>
            </table>

            {yrkesSkills.length > 0 && (
              <table className="cc-sheet-tbl cc-sheet-tbl--skills">
                <caption>Yrkesfärdigheter</caption>
                <tbody>
                  {yrkesSkills.map((s) => (
                    <tr key={s.key}><th>{s.namn}</th><td className="cc-fvcell">{s.fv}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {prof && (
          <div className="cc-sheet__block">
            <h4>Yrkesförmåga — {prof.namn}</h4>
            <p>{prof.formaga}</p>
          </div>
        )}
        {state.formagor.length > 0 && (
          <div className="cc-sheet__block">
            <h4>Särskilda förmågor</h4>
            <ul>{state.formagor.map((f) => <li key={f.id}>{f.text}</li>)}</ul>
          </div>
        )}
        {inventory.length > 0 && (
          <div className="cc-sheet__block">
            <h4>Utrustning</h4>
            <ul className="cc-sheet-inv">
              {inventory.map((it) => (
                <li key={it.id}>
                  {it.qty > 1 ? `${it.qty}× ` : ''}{it.namn}{it.stat ? ` (${it.stat})` : ''}
                </li>
              ))}
            </ul>
          </div>
        )}
        {(state.utseende || state.bakgrund) && (
          <div className="cc-sheet__block">
            {state.utseende && <p><strong>Utseende:</strong> {state.utseende}</p>}
            {state.bakgrund && <p><strong>Bakgrund:</strong> {state.bakgrund}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
