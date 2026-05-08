// Catalog of available section types. Each carries default subsections,
// span (full or half page width), and repeat count for sections that
// render as a grid of identical cards (NPCs, items, etc.).
//
// Subsection { label, lines }
//   - lines === 1 with a non-empty label: inline form field
//     "Label  ___________________"
//   - otherwise: small label heading above N ruled lines for handwriting
export const SECTION_TYPES = [
  { id: 'date',       label: 'Date & Location', span: 'half', repeat: 1, subsections: [{ label: '', lines: 1 }] },
  { id: 'session',    label: 'Session #',       span: 'half', repeat: 1, subsections: [{ label: '', lines: 1 }] },
  { id: 'campaign',   label: 'Campaign',        span: 'half', repeat: 1, subsections: [{ label: '', lines: 1 }] },
  { id: 'characters', label: 'Characters in play', span: 'full', repeat: 1, subsections: [{ label: '', lines: 5 }] },
  { id: 'notes',      label: 'Notes',           span: 'full', repeat: 1, subsections: [{ label: '', lines: 10 }] },
  { id: 'goals',      label: 'Current Goals',   span: 'full', repeat: 1, subsections: [{ label: '', lines: 6 }] },
  { id: 'npcs',       label: 'NPCs',            span: 'full', repeat: 4, subsections: [
    { label: 'Name', lines: 1 },
    { label: 'Notes', lines: 2 },
  ]},
  { id: 'places',     label: 'Locations',       span: 'half', repeat: 1, subsections: [{ label: '', lines: 6 }] },
  { id: 'items',      label: 'Items / Loot',    span: 'half', repeat: 1, subsections: [{ label: '', lines: 6 }] },
  { id: 'rumours',    label: 'Rumours and clues', span: 'half', repeat: 1, subsections: [{ label: '', lines: 6 }] },
  { id: 'quests',     label: 'Quests',          span: 'half', repeat: 1, subsections: [
    { label: 'Active',    lines: 3 },
    { label: 'Completed', lines: 2 },
  ]},
  { id: 'combat',     label: 'Encounters',      span: 'half', repeat: 1, subsections: [{ label: '', lines: 4 }] },
  { id: 'initiative', label: 'Initiative',      span: 'half', repeat: 1, subsections: [
    { label: '1', lines: 1 },
    { label: '2', lines: 1 },
    { label: '3', lines: 1 },
    { label: '4', lines: 1 },
    { label: '5', lines: 1 },
    { label: '6', lines: 1 },
  ]},
  { id: 'decisions',  label: 'Decisions made',  span: 'half', repeat: 1, subsections: [{ label: '', lines: 4 }] },
  { id: 'next',       label: 'Next session',    span: 'half', repeat: 1, subsections: [{ label: '', lines: 3 }] },
]

export function getSectionType(id) {
  return SECTION_TYPES.find((s) => s.id === id)
}
