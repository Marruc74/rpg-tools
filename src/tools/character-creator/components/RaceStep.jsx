import { RACES, ATTRS, POWER_TIERS, randomAlvName } from '../lib/dodData.js'

function fmtMod(n) {
  if (n > 0) return `+${n}`
  if (n < 0) return `${n}`
  return '±0'
}

export default function RaceStep({ state, update }) {
  const selRace = RACES.find((r) => r.id === state.raceId)
  const showAlvName = selRace && (selRace.source === 'alver' || selRace.id === 'alv' || selRace.id === 'halvalv')
  return (
    <div className="cc-step">
      <h2>Grunduppgifter & ras</h2>
      <p className="cc-step__lede">
        Varje rollperson börjar med ett antal <strong>bakgrundspoäng (BP)</strong> som
        fördelas på ras, grundegenskaper, socialt stånd, startkapital och särskilda
        förmågor. Välj först kraftnivå (Krigarens Handbok) och ras — rasens kostnad dras
        från dina BP och ger modifikationer på grundegenskaperna.
      </p>

      <div className="cc-tiers">
        {POWER_TIERS.map((t) => (
          <button
            key={t.id}
            className={`cc-tier ${state.tier === t.id ? 'is-selected' : ''}`}
            onClick={() => update({ tier: t.id })}
          >
            <span className="cc-tier__name">{t.namn}</span>
            <span className="cc-tier__detail">{t.bp} BP · {t.formageRolls} förmåge­slag</span>
          </button>
        ))}
      </div>

      <div className="cc-identity">
        <label>Namn
          <input value={state.namn} onChange={(e) => update({ namn: e.target.value })} placeholder="Rollpersonens namn" />
          {showAlvName && (
            <button type="button" className="cc-namebtn" onClick={() => update({ namn: randomAlvName() })} title="Slumpa ett alviskt namn (Alver s. 34)">⚲ Alviskt namn</button>
          )}
        </label>
        <label>Spelare
          <input value={state.spelare} onChange={(e) => update({ spelare: e.target.value })} placeholder="Ditt namn" />
        </label>
        <label>Kön
          <select value={state.kon} onChange={(e) => update({ kon: e.target.value })}>
            <option>Man</option>
            <option>Kvinna</option>
          </select>
        </label>
      </div>
      <p className="cc-note">Kön påverkar inte grundegenskaper, färdigheter eller liknande.</p>

      <div className="cc-cards">
        {RACES.map((r) => {
          const sel = state.raceId === r.id
          return (
            <button key={r.id} className={`cc-card ${sel ? 'is-selected' : ''}`} onClick={() => update({ raceId: r.id })}>
              <div className="cc-card__head">
                <span className="cc-card__name">
                  {r.namn}
                  {r.source === 'alver' && <span className="cc-src-badge cc-src-badge--xs" title="Alvsläkt ur Alver (Äventyrsspel)">Alver</span>}
                </span>
                <span className="cc-card__cost">{r.cost} BP</span>
              </div>
              <div className="cc-card__mods">
                {ATTRS.map((a) => (
                  <span key={a} className={`cc-card__mod ${r.mod[a] ? '' : 'is-zero'}`}>
                    {a} {fmtMod(r.mod[a])}
                  </span>
                ))}
                <span className="cc-card__mod cc-card__mod--sto">STO {r.sto.min}–{r.sto.max} ({r.sto.normal})</span>
              </div>
              {r.bonus.length > 0 && (
                <div className="cc-card__bonus">
                  {r.bonus.map((b) => (
                    <span key={b.skill}>+{b.fv} {b.skill}{b.asPrimary ? ' (primär)' : ''}</span>
                  ))}
                </div>
              )}
              <p className="cc-card__desc">{r.desc}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
