import { v4 as uuid } from 'uuid'

export const DICE_KEY = 'dice:library'
export const DICE_VERSION = 1
export const MAX_HISTORY = 50

const DEFAULT_PRESETS = [
  { id: uuid(), name: 'Attack',     expression: '1d20+5' },
  { id: uuid(), name: 'Damage',     expression: '1d8+3' },
  { id: uuid(), name: 'Advantage',  expression: '2d20kh1' },
  { id: uuid(), name: 'Disadvantage', expression: '2d20kl1' },
  { id: uuid(), name: 'Stat (4d6 drop low)', expression: '4d6dl1' },
]

export function emptyLibrary() {
  return {
    version: DICE_VERSION,
    presets: DEFAULT_PRESETS,
    history: [],
  }
}

export function migrateLibrary(value) {
  if (!value || typeof value !== 'object') return emptyLibrary()
  return {
    version: DICE_VERSION,
    presets: Array.isArray(value.presets)
      ? value.presets.map((p) => ({
          id: p.id ?? uuid(),
          name: typeof p.name === 'string' ? p.name : 'Roll',
          expression: typeof p.expression === 'string' ? p.expression : '1d20',
        }))
      : DEFAULT_PRESETS,
    history: Array.isArray(value.history) ? value.history.slice(0, MAX_HISTORY) : [],
  }
}

export function newPreset(overrides = {}) {
  return {
    id: uuid(),
    name: overrides.name ?? 'New roll',
    expression: overrides.expression ?? '1d20',
  }
}

export function addHistoryEntry(library, entry) {
  const next = [{ ...entry, id: uuid(), at: Date.now() }, ...library.history]
  return { ...library, history: next.slice(0, MAX_HISTORY) }
}
