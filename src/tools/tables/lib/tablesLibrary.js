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
          { text: 'Avoids saying their own name aloud.' },
          { text: 'Constantly checks the position of the sun or moon.' },
          { text: 'Always pays in copper, even for large purchases.' },
          { text: 'Sneezes when telling a lie.' },
          { text: 'Hates being touched on the shoulder.' },
          { text: 'Counts coins three times before pocketing them.' },
          { text: 'Wears too many rings; jingles when walking.' },
          { text: 'Speaks with a foreign accent that slips when angry.' },
          { text: 'Quotes a long-dead philosopher in every conversation.' },
          { text: 'Insists doors should always be closed behind people.' },
          { text: 'Carries a notebook full of unfinished poems.' },
          { text: 'Knows the name of every dog in town.' },
          { text: 'Suspects every shadow contains an agent of an old enemy.' },
          { text: 'Smells faintly of a strong, unidentifiable spice.' },
          { text: 'Has one milk-white eye that twitches when nervous.' },
          { text: 'Begins every sentence with "Now, listen here…"' },
          { text: 'Sings under their breath while working.' },
          { text: 'Refuses to enter a building without first asking permission.' },
          { text: 'Cracks knuckles after every controversial statement.' },
          { text: 'Owes money to a dangerous person and avoids the topic.' },
          { text: 'Believes themselves the rightful heir of a forgotten title.' },
          { text: 'Names every weapon they own.' },
          { text: 'Talks to a hand-puppet they keep in their belt.' },
          { text: 'Insists on shaking hands twice before any deal.' },
          { text: 'Lost a sibling and mistakes strangers for them.' },
          { text: 'Refuses to make eye contact with anyone in armor.' },
          { text: 'Has a perfect memory for prices but forgets faces.' },
          { text: 'Fingers a holy symbol whenever startled.' },
          { text: 'Grew up at sea and finds inland weather unsettling.' },
          { text: 'Loves riddles, hates straight answers.' },
          { text: 'Once survived a wolf attack and never wears wool.' },
          { text: 'Calls everyone, regardless of age, "kid".' },
          { text: 'Carries a flask of something they never offer to share.' },
          { text: 'Eats only food they cooked themselves.' },
          { text: 'Reads the bones of animals to plan their day.' },
          { text: 'Refuses to step on shadows during the day.' },
          { text: 'Always sits with their back to a wall.' },
          { text: 'Has been thrown out of three taverns this month.' },
          { text: 'Wears a coat several sizes too large, "in case I grow into it".' },
          { text: 'Believes they are being followed by a kindly ghost.' },
          { text: 'Translates aloud what their dog or horse "is thinking".' },
          { text: 'Whispers to plants in the marketplace.' },
          { text: 'Loves bad puns and rates them out of ten.' },
          { text: 'Will not light a fire on the first night of a journey.' },
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
