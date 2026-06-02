import { SERVICE_GROUPS, serviceGroupById, SERVICE_ROLLS, skillById, resolveTraining } from '../../lib/paranoiaData.js'

function grantLabel(grants) {
  return grants.map((g) => `+${g.ranks} ${skillById(g.skill)?.name || g.skill}`).join(', ')
}

// One resolved training roll, plus any auto-rolled sub-rolls (recursive).
function TrainingNode({ node }) {
  const hasKids = node.children && node.children.length > 0
  return (
    <div className={`cc-sg-roll ${hasKids ? 'is-special' : ''}`}>
      <span className="cc-sg-roll__die">{node.roll}</span>
      <span className="cc-sg-roll__txt">
        {node.grants ? grantLabel(node.grants) : node.text ? <em>{node.text}</em> : '—'}
        {node.grants && node.text && <em className="cc-sg-roll__note"> ({node.text})</em>}
        {hasKids && (
          <div className="cc-sg-rolls cc-sg-rolls--nested">
            {node.children.map((c, i) => <TrainingNode key={i} node={c} />)}
          </div>
        )}
      </span>
    </div>
  )
}

// Step 3 — Service Group: where the clone served before being volunteered as a
// Troubleshooter. Pick or roll, then roll five times for basic training.
// "Roll twice on X table" results auto-resolve into real rolls.
export default function ServiceGroupStep({ state, update, derived }) {
  const group = serviceGroupById(state.serviceGroupId)

  const choose = (id) => {
    if (id === state.serviceGroupId) return
    update({ serviceGroupId: id, sgRolls: [] })
  }
  const rollGroup = () => {
    const g = SERVICE_GROUPS[Math.floor(Math.random() * SERVICE_GROUPS.length)]
    update({ serviceGroupId: g.id, sgRolls: [] })
  }
  const rollTraining = () => {
    if (!group) return
    const need = SERVICE_ROLLS - state.sgRolls.length
    const next = [...state.sgRolls]
    for (let i = 0; i < need; i++) next.push(resolveTraining(group.id))
    update({ sgRolls: next })
  }
  const rerollSlot = (idx) => {
    if (!group) return
    update({ sgRolls: state.sgRolls.map((r, i) => (i === idx ? resolveTraining(group.id) : r)) })
  }
  const clearTraining = () => update({ sgRolls: [] })

  return (
    <div className="cc-step">
      <h2>Service Group</h2>
      <p className="cc-step__lede">
        Choose (or roll 1d10 for) the Service Group your clone served in before joining the
        Troubleshooters, then roll <strong>five times</strong> on its training table. Each result adds
        skill ranks; <em>“roll twice on …”</em> results are rolled out automatically.
      </p>

      <div className="cc-roll-bar">
        <button type="button" className="cc-btn cc-btn--ghost" onClick={rollGroup}>🎲 Roll Service Group (d10)</button>
      </div>

      <div className="cc-cards cc-sg-grid">
        {SERVICE_GROUPS.map((g) => (
          <button key={g.id} className={`cc-card cc-sg-card ${state.serviceGroupId === g.id ? 'is-selected' : ''}`} onClick={() => choose(g.id)}>
            <span className="cc-card__name">{g.name}</span>
          </button>
        ))}
      </div>

      {group && (
        <div className="cc-sg-train">
          <div className="cc-minihead">
            <h3>{group.name} — basic training</h3>
            <span className={`cc-count ${derived.sgComplete ? '' : 'is-over'}`}>{state.sgRolls.length} / {SERVICE_ROLLS} rolls</span>
          </div>
          {group.note && <p className="cc-note">{group.note}</p>}
          <div className="cc-roll-bar">
            <button type="button" className="cc-btn" onClick={rollTraining} disabled={state.sgRolls.length >= SERVICE_ROLLS}>🎲 Roll training (×{Math.max(0, SERVICE_ROLLS - state.sgRolls.length)})</button>
            {state.sgRolls.length > 0 && <button type="button" className="cc-btn cc-btn--ghost" onClick={clearTraining}>Clear</button>}
          </div>
          <div className="cc-sg-rolls">
            {state.sgRolls.map((node, i) => (
              <div key={i} className="cc-sg-slot">
                <TrainingNode node={node} />
                <button type="button" className="cc-spec-btn cc-sg-reroll" onClick={() => rerollSlot(i)} title="Re-roll this slot">⟳</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
