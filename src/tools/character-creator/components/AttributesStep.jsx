import {
  ATTRS, ATTR_NAMES, ATTR_BUY_COST, ATTR_MIN, ATTR_MAX,
  STO_RAISE_COST, STO_LOWER_GAIN,
} from '../lib/dodData.js'
import { raceById } from '../lib/characterLibrary.js'

function fmtMod(n) { return n > 0 ? `+${n}` : n < 0 ? `${n}` : '±0' }

export default function AttributesStep({ state, update, derived }) {
  const race = raceById(state.raceId)
  const { finalAttrs, age, derived: d } = derived

  if (!race) {
    return <div className="cc-step"><h2>Grundegenskaper</h2><p className="cc-note">Välj ras först.</p></div>
  }

  const setBase = (attr, value) => {
    const v = Math.max(ATTR_MIN, Math.min(ATTR_MAX, value))
    update({ base: { ...state.base, [attr]: v } })
  }

  const stoLo = Math.max(race.sto.min - race.sto.normal, -5)
  const stoHi = Math.min(race.sto.max - race.sto.normal, 5)
  const stoCost = state.stoMod > 0 ? STO_RAISE_COST[state.stoMod] : state.stoMod < 0 ? -STO_LOWER_GAIN[-state.stoMod] : 0

  return (
    <div className="cc-step">
      <h2>Grundegenskaper</h2>
      <p className="cc-step__lede">
        Köp ett råvärde (3–18) i varje grundegenskap. Priset i BP står i tabellen.
        Rasens och ålderns modifikationer läggs på efteråt — det <em>slutliga</em> värdet
        är det som räknas mot yrkets krav.
      </p>

      <table className="cc-attrs">
        <thead>
          <tr><th>Egenskap</th><th>Köpt värde</th><th>BP</th><th>Ras</th><th>Ålder</th><th>Slutligt</th></tr>
        </thead>
        <tbody>
          {ATTRS.map((a) => {
            const base = state.base[a]
            const cost = ATTR_BUY_COST[base] ?? 0
            return (
              <tr key={a}>
                <th>{ATTR_NAMES[a]} <span className="cc-attrs__code">{a}</span></th>
                <td>
                  <div className="cc-stepper">
                    <button onClick={() => setBase(a, base - 1)} disabled={base <= ATTR_MIN}>−</button>
                    <span>{base}</span>
                    <button onClick={() => setBase(a, base + 1)} disabled={base >= ATTR_MAX}>+</button>
                  </div>
                </td>
                <td className="cc-attrs__bp">{cost}</td>
                <td className={race.mod[a] ? '' : 'is-zero'}>{fmtMod(race.mod[a])}</td>
                <td className={age.mod[a] ? '' : 'is-zero'}>{fmtMod(age.mod[a])}</td>
                <td className="cc-attrs__final">{finalAttrs[a]}</td>
              </tr>
            )
          })}
          <tr className="cc-attrs__sto">
            <th>{ATTR_NAMES.STO} <span className="cc-attrs__code">STO</span></th>
            <td colSpan={3}>
              <div className="cc-stepper">
                <button onClick={() => update({ stoMod: Math.max(stoLo, state.stoMod - 1) })} disabled={state.stoMod <= stoLo}>−</button>
                <span>{finalAttrs.STO}</span>
                <button onClick={() => update({ stoMod: Math.min(stoHi, state.stoMod + 1) })} disabled={state.stoMod >= stoHi}>+</button>
              </div>
              <span className="cc-sto-note">
                Normal {race.sto.normal} ({race.sto.min}–{race.sto.max}) · {fmtMod(state.stoMod)} ⇒ {stoCost === 0 ? '0 BP' : stoCost > 0 ? `${stoCost} BP` : `+${-stoCost} BP tillbaka`}
              </span>
            </td>
            <td className="is-zero">—</td>
            <td className="cc-attrs__final">{finalAttrs.STO}</td>
          </tr>
        </tbody>
      </table>

      <div className="cc-derived">
        <div className="cc-derived__item"><span className="cc-derived__lbl">Kroppspoäng</span><span className="cc-derived__val">{d.totalKP}</span><span className="cc-derived__sub">(FYS+STO)/2</span></div>
        <div className="cc-derived__item"><span className="cc-derived__lbl">Skadebonus</span><span className="cc-derived__val">{d.skadebonus}</span><span className="cc-derived__sub">STY+STO = {finalAttrs.STY + finalAttrs.STO}</span></div>
        <div className="cc-derived__item"><span className="cc-derived__lbl">Förflyttning</span><span className="cc-derived__val">{d.forflyttning}</span><span className="cc-derived__sub">STO+FYS+SMI = {finalAttrs.STO + finalAttrs.FYS + finalAttrs.SMI}</span></div>
      </div>

      {derived.kravFail.length > 0 && (
        <p className="cc-warn">
          Yrkets krav ej uppfyllda: {derived.kravFail.map((k) => `${k.attr} ${k.has} (krav ${k.min})`).join(', ')}.
        </p>
      )}
      {derived.bpRemaining < 0 && <p className="cc-warn">Du har spenderat {-derived.bpRemaining} BP för mycket.</p>}
    </div>
  )
}
