import { v4 as uuid } from 'uuid'
import { SECTION_TYPES, getSectionType } from './sectionTypes.js'

// New, content-free schema: only the structure of a journal page is
// stored. Each print is a fresh blank form.
export const TEMPLATE_KEY = 'journal:template'
export const TEMPLATE_VERSION = 1

const DEFAULT_SECTION_IDS = [
  'date',
  'characters',
  'npcs',
  'places',
  'items',
  'rumours',
  'next',
]

export function newSubsection(sub = {}) {
  return {
    id: uuid(),
    label: sub.label ?? '',
    lines: Math.max(1, Math.min(20, sub.lines ?? 4)),
  }
}

export function newSection(typeId) {
  const type = getSectionType(typeId) ?? SECTION_TYPES[SECTION_TYPES.length - 1]
  return {
    id: uuid(),
    label: type.label,
    subsections: type.subsections.map(newSubsection),
  }
}

export function emptyTemplate() {
  return {
    version: TEMPLATE_VERSION,
    sections: DEFAULT_SECTION_IDS.map(newSection),
  }
}

// Replace the user's whole template with the catalog defaults.
export function defaultTemplate() {
  return emptyTemplate()
}

export function migrateTemplate(value) {
  if (!value || typeof value !== 'object') return emptyTemplate()
  if (value.version === TEMPLATE_VERSION && Array.isArray(value.sections)) {
    // Defensive normalization in case stored data drifted.
    return {
      version: TEMPLATE_VERSION,
      sections: value.sections.map((s) => ({
        id: s.id ?? uuid(),
        label: s.label ?? '',
        subsections: Array.isArray(s.subsections)
          ? s.subsections.map((sub) => ({
              id: sub.id ?? uuid(),
              label: sub.label ?? '',
              lines: Math.max(1, Math.min(20, sub.lines ?? 4)),
            }))
          : [{ id: uuid(), label: '', lines: 4 }],
      })),
    }
  }
  return emptyTemplate()
}

function safeFilename(name) {
  return (name || 'journal-template').replace(/[^a-z0-9-_ ]/gi, '_').trim() || 'journal-template'
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

export function downloadTemplateJson(template) {
  triggerDownload(
    { kind: 'journalTemplate', version: TEMPLATE_VERSION, template },
    `${safeFilename('journal-template')}.json`,
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
        if (parsed.kind === 'journalTemplate' && parsed.template) {
          resolve(migrateTemplate(parsed.template))
          return
        }
        // Tolerate raw template shape too.
        if (Array.isArray(parsed.sections)) {
          resolve(migrateTemplate(parsed))
          return
        }
        reject(new Error('File does not look like a journal template.'))
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}
