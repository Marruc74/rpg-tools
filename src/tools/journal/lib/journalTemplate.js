import { v4 as uuid } from 'uuid'

// Library stores N templates; each template has one or two pages
// (front, optional back). Each page lays boxes by absolute pixel
// position on a virtual A4 page (840 × 1188 px). 8 px snap.

export const LIBRARY_KEY = 'journal:library'
export const LIBRARY_VERSION = 4

const PX_PER_MM = 4

// Page sizes in mm (portrait shape).
export const PAGE_SIZES_MM = {
  a4:     { w: 210, h: 297 },
  letter: { w: 216, h: 279 },
  legal:  { w: 216, h: 356 },
}

// Backward-compat constants (default A4 portrait pixel dims).
export const PAGE_W = PAGE_SIZES_MM.a4.w * PX_PER_MM
export const PAGE_H = PAGE_SIZES_MM.a4.h * PX_PER_MM

export const GRID_PX = 8
export const MIN_W = 96
export const MIN_H = 56

export function getPageDims(pageSize = 'a4', orientation = 'portrait') {
  const base = PAGE_SIZES_MM[pageSize] ?? PAGE_SIZES_MM.a4
  const w_mm = orientation === 'landscape' ? base.h : base.w
  const h_mm = orientation === 'landscape' ? base.w : base.h
  return {
    w: w_mm * PX_PER_MM,
    h: h_mm * PX_PER_MM,
    pageSize,
    orientation,
    w_mm,
    h_mm,
  }
}

export function getTemplatePageDims(template) {
  return getPageDims(template?.pageSize, template?.orientation)
}

export function snap(value) {
  return Math.round(value / GRID_PX) * GRID_PX
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

export const BOX_BORDER_OPTIONS = ['none', 'thin', 'normal', 'thick']
export const BOX_RADIUS_OPTIONS = ['sharp', 'rounded']
export const BOX_FILL_OPTIONS = ['white', 'cream', 'gray', 'transparent']

export function newBox(overrides = {}) {
  return {
    id: uuid(),
    title: 'Untitled',
    x: snap(overrides.x ?? 24),
    y: snap(overrides.y ?? 24),
    w: snap(overrides.w ?? 240),
    h: snap(overrides.h ?? 160),
    content: [],
    style: { border: 'normal', radius: 'rounded', fill: 'white' },
    ...overrides,
    id: overrides.id ?? uuid(),
  }
}

export const MAX_TRACKER_COUNT = 60
export const MAX_GRID_DIM = 30
export const MAX_TABLE_COLS = 8
export const MAX_TABLE_ROWS = 30

export const CONTENT_KINDS = [
  { id: 'tracker',  label: 'Tracker (checkboxes)' },
  { id: 'lines',    label: 'Lined writing space' },
  { id: 'numbered', label: 'Numbered list' },
  { id: 'grid',     label: 'Grid' },
  { id: 'table',    label: 'Table (columns with headers)' },
]

function normalizeColumnWidth(value) {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return 0
  return clamp(Math.round(n), 0, 100)
}

function defaultTableColumns() {
  return [
    { id: uuid(), title: 'Name', width: 0 },
    { id: uuid(), title: 'Notes', width: 0 },
  ]
}

export function newContentItem(kind, overrides = {}) {
  switch (kind) {
    case 'tracker':
      return {
        id: uuid(),
        kind: 'tracker',
        label: typeof overrides.label === 'string' ? overrides.label : '',
        count: clamp(Number(overrides.count) || 10, 1, MAX_TRACKER_COUNT),
      }
    case 'lines':
      return {
        id: uuid(),
        kind: 'lines',
        label: typeof overrides.label === 'string' ? overrides.label : '',
        count: clamp(Number(overrides.count) || 4, 1, 30),
      }
    case 'numbered':
      return {
        id: uuid(),
        kind: 'numbered',
        label: typeof overrides.label === 'string' ? overrides.label : '',
        count: clamp(Number(overrides.count) || 6, 1, 30),
      }
    case 'grid':
      return {
        id: uuid(),
        kind: 'grid',
        label: typeof overrides.label === 'string' ? overrides.label : '',
        cols: clamp(Number(overrides.cols) || 6, 1, MAX_GRID_DIM),
        rows: clamp(Number(overrides.rows) || 4, 1, MAX_GRID_DIM),
      }
    case 'table': {
      const cols = Array.isArray(overrides.columns) && overrides.columns.length > 0
        ? overrides.columns
            .slice(0, MAX_TABLE_COLS)
            .map((c) => ({
              id: c.id ?? uuid(),
              title: typeof c.title === 'string' ? c.title : '',
              width: normalizeColumnWidth(c.width),
            }))
        : defaultTableColumns()
      return {
        id: uuid(),
        kind: 'table',
        label: typeof overrides.label === 'string' ? overrides.label : '',
        columns: cols,
        rows: clamp(Number(overrides.rows) || 4, 1, MAX_TABLE_ROWS),
      }
    }
    default:
      return null
  }
}

// Back-compat alias — most call sites still want a tracker by default.
export function newTracker(overrides = {}) {
  return newContentItem('tracker', overrides)
}

export function newPage(boxes = []) {
  return { id: uuid(), boxes }
}

function defaultFrontBoxes() {
  return [
    newBox({ title: 'Session #',     x: 24,  y: 80,  w: 240, h: 64 }),
    newBox({ title: 'Date',          x: 280, y: 80,  w: 240, h: 64 }),
    newBox({ title: 'Campaign',      x: 536, y: 80,  w: 280, h: 64 }),
    newBox({ title: 'Notes',         x: 24,  y: 160, w: 792, h: 360 }),
    newBox({ title: 'Locations',     x: 24,  y: 536, w: 384, h: 200 }),
    newBox({ title: 'Initiative',    x: 424, y: 536, w: 392, h: 200 }),
    newBox({ title: 'NPCs',          x: 24,  y: 752, w: 384, h: 240 }),
    newBox({ title: 'Loot',          x: 424, y: 752, w: 392, h: 120 }),
    newBox({ title: 'Encounters',    x: 424, y: 888, w: 392, h: 104 }),
  ]
}

export const TEMPLATE_THEMES = ['minimalist', 'parchment']

export function newTemplate(overrides = {}) {
  return {
    id: uuid(),
    name: 'New template',
    title: 'Session Notes',
    game: '',
    pageSize: 'a4',
    orientation: 'portrait',
    theme: 'minimalist',
    pages: [newPage(defaultFrontBoxes())],
    ...overrides,
    id: overrides.id ?? uuid(),
  }
}

export function emptyLibrary() {
  const t = newTemplate({ name: 'Default template' })
  return {
    version: LIBRARY_VERSION,
    templates: [t],
    activeTemplateId: t.id,
  }
}

export const defaultLibrary = emptyLibrary

function normalizeContentItem(c) {
  if (!c || typeof c !== 'object') return null
  const id = c.id ?? uuid()
  const label = typeof c.label === 'string' ? c.label : ''
  switch (c.kind) {
    case 'tracker':
      return { id, kind: 'tracker', label, count: clamp(Number(c.count) || 1, 1, MAX_TRACKER_COUNT) }
    case 'lines':
      return { id, kind: 'lines', label, count: clamp(Number(c.count) || 1, 1, 30) }
    case 'numbered':
      return { id, kind: 'numbered', label, count: clamp(Number(c.count) || 1, 1, 30) }
    case 'grid':
      return {
        id,
        kind: 'grid',
        label,
        cols: clamp(Number(c.cols) || 1, 1, MAX_GRID_DIM),
        rows: clamp(Number(c.rows) || 1, 1, MAX_GRID_DIM),
      }
    case 'table': {
      const columns = Array.isArray(c.columns)
        ? c.columns
            .slice(0, MAX_TABLE_COLS)
            .map((col) => ({
              id: col?.id ?? uuid(),
              title: typeof col?.title === 'string' ? col.title : '',
              width: normalizeColumnWidth(col?.width),
            }))
        : defaultTableColumns()
      return {
        id,
        kind: 'table',
        label,
        columns: columns.length > 0 ? columns : defaultTableColumns(),
        rows: clamp(Number(c.rows) || 1, 1, MAX_TABLE_ROWS),
      }
    }
    default:
      return null
  }
}

function normalizeBox(b) {
  const x = snap(clamp(Number(b.x) || 0, 0, PAGE_W - MIN_W))
  const y = snap(clamp(Number(b.y) || 0, 0, PAGE_H - MIN_H))
  const w = snap(clamp(Number(b.w) || MIN_W, MIN_W, PAGE_W - x))
  const h = snap(clamp(Number(b.h) || MIN_H, MIN_H, PAGE_H - y))

  // Forward-migrate the legacy `trackers` field onto the unified
  // `content` array.
  let content
  if (Array.isArray(b.content)) {
    content = b.content.map(normalizeContentItem).filter(Boolean)
  } else if (Array.isArray(b.trackers)) {
    content = b.trackers
      .map((t) => normalizeContentItem({ ...t, kind: 'tracker' }))
      .filter(Boolean)
  } else {
    content = []
  }

  const styleIn = b.style && typeof b.style === 'object' ? b.style : {}
  const style = {
    border: BOX_BORDER_OPTIONS.includes(styleIn.border) ? styleIn.border : 'normal',
    radius: BOX_RADIUS_OPTIONS.includes(styleIn.radius) ? styleIn.radius : 'rounded',
    fill: BOX_FILL_OPTIONS.includes(styleIn.fill) ? styleIn.fill : 'white',
  }

  return {
    id: b.id ?? uuid(),
    title: typeof b.title === 'string' ? b.title : '',
    x, y, w, h,
    content,
    style,
  }
}

function normalizePage(p) {
  return {
    id: p.id ?? uuid(),
    boxes: Array.isArray(p.boxes) ? p.boxes.map(normalizeBox) : [],
  }
}

function normalizeTemplate(t) {
  // Forward-migrate v3 (top-level boxes) into pages[0].
  let pages
  if (Array.isArray(t.pages) && t.pages.length > 0) {
    pages = t.pages.slice(0, 8).map(normalizePage)
  } else if (Array.isArray(t.boxes)) {
    pages = [normalizePage({ boxes: t.boxes })]
  } else {
    pages = [newPage(defaultFrontBoxes())]
  }
  return {
    id: t.id ?? uuid(),
    name: typeof t.name === 'string' && t.name ? t.name : 'Template',
    title: typeof t.title === 'string' ? t.title : 'Session Notes',
    game: typeof t.game === 'string' ? t.game : '',
    pageSize: PAGE_SIZES_MM[t.pageSize] ? t.pageSize : 'a4',
    orientation: t.orientation === 'landscape' ? 'landscape' : 'portrait',
    theme: TEMPLATE_THEMES.includes(t.theme) ? t.theme : 'minimalist',
    pages,
  }
}

export function migrateLibrary(value) {
  if (!value || typeof value !== 'object') return emptyLibrary()
  if (Array.isArray(value.templates)) {
    const templates = value.templates.map(normalizeTemplate)
    const activeTemplateId =
      templates.find((t) => t.id === value.activeTemplateId)?.id ?? templates[0]?.id
    return { version: LIBRARY_VERSION, templates, activeTemplateId }
  }
  return emptyLibrary()
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
    { kind: 'journalTemplate', version: LIBRARY_VERSION, template },
    `${safeFilename(template.name)}.template.json`,
  )
}

export function downloadLibraryJson(library) {
  triggerDownload(library, 'journal-library.json')
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
          resolve({ kind: 'template', template: normalizeTemplate(parsed.template) })
          return
        }
        if (Array.isArray(parsed.templates)) {
          resolve({ kind: 'library', library: migrateLibrary(parsed) })
          return
        }
        reject(new Error('File does not look like a journal template or library.'))
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}
