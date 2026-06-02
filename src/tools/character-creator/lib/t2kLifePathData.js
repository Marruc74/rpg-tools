// Twilight: 2000 (4E) — life path character-generation data (Player's Manual
// pp. 31–40). Skill and specialty ids match those in t2kData.js.
import { rankIndex } from './t2kData.js'

export const GENERAL_SKILLS = ['stamina', 'mobility', 'driving'] // always available as increases
export const START_AGE = 18

// Childhood (D6): pick one of three skills (at D) + a D6 specialty.
export const CHILDHOODS = [
  { id: 'street-kid', name: 'Street Kid', skills: ['close-combat', 'mobility', 'recon'], specialties: ['brawler', 'melee', 'runner', 'infiltrator', 'scrounger', 'locksmith'] },
  { id: 'small-town', name: 'Small Town', skills: ['driving', 'ranged-combat', 'survival'], specialties: ['biker', 'racer', 'sniper', 'farmer', 'hunter', 'quartermaster'] },
  { id: 'working-class', name: 'Working Class', skills: ['close-combat', 'stamina', 'tech'], specialties: ['brawler', 'builder', 'load-carrier', 'scrounger', 'blacksmith', 'mechanic'] },
  { id: 'intellectual', name: 'Intellectual', skills: ['tech', 'medical-aid', 'persuasion'], specialties: ['historian', 'communications', 'computers', 'scientist', 'linguist', 'musician'] },
  { id: 'military-family', name: 'Military Family', skills: ['stamina', 'mobility', 'ranged-combat'], specialties: ['brawler', 'martial-artist', 'ranger', 'mountaineer', 'runner', 'rifleman'] },
  { id: 'affluence', name: 'Affluence', skills: ['mobility', 'command', 'persuasion'], specialties: ['boatman', 'rider', 'runner', 'linguist', 'musician', 'trader'] },
]
export const childhoodById = (id) => CHILDHOODS.find((c) => c.id === id) || null

// Requirement helpers operating on a context built during derivation.
const at = (letter, min) => rankIndex(letter || 'C') >= rankIndex(min)
const noD = (attrs) => Object.values(attrs).every((v) => v !== 'D')

export const CATEGORIES = [
  { id: 'military', name: 'Military Service' },
  { id: 'police', name: 'Police' },
  { id: 'crime', name: 'Crime' },
  { id: 'intelligence', name: 'Intelligence' },
  { id: 'blue-collar', name: 'Blue Collar' },
  { id: 'education', name: 'Education' },
  { id: 'white-collar', name: 'White Collar' },
]

// Each career: skills it can raise, a D6 specialty table, gear, a human-readable
// requirement, and a soft reqCheck(ctx) where ctx = { attrs, careerIds, categories,
// eduSciences, eduLiberal }.
export const CAREERS = [
  // ── Military (intel-equivalent CUF gain via military flag) ──
  {
    id: 'combat-arms', name: 'Combat Arms', category: 'military', military: true, startingRank: 'Private',
    req: 'STR or AGL B+', reqCheck: (c) => at(c.attrs.STR, 'B') || at(c.attrs.AGL, 'B'),
    skills: ['close-combat', 'heavy-weapons', 'ranged-combat', 'recon'],
    specialties: ['rifleman', 'redleg', 'tanker', 'machinegunner', 'launcher-crew', 'combat-engineer'],
    gear: ['Assault rifle, LMG or ATRL', 'D6 reloads', 'Flak jacket and helmet', 'Knife or D6 hand grenades', 'Personal medkit', 'Backpack'],
  },
  {
    id: 'combat-support', name: 'Combat Support', category: 'military', military: true, startingRank: 'Private First Class',
    req: 'INT B+', reqCheck: (c) => at(c.attrs.INT, 'B'),
    skills: ['recon', 'survival', 'tech'],
    specialties: ['intelligence', 'linguist', 'communications', 'nbc', 'psy-ops', 'interrogator'],
    gear: ['Assault rifle', 'D6 reloads', 'Flak jacket and helmet', 'Knife or D6 hand grenades', 'Personal medkits', 'MOPP suit or manpack radio', 'Backpack'],
  },
  {
    id: 'combat-service-support', name: 'Combat Service Support', category: 'military', military: true, startingRank: 'Private First Class',
    req: 'None', reqCheck: () => true,
    skills: ['medical-aid', 'tech'],
    specialties: ['mechanic', 'gunsmith', 'electrician', 'computers', 'combat-medic', 'field-surgeon'],
    gear: ['Assault rifle', 'D6 reloads', 'Flak jacket and helmet', 'Knife or D6 hand grenades', 'Personal medkit', 'Basic tools', 'Vehicle/weapon/surgical tools', 'Backpack'],
  },
  {
    id: 'special-operations', name: 'Special Operations', category: 'military', military: true, startingRank: 'Sergeant',
    req: 'STR & AGL B+, INT C+, ≥1 term Combat Arms',
    reqCheck: (c) => at(c.attrs.STR, 'B') && at(c.attrs.AGL, 'B') && at(c.attrs.INT, 'C') && c.careerIds.includes('combat-arms'),
    skills: ['close-combat', 'ranged-combat', 'recon', 'survival'],
    specialties: ['paratrooper', 'ranger', 'infiltrator', 'combat-awareness', 'sniper', 'sere-training'],
    gear: ['Assault rifle or sniper rifle', 'Any pistol, D6 grenades or rifle GL', 'D6 reloads for each weapon', 'Binoculars or night vision goggles', 'Flak jacket and helmet', 'Knife', 'Personal medkit', 'Backpack'],
  },
  {
    id: 'officer', name: 'Officer', category: 'military', military: true, startingRank: '2nd Lieutenant',
    req: 'INT B+, no D attribute, ≥1 term Education',
    reqCheck: (c) => at(c.attrs.INT, 'B') && noD(c.attrs) && c.categories.includes('education'),
    skills: ['ranged-combat', 'command', 'persuasion'],
    specialties: ['sidearms', 'intelligence', 'tactician', 'logistician', 'frontline-leader', 'quartermaster'],
    gear: ['Pistol or submachine gun', 'D6 reloads', 'Manpack radio or night vision goggles', 'Flak jacket', 'Knife or D6 hand grenades', 'Personal medkit'],
  },
  // ── Police ──
  {
    id: 'police-officer', name: 'Police Officer', category: 'police', startingRank: null,
    req: 'No D attribute, no terms in prison', reqCheck: (c) => noD(c.attrs) && !c.careerIds.includes('prisoner'),
    skills: ['close-combat', 'ranged-combat'],
    specialties: ['sidearms', 'melee', 'runner', 'racer', 'biker', 'scout'],
    gear: ['Pistol', 'D6 reloads', 'Handcuffs', 'Baton (club)', 'Patrol car (½ tank of gasoline)'],
  },
  {
    id: 'detective', name: 'Detective', category: 'police',
    req: 'EMP B+, ≥1 term as Police Officer', reqCheck: (c) => at(c.attrs.EMP, 'B') && c.careerIds.includes('police-officer'),
    skills: ['ranged-combat', 'recon', 'persuasion'],
    specialties: ['infiltrator', 'interrogator', 'intelligence', 'investigator', 'locksmith', 'linguist'],
    gear: ['Pistol', 'D6 reloads', 'Lockpicks'],
  },
  {
    id: 'swat', name: 'SWAT', category: 'police',
    req: 'STR & AGL B+, ≥1 term as Police Officer', reqCheck: (c) => at(c.attrs.STR, 'B') && at(c.attrs.AGL, 'B') && c.careerIds.includes('police-officer'),
    skills: ['close-combat', 'ranged-combat', 'recon'],
    specialties: ['martial-artist', 'rifleman', 'sniper', 'combat-awareness', 'infiltrator', 'scout'],
    gear: ['Assault rifle or submachine gun', 'D6 reloads', 'Night vision goggles', 'Flak jacket and helmet', 'Knife', 'Personal medkit'],
  },
  // ── Crime (odd D6 after a crime term with no war → prison next term) ──
  {
    id: 'gang-member', name: 'Gang Member', category: 'crime',
    req: 'STR & AGL C+', reqCheck: (c) => at(c.attrs.STR, 'C') && at(c.attrs.AGL, 'C'),
    skills: ['close-combat', 'ranged-combat'],
    specialties: ['brawler', 'melee', 'killer', 'martial-artist', 'rifleman', 'sidearms'],
    gear: ['Any civilian firearm', 'D6 reloads', 'Knife'],
  },
  {
    id: 'burglar', name: 'Burglar', category: 'crime',
    req: 'AGL & INT C+', reqCheck: (c) => at(c.attrs.AGL, 'C') && at(c.attrs.INT, 'C'),
    skills: ['recon'],
    specialties: ['brawler', 'sidearms', 'mountaineer', 'infiltrator', 'electrician', 'locksmith'],
    gear: ['Pistol or revolver', 'D6 reloads', 'Lockpick set (TECH +2)'],
  },
  {
    id: 'hustler', name: 'Hustler', category: 'crime',
    req: 'INT & EMP C+', reqCheck: (c) => at(c.attrs.INT, 'C') && at(c.attrs.EMP, 'C'),
    skills: ['recon', 'persuasion'],
    specialties: ['sidearms', 'infiltrator', 'scout', 'interrogator', 'psy-ops', 'trader'],
    gear: ['Pistol or revolver', 'D6 reloads'],
  },
  {
    id: 'prisoner', name: 'Prisoner', category: 'crime',
    req: 'None', reqCheck: () => true,
    skills: ['close-combat'],
    specialties: ['brawler', 'melee', 'killer', 'ranger', 'sere-training', 'scrounger'],
    gear: ['Any civilian firearm', 'D6 reloads', 'Knife'],
  },
  // ── Intelligence (counts as military for CUF gain) ──
  {
    id: 'agent', name: 'Agent', category: 'intelligence', intel: true,
    req: 'INT B+, ≥1 term in Education', reqCheck: (c) => at(c.attrs.INT, 'B') && c.categories.includes('education'),
    skills: ['ranged-combat', 'recon', 'persuasion'],
    specialties: ['intelligence', 'locksmith', 'investigator', 'scout', 'psy-ops', 'sidearms'],
    gear: ['Pistol', 'D6 reloads', 'Lockpick set', 'Knife or explosives', 'Personal medkit'],
  },
  {
    id: 'assassin', name: 'Assassin', category: 'intelligence', intel: true,
    req: 'EMP C or D, AGL B+, ≥1 term as Agent', reqCheck: (c) => (c.attrs.EMP === 'C' || c.attrs.EMP === 'D') && at(c.attrs.AGL, 'B') && c.careerIds.includes('agent'),
    skills: ['close-combat', 'ranged-combat'],
    specialties: ['killer', 'interrogator', 'sniper', 'martial-artist', 'improvised-munitions', 'infiltrator'],
    gear: ['Sniper rifle or submachine gun (suppressed)', 'D6 reloads', 'Radio or binoculars', 'Knife or explosives', 'Personal medkit'],
  },
  {
    id: 'paramilitary', name: 'Paramilitary', category: 'intelligence', intel: true,
    req: 'STR & AGL B+, ≥1 military term', reqCheck: (c) => at(c.attrs.STR, 'B') && at(c.attrs.AGL, 'B') && c.categories.includes('military'),
    skills: ['heavy-weapons', 'ranged-combat', 'survival'],
    specialties: ['brawler', 'rifleman', 'machinegunner', 'combat-engineer', 'improvised-munitions', 'tactician'],
    gear: ['Assault rifle, LMG or ATRL', 'D6 reloads', 'Knife or D6 hand grenades', 'Personal medkit'],
  },
  // ── Blue Collar ──
  {
    id: 'driver', name: 'Driver', category: 'blue-collar',
    req: 'AGL B+', reqCheck: (c) => at(c.attrs.AGL, 'B'),
    skills: ['tech'],
    specialties: ['biker', 'boatman', 'navigator', 'pilot', 'racer', 'tanker'],
    gear: ['Any civilian firearm', 'D3 reloads', 'Any civilian car or truck', 'Vehicle tools'],
  },
  {
    id: 'farmer', name: 'Farmer', category: 'blue-collar',
    req: 'None', reqCheck: () => true,
    skills: ['survival'],
    specialties: ['cook', 'farmer', 'fisher', 'hunter', 'forager', 'rider'],
    gear: ['Any civilian firearm', 'D3 reloads', 'Pickup truck', 'Basic toolkit', '2D6 rations of food'],
  },
  {
    id: 'mechanic', name: 'Mechanic', category: 'blue-collar',
    req: 'None', reqCheck: () => true,
    skills: ['tech'],
    specialties: ['blacksmith', 'gunsmith', 'locksmith', 'mechanic', 'scrounger', 'improvised-munitions'],
    gear: ['Any civilian firearm', 'D3 reloads', 'Pickup truck', 'Basic tools', 'Vehicle tools or weapon tools'],
  },
  {
    id: 'construction', name: 'Construction', category: 'blue-collar',
    req: 'STR B+', reqCheck: (c) => at(c.attrs.STR, 'B'),
    skills: ['close-combat', 'tech'],
    specialties: ['brawler', 'builder', 'load-carrier', 'blacksmith', 'electrician', 'improvised-munitions'],
    gear: ['Any civilian firearm', 'D3 reloads', 'Crowbar', 'Pickup truck', 'Basic tools'],
  },
  // ── Education ──
  {
    id: 'liberal-arts', name: 'Liberal Arts', category: 'education',
    req: 'INT & EMP C+', reqCheck: (c) => at(c.attrs.INT, 'C') && at(c.attrs.EMP, 'C'),
    skills: ['persuasion'],
    specialties: ['historian', 'cook', 'linguist', 'musician', 'psy-ops', 'counselor'],
    gear: ['Any civilian firearm', 'D3 reloads', 'Dictionary in any language', 'Bicycle'],
  },
  {
    id: 'sciences', name: 'Sciences', category: 'education',
    req: 'INT B+', reqCheck: (c) => at(c.attrs.INT, 'B'),
    skills: ['tech'],
    specialties: ['chemist', 'communications', 'computers', 'electrician', 'scientist', 'linguist'],
    gear: ['Any civilian firearm', 'D3 reloads', 'Bicycle or 2WD car (½ tank)'],
  },
  // ── White Collar ──
  {
    id: 'doctor', name: 'Doctor', category: 'white-collar',
    req: 'Two terms Education (Sciences), EMP B+', reqCheck: (c) => c.eduSciences >= 2 && at(c.attrs.EMP, 'B'),
    skills: ['medical-aid', 'persuasion'],
    specialties: ['linguist', 'combat-medic', 'counselor', 'field-surgeon', 'general-practitioner', 'veterinarian'],
    gear: ['Any civilian firearm', 'D3 reloads', 'D6 personal medkits', 'Pain relievers', 'Surgical instruments'],
  },
  {
    id: 'professor', name: 'Professor', category: 'white-collar',
    req: 'Two terms Education (Liberal Arts), INT B+', reqCheck: (c) => c.eduLiberal >= 2 && at(c.attrs.INT, 'B'),
    skills: ['persuasion'],
    specialties: ['historian', 'chemist', 'scientist', 'linguist', 'psy-ops', 'teacher'],
    gear: ['Any civilian firearm', 'D3 reloads', '2WD car (½ tank)'],
  },
  {
    id: 'manager', name: 'Manager', category: 'white-collar',
    req: 'One term Education (any), EMP B+', reqCheck: (c) => c.categories.includes('education') && at(c.attrs.EMP, 'B'),
    skills: ['tech', 'command', 'persuasion'],
    specialties: ['quartermaster', 'computers', 'frontline-leader', 'logistician', 'teacher', 'counselor'],
    gear: ['Any civilian firearm', 'D3 reloads', 'Pocket calculator', '2WD car (½ tank)'],
  },
]
export const careerById = (id) => CAREERS.find((c) => c.id === id) || null

// At War final specialty (D6), column by the type of your most recent career.
export const AT_WAR_SPECIALTIES = {
  military: ['brawler', 'ranger', 'nbc', 'rifleman', 'scrounger', 'improvised-munitions'],
  'blue-collar': ['brawler', 'rider', 'runner', 'quartermaster', 'gunsmith', 'mechanic'],
  'white-collar': ['scout', 'fisher', 'forager', 'scrounger', 'frontline-leader', 'interrogator'],
  other: ['racer', 'hunter', 'forager', 'quartermaster', 'scrounger', 'improvised-munitions'],
}
// Map a career's category to the At War column key.
export function atWarColumn(category) {
  if (category === 'military') return 'military'
  if (category === 'blue-collar') return 'blue-collar'
  if (category === 'white-collar') return 'white-collar'
  return 'other'
}

// ── GROUP GEAR & VEHICLE (Player's Manual p.18) ─────────────────────────────
// The team picks a number of group items equal to the number of PCs.
export const GROUP_GEAR = [
  'Backpack',
  'Any bow including D6 arrows',
  'Any pistol or shotgun including D3 reloads',
  'Any sniper or hunting rifle including D3 reloads',
  'Any LMG/GPMG including one ammo belt',
  'Any GL or ATRL (D3 reloads if applicable)',
  'D6 magazines/reloads for any weapon',
  'Two ammo belts for any machinegun',
  'D6 reloads for any grenade or rocket launcher',
  'D6 hand grenades of any type',
  'Dirt bike with half a tank of fuel',
  'Basic toolkit',
  'Binoculars',
  'D100 liters of any fuel, in jerrycans',
  'D6 personal medkits',
  'D6 rations of food',
  'D6 rations of clean water',
]

// Starting vehicle: roll 2D6 and add the number of PCs.
const VEHICLE_TABLE = [
  { max: 6, vehicle: 'None' },
  { max: 8, vehicle: '2WD car' },
  { max: 10, vehicle: 'Pickup truck' },
  { max: 12, vehicle: 'Jeep or HMMWV' },
  { max: 14, vehicle: 'Armored Personnel Carrier' },
  { max: 99, vehicle: 'Main Battle Tank' },
]
export function rollVehicle(partySize = 1, rng = Math.random) {
  const total = (1 + Math.floor(rng() * 6)) + (1 + Math.floor(rng() * 6)) + (partySize || 0)
  const row = VEHICLE_TABLE.find((r) => total <= r.max) || VEHICLE_TABLE[VEHICLE_TABLE.length - 1]
  return { total, vehicle: row.vehicle }
}
