import { v4 as uuid } from 'uuid'
import { DEFAULT_STYLE } from './newCard.js'
import { DEFAULT_SIZE_ID } from './cardSizes.js'

export const LIBRARY_KEY = 'cardmaker:library'
export const LIBRARY_VERSION = 7

export const DEFAULT_CATEGORIES = ['Item', 'Spell', 'Rule', 'NPC', 'Other']

export const BACK_MODES = {
  PER_CARD: 'per-card',
  SHARED: 'shared',
}

export function newCollection(overrides = {}) {
  return {
    id: uuid(),
    name: 'New collection',
    size: DEFAULT_SIZE_ID,
    style: { ...DEFAULT_STYLE },
    categories: [...DEFAULT_CATEGORIES],
    backMode: BACK_MODES.PER_CARD,
    sharedBacks: {},
    cards: [],
    ...overrides,
  }
}

// True if a side carries any user-authored content.
function sideHasContent(side) {
  if (!side || typeof side !== 'object') return false
  if (side.title && side.title.trim()) return true
  if (side.image) return true
  if (side.body && side.body.trim()) return true
  if (Array.isArray(side.stats) && side.stats.some((s) => s.label || s.value)) return true
  return false
}

export function emptyLibrary() {
  const col = newCollection({ name: 'My library' })
  return {
    version: LIBRARY_VERSION,
    collections: [col],
    activeCollectionId: col.id,
  }
}

// Brings any older shape forward to the current schema. Called both when
// reading from localStorage and when importing JSON.
export function migrateLibrary(library) {
  if (!library || typeof library !== 'object') return emptyLibrary()

  // Already current.
  if (library.version === LIBRARY_VERSION && Array.isArray(library.collections)) {
    return library
  }

  // Common helper to ensure each collection has a default style + size.
  const ensureCollectionDefaults = (col) => {
    const { gameName, ...rest } = col
    return {
      ...rest,
      name:
        rest.name ||
        (gameName && gameName.trim()) ||
        'New collection',
      size: rest.size ?? DEFAULT_SIZE_ID,
      style: rest.style ?? { ...DEFAULT_STYLE },
      categories:
        Array.isArray(rest.categories) && rest.categories.length > 0
          ? rest.categories
          : [...DEFAULT_CATEGORIES],
      backMode:
        rest.backMode === BACK_MODES.SHARED
          ? BACK_MODES.SHARED
          : BACK_MODES.PER_CARD,
      sharedBacks: normalizeSharedBacks(rest),
      cards: rest.cards ?? [],
    }
  }

  // Bring the previous single sharedBack forward by attaching it to the
  // first available category, so users who set one up under v6 don't
  // silently lose it when categories now own their own backs.
  function normalizeSharedBacks(rest) {
    if (rest.sharedBacks && typeof rest.sharedBacks === 'object') {
      return rest.sharedBacks
    }
    if (sideHasContent(rest.sharedBack)) {
      const cats = Array.isArray(rest.categories) && rest.categories.length > 0
        ? rest.categories
        : DEFAULT_CATEGORIES
      return { [cats[0]]: rest.sharedBack }
    }
    return {}
  }

  // v2/v3 → v4: collections array exists; ensure each has a style and that
  // gameName (if any v2 leftover) is consolidated into name.
  if (Array.isArray(library.collections)) {
    return {
      version: LIBRARY_VERSION,
      collections: library.collections.map(ensureCollectionDefaults),
      activeCollectionId: library.activeCollectionId,
    }
  }

  // v1 → v4: wrap loose cards into a single collection.
  if (Array.isArray(library.cards)) {
    const col = newCollection({
      name: (library.gameName && library.gameName.trim()) || 'My library',
      cards: library.cards,
    })
    return {
      version: LIBRARY_VERSION,
      collections: [col],
      activeCollectionId: col.id,
    }
  }

  return emptyLibrary()
}

function safeFilename(name) {
  return (name || 'export').replace(/[^a-z0-9-_ ]/gi, '_').trim() || 'export'
}

function triggerDownload(payload, filename) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function downloadJson(library) {
  triggerDownload(library, 'cardmaker-library.json')
}

export function downloadCollectionJson(collection) {
  triggerDownload(
    { kind: 'collection', version: LIBRARY_VERSION, collection },
    `${safeFilename(collection.name)}.collection.json`,
  )
}

export function downloadCardJson(card) {
  triggerDownload(
    { kind: 'card', version: LIBRARY_VERSION, card },
    `${safeFilename(card.name)}.card.json`,
  )
}

// Returns a discriminated payload:
//   { kind: 'library',    library: <migrated library> }
//   { kind: 'collection', collection: <single collection> }
//   { kind: 'card',       card: <single card> }
export function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        if (!parsed || typeof parsed !== 'object') {
          reject(new Error('File is not valid JSON.'))
          return
        }

        if (parsed.kind === 'card' && parsed.card) {
          resolve({ kind: 'card', card: parsed.card })
          return
        }
        if (parsed.kind === 'collection' && parsed.collection) {
          resolve({ kind: 'collection', collection: parsed.collection })
          return
        }

        if (Array.isArray(parsed.cards) || Array.isArray(parsed.collections)) {
          resolve({ kind: 'library', library: migrateLibrary(parsed) })
          return
        }

        reject(new Error('File does not look like a Card-Maker export.'))
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}
