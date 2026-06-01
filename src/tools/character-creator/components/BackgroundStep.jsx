import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import {
  AGE_CATEGORIES, AGE_BY_RACE, rollDice, lookupFormaga, svardshand, synHorsel,
} from '../lib/dodData.js'
import { raceById } from '../lib/characterLibrary.js'

function RollLine({ label, hint, roll, bp, onBp, onRoll, result, die = '2T6' }) {
  return (
    <div className="cc-roll">
      <div className="cc-roll__head">
        <span className="cc-roll__label">{label}</span>
        {hint && <span className="cc-roll__hint">{hint}</span>}
      </div>
      <div className="cc-roll__controls">
        <label className="cc-roll__bp">
          BP att spendera
          <div className="cc-stepper cc-stepper--sm">
            <button onClick={() => onBp(Math.max(0, bp - 1))} disabled={bp <= 0}>−</button>
            <span>{bp}</span>
            <button onClick={() => onBp(bp + 1)}>+</button>
          </div>
        </label>
        <button className="cc-btn cc-btn--sm" onClick={onRoll}>{roll ? 'Slå om' : `Slå ${die}`}</button>
        {roll && <span className="cc-roll__dice">{die} = {roll.total}{bp ? ` + ${bp} BP` : ''}</span>}
      </div>
      {result && <div className="cc-roll__result">{result}</div>}
    </div>
  )
}

export default function BackgroundStep({ state, update, derived }) {
  const race = raceById(state.raceId)
  const { social, socialTotal, baseKapital, slutKapital, age } = derived

  const rollSocial = () => update({ socialRoll: { total: rollDice(2, 6) } })
  const rollKapital = () => update({ kapitalRoll: { total: rollDice(2, 6) } })
  const rollSvard = () => update({ svardshandRoll: { total: rollDice(2, 6) } })
  const rollSyn = () => update({ synRoll: { total: rollDice(1, 6) } })
  const rollHorsel = () => update({ horselRoll: { total: rollDice(1, 6) } })

  const synTotal = state.synRoll ? state.synRoll.total + state.synBP : null
  const synRes = synTotal != null ? synHorsel(synTotal) : null
  const horselTotal = state.horselRoll ? state.horselRoll.total + state.horselBP : null
  const horselRes = horselTotal != null ? synHorsel(horselTotal) : null
  const fmtBonus = (n) => (n >= 0 ? `+${n}` : `${n}`)
  const formageMax = derived.tier.formageRolls
  const formageFull = state.formagor.length >= formageMax

  const rollFormaga = (bp) => {
    const dice = rollDice(2, 20)
    const total = dice + bp
    update({
      formagor: [...state.formagor, { id: uuid(), bp, dice, total, text: lookupFormaga(total) }],
    })
  }

  const svardTotal = state.svardshandRoll ? state.svardshandRoll.total + state.svardshandBP : null

  return (
    <div className="cc-step">
      <h2>Bakgrund</h2>

      {/* Ålder */}
      <section className="cc-bg-sec">
        <h3>Ålder</h3>
        <div className="cc-age-grid">
          {AGE_CATEGORIES.map((a) => {
            const sel = state.alderId === a.id
            const years = race ? AGE_BY_RACE[race.id]?.[a.id] : null
            return (
              <button key={a.id} className={`cc-card cc-card--sm ${sel ? 'is-selected' : ''}`} onClick={() => update({ alderId: a.id })}>
                <div className="cc-card__head"><span className="cc-card__name">{a.namn}</span>{years && <span className="cc-card__cost">{years} år</span>}</div>
                <div className="cc-card__bonus">
                  <span>{a.ep} EP</span><span>Kapital ×{a.kapMult}</span><span>Max FV {a.maxFV}</span>
                </div>
              </button>
            )
          })}
        </div>
        <p className="cc-note">Äldre rollpersoner får mer EP, mer kapital och högre max-FV, men förlorar fysiska egenskaper.</p>
      </section>

      {/* Socialt stånd */}
      <section className="cc-bg-sec">
        <h3>Socialt stånd</h3>
        <RollLine
          label="2T6 + BP + rasmodifikation"
          hint={race ? `Rasmod: ${race.social >= 0 ? '+' : ''}${race.social}` : ''}
          roll={state.socialRoll}
          bp={state.socialBP}
          onBp={(v) => update({ socialBP: v })}
          onRoll={rollSocial}
          result={social ? `${social.namn} (summa ${socialTotal}) — ${social.exempel}` : null}
        />
      </section>

      {/* Startkapital */}
      <section className="cc-bg-sec">
        <h3>Startkapital</h3>
        <RollLine
          label="2T6 + BP + halva socialt-stånd-BP"
          hint={`Åldersmultiplikator ×${age.kapMult}`}
          roll={state.kapitalRoll}
          bp={state.kapitalBP}
          onBp={(v) => update({ kapitalBP: v })}
          onRoll={rollKapital}
          result={baseKapital != null ? `${baseKapital.toLocaleString('sv-SE')} sm × ${age.kapMult} = ${slutKapital.toLocaleString('sv-SE')} sm` : null}
        />
      </section>

      {/* Svärdshand */}
      <section className="cc-bg-sec">
        <h3>Svärdshand</h3>
        <RollLine
          label="2T6 + BP"
          roll={state.svardshandRoll}
          bp={state.svardshandBP}
          onBp={(v) => update({ svardshandBP: v })}
          onRoll={rollSvard}
          result={svardTotal != null ? `${svardshand(svardTotal)} (summa ${svardTotal})` : null}
        />
      </section>

      {/* Syn & Hörsel */}
      <section className="cc-bg-sec">
        <h3>Syn & Hörsel <span className="cc-src-badge">KH</span></h3>
        <p className="cc-note">Slå 1T6 + valfria BP. Syn påverkar Upptäcka fara och Finna dolda ting; hörsel påverkar Upptäcka fara.</p>
        <RollLine
          label="Syn (1T6 + BP)" die="1T6"
          roll={state.synRoll} bp={state.synBP}
          onBp={(v) => update({ synBP: v })} onRoll={rollSyn}
          result={synRes ? `${synRes.namn} (summa ${synTotal}) — ${fmtBonus(synRes.bonus)} på Upptäcka fara & Finna dolda ting` : null}
        />
        <div style={{ height: 8 }} />
        <RollLine
          label="Hörsel (1T6 + BP)" die="1T6"
          roll={state.horselRoll} bp={state.horselBP}
          onBp={(v) => update({ horselBP: v })} onRoll={rollHorsel}
          result={horselRes ? `${horselRes.namn} (summa ${horselTotal}) — ${fmtBonus(horselRes.bonus)} på Upptäcka fara` : null}
        />
      </section>

      {/* Särskilda förmågor */}
      <section className="cc-bg-sec">
        <h3>Särskilda förmågor <span className="cc-count">{state.formagor.length} / {formageMax} slag</span></h3>
        <p className="cc-note">Slå 2T20 och lägg till de BP du vill spendera. Din kraftnivå ger {formageMax} slag. Högre resultat ger bättre förmågor.</p>
        <FormagaRoller onRoll={rollFormaga} disabled={formageFull} />
        <ul className="cc-formaga-list">
          {state.formagor.map((f) => (
            <li key={f.id}>
              <span className="cc-formaga__roll">{f.total}</span>
              <span className="cc-formaga__text">{f.text}</span>
              <button className="cc-x" onClick={() => update({ formagor: state.formagor.filter((x) => x.id !== f.id) })}>×</button>
            </li>
          ))}
        </ul>
      </section>

      {/* Utseende & bakgrund */}
      <section className="cc-bg-sec">
        <h3>Utseende & personlig bakgrund</h3>
        <textarea className="cc-textarea" rows={3} placeholder="Utseende — längd, hår, kännetecken…" value={state.utseende} onChange={(e) => update({ utseende: e.target.value })} />
        <textarea className="cc-textarea" rows={4} placeholder="Bakgrund — varifrån kommer du, varför är du äventyrare…" value={state.bakgrund} onChange={(e) => update({ bakgrund: e.target.value })} />
      </section>
    </div>
  )
}

function FormagaRoller({ onRoll, disabled }) {
  const [bp, setBp] = useState(0)
  return (
    <div className="cc-roll__controls">
      <label className="cc-roll__bp">
        BP att spendera
        <div className="cc-stepper cc-stepper--sm">
          <button onClick={() => setBp(Math.max(0, bp - 1))} disabled={bp <= 0}>−</button>
          <span>{bp}</span>
          <button onClick={() => setBp(bp + 1)}>+</button>
        </div>
      </label>
      <button className="cc-btn cc-btn--sm" onClick={() => onRoll(bp)} disabled={disabled}>Slå 2T20 + BP</button>
      {disabled && <span className="cc-roll__hint">Inga slag kvar för din kraftnivå</span>}
    </div>
  )
}
