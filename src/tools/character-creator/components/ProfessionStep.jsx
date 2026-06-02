import { PROFESSIONS } from '../lib/dodData.js'

const ATTR_NAMES = { STY: 'STY', FYS: 'FYS', SMI: 'SMI', INT: 'INT', PSY: 'PSY', KAR: 'KAR' }

export default function ProfessionStep({ state, update, derived }) {
  const finalAttrs = derived.finalAttrs
  return (
    <div className="cc-step">
      <h2>Yrke</h2>
      <p className="cc-step__lede">
        Yrket avgör vilka <strong>yrkesfärdigheter</strong> du kan välja och ger en
        särskild yrkesförmåga. Varje yrke har grundegenskapskrav (krav) som dina
        rasmodifierade värden måste uppfylla. Magiker väljer 9 yrkesfärdigheter, övriga 12.
      </p>

      <div className="cc-cards">
        {PROFESSIONS.map((p) => {
          const sel = state.yrkeId === p.id
          const krav = Object.entries(p.krav)
          const fails = state.raceId
            ? krav.filter(([a, min]) => finalAttrs[a] < min)
            : []
          return (
            <button
              key={p.id}
              className={`cc-card ${sel ? 'is-selected' : ''} ${state.raceId && fails.length ? 'is-warn' : ''}`}
              onClick={() => update({ yrkeId: p.id })}
            >
              <div className="cc-card__head">
                <span className="cc-card__name">{p.namn}{p.source && <span className="cc-src-badge">{p.source === 'kh' ? 'KH' : p.source === 'tl' ? 'TL' : p.source === 'alver' ? 'Alver' : p.source.toUpperCase()}</span>}</span>
                <span className="cc-card__cost">{p.yrkesCount} färd.</span>
              </div>
              <div className="cc-card__krav">
                {krav.length === 0 ? <span className="is-zero">Inga krav</span> : krav.map(([a, min]) => {
                  const ok = !state.raceId || finalAttrs[a] >= min
                  return (
                    <span key={a} className={`cc-krav-chip ${ok ? 'is-ok' : 'is-fail'}`}>
                      {ATTR_NAMES[a]} {min}{state.raceId ? ` (${finalAttrs[a]})` : ''}
                    </span>
                  )
                })}
              </div>
              {p.magic && <div className="cc-card__bonus"><span>Kan lära besvärjelser</span></div>}
              <p className="cc-card__desc">{p.formaga}</p>
            </button>
          )
        })}
      </div>
      {!state.raceId && <p className="cc-note">Välj ras först för att se om kraven uppfylls.</p>}
    </div>
  )
}
