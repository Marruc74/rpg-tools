// Catalog of available section types. Each type comes with default
// subsections that are cloned into the template when added; the user
// can rename them, change their line count, or remove them.
//
// Subsection shape: { label, lines }
//   - lines === 1 with a non-empty label renders as an inline form
//     field: "Label: ____________"
//   - lines >= 1 with no label renders as N ruled lines under the
//     section heading
//   - lines >= 2 with a label renders as a small label heading above
//     N ruled lines
export const SECTION_TYPES = [
  {
    id: 'date',
    label: 'Date played',
    subsections: [{ label: '', lines: 1 }],
  },
  {
    id: 'session',
    label: 'Session #',
    subsections: [{ label: '', lines: 1 }],
  },
  {
    id: 'characters',
    label: 'Characters in play',
    subsections: [{ label: '', lines: 6 }],
  },
  {
    id: 'npcs',
    label: 'NPCs met',
    subsections: [
      { label: 'Name', lines: 1 },
      { label: 'Description', lines: 2 },
      { label: 'Disposition', lines: 1 },
    ],
  },
  {
    id: 'places',
    label: 'Places explored',
    subsections: [
      { label: 'Name', lines: 1 },
      { label: 'Notable features', lines: 3 },
    ],
  },
  {
    id: 'items',
    label: 'Items found',
    subsections: [{ label: '', lines: 6 }],
  },
  {
    id: 'rumours',
    label: 'Rumours and clues',
    subsections: [{ label: '', lines: 6 }],
  },
  {
    id: 'quests',
    label: 'Quests and objectives',
    subsections: [
      { label: 'Active', lines: 3 },
      { label: 'Completed', lines: 2 },
    ],
  },
  {
    id: 'combat',
    label: 'Combat highlights',
    subsections: [{ label: '', lines: 4 }],
  },
  {
    id: 'decisions',
    label: 'Decisions made',
    subsections: [{ label: '', lines: 4 }],
  },
  {
    id: 'next',
    label: 'Next session',
    subsections: [{ label: '', lines: 3 }],
  },
  {
    id: 'notes',
    label: 'Notes',
    subsections: [{ label: '', lines: 8 }],
  },
]

export function getSectionType(id) {
  return SECTION_TYPES.find((s) => s.id === id)
}
