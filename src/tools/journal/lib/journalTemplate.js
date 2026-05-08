import { v4 as uuid } from 'uuid'
import { SECTION_TYPES, getSectionType } from './sectionTypes.js'

export const TEMPLATE_KEY = 'journal:template'
export const TEMPLATE_VERSION = 2

const DEFAULT_TITLE = 'Session Notes'

// Approximates the minimalist single-page layout: header info row, a
// big notes block, then half-width side boxes.
const DEFAULT_SECTION_IDS = [
  'session',
  'date',
  'notes',
  'places',
  'initiative',
  'npcs',
  'items',
  'combat',
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
    span: type.span ?? 'full',
    repeat: type.repeat ?? 1,
    subsections: type.subsections.map(newSubsection),
  }
}

export function emptyTemplate() {
  return {
    version: TEMPLATE_VERSION,
    title: DEFAULT_TITLE,
    sections: DEFAULT_SECTION_IDS.map(newSection),
  }
}

export const defaultTemplate = emptyTemplate

function normalizeSection(s) {
  return {
    id: s.id ?? uuid(),
    label: s.label ?? '',
    span: s.span === 'half' ? 'half' : 'full',
    repeat: Math.max(1, Math.min(20, Number(s.repeat) || 1)),
    subsections: Array.isArray(s.subsections) && s.subsections.length > 0
      ? s.subsections.map((sub) => ({
          id: sub.id ?? uuid(),
          label: sub.label ?? '',
          lines: Math.max(1, Math.min(20, Number(sub.lines) || 4)),
        }))
      : [{ id: uuid(), label: '', lines: 4 }],
  }
}

export function migrateTemplate(value) {
  if (!value || typeof value !== 'object') return emptyTemplate()
  if (Array.isArray(value.sections)) {
    return {
      version: TEMPLATE_VERSION,
      title: typeof value.title === 'string' ? value.title : DEFAULT_TITLE,
      sections: value.sections.map(normalizeSection),
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
    `${safeFilename(template.title)}.json`,
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
