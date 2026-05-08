import { rollD20 } from '../lib/initiativeLibrary.js'

export default function CombatantRow({ combatant: c, isCurrent, onChange, onRemove }) {
  const update = (patch) => onChange({ ...c, ...patch })

  return (
    <li className={`combatant${isCurrent ? ' is-current' : ''}`}>
      <div className="combatant__init">
        <input
          type="number"
          value={c.initiative}
          onChange={(e) => update({ initiative: Number(e.target.value) || 0 })}
          className="combatant__init-input"
        />
        <button
          className="icon-button"
          onClick={() => update({ initiative: rollD20() })}
          title="Roll 1d20 for initiative"
          aria-label="Roll initiative"
        >
          🎲
        </button>
      </div>
      <input
        type="text"
        value={c.name}
        onChange={(e) => update({ name: e.target.value })}
        className="combatant__name"
        placeholder="Name"
      />
      <div className="combatant__hp">
        <input
          type="number"
          value={c.hp ?? ''}
          onChange={(e) =>
            update({ hp: e.target.value === '' ? null : Number(e.target.value) })
          }
          placeholder="HP"
          className="combatant__hp-input"
        />
        <span className="combatant__hp-sep">/</span>
        <input
          type="number"
          value={c.maxHp ?? ''}
          onChange={(e) =>
            update({ maxHp: e.target.value === '' ? null : Number(e.target.value) })
          }
          placeholder="Max"
          className="combatant__hp-input"
        />
      </div>
      <input
        type="text"
        value={c.notes}
        onChange={(e) => update({ notes: e.target.value })}
        className="combatant__notes"
        placeholder="Notes (status, conditions…)"
      />
      <button
        className="icon-button"
        onClick={() => {
          if (confirm(`Remove "${c.name}"?`)) onRemove(c.id)
        }}
        title="Remove"
        aria-label="Remove combatant"
      >
        ×
      </button>
    </li>
  )
}
