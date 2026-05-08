import { v4 as uuid } from 'uuid'

export const TABLES_KEY = 'tables:library'
export const TABLES_VERSION = 1
export const MAX_HISTORY = 30

export function newEntry(overrides = {}) {
  return {
    id: uuid(),
    text: overrides.text ?? '',
    weight: clampWeight(overrides.weight ?? 1),
  }
}

export function newTable(overrides = {}) {
  return {
    id: uuid(),
    name: overrides.name ?? 'New table',
    description: overrides.description ?? '',
    entries: overrides.entries
      ? overrides.entries.map(newEntry)
      : [newEntry({ text: '' })],
  }
}

function clampWeight(w) {
  const n = Number(w)
  if (!isFinite(n) || n < 0) return 1
  return Math.min(1000, Math.max(0, n))
}

export function emptyLibrary() {
  return {
    version: TABLES_VERSION,
    tables: [
      newTable({
        name: 'Random NPC quirk',
        description: 'Roll for a quick NPC mannerism.',
        entries: [
          { text: 'Speaks in a constant whisper.' },
          { text: 'Refers to themselves in the third person.' },
          { text: 'Always hungry; eats during conversations.' },
          { text: 'Carries a small, fidget-worthy talisman.' },
          { text: 'Suspicious of anyone in good shoes.' },
          { text: 'Has a beloved pet they mention often.' },
        ],
      }),
    ],
    activeTableId: null,
    history: [],
  }
}

export function migrateLibrary(value) {
  if (!value || typeof value !== 'object') return emptyLibrary()
  const tables = Array.isArray(value.tables)
    ? value.tables.map((t) => ({
        id: t.id ?? uuid(),
        name: typeof t.name === 'string' ? t.name : 'Table',
        description: typeof t.description === 'string' ? t.description : '',
        entries: Array.isArray(t.entries) && t.entries.length > 0
          ? t.entries.map((e) => ({
              id: e.id ?? uuid(),
              text: typeof e.text === 'string' ? e.text : '',
              weight: clampWeight(e.weight ?? 1),
            }))
          : [newEntry()],
      }))
    : []
  return {
    version: TABLES_VERSION,
    tables,
    activeTableId:
      tables.find((t) => t.id === value.activeTableId)?.id ??
      tables[0]?.id ??
      null,
    history: Array.isArray(value.history) ? value.history.slice(0, MAX_HISTORY) : [],
  }
}

export function rollTable(table) {
  // Filter out empty-text entries before rolling so blank rows aren't
  // hit as a valid result.
  const usable = table.entries.filter((e) => e.text.trim() && e.weight > 0)
  if (usable.length === 0) return null
  const total = usable.reduce((s, e) => s + e.weight, 0)
  let r = Math.random() * total
  for (const e of usable) {
    r -= e.weight
    if (r <= 0) return e
  }
  return usable[usable.length - 1]
}

export function addHistoryEntry(library, tableId, tableName, entry) {
  const item = {
    id: uuid(),
    at: Date.now(),
    tableId,
    tableName,
    text: entry.text,
  }
  return { ...library, history: [item, ...library.history].slice(0, MAX_HISTORY) }
}
