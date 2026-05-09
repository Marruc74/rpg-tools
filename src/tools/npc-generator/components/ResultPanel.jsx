import SlotRow from './SlotRow.jsx'
import { resolveSlotTable } from '../lib/npcLibrary.js'

export default function ResultPanel({
  slots,
  current,
  tablesLib,
  canRollAny,
  onRollAll,
  onRollOne,
  onSlotTableChange,
  onSave,
  onSendToCardMaker,
  sending,
}) {
  const displayName =
    current?.name?.trim() ||
    (current ? 'Unnamed NPC' : 'No NPC rolled yet')

  return (
    <div className="npc-result">
      <div className="npc-result__head">
        <div className="npc-result__name">{displayName}</div>
        <button
          type="button"
          className="npc-result__roll-all"
          onClick={onRollAll}
          disabled={!canRollAny}
          title={canRollAny ? 'Roll every slot that has a table' : 'Pick a table for at least one slot'}
        >
          Roll NPC
        </button>
      </div>

      <div className="npc-result__slots">
        {slots.map((slot) => {
          const resolvedTable = resolveSlotTable(slot, tablesLib)
          const orphaned = slot.tableId !== null && !resolvedTable
          return (
            <SlotRow
              key={slot.id}
              slot={slot}
              resolvedTable={resolvedTable}
              value={current?.[slot.id] ?? ''}
              tables={tablesLib.tables}
              orphaned={orphaned}
              onTableChange={onSlotTableChange}
              onReroll={onRollOne}
            />
          )
        })}
      </div>

      <div className="npc-result__actions">
        <button
          type="button"
          onClick={onSave}
          disabled={!current}
          title={current ? 'Save this NPC to your roster' : 'Roll an NPC first'}
        >
          Save to roster
        </button>
        <button
          type="button"
          className="primary"
          onClick={onSendToCardMaker}
          disabled={!current || sending}
          title={current ? 'Send to Card-Maker as a new NPC card' : 'Roll an NPC first'}
        >
          {sending ? 'Sending…' : 'Send to Card-Maker →'}
        </button>
      </div>
    </div>
  )
}
