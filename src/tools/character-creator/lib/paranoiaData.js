// Paranoia (the Fifth Edition, West End Games) — static character-creation data.
// Pulled from the rulebook character-generation chapter (pp. 18–32) and the
// gamemaster's secret tables (pp. 77–78). The Computer assures you this data is
// entirely accurate and that any discrepancy is treason.

// ── ATTRIBUTES ─────────────────────────────────────────────────────────────
// Eight attributes, each 1–10. Skills hang off Agility, Chutzpah, Dexterity,
// Mechanical Aptitude and Moxie; Strength/Endurance/Power drive derived stats.
export const ATTR_MIN = 1
export const ATTR_MAX = 10
export const ATTR_POINTS = 60 // point-allocation pool
export const SKILL_POINTS = 10 // skill points spent on ranks
export const MAX_RANK = 5 // a skill may not exceed five ranks
export const SERVICE_ROLLS = 5 // rolls on the service-group skill table

export const ATTRIBUTES = [
  { key: 'STR', name: 'Strength', hasSkills: false, desc: 'Physical power — carrying capacity and hand-to-hand damage.' },
  { key: 'AGI', name: 'Agility', hasSkills: true, desc: 'Coordination and balance.' },
  { key: 'DEX', name: 'Dexterity', hasSkills: true, desc: 'Hand-eye coordination — fine motor control and gunplay.' },
  { key: 'END', name: 'Endurance', hasSkills: false, desc: 'Resisting damage, fatigue, disease and radiation. Sets Macho and Wound Levels.' },
  { key: 'MOX', name: 'Moxie', hasSkills: true, desc: 'Wit and comprehension — the closest thing a clone has to intelligence.' },
  { key: 'CHU', name: 'Chutzpah', hasSkills: true, desc: 'Bluster, guts and a little psychology.' },
  { key: 'MEC', name: 'Mechanical Aptitude', hasSkills: true, desc: 'Operating (and surviving) Alpha Complex machinery.' },
  { key: 'POW', name: 'Power', hasSkills: false, desc: 'Control of your mutant power (if you have one — you do). May never be zero.' },
]
export const ATTR_KEYS = ATTRIBUTES.map((a) => a.key)
export const SKILL_ATTRS = ATTRIBUTES.filter((a) => a.hasSkills).map((a) => a.key)
export const attrByKey = (k) => ATTRIBUTES.find((a) => a.key === k) || null

// Skill Base = half the governing attribute, rounded up.
export function skillBase(attr) {
  return Math.ceil((attr || 0) / 2)
}

// ── STRENGTH / ENDURANCE CHARTS (p. 23) ─────────────────────────────────────
const STRENGTH_CHART = [
  { max: 3, carry: 25, hth: 1 },
  { max: 5, carry: 30, hth: 2 },
  { max: 6, carry: 40, hth: 3 },
  { max: 7, carry: 50, hth: 3 },
  { max: 8, carry: 65, hth: 4 },
  { max: 9, carry: 80, hth: 4 },
  { max: 10, carry: 100, hth: 5 },
]
const ENDURANCE_CHART = [
  { max: 3, macho: 1, wounds: 3 },
  { max: 5, macho: 2, wounds: 4 },
  { max: 7, macho: 3, wounds: 5 },
  { max: 9, macho: 4, wounds: 6 },
  { max: 10, macho: 5, wounds: 7 },
]
export function lookupStrength(str) {
  return STRENGTH_CHART.find((r) => str <= r.max) || STRENGTH_CHART[STRENGTH_CHART.length - 1]
}
export function lookupEndurance(end) {
  return ENDURANCE_CHART.find((r) => end <= r.max) || ENDURANCE_CHART[ENDURANCE_CHART.length - 1]
}

// ── SKILL LIST (p. 32) ──────────────────────────────────────────────────────
// treason: skills the Computer would rather you didn't have.
export const SKILLS = [
  // Agility
  { id: 'brawling', name: 'Brawling', attr: 'AGI' },
  { id: 'dodge', name: 'Dodge', attr: 'AGI' },
  { id: 'force-weapons', name: 'Force Weapons', attr: 'AGI' },
  { id: 'melee-weapons', name: 'Melee Weapons', attr: 'AGI' },
  { id: 'sneak', name: 'Sneak', attr: 'AGI' },
  { id: 'thrown-weapons', name: 'Thrown Weapons', attr: 'AGI' },
  // Chutzpah
  { id: 'bootlicking', name: 'Bootlicking', attr: 'CHU' },
  { id: 'bribery', name: 'Bribery', attr: 'CHU' },
  { id: 'communist-propaganda', name: 'Communist Propaganda', attr: 'CHU', treason: true },
  { id: 'con', name: 'Con', attr: 'CHU' },
  { id: 'fast-talk', name: 'Fast Talk', attr: 'CHU' },
  { id: 'forgery', name: 'Forgery', attr: 'CHU' },
  { id: 'interrogation', name: 'Interrogation', attr: 'CHU' },
  { id: 'intimidation', name: 'Intimidation', attr: 'CHU' },
  { id: 'motivation', name: 'Motivation', attr: 'CHU' },
  { id: 'oratory', name: 'Oratory', attr: 'CHU' },
  { id: 'perception', name: 'Perception', attr: 'CHU' },
  { id: 'spurious-logic', name: 'Spurious Logic', attr: 'CHU' },
  // Dexterity
  { id: 'energy-weapons', name: 'Energy Weapons', attr: 'DEX' },
  { id: 'field-weapons', name: 'Field Weapons', attr: 'DEX' },
  { id: 'laser-weapons', name: 'Laser Weapons', attr: 'DEX' },
  { id: 'missile-weapons', name: 'Missile Weapons', attr: 'DEX' },
  { id: 'projectile-weapons', name: 'Projectile Weapons', attr: 'DEX' },
  { id: 'vehicle-weapons', name: 'Vehicle Weapons', attr: 'DEX' },
  // Mechanical Aptitude
  { id: 'habitat-engineering', name: 'Habitat Engineering', attr: 'MEC' },
  { id: 'juryrigging', name: 'Juryrigging', attr: 'MEC' },
  { id: 'robot-ops', name: 'Robot Ops & Maintenance', attr: 'MEC' },
  { id: 'vehicle-ops', name: 'Vehicle Ops & Maintenance', attr: 'MEC' },
  // Moxie
  { id: 'biochem-therapy', name: 'Biochem Therapy', attr: 'MOX' },
  { id: 'biosciences', name: 'Biosciences', attr: 'MOX' },
  { id: 'chemistry', name: 'Chemistry', attr: 'MOX' },
  { id: 'computer-programming', name: 'Computer Programming', attr: 'MOX', treason: true },
  { id: 'data-analysis', name: 'Data Analysis', attr: 'MOX' },
  { id: 'data-search', name: 'Data Search', attr: 'MOX' },
  { id: 'demolitions', name: 'Demolitions', attr: 'MOX' },
  { id: 'electronics', name: 'Electronics', attr: 'MOX' },
  { id: 'first-aid', name: 'First Aid', attr: 'MOX' },
  { id: 'mechanics', name: 'Mechanics', attr: 'MOX' },
  { id: 'nuclear-engineering', name: 'Nuclear Engineering', attr: 'MOX' },
  { id: 'old-reckoning-cultures', name: 'Old Reckoning Cultures', attr: 'MOX', treason: true },
  { id: 'security', name: 'Security', attr: 'MOX' },
  { id: 'surveillance', name: 'Surveillance', attr: 'MOX' },
  { id: 'survival', name: 'Survival', attr: 'MOX' },
]
export const skillById = (id) => SKILLS.find((s) => s.id === id) || null

// ── SERVICE GROUPS (pp. 24–25) ──────────────────────────────────────────────
// Each table is rolled 1d10. `grants` adds skill ranks; `special` results (roll
// again, cross-table rolls, "+1 to all robot ops") are shown for the player to
// resolve by re-rolling the slot or asking the gamemaster.
// Sub-bot ops (jacko/docbot/scrubot) → Robot Ops; autocar/transbot → Vehicle Ops;
// "mechanical engineering" → Mechanics.
const g = (skill, ranks = 1) => ({ skill, ranks })
export const SERVICE_GROUPS = [
  {
    id: 'intsec', name: 'Internal Security',
    note: 'IntSec agents are really posing as a member of another Service Group: per the book, roll 3× on this table and 2× on your "cover" group.',
    table: [
      { roll: 1, text: 'Disguised as a doberbot — no skills learned' },
      { roll: 2, grants: [g('brawling')] },
      { roll: 3, grants: [g('melee-weapons')] },
      { roll: 4, grants: [g('interrogation')] },
      { roll: 5, grants: [g('intimidation')] },
      { roll: 6, grants: [g('laser-weapons')] },
      { roll: 7, grants: [g('security')] },
      { roll: 8, grants: [g('surveillance')] },
      { roll: 9, text: 'Roll once on any other Service Group table', expand: { table: 'other', times: 1 } },
      { roll: 10, text: 'Roll twice on this table (ignoring 9–10)', expand: { table: 'this', times: 2, ignore: [9, 10] } },
    ],
  },
  {
    id: 'techservices', name: 'Technical Services',
    table: [
      { roll: 1, text: 'Snoozed in a supply closet — learned nothing' },
      { roll: 2, grants: [g('spurious-logic')] },
      { roll: 3, grants: [g('vehicle-ops')] }, // autocar ops
      { roll: 4, grants: [g('vehicle-ops')] }, // transbot ops
      { roll: 5, grants: [g('robot-ops')] }, // docbot ops
      { roll: 6, grants: [g('robot-ops')] }, // scrubot ops
      { roll: 7, grants: [g('electronics')] },
      { roll: 8, grants: [g('mechanics')] },
      { roll: 9, grants: [g('robot-ops')], text: '+1 to all robot ops & maintenance' },
      { roll: 10, text: 'Roll once on the R&D table', expand: { table: 'rnd', times: 1 } },
    ],
  },
  {
    id: 'rnd', name: 'Research & Design',
    table: [
      { roll: 1, text: 'Minor lab accident — you clean up but learn nothing' },
      { roll: 2, grants: [g('robot-ops')] }, // jackobot ops
      { roll: 3, grants: [g('biosciences')] },
      { roll: 4, grants: [g('data-analysis')] },
      { roll: 5, grants: [g('data-search')] },
      { roll: 6, grants: [g('electronics')] },
      { roll: 7, grants: [g('mechanics')] },
      { roll: 8, text: 'Roll twice on this table (ignoring 8+)', expand: { table: 'this', times: 2, ignoreFrom: 8 } },
      { roll: 9, text: 'Roll twice on the Technical Services table', expand: { table: 'techservices', times: 2 } },
      { roll: 10, text: 'Roll twice on the Power Services table', expand: { table: 'power', times: 2 } },
    ],
  },
  {
    id: 'cpu', name: 'Central Processing Unit',
    table: [
      { roll: 1, text: 'Too much paperwork — you learned nothing' },
      { roll: 2, grants: [g('data-analysis')] },
      { roll: 3, grants: [g('data-search')] },
      { roll: 4, grants: [g('surveillance')] },
      { roll: 5, grants: [g('security')] },
      { roll: 6, grants: [g('fast-talk')] },
      { roll: 7, grants: [g('spurious-logic')] },
      { roll: 8, grants: [g('laser-weapons')] },
      { roll: 9, grants: [g('data-analysis'), g('data-search')] },
      { roll: 10, text: 'Roll once on the HPD&MC table', expand: { table: 'hpdmc', times: 1 } },
    ],
  },
  {
    id: 'power', name: 'Power Services',
    table: [
      { roll: 1, text: 'Hid in the ventilation shafts — learned nothing' },
      { roll: 2, grants: [g('spurious-logic')] },
      { roll: 3, grants: [g('habitat-engineering')] },
      { roll: 4, grants: [g('robot-ops')] }, // jackobot ops
      { roll: 5, grants: [g('chemistry')] },
      { roll: 6, grants: [g('electronics')] },
      { roll: 7, grants: [g('mechanics')] }, // mechanical engineering
      { roll: 8, grants: [g('nuclear-engineering')] },
      { roll: 9, grants: [g('robot-ops'), g('habitat-engineering')] },
      { roll: 10, text: 'Roll twice on this table (ignoring this result)', expand: { table: 'this', times: 2, ignore: [10] } },
    ],
  },
  {
    id: 'plc', name: 'Production, Logistics & Commissary',
    table: [
      { roll: 1, text: 'Buried under requisition forms — learned nothing' },
      { roll: 2, grants: [g('bribery')] },
      { roll: 3, grants: [g('fast-talk')] },
      { roll: 4, grants: [g('forgery')] },
      { roll: 5, grants: [g('habitat-engineering')] },
      { roll: 6, grants: [g('robot-ops')] }, // jackobot ops
      { roll: 7, grants: [g('bootlicking')] },
      { roll: 8, grants: [g('spurious-logic')] },
      { roll: 9, grants: [g('vehicle-ops')] }, // autocar ops
      { roll: 10, text: 'Roll twice on this table (disregarding this result)', expand: { table: 'this', times: 2, ignore: [10] } },
    ],
  },
  {
    id: 'armed', name: 'Armed Forces',
    table: [
      { roll: 1, text: 'You goofed off — you didn’t learn anything' },
      { roll: 2, grants: [g('force-weapons')] },
      { roll: 3, grants: [g('intimidation'), g('motivation')] },
      { roll: 4, grants: [g('thrown-weapons')] },
      { roll: 5, grants: [g('energy-weapons'), g('laser-weapons')] },
      { roll: 6, grants: [g('field-weapons')] },
      { roll: 7, grants: [g('missile-weapons')] },
      { roll: 8, grants: [g('projectile-weapons')] },
      { roll: 9, grants: [g('vehicle-weapons')] },
      { roll: 10, grants: [g('demolitions')] },
    ],
  },
  {
    id: 'hpdmc', name: 'Housing Preservation & Development and Mind Control',
    table: [
      { roll: 1, text: 'Dodged work successfully — no skills this time' },
      { roll: 2, grants: [g('bootlicking')] },
      { roll: 3, grants: [g('con')] },
      { roll: 4, grants: [g('forgery')] },
      { roll: 5, grants: [g('oratory')] },
      { roll: 6, grants: [g('robot-ops')] }, // docbot ops
      { roll: 7, grants: [g('biochem-therapy')] },
      { roll: 8, grants: [g('first-aid')] },
      { roll: 9, text: 'Roll once on the Technical Services table', expand: { table: 'techservices', times: 1 } },
      { roll: 10, text: 'Roll twice on the Power Services table', expand: { table: 'power', times: 2 } },
    ],
  },
]
export const serviceGroupById = (id) => SERVICE_GROUPS.find((s) => s.id === id) || null

// Resolve a single training roll on a group's table into a node:
//   { roll, table, grants, text, children:[ …resolved sub-rolls ] }
// "Roll twice on X" results auto-expand (recursively) into real rolls; their
// granted skills are nested in `children`. `ignore`/`ignoreFrom` re-roll banned
// results so loops terminate; a depth cap is a final backstop.
const d10roll = (rng) => 1 + Math.floor(rng() * 10)
function resolveOnTable(groupId, ignore, rng, depth) {
  const group = serviceGroupById(groupId)
  if (!group || depth > 8) return null
  let roll, guard = 0
  do { roll = d10roll(rng); guard++ } while (ignore && ignore.includes(roll) && guard < 60)
  const row = group.table.find((r) => r.roll === roll) || group.table[0]
  const node = { roll, table: groupId, grants: row.grants || null, text: row.text || null }
  if (row.expand) {
    const target = row.expand.table === 'this' ? groupId
      : row.expand.table === 'other' ? pickOtherGroup(groupId, rng)
      : row.expand.table
    let ig = row.expand.ignore || null
    if (row.expand.ignoreFrom) {
      ig = []
      for (let n = row.expand.ignoreFrom; n <= 10; n++) ig.push(n)
    }
    node.children = []
    for (let i = 0; i < row.expand.times; i++) {
      const child = resolveOnTable(target, ig, rng, depth + 1)
      if (child) node.children.push(child)
    }
  }
  return node
}
function pickOtherGroup(groupId, rng) {
  const others = SERVICE_GROUPS.filter((s) => s.id !== groupId)
  return others[Math.floor(rng() * others.length)].id
}
export function resolveTraining(groupId, rng = Math.random) {
  return resolveOnTable(groupId, null, rng, 0)
}

// Walk a resolved training node (and its children) accumulating skill ranks.
export function collectGrants(node, out = {}) {
  if (!node) return out
  for (const grant of node.grants || []) out[grant.skill] = (out[grant.skill] || 0) + (grant.ranks || 0)
  for (const child of node.children || []) collectGrants(child, out)
  return out
}

// ── SECRET SOCIETIES (d20, p. 77) ───────────────────────────────────────────
export const SECRET_SOCIETIES = [
  'Anti-Mutant', 'Assembler of God', 'Communists', 'Computer Phreaks', 'Corpore Metallica',
  'Death Leopard', 'Frankenstein Destroyers', 'Free Enterprise', 'Illuminati', 'Mystics',
  'Politiclones', 'Pro Tech', 'Psion', 'PURGE', 'Romantics', 'Seal Club', 'Trekkers',
]
export const SECRET_SOCIETY_UNKNOWN = 'Unknown (you are a member, but don’t know it yet)'
// d20 → society name (18–20 = Unknown).
export function rollSociety(d20) {
  return d20 <= SECRET_SOCIETIES.length ? SECRET_SOCIETIES[d20 - 1] : SECRET_SOCIETY_UNKNOWN
}

// ── MUTANT POWERS (d20, p. 78) ──────────────────────────────────────────────
export const MUTANT_POWERS = [
  'Adrenaline Control', 'Charm', 'Deep Probe', 'Electroshock', 'Empathy', 'Energy Field',
  'Hypersenses', 'Levitation', 'Machine Empathy', 'Matter Eater', 'Mechanical Intuition',
  'Mental Blast', 'Polymorphism', 'Precognition', 'Pyrokinesis', 'Regeneration',
  'Telekinesis', 'Telepathy', 'Teleport', 'X-Ray Vision',
]

// ── SECURITY CLEARANCES (p. 21) ─────────────────────────────────────────────
export const CLEARANCES = [
  { letter: 'IR', name: 'Infrared', color: '#2b2b2b' },
  { letter: 'R', name: 'Red', color: '#c0392b' },
  { letter: 'O', name: 'Orange', color: '#d35400' },
  { letter: 'Y', name: 'Yellow', color: '#c9a800' },
  { letter: 'G', name: 'Green', color: '#27893b' },
  { letter: 'B', name: 'Blue', color: '#2a6fc0' },
  { letter: 'I', name: 'Indigo', color: '#4b3b9b' },
  { letter: 'V', name: 'Violet', color: '#7a3b9b' },
  { letter: 'U', name: 'Ultraviolet', color: '#6b5b95' },
]
export const clearanceByLetter = (l) => CLEARANCES.find((c) => c.letter === l) || CLEARANCES[1]

// ── CLONE NAME (pp. 20–21) ──────────────────────────────────────────────────
// Name = First-CLEARANCE-SECTOR-clone#  (Infrared has no clearance letter).
export function buildName({ firstName, clearance, sector, cloneNumber }) {
  const parts = [(firstName || '').trim() || '—']
  if (clearance && clearance !== 'IR') parts.push(clearance)
  parts.push((sector || '???').toUpperCase())
  parts.push(String(cloneNumber || 1))
  return parts.join('-')
}

const SAMPLE_FIRST = ['Lepp', 'Slip', 'Dead', 'Nev', 'Ready', 'Hyd', 'Mage', 'Bob', 'Whyn', 'Loo', 'Teela', 'Grul', 'Vex', 'Pyro', 'Snip']
const SECTOR_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)] }
// Random first name + 3-letter sector (clearance/clone left to the player).
export function randomNameParts(rng = Math.random) {
  const sector = Array.from({ length: 3 }, () => SECTOR_LETTERS[Math.floor(rng() * 26)]).join('')
  return { firstName: pick(SAMPLE_FIRST, rng), sector }
}

// ── EQUIPMENT (pp. 29–30) ───────────────────────────────────────────────────
// Standard Troubleshooter issue. The jumpsuit/barrel are tinted to the clone's
// security clearance (Red at start).
export const STANDARD_ISSUE = [
  'Jumpsuit (clearance-coloured)',
  'Undershirt, black',
  'Underwear, supposedly black',
  'Laser pistol',
  'Laser pistol barrel, Red (six shots per barrel)',
  'Boots, black',
]

// The Stuff Table (roll for one bonus item). Names transcribed from the rulebook.
export const STUFF = [
  'Bottle of Bouncy Bubble Beverage',
  'Happy-Happy Goofballs (life is good, life is fun, life is upside down)',
  'Superplastic knife',
  'Gummy Gun (looks real, tastes like syntheberry paste!)',
  'Bullhorn',
  'Fire extinguisher',
  'Watch',
  'Extra jumpsuit',
  'Extra boots',
  "SuperSoaper Hygiene Spray (one squirt and they're clean!)",
  'First aid kit',
  'UltraRubber Bouncy Ball (nearly 100% elasticity!)',
  'Bot repair kit',
  'Yo-Yo with super-long string',
  'Flashlight',
  'Dead rat (treasonous food?)',
  'Bake a Traitor, the Home Game',
  'Commie cap with laser holes in it (possibly treasonous)',
  'UltraHard Breakfast Muffin (guaranteed not to crumble apart)',
  'Gas mask (ah, but what gas?)',
  '50 plasticreds (buy your own stuff!)',
  'A "Get out of Jail Free" card ("Jail?" What is "Jail?")',
  '"Happiness is Mandatory" PR badge',
  '"I\'m With the Traitor" novelty button',
  'Happiness Energy Bar (yum!)',
  'Defective spring shoes (jump higher with them off)',
  'Freeze-dried bagel with synthecream cheese-like food product',
  "Jackobot (okay, it malfunctions, but it's yours!)",
  'SuperHot SuperLunch (are those noodles, or …)',
  'Hot-torch (like a blowtorch, but with a mini-laser beam)',
  'Mutant Wombat Detector Kit (it ain\'t beeping!)',
  'Equipment Requisition Form (blank, unauthorized)',
  'Termination Voucher (blank, unauthorized)',
  'Something you found under a FoodLyke distribution vat',
  'Picture of vidstar Teela-O-MLY (good luck charm)',
  'Appropriate Service Group "Flash" Patch',
  'Holster for laser pistol',
  'Stretchy Rubber Container (holds water or air)',
  'Desk plaque with name, clearance, and home sector',
  'Personal hygiene kit',
  '"I\'ve Got a Friend in the Computer" bot-bumper sticker',
  'Voucher for One Free Stupid Question (authorized by the Computer)',
  'Parachute (fully functioning? Maybe)',
  'SuperSafety Goggles (completely opaque)',
  'Plasticord (10 meters of syntherope)',
  "HPD&MC's Creche Program Guide",
  "The Computer's handbook, Why I'm in Charge and You're Not (audiodisk)",
  'Utility belt',
  'Gloves with fingers cut out',
  'Smoke alarm',
  'Smiley-face button ("Happiness is Really Mandatory!")',
  'DIN Sector cafeteria menu from four yearcycles ago (still current!)',
  'Troubleshooter Songbook and Phrase Guide',
  'A newly-reedited version of War and Peace (two pages of text…)',
  'SuperGum',
  'SuperSolvent',
  'HandiCam Vidlink (lens missing)',
  "Spackle (there's a helluva lot of it here!)",
  'One Dose of Ultra Vaccine and Pet Spray',
  'Official Troubleshooter Bill-O-DAL Thermos and Lunch Pail',
  'Something treasonous (Gamemaster\'s option)',
  'Something useful (Gamemaster\'s option)',
]
export function rollStuff(rng = Math.random) {
  return STUFF[Math.floor(rng() * STUFF.length)]
}
