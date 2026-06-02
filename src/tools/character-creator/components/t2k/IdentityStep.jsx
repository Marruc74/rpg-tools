import { ARCHETYPES, NATIONALITIES, SKILLS, rollRank, rankOptions } from '../../lib/t2kData.js'

const skillName = (id) => SKILLS.find((s) => s.id === id)?.name || id

// Step 1 — choose your archetype (the spine of the archetype method) plus
// nationality, branch, rank, and name.
export default function IdentityStep({ state, update, derived }) {
  const arch = derived.archetype

  const chooseArch = (a) => {
    if (a.id === state.archetypeId) return
    update({ archetypeId: a.id, branch: a.branches[0] || '', rank: '' })
  }
  const rollForRank = () => arch?.rank && update({ rank: rollRank(arch.rank) })

  return (
    <div className="cc-step">
      <h2>Survivor &amp; archetype</h2>
      <p className="cc-step__lede">
        Pick an archetype — a typical Twilight: 2000 character type that gets you into the action fast.
        It sets your key attribute, the skill your <strong>B-level</strong> skill is chosen from, your
        starting Coolness Under Fire, and your gear. Then choose nationality, branch (flavor only), and
        rank.
      </p>

      <div className="cc-cards cc-t2k-arch-grid">
        {ARCHETYPES.map((a) => (
          <button key={a.id} className={`cc-card cc-t2k-arch ${state.archetypeId === a.id ? 'is-selected' : ''}`} onClick={() => chooseArch(a)}>
            <div className="cc-card__head">
              <span className="cc-card__name">{a.name}</span>
              <span className="cc-card__cost">CUF {a.cuf}</span>
            </div>
            <div className="cc-card__mods">
              <span className="cc-card__mod">Key: {a.keyAttr}</span>
              {a.keySkills.map((s) => <span key={s} className="cc-card__mod">{skillName(s)}</span>)}
            </div>
            <p className="cc-card__desc">{a.blurb}</p>
          </button>
        ))}
      </div>

      {arch && (
        <div className="cc-identity cc-t2k-identity">
          <label>Nationality
            <select value={state.nationality} onChange={(e) => update({ nationality: e.target.value })}>
              {NATIONALITIES.map((n) => <option key={n.id} value={n.id}>{n.name} ({n.language})</option>)}
            </select>
          </label>
          <label>Branch
            {arch.branches.length ? (
              <select value={state.branch} onChange={(e) => update({ branch: e.target.value })}>
                {arch.branches.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            ) : <input value="None" disabled />}
          </label>
          <label>Rank
            {arch.rank ? (
              <span className="cc-t2k-rank">
                <select value={state.rank} onChange={(e) => update({ rank: e.target.value })}>
                  <option value="">— choose —</option>
                  {rankOptions(arch.rank).map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <button type="button" className="cc-btn cc-btn--ghost" onClick={rollForRank}>🎲 D6</button>
              </span>
            ) : <input value="None" disabled />}
          </label>
          <label>Name
            <input value={state.name} onChange={(e) => update({ name: e.target.value })} placeholder="Character name" />
          </label>
          <label>Nickname
            <input value={state.nickname} onChange={(e) => update({ nickname: e.target.value })} placeholder={arch.nicknames.join(', ')} list="t2k-nicks" />
            <datalist id="t2k-nicks">{arch.nicknames.map((n) => <option key={n} value={n} />)}</datalist>
          </label>
        </div>
      )}
    </div>
  )
}
