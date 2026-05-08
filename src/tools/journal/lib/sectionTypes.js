// Catalog of available section types for a session journal entry.
// `id` is stable for storage; `label` and `placeholder` may evolve.
export const SECTION_TYPES = [
  {
    id: 'characters',
    label: 'Characters in play',
    placeholder: 'Party members and notable allies present this session.',
  },
  {
    id: 'npcs',
    label: 'NPCs met',
    placeholder: 'New or returning non-player characters and what we learned about them.',
  },
  {
    id: 'places',
    label: 'Places explored',
    placeholder: 'Locations visited, with notable features.',
  },
  {
    id: 'items',
    label: 'Items found',
    placeholder: 'Treasure, gear, consumables, magical items.',
  },
  {
    id: 'rumours',
    label: 'Rumours and clues',
    placeholder: 'Hooks, mysteries, leads worth chasing.',
  },
  {
    id: 'quests',
    label: 'Quests and objectives',
    placeholder: 'Active goals and progress this session.',
  },
  {
    id: 'combat',
    label: 'Combat highlights',
    placeholder: 'Memorable encounters, tactics, casualties.',
  },
  {
    id: 'decisions',
    label: 'Decisions made',
    placeholder: 'Moral, strategic, or plot-defining choices.',
  },
  {
    id: 'next',
    label: 'Next session',
    placeholder: 'Loose ends, plans, things to follow up.',
  },
  {
    id: 'notes',
    label: 'Notes',
    placeholder: 'Anything else worth remembering.',
  },
]

export function getSectionType(id) {
  return SECTION_TYPES.find((s) => s.id === id)
}
