import { v4 as uuid } from 'uuid'
import { rollTable } from '../../tables/lib/tablesLibrary.js'

export const NPC_KEY = 'npcGenerator:state'
export const NPC_VERSION = 1
export const MAX_HISTORY = 30

// Fixed v1 slot set. Order is canonical and matters for rendering;
// migrateState rebuilds slots in this exact order.
export const DEFAULT_SLOTS = [
  { id: 'name',       label: 'Name',       fallbackTableName: 'NPC name (fantasy)' },
  { id: 'profession', label: 'Profession', fallbackTableName: 'NPC profession' },
  { id: 'appearance', label: 'Appearance', fallbackTableName: 'NPC appearance' },
  { id: 'quirk',      label: 'Quirk',      fallbackTableName: 'Random NPC quirk' },
]

export const SLOT_IDS = DEFAULT_SLOTS.map((s) => s.id)

export function emptyState() {
  return {
    version: NPC_VERSION,
    slots: DEFAULT_SLOTS.map((s) => ({ ...s, tableId: null })),
    current: null,
    roster: [],
    history: [],
  }
}

function emptyFields() {
  return Object.fromEntries(SLOT_IDS.map((id) => [id, '']))
}

function normalizeFields(fields) {
  const out = emptyFields()
  if (fields && typeof fields === 'object') {
    for (const id of SLOT_IDS) {
      if (typeof fields[id] === 'string') out[id] = fields[id]
    }
  }
  return out
}

export function migrateState(value) {
  if (!value || typeof value !== 'object') return emptyState()

  const incomingSlots = Array.isArray(value.slots) ? value.slots : []
  const slots = DEFAULT_SLOTS.map((def) => {
    const found = incomingSlots.find((s) => s && s.id === def.id)
    return {
      id: def.id,
      label: def.label,
      fallbackTableName:
        typeof found?.fallbackTableName === 'string' && found.fallbackTableName
          ? found.fallbackTableName
          : def.fallbackTableName,
      tableId: typeof found?.tableId === 'string' ? found.tableId : null,
    }
  })

  const current = value.current && typeof value.current === 'object'
    ? normalizeFields(value.current)
    : null

  const roster = Array.isArray(value.roster)
    ? value.roster
        .filter((r) => r && typeof r === 'object')
        .map((r) => ({
          id: typeof r.id === 'string' ? r.id : uuid(),
          name: typeof r.name === 'string' ? r.name : 'Unnamed NPC',
          fields: normalizeFields(r.fields),
          createdAt: typeof r.createdAt === 'number' ? r.createdAt : Date.now(),
        }))
    : []

  const history = Array.isArray(value.history)
    ? value.history
        .filter((h) => h && typeof h === 'object')
        .slice(0, MAX_HISTORY)
        .map((h) => ({
          id: typeof h.id === 'string' ? h.id : uuid(),
          at: typeof h.at === 'number' ? h.at : Date.now(),
          fields: normalizeFields(h.fields),
        }))
    : []

  return { version: NPC_VERSION, slots, current, roster, history }
}

// Resolves a slot to a live table from the Tables library.
// 1. Match by tableId
// 2. Fallback by case-insensitive fallbackTableName match
// Returns the table object or null.
export function resolveSlotTable(slot, tablesLib) {
  if (!slot || !tablesLib || !Array.isArray(tablesLib.tables)) return null
  if (slot.tableId) {
    const byId = tablesLib.tables.find((t) => t.id === slot.tableId)
    if (byId) return byId
  }
  if (slot.fallbackTableName) {
    const target = slot.fallbackTableName.trim().toLowerCase()
    const byName = tablesLib.tables.find(
      (t) => t.name.trim().toLowerCase() === target,
    )
    if (byName) return byName
  }
  return null
}

// Reconciles slot.tableId values against the live tables library by name
// fallback. Returns the same slots array (referential equality) if nothing
// changed, or a new array with updated tableId values otherwise.
export function reconcileSlots(slots, tablesLib) {
  let changed = false
  const next = slots.map((slot) => {
    const matched = resolveSlotTable(slot, tablesLib)
    const newId = matched?.id ?? null
    if (newId !== slot.tableId) {
      changed = true
      return { ...slot, tableId: newId }
    }
    return slot
  })
  return changed ? next : slots
}

// Roll every slot that has a resolved table. Slots without a resolved
// table keep their previous value (or '' if none). Returns a fields object.
export function rollAll(slots, tablesLib, prevFields) {
  const base = normalizeFields(prevFields)
  const next = { ...base }
  for (const slot of slots) {
    const table = resolveSlotTable(slot, tablesLib)
    if (!table) continue
    const result = rollTable(table)
    if (result) next[slot.id] = result.text
  }
  return next
}

// Roll a single slot. If prevFields is null, returns a fresh fields object
// with only the rolled slot populated. If the slot has no resolved table,
// returns prevFields unchanged (or a fresh empty fields if prev was null).
export function rollOne(slots, tablesLib, slotId, prevFields) {
  const base = normalizeFields(prevFields)
  const slot = slots.find((s) => s.id === slotId)
  if (!slot) return base
  const table = resolveSlotTable(slot, tablesLib)
  if (!table) return base
  const result = rollTable(table)
  if (!result) return base
  return { ...base, [slot.id]: result.text }
}

export function addToHistory(state, fields) {
  const item = { id: uuid(), at: Date.now(), fields: normalizeFields(fields) }
  return { ...state, history: [item, ...state.history].slice(0, MAX_HISTORY) }
}

export function addToRoster(state, name, fields) {
  const item = {
    id: uuid(),
    name: name && name.trim() ? name.trim() : 'Unnamed NPC',
    fields: normalizeFields(fields),
    createdAt: Date.now(),
  }
  return { ...state, roster: [item, ...state.roster] }
}

export function removeFromRoster(state, id) {
  return { ...state, roster: state.roster.filter((r) => r.id !== id) }
}

export function renameRosterItem(state, id, name) {
  const cleaned = name && name.trim() ? name.trim() : 'Unnamed NPC'
  return {
    ...state,
    roster: state.roster.map((r) =>
      r.id === id ? { ...r, name: cleaned } : r,
    ),
  }
}

export function clearHistory(state) {
  return { ...state, history: [] }
}

// Multi-line body used when sending an NPC to Card-Maker. Kept here so it
// stays unit-testable and reusable.
export function composeCardBody(fields) {
  const f = normalizeFields(fields)
  const lines = []
  if (f.profession) lines.push(`**Profession:** ${f.profession}`)
  if (f.appearance) lines.push(`**Appearance:** ${f.appearance}`)
  if (f.quirk) lines.push(`**Quirk:** ${f.quirk}`)
  return lines.join('\n\n')
}
