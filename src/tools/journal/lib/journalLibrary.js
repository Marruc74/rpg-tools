import { v4 as uuid } from 'uuid'
import { SECTION_TYPES, getSectionType } from './sectionTypes.js'

export const JOURNAL_KEY = 'journal:library'
export const JOURNAL_VERSION = 1

// Default sections seeded on a brand-new entry. The user can add or
// remove sections freely from the catalog.
export const DEFAULT_ENTRY_SECTIONS = [
  'characters',
  'npcs',
  'places',
  'items',
  'rumours',
  'next',
]

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function newSection(typeId) {
  const type = getSectionType(typeId) ?? SECTION_TYPES[SECTION_TYPES.length - 1]
  return {
    id: uuid(),
    type: type.id,
    label: type.label,
    content: '',
  }
}

export function newEntry(overrides = {}) {
  return {
    id: uuid(),
    title: 'New session',
    date: todayIso(),
    sections: DEFAULT_ENTRY_SECTIONS.map(newSection),
    ...overrides,
  }
}

export { newSection }

export function emptyJournal() {
  const entry = newEntry({ title: 'Session 1' })
  return {
    version: JOURNAL_VERSION,
    entries: [entry],
    activeEntryId: entry.id,
  }
}

export function migrateJournal(value) {
  if (!value || typeof value !== 'object') return emptyJournal()
  if (value.version === JOURNAL_VERSION && Array.isArray(value.entries)) {
    return value
  }
  // Future migrations branch here. For now just normalize unknown shapes.
  return emptyJournal()
}

function safeFilename(name) {
  return (name || 'session').replace(/[^a-z0-9-_ ]/gi, '_').trim() || 'session'
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

export function downloadJournalJson(journal) {
  triggerDownload(journal, 'journal.json')
}

export function downloadEntryJson(entry) {
  triggerDownload(
    { kind: 'journalEntry', version: JOURNAL_VERSION, entry },
    `${safeFilename(entry.title)}.entry.json`,
  )
}

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
        if (parsed.kind === 'journalEntry' && parsed.entry) {
          resolve({ kind: 'entry', entry: parsed.entry })
          return
        }
        if (Array.isArray(parsed.entries)) {
          resolve({ kind: 'journal', journal: migrateJournal(parsed) })
          return
        }
        reject(new Error('File does not look like a journal export.'))
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}
