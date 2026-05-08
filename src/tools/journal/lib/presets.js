// Box presets — drop-in starter configurations the user can plop onto
// the page instead of building from scratch. Each entry describes the
// box's title and dimensions plus an array of content items in their
// raw shape (the runtime adds ids and clamps).

export const BOX_PRESETS = [
  {
    id: 'hp',
    name: 'HP block (10)',
    title: 'HP',
    w: 240, h: 80,
    content: [{ kind: 'tracker', label: '', count: 10 }],
  },
  {
    id: 'arrows',
    name: 'Arrows / Ammo (20)',
    title: 'Arrows',
    w: 280, h: 96,
    content: [{ kind: 'tracker', label: '', count: 20 }],
  },
  {
    id: 'rations',
    name: 'Rations (7)',
    title: 'Rations',
    w: 200, h: 80,
    content: [{ kind: 'tracker', label: '', count: 7 }],
  },
  {
    id: 'initiative',
    name: 'Initiative (6 slots)',
    title: 'Initiative',
    w: 280, h: 200,
    content: [{ kind: 'numbered', label: '', count: 6 }],
  },
  {
    id: 'quests',
    name: 'Quests (active 4 / done 3)',
    title: 'Quests',
    w: 320, h: 240,
    content: [
      { kind: 'numbered', label: 'Active', count: 4 },
      { kind: 'numbered', label: 'Completed', count: 3 },
    ],
  },
  {
    id: 'npc-card',
    name: 'NPC card',
    title: 'NPC',
    w: 280, h: 152,
    content: [
      { kind: 'lines', label: 'Name', count: 1 },
      { kind: 'lines', label: 'Notes', count: 3 },
    ],
  },
  {
    id: 'notes',
    name: 'Ruled notes (8)',
    title: 'Notes',
    w: 400, h: 240,
    content: [{ kind: 'lines', label: '', count: 8 }],
  },
  {
    id: 'spell-prep',
    name: 'Spell prep grid (6×4)',
    title: 'Spell prep',
    w: 280, h: 200,
    content: [{ kind: 'grid', label: '', cols: 6, rows: 4 }],
  },
  {
    id: 'session-header',
    name: 'Session header (Date / Session #)',
    title: '',
    w: 528, h: 64,
    content: [
      { kind: 'lines', label: '', count: 1 },
    ],
  },
]
