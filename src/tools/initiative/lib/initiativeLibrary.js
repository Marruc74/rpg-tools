import { v4 as uuid } from 'uuid'

export const INIT_KEY = 'initiative:state'
export const INIT_VERSION = 1

export function newCombatant(overrides = {}) {
  return {
    id: uuid(),
    name: overrides.name ?? 'Combatant',
    initiative: Number(overrides.initiative ?? 0),
    hp: overrides.hp ?? null,
    maxHp: overrides.maxHp ?? null,
    notes: overrides.notes ?? '',
  }
}

export function emptyState() {
  return {
    version: INIT_VERSION,
    combatants: [],
    round: 1,
    currentId: null,
  }
}

export function migrateState(value) {
  if (!value || typeof value !== 'object') return emptyState()
  return {
    version: INIT_VERSION,
    combatants: Array.isArray(value.combatants)
      ? value.combatants.map((c) => ({
          id: c.id ?? uuid(),
          name: typeof c.name === 'string' ? c.name : 'Combatant',
          initiative: Number(c.initiative) || 0,
          hp: c.hp == null ? null : Number(c.hp),
          maxHp: c.maxHp == null ? null : Number(c.maxHp),
          notes: typeof c.notes === 'string' ? c.notes : '',
        }))
      : [],
    round: Number(value.round) || 1,
    currentId: typeof value.currentId === 'string' ? value.currentId : null,
  }
}

// Returns combatants sorted by initiative desc; ties broken by name.
export function sortByInitiative(combatants) {
  return [...combatants].sort(
    (a, b) =>
      (b.initiative || 0) - (a.initiative || 0) ||
      a.name.localeCompare(b.name),
  )
}

export function rollD20() {
  return 1 + Math.floor(Math.random() * 20)
}
