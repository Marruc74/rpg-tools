export default function SlotRow({
  slot,
  resolvedTable,
  value,
  tables,
  orphaned,
  onTableChange,
  onReroll,
}) {
  const canRoll = !!resolvedTable
  return (
    <div className="npc-slot">
      <div className="npc-slot__label">{slot.label}</div>
      <select
        className="npc-slot__table-select"
        value={resolvedTable?.id ?? ''}
        onChange={(e) => onTableChange(slot.id, e.target.value || null)}
      >
        <option value="">— No table —</option>
        {tables.map((t) => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>
      <div
        className={
          'npc-slot__value' + (value ? '' : ' npc-slot__value--empty')
        }
      >
        {value || (canRoll ? 'Click Roll NPC to fill this slot.' : 'Pick a table to roll.')}
      </div>
      <button
        type="button"
        className="npc-slot__reroll icon-button"
        onClick={() => onReroll(slot.id)}
        disabled={!canRoll}
        title={canRoll ? 'Re-roll this slot' : 'Pick a table first'}
        aria-label={`Re-roll ${slot.label}`}
      >
        ↻
      </button>
      {orphaned && (
        <div className="npc-slot__missing">
          Saved table not found — pick a replacement from the list.
        </div>
      )}
    </div>
  )
}
