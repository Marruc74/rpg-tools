// Twilight: 2000 (4th edition, Free League) — character-creation data, archetype
// method (Player's Manual, chapter 2 "Player Characters", pp. 14–31, and the
// skills/specialties list, chapter 3, pp. 44–52).

// ── ATTRIBUTES & RATINGS ────────────────────────────────────────────────────
// Ratings A–D map to die types D12/D10/D8/D6. Skills add an "F" (untrained).
export const RANKS = ['A', 'B', 'C', 'D'] // attribute / CUF scale (best → worst)
export const SKILL_RANKS = ['A', 'B', 'C', 'D', 'F'] // skills can also be F (untrained)
export const DIE = { A: 12, B: 10, C: 8, D: 6, F: 0 }
export const RANK_DESC = { A: 'Extraordinary', B: 'Capable', C: 'Average', D: 'Feeble' }
export const SKILL_RANK_DESC = { A: 'Elite', B: 'Veteran', C: 'Experienced', D: 'Novice', F: 'Untrained' }
export const rankIndex = (r) => ({ A: 3, B: 2, C: 1, D: 0 }[r] ?? 1) // higher = better

export const ATTRIBUTES = [
  { key: 'STR', name: 'Strength', desc: 'Muscle power, toughness, and physical endurance.' },
  { key: 'AGL', name: 'Agility', desc: 'Body control, speed, and fine motor skills.' },
  { key: 'INT', name: 'Intelligence', desc: 'Perception, intellect, and mental stability.' },
  { key: 'EMP', name: 'Empathy', desc: 'Charisma, amiability, and emotional stability.' },
]
export const ATTR_KEYS = ATTRIBUTES.map((a) => a.key)
export const BASE_INCREASES = 3 // increases from the C baseline

// Hit capacity = (STR die + AGL die) / 4 ↑;  Stress = (INT die + EMP die) / 4 ↑.
export const hitCapacity = (attrs) => Math.ceil((DIE[attrs.STR] + DIE[attrs.AGL]) / 4)
export const stressCapacity = (attrs) => Math.ceil((DIE[attrs.INT] + DIE[attrs.EMP]) / 4)

// ── CORE SKILLS (12) ────────────────────────────────────────────────────────
export const SKILLS = [
  { id: 'close-combat', name: 'Close Combat', attr: 'STR' },
  { id: 'heavy-weapons', name: 'Heavy Weapons', attr: 'STR' },
  { id: 'stamina', name: 'Stamina', attr: 'STR' },
  { id: 'driving', name: 'Driving', attr: 'AGL' },
  { id: 'ranged-combat', name: 'Ranged Combat', attr: 'AGL' },
  { id: 'mobility', name: 'Mobility', attr: 'AGL' },
  { id: 'recon', name: 'Recon', attr: 'INT' },
  { id: 'survival', name: 'Survival', attr: 'INT' },
  { id: 'tech', name: 'Tech', attr: 'INT' },
  { id: 'command', name: 'Command', attr: 'EMP' },
  { id: 'medical-aid', name: 'Medical Aid', attr: 'EMP' },
  { id: 'persuasion', name: 'Persuasion', attr: 'EMP' },
]
export const skillById = (id) => SKILLS.find((s) => s.id === id) || null
// The required starting spread: one B, two C, three D (archetype method, step 7).
export const SKILL_SPREAD = { B: 1, C: 2, D: 3 }

// ── SPECIALTIES (by skill, pp. 50–52) ───────────────────────────────────────
export const SPECIALTIES = [
  // Close Combat
  { id: 'brawler', name: 'Brawler', skill: 'close-combat' },
  { id: 'melee', name: 'Melee', skill: 'close-combat' },
  { id: 'killer', name: 'Killer', skill: 'close-combat' },
  { id: 'martial-artist', name: 'Martial Artist', skill: 'close-combat' },
  // Heavy Weapons
  { id: 'machinegunner', name: 'Machinegunner', skill: 'heavy-weapons' },
  { id: 'launcher-crew', name: 'Launcher Crew', skill: 'heavy-weapons' },
  { id: 'redleg', name: 'Redleg', skill: 'heavy-weapons' },
  { id: 'vehicle-gunner', name: 'Vehicle Gunner', skill: 'heavy-weapons' },
  // Stamina
  { id: 'builder', name: 'Builder', skill: 'stamina' },
  { id: 'load-carrier', name: 'Load Carrier', skill: 'stamina' },
  { id: 'nbc', name: 'NBC', skill: 'stamina' },
  { id: 'ranger', name: 'Ranger', skill: 'stamina' },
  { id: 'sere-training', name: 'SERE Training', skill: 'stamina' },
  // Driving
  { id: 'biker', name: 'Biker', skill: 'driving' },
  { id: 'boatman', name: 'Boatman', skill: 'driving' },
  { id: 'pilot', name: 'Pilot', skill: 'driving' },
  { id: 'racer', name: 'Racer', skill: 'driving' },
  { id: 'tanker', name: 'Tanker', skill: 'driving' },
  // Mobility
  { id: 'diver', name: 'Diver', skill: 'mobility' },
  { id: 'mountaineer', name: 'Mountaineer', skill: 'mobility' },
  { id: 'paratrooper', name: 'Paratrooper', skill: 'mobility' },
  { id: 'pitcher', name: 'Pitcher', skill: 'mobility' },
  { id: 'rider', name: 'Rider', skill: 'mobility' },
  { id: 'runner', name: 'Runner', skill: 'mobility' },
  // Ranged Combat
  { id: 'archer', name: 'Archer', skill: 'ranged-combat' },
  { id: 'reloader', name: 'Reloader', skill: 'ranged-combat' },
  { id: 'rifleman', name: 'Rifleman', skill: 'ranged-combat' },
  { id: 'sidearms', name: 'Sidearms', skill: 'ranged-combat' },
  { id: 'sniper', name: 'Sniper', skill: 'ranged-combat' },
  // Recon
  { id: 'combat-awareness', name: 'Combat Awareness', skill: 'recon' },
  { id: 'forward-observer', name: 'Forward Observer', skill: 'recon' },
  { id: 'historian', name: 'Historian', skill: 'recon' },
  { id: 'infiltrator', name: 'Infiltrator', skill: 'recon' },
  { id: 'intelligence', name: 'Intelligence', skill: 'recon' },
  { id: 'investigator', name: 'Investigator', skill: 'recon' },
  { id: 'scout', name: 'Scout', skill: 'recon' },
  // Survival
  { id: 'cook', name: 'Cook', skill: 'survival' },
  { id: 'farmer', name: 'Farmer', skill: 'survival' },
  { id: 'fisher', name: 'Fisher', skill: 'survival' },
  { id: 'forager', name: 'Forager', skill: 'survival' },
  { id: 'navigator', name: 'Navigator', skill: 'survival' },
  { id: 'hunter', name: 'Hunter', skill: 'survival' },
  { id: 'quartermaster', name: 'Quartermaster', skill: 'survival' },
  { id: 'scrounger', name: 'Scrounger', skill: 'survival' },
  // Tech
  { id: 'blacksmith', name: 'Blacksmith', skill: 'tech' },
  { id: 'chemist', name: 'Chemist', skill: 'tech' },
  { id: 'combat-engineer', name: 'Combat Engineer', skill: 'tech' },
  { id: 'communications', name: 'Communications', skill: 'tech' },
  { id: 'computers', name: 'Computers', skill: 'tech' },
  { id: 'electrician', name: 'Electrician', skill: 'tech' },
  { id: 'gunsmith', name: 'Gunsmith', skill: 'tech' },
  { id: 'improvised-munitions', name: 'Improvised Munitions', skill: 'tech' },
  { id: 'locksmith', name: 'Locksmith', skill: 'tech' },
  { id: 'mechanic', name: 'Mechanic', skill: 'tech' },
  { id: 'scientist', name: 'Scientist', skill: 'tech' },
  // Command
  { id: 'frontline-leader', name: 'Frontline Leader', skill: 'command' },
  { id: 'logistician', name: 'Logistician', skill: 'command' },
  { id: 'tactician', name: 'Tactician', skill: 'command' },
  // Medical Aid
  { id: 'combat-medic', name: 'Combat Medic', skill: 'medical-aid' },
  { id: 'counselor', name: 'Counselor', skill: 'medical-aid' },
  { id: 'field-surgeon', name: 'Field Surgeon', skill: 'medical-aid' },
  { id: 'general-practitioner', name: 'General Practitioner', skill: 'medical-aid' },
  { id: 'veterinarian', name: 'Veterinarian', skill: 'medical-aid' },
  // Persuasion
  { id: 'linguist', name: 'Linguist', skill: 'persuasion' },
  { id: 'musician', name: 'Musician', skill: 'persuasion' },
  { id: 'interrogator', name: 'Interrogator', skill: 'persuasion' },
  { id: 'psy-ops', name: 'Psy Ops', skill: 'persuasion' },
  { id: 'teacher', name: 'Teacher', skill: 'persuasion' },
  { id: 'trader', name: 'Trader', skill: 'persuasion' },
]
export const specialtyById = (id) => SPECIALTIES.find((s) => s.id === id) || null

// ── NATIONALITIES ───────────────────────────────────────────────────────────
// Nationality affects language and starting gear only (p. 15).
export const NATIONALITIES = [
  { id: 'american', name: 'American', language: 'English' },
  { id: 'polish', name: 'Polish', language: 'Polish' },
  { id: 'soviet', name: 'Soviet', language: 'Russian' },
  { id: 'swedish', name: 'Swedish', language: 'Swedish' },
  { id: 'local', name: 'Other / Local', language: 'Native language' },
]
export const nationalityById = (id) => NATIONALITIES.find((n) => n.id === id) || null

// ── ARCHETYPES (pp. 22–31) ──────────────────────────────────────────────────
// keyAttr: the recommended key attribute. keySkills: the skills your one B-level
// skill must be chosen from. cuf: starting Coolness Under Fire. rank: null, or a
// D6 table [[min,max,name],…]. specialties: recommended specialty ids.
export const ARCHETYPES = [
  {
    id: 'civilian', name: 'The Civilian', keyAttr: 'EMP', cuf: 'D',
    keySkills: ['driving', 'survival', 'persuasion'],
    branches: ['Blue Collar', 'White Collar'], rank: null,
    specialties: ['chemist', 'cook', 'hunter'],
    nicknames: ['Duck', 'Izzy', 'Easy Ice'],
    blurb: 'You had no say in this war. Your old life is over — now you are one thing: a survivor.',
    gear: ['Any civilian firearm', 'D3 reloads', 'Knife or binoculars', 'Basic toolset or dirt bike (½ tank)', 'D6 rations domestic food', 'D6 rations clean water', 'D6 rounds ammo (currency)'],
  },
  {
    id: 'grunt', name: 'The Grunt', keyAttr: 'STR', cuf: 'C',
    keySkills: ['close-combat', 'stamina', 'ranged-combat'],
    branches: ['Army', 'Marine'], rank: [[1, 2, 'Private'], [3, 4, 'Private First Class'], [5, 5, 'Corporal'], [6, 6, 'Sergeant']],
    specialties: ['load-carrier', 'ranger', 'rifleman'],
    nicknames: ['Sledgehammer', 'SNAFU', 'Oddball'],
    blurb: 'A ground-pounder humping 30 kilos of gear to hell and back, hoping to stay alive.',
    gear: ['Assault rifle (by nationality)', 'D6 reloads', 'Flak jacket and helmet', 'Knife or D6 hand grenades', 'Personal medkit', 'Fatigues', 'Backpack', 'D6 field rations', 'D6 rations clean water'],
  },
  {
    id: 'gunner', name: 'The Gunner', keyAttr: 'STR', cuf: 'C',
    keySkills: ['heavy-weapons', 'driving', 'ranged-combat'],
    branches: ['Army', 'Marine'], rank: [[1, 3, 'Private'], [4, 5, 'Private First Class'], [6, 6, 'Corporal']],
    specialties: ['launcher-crew', 'machinegunner', 'redleg'],
    nicknames: ['Pig', "Rock 'n Roll", 'Buzzer'],
    blurb: 'You got the big gun. You lay down a curtain of lead for your team.',
    gear: ['Light machine gun (by nationality)', 'D6 ammo belts', 'D6 hand grenades or ATRL w/ D3 rounds', 'Flak jacket and helmet', 'Knife', 'Personal medkit', 'Fatigues', 'Backpack', 'D6 field rations', 'D6 rations clean water'],
  },
  {
    id: 'kid', name: 'The Kid', keyAttr: 'AGL', cuf: 'D',
    keySkills: ['stamina', 'mobility', 'survival'],
    branches: [], rank: null,
    specialties: ['archer', 'runner', 'scrounger'],
    nicknames: ['Dime Bag', 'Shorty', '“Kid”'],
    blurb: 'You never had a chance to grow up. The adults destroyed it all. Now it’s up to you.',
    gear: ['Bow, pipe gun or zip gun', 'D3 reloads', 'Knife', 'D6 rations domestic food', 'D6 rations clean water', 'D6 rounds ammo (currency)'],
  },
  {
    id: 'mechanic', name: 'The Mechanic', keyAttr: 'INT', cuf: 'D',
    keySkills: ['stamina', 'driving', 'tech'],
    branches: ['Army', 'Marine', 'Navy', 'Blue Collar'], rank: [[1, 1, 'Private'], [2, 3, 'Private First Class'], [4, 6, 'Specialist']],
    specialties: ['combat-engineer', 'gunsmith', 'mechanic'],
    nicknames: ['Grease Monkey (Monk)', 'Daytona', 'Clutch'],
    blurb: 'A natural grease monkey. The unit relies on you to keep the machines running.',
    gear: ['Assault rifle (by nationality)', 'D6 reloads', 'Flak jacket and helmet', 'Knife or D6 hand grenades', 'Personal medkit', 'Basic tools', 'Vehicle tools or weapon tools', 'Fatigues', 'Backpack', 'D6 field rations', 'D6 rations clean water'],
  },
  {
    id: 'medic', name: 'The Medic', keyAttr: 'EMP', cuf: 'C',
    keySkills: ['stamina', 'medical-aid', 'persuasion'],
    branches: ['Army', 'Marine', 'White Collar'], rank: [[1, 1, 'Private First Class'], [2, 3, 'Specialist'], [4, 6, 'Sergeant']],
    specialties: ['combat-medic', 'field-surgeon', 'general-practitioner'],
    nicknames: ['Doc', 'Tex', 'Bones'],
    blurb: 'You triage — on the field, in life. You try to heal in the face of complete absurdity.',
    gear: ['Pistol or SMG (by nationality)', 'D6 reloads', 'Flak jacket and helmet', 'Knife or D6 hand grenades', 'D6 personal medkits', 'Pain relievers or surgical instruments', 'Fatigues', 'Backpack', 'D6 field rations', 'D6 rations clean water'],
  },
  {
    id: 'officer', name: 'The Officer', keyAttr: 'EMP', cuf: 'C',
    keySkills: ['ranged-combat', 'command', 'persuasion'],
    branches: ['Army', 'Marine', 'Navy', 'Police'], rank: [[1, 3, 'Lieutenant'], [4, 5, 'Captain'], [6, 6, 'Major']],
    specialties: ['intelligence', 'sidearms', 'tactician'],
    nicknames: ['Skipper', 'CO', 'El-Tee'],
    blurb: 'The men and women under your command depend on you. You remain apart, and keep them alive.',
    gear: ['Pistol or SMG (by nationality)', 'D6 reloads', 'Radio (manpack) or night vision goggles', 'Flak jacket', 'Knife or D6 hand grenades', 'Personal medkit', 'Fatigues', 'D6 field rations', 'D6 rations clean water'],
  },
  {
    id: 'operator', name: 'The Operator', keyAttr: 'AGL', cuf: 'B',
    keySkills: ['ranged-combat', 'recon', 'survival'],
    branches: ['Army', 'Marine', 'Navy', 'Intelligence Services', 'Police'], rank: [[1, 3, 'Staff Sergeant'], [4, 5, 'Sergeant First Class'], [6, 6, 'Master Sergeant']],
    specialties: ['combat-awareness', 'infiltrator', 'sniper'],
    nicknames: ['Hat Trick', 'Tex', 'Jack Rabbit'],
    blurb: 'You are the elite — trained in every kind of operation, from raids to capturing high-value targets.',
    gear: ['Any assault rifle or sniper rifle', 'Any pistol, D6 hand grenades or rifle GL', 'D6 reloads for each weapon', 'Binoculars or night vision goggles', 'Flak jacket and helmet', 'Knife', 'Personal medkit', 'Fatigues', 'Backpack', 'D6 field rations', 'D6 rations clean water'],
  },
  {
    id: 'spook', name: 'The Spook', keyAttr: 'INT', cuf: 'B',
    keySkills: ['ranged-combat', 'recon', 'persuasion'],
    branches: ['Intelligence'], rank: null,
    specialties: ['intelligence', 'killer', 'psy-ops'],
    nicknames: ['Sparrow', 'Hadrian', 'Blue Angel'],
    blurb: 'Your Cold War went hot. You fall back on tradecraft to survive — the spy game isn’t over.',
    gear: ['Any pistol', 'D6 reloads', 'Radio (manpack) or binoculars', 'Knife or D6 units of explosives', 'Personal medkit', 'D6 rations domestic food', 'D6 rations clean water'],
  },
]
export const archetypeById = (id) => ARCHETYPES.find((a) => a.id === id) || null

// Roll a D6 rank on an archetype's rank table.
export function rollRank(rankTable, rng = Math.random) {
  if (!rankTable) return null
  const r = 1 + Math.floor(rng() * 6)
  const row = rankTable.find(([min, max]) => r >= min && r <= max)
  return row ? row[2] : null
}
export const rankOptions = (rankTable) => (rankTable ? [...new Set(rankTable.map((r) => r[2]))] : [])
