// Warhammer Fantasy Roleplay 4th Edition (Cubicle 7) — character-creation data.
// Transcribed from the WFRP 4e rulebook, character-creation chapter (pp. 24–43)
// and the Class & Careers chapter (pp. 46–116). Species characteristic values and
// the Fate/Resilience/Movement table were verified against the rulebook's
// Attributes Table (p. 33).
//
// Expanded with Up in Arms (Cubicle 7, 2022): 15 new careers (New Careers table
// p. 9; career spreads pp. 10–22, 31–37, 44–48 and 78) and the Quartermaster's
// Store equipment tables (pp. 88–102). Expansion careers carry `book`, a
// `species` eligibility list, and their first-level `trappings`. Newer careers
// list TEN first-level skills (core lists eight) — only eight need advances to
// complete the level, and the 40-advance creation budget is unchanged.
//
// Creation is a roll-or-choose process: random results at Species, Career and
// Characteristics grant bonus XP. Skill advances are split between a species
// list (3 skills @ +5 and 3 @ +3) and the first career level (40 advances, max
// 10 per skill). See wfrpLibrary.js for the derivation and budgets.

// ── CHARACTERISTICS ────────────────────────────────────────────────────────
// The ten characteristics, in sheet order. Each is rolled 2d10 + species value.
export const CHARACTERISTICS = [
  { key: 'WS', name: 'Weapon Skill' },
  { key: 'BS', name: 'Ballistic Skill' },
  { key: 'S', name: 'Strength' },
  { key: 'T', name: 'Toughness' },
  { key: 'I', name: 'Initiative' },
  { key: 'Ag', name: 'Agility' },
  { key: 'Dex', name: 'Dexterity' },
  { key: 'Int', name: 'Intelligence' },
  { key: 'WP', name: 'Willpower' },
  { key: 'Fel', name: 'Fellowship' },
]

// A Characteristic Bonus is simply the tens digit of the characteristic.
export const charBonus = (v) => Math.floor((v || 0) / 10)

// ── SPECIES ────────────────────────────────────────────────────────────────
// mods: per-characteristic modifier added to 2d10. fate/resilience: starting
// values; extra: extra points the player distributes between Fate & Resilience.
// movement: base Movement. woundsNoSB: Halflings (Small) omit SB from Wounds.
// skills: the species skill list (player picks 3 @ +5 and 3 @ +3). talents:
// fixed talents always gained, choices (pick one from each pair), and the number
// of rolls on the Random Talents table.
export const SPECIES = [
  {
    id: 'human', name: 'Human (Reiklander)',
    mods: { WS: 20, BS: 20, S: 20, T: 20, I: 20, Ag: 20, Dex: 20, Int: 20, WP: 20, Fel: 20 },
    fate: 2, resilience: 1, extra: 3, movement: 4, woundsNoSB: false,
    random: '01–90',
    age: { base: 15, dice: '1d10' }, height: '4\'9" + 2d10"',
    skills: ['Animal Care', 'Charm', 'Cool', 'Evaluate', 'Gossip', 'Haggle', 'Language (Bretonnian)', 'Language (Wastelander)', 'Leadership', 'Lore (Reikland)', 'Melee (Basic)', 'Ranged (Bow)'],
    talents: { fixed: ['Doomed'], choices: [['Savvy', 'Suave']], random: 3 },
    desc: 'The most numerous and versatile species of the Old World. No characteristic specialisms, but the broadest skill list and three random talents.',
  },
  {
    id: 'dwarf', name: 'Dwarf',
    mods: { WS: 30, BS: 20, S: 20, T: 30, I: 20, Ag: 10, Dex: 30, Int: 20, WP: 40, Fel: 10 },
    fate: 0, resilience: 2, extra: 2, movement: 3, woundsNoSB: false,
    random: '95–98',
    age: { base: 15, dice: '10d10' }, height: '4\'3" + 1d10"',
    skills: ['Consume Alcohol', 'Cool', 'Endurance', 'Entertain (Storytelling)', 'Evaluate', 'Intimidate', 'Language (Khazalid)', 'Lore (Dwarfs)', 'Lore (Geology)', 'Lore (Metallurgy)', 'Melee (Basic)', 'Trade (any one)'],
    talents: { fixed: ['Magic Resistance', 'Night Vision', 'Sturdy'], choices: [['Read/Write', 'Relentless'], ['Resolute', 'Strong-minded']], random: 0 },
    desc: 'Stout, stubborn, and tough, with high Toughness and Willpower. Cannot cast spells. Often carry Animosity (Elves).',
  },
  {
    id: 'halfling', name: 'Halfling',
    mods: { WS: 10, BS: 30, S: 10, T: 20, I: 20, Ag: 20, Dex: 30, Int: 20, WP: 30, Fel: 30 },
    fate: 0, resilience: 2, extra: 3, movement: 3, woundsNoSB: true,
    random: '91–94',
    age: { base: 15, dice: '5d10' }, height: '3\'1" + 1d10"',
    skills: ['Charm', 'Consume Alcohol', 'Dodge', 'Gamble', 'Haggle', 'Intuition', 'Language (Mootish)', 'Lore (Reikland)', 'Perception', 'Sleight of Hand', 'Stealth (Any)', 'Trade (Cook)'],
    talents: { fixed: ['Acute Sense (Taste)', 'Night Vision', 'Resistance (Chaos)', 'Small'], choices: [], random: 2 },
    desc: 'Small, dexterous and personable, with the Small trait (Wounds omit the Strength Bonus). Fine ballistic skill and a way with food.',
  },
  {
    id: 'high-elf', name: 'High Elf',
    mods: { WS: 30, BS: 30, S: 20, T: 20, I: 40, Ag: 30, Dex: 30, Int: 30, WP: 30, Fel: 20 },
    fate: 0, resilience: 0, extra: 2, movement: 5, woundsNoSB: false,
    random: '99',
    age: { base: 30, dice: '10d10' }, height: '5\'11" + 1d10"',
    skills: ['Cool', 'Entertain (Sing)', 'Evaluate', 'Language (Eltharin)', 'Leadership', 'Melee (Basic)', 'Navigation', 'Perception', 'Play (any one)', 'Ranged (Bow)', 'Sail', 'Swim'],
    talents: { fixed: ['Acute Sense (Sight)', 'Night Vision', 'Read/Write'], choices: [['Coolheaded', 'Savvy'], ['Second Sight', 'Sixth Sense']], random: 0 },
    desc: 'The Asur — proud, disciplined and supremely capable, with high Initiative and Agility. Long-lived and intense.',
  },
  {
    id: 'wood-elf', name: 'Wood Elf',
    mods: { WS: 30, BS: 30, S: 20, T: 20, I: 40, Ag: 30, Dex: 30, Int: 30, WP: 30, Fel: 20 },
    fate: 0, resilience: 0, extra: 2, movement: 5, woundsNoSB: false,
    random: '00',
    age: { base: 30, dice: '10d10' }, height: '5\'11" + 1d10"',
    skills: ['Athletics', 'Climb', 'Endurance', 'Entertain (Sing)', 'Intimidate', 'Language (Eltharin)', 'Melee (Basic)', 'Outdoor Survival', 'Perception', 'Ranged (Bow)', 'Stealth (Rural)', 'Track'],
    talents: { fixed: ['Acute Sense (Sight)', 'Night Vision', 'Rover'], choices: [['Hardy', 'Second Sight'], ['Read/Write', 'Very Resilient']], random: 0 },
    desc: 'The Asrai — reclusive forest dwellers. Same characteristics as High Elves, but woodcraft skills and the Rover talent.',
  },
]

export const RANDOM_SPECIES = [
  { range: '01–90', id: 'human' },
  { range: '91–94', id: 'halfling' },
  { range: '95–98', id: 'dwarf' },
  { range: '99', id: 'high-elf' },
  { range: '00', id: 'wood-elf' },
]

// ── CLASSES ────────────────────────────────────────────────────────────────
// Each class shares a set of starting trappings, granted in addition to the
// chosen career's first-level trappings.
export const CLASSES = [
  { id: 'academics', name: 'Academics', desc: 'Learned folk who live by their education — often the only ones who can read and write.', trappings: ['Clothing', 'Dagger', 'Pouch', 'Sling Bag (Writing Kit, 1d10 sheets of Parchment)'] },
  { id: 'burghers', name: 'Burghers', desc: 'Law-abiding townsfolk who live and work in the Empire\'s towns and cities. Often middle class.', trappings: ['Cloak', 'Clothing', 'Dagger', 'Hat', 'Pouch', 'Sling Bag (Lunch)'] },
  { id: 'courtiers', name: 'Courtiers', desc: 'Those who rule, or who serve those who rule. Even lowly courtiers enjoy higher status.', trappings: ['Dagger', 'Fine Clothing', 'Pouch (Tweezers, Ear Pick, Comb)'] },
  { id: 'peasants', name: 'Peasants', desc: 'People of the farms, villages and countryside. All lower class, but locally influential.', trappings: ['Cloak', 'Clothing', 'Dagger', 'Pouch', 'Sling Bag (Rations for 1 day)'] },
  { id: 'rangers', name: 'Rangers', desc: 'Roving folk who make a living on the open roads, far from their home towns.', trappings: ['Cloak', 'Clothing', 'Dagger', 'Pouch', 'Backpack (Tinderbox, Blanket, Rations for 1 day)'] },
  { id: 'riverfolk', name: 'Riverfolk', desc: 'People who live and work on the rivers and waterways of the Reikland and beyond.', trappings: ['Cloak', 'Clothing', 'Dagger', 'Pouch', 'Sling Bag (Flask of Spirits)'] },
  { id: 'rogues', name: 'Rogues', desc: 'Town and city folk who make a living through illegal or unsavoury acts.', trappings: ['Clothing', 'Dagger', 'Pouch', 'Sling Bag (2 Candles, 1d10 Matches, Hood or Mask)'] },
  { id: 'warriors', name: 'Warriors', desc: 'Trained fighters of every background who rely on physical prowess.', trappings: ['Clothing', 'Hand Weapon', 'Dagger', 'Pouch'] },
]

// ── CAREERS ────────────────────────────────────────────────────────────────
// All 64 core careers, grouped by class. levels: the four career-path levels,
// each with its title and Status (tier + standing). skills/talents: the FIRST
// career level's eight skills and four talents (the player allocates 40 skill
// advances among the skills and picks one talent to learn).
// species: the species that may enter the career, per the core rulebook's
// Random Class and Career Table (pp. 30–31) — careers with a '—' cell for a
// species are closed to it. Careers with NO species field are open to all.
export const CAREERS = [
  // ── ACADEMICS ──
  { id: 'apothecary', name: 'Apothecary', classId: 'academics', species: ['human', 'dwarf', 'halfling', 'high-elf'],
    levels: [{ title: "Apothecary's Apprentice", status: 'Brass 3' }, { title: 'Apothecary', status: 'Silver 1' }, { title: 'Master Apothecary', status: 'Silver 3' }, { title: 'Apothecary-General', status: 'Gold 1' }],
    skills: ['Consume Alcohol', 'Heal', 'Language (Classical)', 'Lore (Chemistry)', 'Lore (Medicine)', 'Lore (Plants)', 'Trade (Apothecary)', 'Trade (Poisoner)'],
    talents: ['Concoct', 'Craftsman (Apothecary)', 'Etiquette (Scholars)', 'Read/Write'] },
  { id: 'engineer', name: 'Engineer', classId: 'academics', species: ['human', 'dwarf', 'halfling'],
    levels: [{ title: 'Student Engineer', status: 'Brass 4' }, { title: 'Engineer', status: 'Silver 2' }, { title: 'Master Engineer', status: 'Silver 4' }, { title: 'Chartered Engineer', status: 'Gold 2' }],
    skills: ['Consume Alcohol', 'Cool', 'Endurance', 'Language (Classical)', 'Lore (Engineering)', 'Perception', 'Ranged (Blackpowder)', 'Trade (Engineer)'],
    talents: ['Artistic', 'Gunner', 'Read/Write', 'Tinker'] },
  { id: 'lawyer', name: 'Lawyer', classId: 'academics', species: ['human', 'dwarf', 'halfling', 'high-elf'],
    levels: [{ title: 'Student Lawyer', status: 'Brass 4' }, { title: 'Lawyer', status: 'Silver 3' }, { title: 'Barrister', status: 'Gold 1' }, { title: 'Judge', status: 'Gold 2' }],
    skills: ['Consume Alcohol', 'Endurance', 'Haggle', 'Language (Classical)', 'Lore (Law)', 'Lore (Theology)', 'Perception', 'Research'],
    talents: ['Blather', 'Etiquette (Scholars)', 'Read/Write', 'Speedreader'] },
  { id: 'nun', name: 'Nun', classId: 'academics', species: ['human'],
    levels: [{ title: 'Novitiate', status: 'Brass 1' }, { title: 'Nun', status: 'Brass 4' }, { title: 'Abbess', status: 'Silver 2' }, { title: 'Prioress General', status: 'Silver 5' }],
    skills: ['Art (Calligraphy)', 'Cool', 'Endurance', 'Entertain (Storytelling)', 'Gossip', 'Heal', 'Lore (Theology)', 'Pray'],
    talents: ['Bless (Any)', 'Holy Visions', 'Read/Write', 'Suave'] },
  { id: 'physician', name: 'Physician', classId: 'academics', species: ['human', 'dwarf', 'halfling', 'high-elf'],
    levels: [{ title: "Physician's Apprentice", status: 'Brass 4' }, { title: 'Physician', status: 'Silver 3' }, { title: 'Doktor', status: 'Silver 5' }, { title: 'Court Physician', status: 'Gold 1' }],
    skills: ['Bribery', 'Cool', 'Drive', 'Endurance', 'Gossip', 'Heal', 'Perception', 'Sleight of Hand'],
    talents: ['Bookish', 'Field Dressing', 'Read/Write', 'Strike to Stun'] },
  { id: 'priest', name: 'Priest', classId: 'academics', species: ['human'],
    levels: [{ title: 'Initiate', status: 'Brass 2' }, { title: 'Priest', status: 'Silver 1' }, { title: 'High Priest', status: 'Gold 1' }, { title: 'Lector', status: 'Gold 2' }],
    skills: ['Athletics', 'Cool', 'Endurance', 'Intuition', 'Lore (Theology)', 'Perception', 'Pray', 'Research'],
    talents: ['Bless (Any)', 'Holy Visions', 'Read/Write', 'Suave'] },
  { id: 'scholar', name: 'Scholar', classId: 'academics',
    levels: [{ title: 'Student', status: 'Brass 3' }, { title: 'Scholar', status: 'Silver 2' }, { title: 'Fellow', status: 'Silver 5' }, { title: 'Professor', status: 'Gold 1' }],
    skills: ['Consume Alcohol', 'Entertain (Storytelling)', 'Gamble', 'Gossip', 'Haggle', 'Language (Classical)', 'Lore (Any)', 'Research'],
    talents: ['Carouser', 'Read/Write', 'Savvy', 'Super Numerate'] },
  { id: 'wizard', name: 'Wizard', classId: 'academics', species: ['human', 'high-elf', 'wood-elf'],
    levels: [{ title: "Wizard's Apprentice", status: 'Brass 3' }, { title: 'Wizard', status: 'Silver 3' }, { title: 'Master Wizard', status: 'Gold 1' }, { title: 'Wizard Lord', status: 'Gold 2' }],
    skills: ['Channelling (Any)', 'Dodge', 'Intuition', 'Language (Magick)', 'Lore (Magic)', 'Melee (Basic)', 'Perception', 'Trade (Apothecary)'],
    talents: ['Aethyric Attunement', 'Petty Magic', 'Read/Write', 'Second Sight'] },

  // ── BURGHERS ──
  { id: 'agitator', name: 'Agitator', classId: 'burghers', species: ['human', 'dwarf', 'halfling'],
    levels: [{ title: 'Pamphleteer', status: 'Brass 1' }, { title: 'Agitator', status: 'Brass 2' }, { title: 'Rabble Rouser', status: 'Brass 3' }, { title: 'Demagogue', status: 'Brass 5' }],
    skills: ['Art (Writing)', 'Bribery', 'Charm', 'Consume Alcohol', 'Gossip', 'Haggle', 'Lore (Politics)', 'Trade (Printing)'],
    talents: ['Blather', 'Gregarious', 'Panhandle', 'Read/Write'] },
  { id: 'artisan', name: 'Artisan', classId: 'burghers',
    levels: [{ title: 'Apprentice Artisan', status: 'Brass 2' }, { title: 'Artisan', status: 'Silver 1' }, { title: 'Master Artisan', status: 'Silver 3' }, { title: 'Guildmaster', status: 'Gold 1' }],
    skills: ['Athletics', 'Cool', 'Consume Alcohol', 'Dodge', 'Endurance', 'Evaluate', 'Stealth (Urban)', 'Trade (Any)'],
    talents: ['Artistic', 'Craftsman (Any)', 'Strong Back', 'Very Strong'] },
  { id: 'beggar', name: 'Beggar', classId: 'burghers', species: ['human', 'dwarf', 'halfling'],
    levels: [{ title: 'Pauper', status: 'Brass 0' }, { title: 'Beggar', status: 'Brass 2' }, { title: 'Master Beggar', status: 'Brass 4' }, { title: 'Beggar King', status: 'Silver 2' }],
    skills: ['Athletics', 'Charm', 'Consume Alcohol', 'Cool', 'Dodge', 'Endurance', 'Intuition', 'Stealth (Urban)'],
    talents: ['Panhandle', 'Resistance (Disease)', 'Stone Soup', 'Very Resilient'] },
  { id: 'investigator', name: 'Investigator', classId: 'burghers', species: ['human', 'dwarf', 'halfling', 'high-elf'],
    levels: [{ title: 'Sleuth', status: 'Silver 1' }, { title: 'Investigator', status: 'Silver 2' }, { title: 'Master Investigator', status: 'Silver 3' }, { title: 'Detective', status: 'Silver 5' }],
    skills: ['Charm', 'Climb', 'Cool', 'Gossip', 'Intuition', 'Perception', 'Stealth (Urban)', 'Track'],
    talents: ['Alley Cat', 'Beneath Notice', 'Read/Write', 'Sharp'] },
  { id: 'merchant', name: 'Merchant', classId: 'burghers', species: ['human', 'dwarf', 'halfling', 'high-elf'],
    levels: [{ title: 'Trader', status: 'Silver 2' }, { title: 'Merchant', status: 'Silver 5' }, { title: 'Master Merchant', status: 'Gold 1' }, { title: 'Merchant Prince', status: 'Gold 3' }],
    skills: ['Animal Care', 'Bribery', 'Charm', 'Consume Alcohol', 'Drive', 'Gamble', 'Gossip', 'Haggle'],
    talents: ['Blather', 'Dealmaker', 'Read/Write', 'Suave'] },
  { id: 'rat-catcher', name: 'Rat Catcher', classId: 'burghers', species: ['human', 'dwarf', 'halfling'],
    levels: [{ title: 'Rat Hunter', status: 'Brass 3' }, { title: 'Rat Catcher', status: 'Silver 1' }, { title: 'Sewer Jack', status: 'Silver 2' }, { title: 'Exterminator', status: 'Silver 3' }],
    skills: ['Athletics', 'Animal Training (Dog)', 'Charm Animal', 'Consume Alcohol', 'Endurance', 'Melee (Basic)', 'Ranged (Sling)', 'Stealth (Any)'],
    talents: ['Night Vision', 'Resistance (Disease)', 'Strike Mighty Blow', 'Strike to Stun'] },
  { id: 'townsman', name: 'Townsman', classId: 'burghers', species: ['human', 'dwarf', 'halfling', 'high-elf'],
    levels: [{ title: 'Clerk', status: 'Silver 1' }, { title: 'Townsman', status: 'Silver 2' }, { title: 'Town Councillor', status: 'Silver 5' }, { title: 'Burgomeister', status: 'Gold 1' }],
    skills: ['Charm', 'Climb', 'Consume Alcohol', 'Drive', 'Dodge', 'Gamble', 'Gossip', 'Haggle'],
    talents: ['Alley Cat', 'Beneath Notice', 'Etiquette (Servants)', 'Sturdy'] },
  { id: 'watchman', name: 'Watchman', classId: 'burghers', species: ['human', 'dwarf', 'halfling', 'high-elf'],
    levels: [{ title: 'Watch Recruit', status: 'Brass 3' }, { title: 'Watchman', status: 'Silver 1' }, { title: 'Watch Sergeant', status: 'Silver 3' }, { title: 'Watch Captain', status: 'Gold 1' }],
    skills: ['Athletics', 'Climb', 'Consume Alcohol', 'Dodge', 'Endurance', 'Gamble', 'Melee (Any)', 'Perception'],
    talents: ['Drilled', 'Hardy', 'Strike to Stun', 'Tenacious'] },

  // ── COURTIERS ──
  { id: 'advisor', name: 'Advisor', classId: 'courtiers',
    levels: [{ title: 'Aide', status: 'Silver 2' }, { title: 'Advisor', status: 'Silver 4' }, { title: 'Counsellor', status: 'Gold 1' }, { title: 'Chancellor', status: 'Gold 3' }],
    skills: ['Bribery', 'Consume Alcohol', 'Endurance', 'Gossip', 'Haggle', 'Language (Classical)', 'Lore (Politics)', 'Perception'],
    talents: ['Beneath Notice', 'Etiquette (Any)', 'Gregarious', 'Read/Write'] },
  { id: 'artist', name: 'Artist', classId: 'courtiers',
    levels: [{ title: 'Apprentice Artist', status: 'Silver 1' }, { title: 'Artist', status: 'Silver 3' }, { title: 'Master Artist', status: 'Silver 5' }, { title: 'Maestro', status: 'Gold 2' }],
    skills: ['Art (Any)', 'Cool', 'Consume Alcohol', 'Evaluate', 'Endurance', 'Gossip', 'Perception', 'Stealth (Urban)'],
    talents: ['Artistic', 'Sharp', 'Strong Back', 'Tenacious'] },
  { id: 'duellist', name: 'Duellist', classId: 'courtiers', species: ['human', 'dwarf', 'high-elf'],
    levels: [{ title: 'Fencer', status: 'Silver 3' }, { title: 'Duellist', status: 'Silver 5' }, { title: 'Duelmaster', status: 'Gold 1' }, { title: 'Judicial Champion', status: 'Gold 3' }],
    skills: ['Athletics', 'Dodge', 'Endurance', 'Heal', 'Intuition', 'Language (Classical)', 'Melee (Any)', 'Perception'],
    talents: ['Beat Blade', 'Distract', 'Feint', 'Step Aside'] },
  { id: 'envoy', name: 'Envoy', classId: 'courtiers',
    levels: [{ title: 'Herald', status: 'Silver 2' }, { title: 'Envoy', status: 'Silver 4' }, { title: 'Diplomat', status: 'Gold 2' }, { title: 'Ambassador', status: 'Gold 5' }],
    skills: ['Athletics', 'Charm', 'Drive', 'Dodge', 'Endurance', 'Intuition', 'Ride (Horse)', 'Row'],
    talents: ['Blather', 'Etiquette (Nobles)', 'Read/Write', 'Suave'] },
  { id: 'noble', name: 'Noble', classId: 'courtiers', species: ['human', 'dwarf', 'high-elf', 'wood-elf'],
    levels: [{ title: 'Scion', status: 'Gold 1' }, { title: 'Noble', status: 'Gold 3' }, { title: 'Magnate', status: 'Gold 5' }, { title: 'Noble Lord', status: 'Gold 7' }],
    skills: ['Bribery', 'Consume Alcohol', 'Gamble', 'Intimidate', 'Leadership', 'Lore (Heraldry)', 'Melee (Fencing)', 'Play (Any)'],
    talents: ['Etiquette (Nobles)', 'Luck', 'Noble Blood', 'Read/Write'] },
  { id: 'servant', name: 'Servant', classId: 'courtiers', species: ['human', 'dwarf', 'halfling'],
    levels: [{ title: 'Menial', status: 'Silver 1' }, { title: 'Servant', status: 'Silver 3' }, { title: 'Attendant', status: 'Silver 5' }, { title: 'Steward', status: 'Gold 1' }],
    skills: ['Athletics', 'Climb', 'Drive', 'Dodge', 'Endurance', 'Intuition', 'Perception', 'Stealth (Any)'],
    talents: ['Beneath Notice', 'Strong Back', 'Strong-minded', 'Sturdy'] },
  { id: 'spy', name: 'Spy', classId: 'courtiers',
    levels: [{ title: 'Informer', status: 'Brass 3' }, { title: 'Spy', status: 'Silver 3' }, { title: 'Agent', status: 'Gold 1' }, { title: 'Spymaster', status: 'Gold 4' }],
    skills: ['Bribery', 'Charm', 'Cool', 'Gamble', 'Gossip', 'Haggle', 'Perception', 'Stealth (Any)'],
    talents: ['Blather', 'Carouser', 'Gregarious', 'Shadow'] },
  { id: 'warden', name: 'Warden', classId: 'courtiers', species: ['human', 'dwarf', 'halfling', 'high-elf'],
    levels: [{ title: 'Custodian', status: 'Silver 1' }, { title: 'Warden', status: 'Silver 3' }, { title: 'Seneschal', status: 'Gold 1' }, { title: 'Governor', status: 'Gold 3' }],
    skills: ['Athletics', 'Charm Animal', 'Consume Alcohol', 'Cool', 'Endurance', 'Intuition', 'Lore (Local)', 'Perception'],
    talents: ['Menacing', 'Night Vision', 'Sharp', 'Strike to Stun'] },

  // ── PEASANTS ──
  { id: 'bailiff', name: 'Bailiff', classId: 'peasants', species: ['human', 'dwarf', 'halfling'],
    levels: [{ title: 'Tax Collector', status: 'Silver 1' }, { title: 'Bailiff', status: 'Silver 5' }, { title: 'Reeve', status: 'Gold 1' }, { title: 'Magistrate', status: 'Gold 3' }],
    skills: ['Cool', 'Dodge', 'Endurance', 'Gossip', 'Haggle', 'Intimidate', 'Melee (Basic)', 'Perception'],
    talents: ['Embezzle', 'Numismatics', 'Strong Back', 'Tenacious'] },
  { id: 'hedge-witch', name: 'Hedge Witch', classId: 'peasants', species: ['human'],
    levels: [{ title: 'Hedge Apprentice', status: 'Brass 1' }, { title: 'Hedge Witch', status: 'Brass 2' }, { title: 'Hedge Master', status: 'Brass 3' }, { title: 'Hedgewise', status: 'Brass 5' }],
    skills: ['Channelling', 'Endurance', 'Intuition', 'Language (Magick)', 'Lore (Folklore)', 'Lore (Herbs)', 'Outdoor Survival', 'Perception'],
    talents: ['Fast Hands', 'Petty Magic', 'Rover', 'Strider (Woodlands)'] },
  { id: 'herbalist', name: 'Herbalist', classId: 'peasants', species: ['human', 'halfling', 'high-elf', 'wood-elf'],
    levels: [{ title: 'Herb Gatherer', status: 'Brass 2' }, { title: 'Herbalist', status: 'Brass 4' }, { title: 'Herb Master', status: 'Silver 1' }, { title: 'Herbwise', status: 'Silver 3' }],
    skills: ['Charm Animal', 'Climb', 'Endurance', 'Lore (Herbs)', 'Outdoor Survival', 'Perception', 'Swim', 'Trade (Herbalist)'],
    talents: ['Acute Sense (Taste)', 'Orientation', 'Rover', 'Strider (Any)'] },
  { id: 'hunter', name: 'Hunter', classId: 'peasants',
    levels: [{ title: 'Trapper', status: 'Brass 2' }, { title: 'Hunter', status: 'Brass 4' }, { title: 'Tracker', status: 'Silver 1' }, { title: 'Huntsmaster', status: 'Silver 3' }],
    skills: ['Charm Animal', 'Climb', 'Endurance', 'Lore (Beasts)', 'Outdoor Survival', 'Perception', 'Ranged (Sling)', 'Set Trap'],
    talents: ['Hardy', 'Rover', 'Strider (Any)', 'Trapper'] },
  { id: 'miner', name: 'Miner', classId: 'peasants', species: ['human', 'dwarf', 'halfling'],
    levels: [{ title: 'Prospector', status: 'Brass 2' }, { title: 'Miner', status: 'Brass 4' }, { title: 'Master Miner', status: 'Brass 5' }, { title: 'Mine Foreman', status: 'Silver 4' }],
    skills: ['Cool', 'Endurance', 'Intuition', 'Lore (Local)', 'Melee (Two-handed)', 'Outdoor Survival', 'Perception', 'Swim'],
    talents: ['Rover', 'Strider (Rocky)', 'Sturdy', 'Tenacious'] },
  { id: 'mystic', name: 'Mystic', classId: 'peasants', species: ['human', 'wood-elf'],
    levels: [{ title: 'Fortune Teller', status: 'Brass 1' }, { title: 'Mystic', status: 'Brass 2' }, { title: 'Sage', status: 'Brass 3' }, { title: 'Seer', status: 'Brass 4' }],
    skills: ['Charm', 'Entertain (Fortune Telling)', 'Dodge', 'Gossip', 'Haggle', 'Intuition', 'Perception', 'Sleight of Hand'],
    talents: ['Attractive', 'Luck', 'Second Sight', 'Suave'] },
  { id: 'scout', name: 'Scout', classId: 'peasants',
    levels: [{ title: 'Guide', status: 'Brass 3' }, { title: 'Scout', status: 'Brass 5' }, { title: 'Pathfinder', status: 'Silver 1' }, { title: 'Explorer', status: 'Silver 5' }],
    skills: ['Charm Animal', 'Climb', 'Endurance', 'Gossip', 'Lore (Local)', 'Melee (Basic)', 'Outdoor Survival', 'Perception'],
    talents: ['Orientation', 'Rover', 'Sharp', 'Strider (Any)'] },
  { id: 'villager', name: 'Villager', classId: 'peasants', species: ['human', 'dwarf', 'halfling'],
    levels: [{ title: 'Peasant', status: 'Brass 2' }, { title: 'Villager', status: 'Brass 3' }, { title: 'Councillor', status: 'Brass 4' }, { title: 'Village Elder', status: 'Silver 2' }],
    skills: ['Animal Care', 'Athletics', 'Consume Alcohol', 'Endurance', 'Gossip', 'Melee (Brawling)', 'Lore (Local)', 'Outdoor Survival'],
    talents: ['Rover', 'Strong Back', 'Strong-minded', 'Stone Soup'] },

  // ── RANGERS ──
  { id: 'bounty-hunter', name: 'Bounty Hunter', classId: 'rangers',
    levels: [{ title: 'Thief-taker', status: 'Silver 1' }, { title: 'Bounty Hunter', status: 'Silver 3' }, { title: 'Master Bounty Hunter', status: 'Silver 5' }, { title: 'Bounty Hunter General', status: 'Gold 1' }],
    skills: ['Bribery', 'Charm', 'Gossip', 'Haggle', 'Intuition', 'Melee (Basic)', 'Outdoor Survival', 'Perception'],
    talents: ['Break and Enter', 'Shadow', 'Strike to Stun', 'Suave'] },
  { id: 'coachman', name: 'Coachman', classId: 'rangers', species: ['human', 'dwarf', 'halfling'],
    levels: [{ title: 'Postilion', status: 'Silver 1' }, { title: 'Coachman', status: 'Silver 2' }, { title: 'Coach Master', status: 'Silver 3' }, { title: 'Route Master', status: 'Silver 5' }],
    skills: ['Animal Care', 'Charm Animal', 'Climb', 'Drive', 'Endurance', 'Perception', 'Ranged (Entangling)', 'Ride (Horse)'],
    talents: ['Animal Affinity', 'Seasoned Traveller', 'Trick Riding', 'Tenacious'] },
  { id: 'entertainer', name: 'Entertainer', classId: 'rangers',
    levels: [{ title: 'Busker', status: 'Brass 3' }, { title: 'Entertainer', status: 'Brass 5' }, { title: 'Troubadour', status: 'Silver 3' }, { title: 'Troupe Leader', status: 'Gold 1' }],
    skills: ['Athletics', 'Charm', 'Entertain (Any)', 'Gossip', 'Haggle', 'Melee (Basic)', 'Play (Any)', 'Sleight of Hand'],
    talents: ['Attractive', 'Mimic', 'Public Speaker', 'Suave'] },
  { id: 'flagellant', name: 'Flagellant', classId: 'rangers', species: ['human'],
    levels: [{ title: 'Zealot', status: 'Brass 0' }, { title: 'Flagellant', status: 'Brass 0' }, { title: 'Penitent', status: 'Brass 1' }, { title: 'Prophet of Doom', status: 'Brass 2' }],
    skills: ['Dodge', 'Endurance', 'Heal', 'Intimidate', 'Intuition', 'Lore (Sigmar)', 'Melee (Flail)', 'Outdoor Survival'],
    talents: ['Berserk Charge', 'Frenzy', 'Read/Write', 'Stone Soup'] },
  { id: 'messenger', name: 'Messenger', classId: 'rangers',
    levels: [{ title: 'Runner', status: 'Brass 3' }, { title: 'Messenger', status: 'Silver 1' }, { title: 'Courier', status: 'Silver 3' }, { title: 'Courier-Captain', status: 'Silver 5' }],
    skills: ['Athletics', 'Climb', 'Dodge', 'Endurance', 'Gossip', 'Navigation', 'Perception', 'Ride (Horse)'],
    talents: ['Flee!', 'Fleet Footed', 'Sprinter', 'Step Aside'] },
  { id: 'pedlar', name: 'Pedlar', classId: 'rangers', species: ['human', 'dwarf', 'halfling'],
    levels: [{ title: 'Vagabond', status: 'Brass 1' }, { title: 'Pedlar', status: 'Brass 4' }, { title: 'Master Pedlar', status: 'Silver 1' }, { title: 'Wandering Trader', status: 'Silver 3' }],
    skills: ['Charm', 'Endurance', 'Entertain (Storytelling)', 'Gossip', 'Haggle', 'Intuition', 'Outdoor Survival', 'Stealth (Any)'],
    talents: ['Fisherman', 'Flee!', 'Rover', 'Tinker'] },
  { id: 'road-warden', name: 'Road Warden', classId: 'rangers', species: ['human', 'halfling'],
    levels: [{ title: 'Toll Keeper', status: 'Brass 5' }, { title: 'Road Warden', status: 'Silver 2' }, { title: 'Road Sergeant', status: 'Silver 4' }, { title: 'Road Captain', status: 'Gold 1' }],
    skills: ['Bribery', 'Consume Alcohol', 'Gamble', 'Gossip', 'Haggle', 'Melee (Basic)', 'Perception', 'Ranged (Crossbow)'],
    talents: ['Coolheaded', 'Embezzle', 'Marksman', 'Numismatics'] },
  { id: 'witch-hunter', name: 'Witch Hunter', classId: 'rangers', species: ['human'],
    levels: [{ title: 'Interrogator', status: 'Silver 1' }, { title: 'Witch Hunter', status: 'Silver 3' }, { title: 'Inquisitor', status: 'Silver 5' }, { title: 'Witchfinder General', status: 'Gold 1' }],
    skills: ['Charm', 'Consume Alcohol', 'Heal', 'Intimidate', 'Intuition', 'Lore (Torture)', 'Melee (Brawling)', 'Perception'],
    talents: ['Coolheaded', 'Menacing', 'Read/Write', 'Resolute'] },

  // ── RIVERFOLK ──
  { id: 'boatman', name: 'Boatman', classId: 'riverfolk', species: ['human', 'dwarf', 'halfling', 'high-elf'],
    levels: [{ title: 'Boat-hand', status: 'Silver 1' }, { title: 'Boatman', status: 'Silver 2' }, { title: 'Bargeswain', status: 'Silver 3' }, { title: 'Barge Master', status: 'Silver 5' }],
    skills: ['Consume Alcohol', 'Dodge', 'Endurance', 'Gossip', 'Melee (Brawling)', 'Row', 'Sail', 'Swim'],
    talents: ['Dirty Fighting', 'Fisherman', 'Strong Back', 'Strong Swimmer'] },
  { id: 'huffer', name: 'Huffer', classId: 'riverfolk', species: ['human', 'dwarf', 'halfling'],
    levels: [{ title: 'Riverguide', status: 'Brass 4' }, { title: 'Huffer', status: 'Silver 1' }, { title: 'Pilot', status: 'Silver 3' }, { title: 'Master Pilot', status: 'Silver 5' }],
    skills: ['Consume Alcohol', 'Gossip', 'Intuition', 'Lore (Local)', 'Lore (Riverways)', 'Perception', 'Row', 'Swim'],
    talents: ['Fisherman', 'Night Vision', 'Orientation', 'Waterman'] },
  { id: 'riverwarden', name: 'Riverwarden', classId: 'riverfolk', species: ['human', 'halfling'],
    levels: [{ title: 'River Recruit', status: 'Silver 1' }, { title: 'Riverwarden', status: 'Silver 2' }, { title: 'Shipsword', status: 'Silver 4' }, { title: 'Shipsword Master', status: 'Gold 1' }],
    skills: ['Athletics', 'Dodge', 'Endurance', 'Melee (Basic)', 'Perception', 'Row', 'Sail', 'Swim'],
    talents: ['Strong Swimmer', 'Strong Back', 'Very Strong', 'Waterman'] },
  { id: 'riverwoman', name: 'Riverwoman', classId: 'riverfolk', species: ['human', 'dwarf', 'halfling'],
    levels: [{ title: 'Greenfish', status: 'Brass 2' }, { title: 'Riverwoman', status: 'Brass 3' }, { title: 'Riverwise', status: 'Brass 5' }, { title: 'River Elder', status: 'Silver 2' }],
    skills: ['Athletics', 'Consume Alcohol', 'Dodge', 'Endurance', 'Gossip', 'Outdoor Survival', 'Row', 'Swim'],
    talents: ['Fisherman', 'Gregarious', 'Strider (Marshes)', 'Strong Swimmer'] },
  { id: 'seaman', name: 'Seaman', classId: 'riverfolk', species: ['human', 'dwarf', 'halfling', 'high-elf'],
    levels: [{ title: 'Landsman', status: 'Silver 1' }, { title: 'Seaman', status: 'Silver 3' }, { title: 'Boatswain', status: 'Silver 5' }, { title: "Ship's Master", status: 'Gold 2' }],
    skills: ['Climb', 'Consume Alcohol', 'Gamble', 'Gossip', 'Row', 'Melee (Brawling)', 'Sail', 'Swim'],
    talents: ['Fisherman', 'Strider (Coastal)', 'Strong Back', 'Strong Swimmer'] },
  { id: 'smuggler', name: 'Smuggler', classId: 'riverfolk', species: ['human', 'dwarf', 'halfling', 'high-elf'],
    levels: [{ title: 'River Runner', status: 'Brass 2' }, { title: 'Smuggler', status: 'Brass 3' }, { title: 'Master Smuggler', status: 'Brass 5' }, { title: 'Smuggler King', status: 'Silver 2' }],
    skills: ['Athletics', 'Bribery', 'Cool', 'Consume Alcohol', 'Row', 'Sail', 'Stealth (Rural or Urban)', 'Swim'],
    talents: ['Criminal', 'Fisherman', 'Strider (Marshes)', 'Strong Back'] },
  { id: 'stevedore', name: 'Stevedore', classId: 'riverfolk', species: ['human', 'dwarf', 'halfling'],
    levels: [{ title: 'Dockhand', status: 'Brass 3' }, { title: 'Stevedore', status: 'Silver 1' }, { title: 'Foreman', status: 'Silver 3' }, { title: 'Dock Master', status: 'Silver 5' }],
    skills: ['Athletics', 'Climb', 'Consume Alcohol', 'Dodge', 'Endurance', 'Gossip', 'Melee (Basic)', 'Swim'],
    talents: ['Dirty Fighting', 'Strong Back', 'Sturdy', 'Very Strong'] },
  { id: 'wrecker', name: 'Wrecker', classId: 'riverfolk', species: ['human', 'dwarf', 'wood-elf'],
    levels: [{ title: 'Cargo Scavenger', status: 'Brass 2' }, { title: 'Wrecker', status: 'Brass 3' }, { title: 'River Pirate', status: 'Brass 5' }, { title: 'Wrecker Captain', status: 'Silver 2' }],
    skills: ['Climb', 'Consume Alcohol', 'Dodge', 'Endurance', 'Row', 'Melee (Basic)', 'Outdoor Survival', 'Swim'],
    talents: ['Break and Enter', 'Criminal', 'Fisherman', 'Strong Back'] },

  // ── ROGUES ──
  { id: 'bawd', name: 'Bawd', classId: 'rogues', species: ['human', 'halfling', 'high-elf'],
    levels: [{ title: 'Hustler', status: 'Brass 1' }, { title: 'Bawd', status: 'Brass 3' }, { title: 'Procurer', status: 'Silver 1' }, { title: 'Ringleader', status: 'Silver 3' }],
    skills: ['Bribery', 'Charm', 'Consume Alcohol', 'Entertain (Any)', 'Gamble', 'Gossip', 'Haggle', 'Intimidate'],
    talents: ['Attractive', 'Alley Cat', 'Blather', 'Gregarious'] },
  { id: 'charlatan', name: 'Charlatan', classId: 'rogues', species: ['human', 'halfling', 'high-elf'],
    levels: [{ title: 'Swindler', status: 'Brass 3' }, { title: 'Charlatan', status: 'Brass 5' }, { title: 'Con Artist', status: 'Silver 2' }, { title: 'Scoundrel', status: 'Silver 4' }],
    skills: ['Bribery', 'Consume Alcohol', 'Charm', 'Entertain (Storytelling)', 'Gamble', 'Gossip', 'Haggle', 'Sleight of Hand'],
    talents: ['Cardsharp', 'Diceman', 'Etiquette (Any)', 'Luck'] },
  { id: 'fence', name: 'Fence', classId: 'rogues', species: ['human', 'dwarf', 'halfling'],
    levels: [{ title: 'Broker', status: 'Silver 1' }, { title: 'Fence', status: 'Silver 2' }, { title: 'Master Fence', status: 'Silver 3' }, { title: 'Black Marketeer', status: 'Silver 4' }],
    skills: ['Charm', 'Consume Alcohol', 'Dodge', 'Evaluate', 'Gamble', 'Gossip', 'Haggle', 'Melee (Basic)'],
    talents: ['Alley Cat', 'Cardsharp', 'Dealmaker', 'Gregarious'] },
  { id: 'grave-robber', name: 'Grave Robber', classId: 'rogues', species: ['human', 'halfling'],
    levels: [{ title: 'Body Snatcher', status: 'Brass 2' }, { title: 'Grave Robber', status: 'Brass 3' }, { title: 'Tomb Robber', status: 'Silver 1' }, { title: 'Treasure Hunter', status: 'Silver 5' }],
    skills: ['Climb', 'Cool', 'Dodge', 'Endurance', 'Gossip', 'Intuition', 'Perception', 'Stealth (Any)'],
    talents: ['Alley Cat', 'Criminal', 'Flee!', 'Strong Back'] },
  { id: 'outlaw', name: 'Outlaw', classId: 'rogues',
    levels: [{ title: 'Brigand', status: 'Brass 1' }, { title: 'Outlaw', status: 'Brass 2' }, { title: 'Outlaw Chief', status: 'Brass 4' }, { title: 'Bandit King', status: 'Silver 2' }],
    skills: ['Athletics', 'Consume Alcohol', 'Cool', 'Endurance', 'Gamble', 'Intimidate', 'Melee (Basic)', 'Outdoor Survival'],
    talents: ['Combat Aware', 'Criminal', 'Rover', 'Flee!'] },
  { id: 'racketeer', name: 'Racketeer', classId: 'rogues', species: ['human', 'dwarf', 'halfling'],
    levels: [{ title: 'Thug', status: 'Brass 3' }, { title: 'Racketeer', status: 'Brass 5' }, { title: 'Gang Boss', status: 'Silver 3' }, { title: 'Crime Lord', status: 'Silver 5' }],
    skills: ['Consume Alcohol', 'Cool', 'Dodge', 'Endurance', 'Intimidate', 'Lore (Local)', 'Melee (Brawling)', 'Stealth (Urban)'],
    talents: ['Criminal', 'Etiquette (Criminals)', 'Menacing', 'Strike Mighty Blow'] },
  { id: 'thief', name: 'Thief', classId: 'rogues', species: ['human', 'dwarf', 'halfling'],
    levels: [{ title: 'Prowler', status: 'Brass 1' }, { title: 'Thief', status: 'Brass 3' }, { title: 'Master Thief', status: 'Brass 5' }, { title: 'Cat Burglar', status: 'Silver 3' }],
    skills: ['Athletics', 'Climb', 'Cool', 'Dodge', 'Endurance', 'Intuition', 'Perception', 'Stealth (Urban)'],
    talents: ['Alley Cat', 'Criminal', 'Flee!', 'Strike to Stun'] },
  { id: 'witch', name: 'Witch', classId: 'rogues', species: ['human'],
    levels: [{ title: 'Hexer', status: 'Brass 1' }, { title: 'Witch', status: 'Brass 2' }, { title: 'Wyrd', status: 'Brass 3' }, { title: 'Warlock', status: 'Brass 5' }],
    skills: ['Channelling', 'Cool', 'Endurance', 'Gossip', 'Intimidate', 'Language (Magick)', 'Sleight of Hand', 'Stealth (Rural)'],
    talents: ['Criminal', 'Instinctive Diction', 'Menacing', 'Petty Magic'] },

  // ── WARRIORS ──
  { id: 'cavalryman', name: 'Cavalryman', classId: 'warriors', species: ['human', 'high-elf', 'wood-elf'],
    levels: [{ title: 'Horseman', status: 'Silver 2' }, { title: 'Cavalryman', status: 'Silver 4' }, { title: 'Cavalry Sergeant', status: 'Gold 1' }, { title: 'Cavalry Officer', status: 'Gold 2' }],
    skills: ['Animal Care', 'Charm Animal', 'Endurance', 'Language (Battle)', 'Melee (Cavalry)', 'Outdoor Survival', 'Perception', 'Ride (Horse)'],
    talents: ['Combat Aware', 'Crack the Whip', 'Lightning Reflexes', 'Roughrider'] },
  { id: 'guard', name: 'Guard', classId: 'warriors',
    levels: [{ title: 'Sentry', status: 'Silver 1' }, { title: 'Guard', status: 'Silver 2' }, { title: 'Honour Guard', status: 'Silver 3' }, { title: 'Guard Officer', status: 'Silver 5' }],
    skills: ['Consume Alcohol', 'Endurance', 'Entertain (Storytelling)', 'Gamble', 'Gossip', 'Intuition', 'Melee (Basic)', 'Perception'],
    talents: ['Diceman', 'Etiquette (Servants)', 'Strike to Stun', 'Tenacious'] },
  { id: 'knight', name: 'Knight', classId: 'warriors', species: ['human', 'high-elf', 'wood-elf'],
    levels: [{ title: 'Squire', status: 'Silver 3' }, { title: 'Knight', status: 'Silver 5' }, { title: 'First Knight', status: 'Gold 2' }, { title: 'Knight of the Inner Circle', status: 'Gold 4' }],
    skills: ['Athletics', 'Animal Care', 'Charm Animal', 'Heal', 'Lore (Heraldry)', 'Melee (Cavalry)', 'Ride (Horse)', 'Trade (Farrier)'],
    talents: ['Etiquette (Any)', 'Roughrider', 'Sturdy', 'Warrior Born'] },
  { id: 'pit-fighter', name: 'Pit Fighter', classId: 'warriors',
    levels: [{ title: 'Pugilist', status: 'Brass 4' }, { title: 'Pit Fighter', status: 'Silver 2' }, { title: 'Pit Champion', status: 'Silver 5' }, { title: 'Pit Legend', status: 'Gold 2' }],
    skills: ['Athletics', 'Cool', 'Dodge', 'Endurance', 'Gamble', 'Intimidate', 'Melee (Any)', 'Melee (Brawling)'],
    talents: ['Dirty Fighting', 'In-fighter', 'Iron Jaw', 'Reversal'] },
  { id: 'protagonist', name: 'Protagonist', classId: 'warriors', species: ['human', 'dwarf', 'high-elf'],
    levels: [{ title: 'Braggart', status: 'Brass 2' }, { title: 'Protagonist', status: 'Silver 1' }, { title: 'Hitman', status: 'Silver 4' }, { title: 'Assassin', status: 'Gold 1' }],
    skills: ['Athletics', 'Dodge', 'Endurance', 'Entertain (Taunt)', 'Gossip', 'Haggle', 'Intimidate', 'Melee (Any)'],
    talents: ['In-fighter', 'Dirty Fighting', 'Menacing', 'Warrior Born'] },
  { id: 'slayer', name: 'Slayer', classId: 'warriors', species: ['dwarf'],
    levels: [{ title: 'Troll Slayer', status: 'Brass 2' }, { title: 'Giant Slayer', status: 'Brass 3' }, { title: 'Dragon Slayer', status: 'Brass 4' }, { title: 'Daemon Slayer', status: 'Brass 5' }],
    skills: ['Consume Alcohol', 'Cool', 'Dodge', 'Endurance', 'Gamble', 'Intimidate', 'Lore (Trolls)', 'Melee (Basic)'],
    talents: ['Fearless (Everything)', 'Frenzy', 'Menacing', 'Relentless'] },
  { id: 'soldier', name: 'Soldier', classId: 'warriors',
    levels: [{ title: 'Recruit', status: 'Silver 1' }, { title: 'Soldier', status: 'Silver 3' }, { title: 'Sergeant', status: 'Silver 5' }, { title: 'Officer', status: 'Gold 1' }],
    skills: ['Athletics', 'Climb', 'Cool', 'Dodge', 'Endurance', 'Language (Battle)', 'Melee (Basic)', 'Play (Drum or Fife)'],
    talents: ['Diceman', 'Marksman', 'Strong Back', 'Warrior Born'] },
  { id: 'warrior-priest', name: 'Warrior Priest', classId: 'warriors', species: ['human'],
    levels: [{ title: 'Novitiate', status: 'Brass 2' }, { title: 'Warrior Priest', status: 'Silver 2' }, { title: 'Priest Sergeant', status: 'Silver 3' }, { title: 'Priest Captain', status: 'Silver 4' }],
    skills: ['Cool', 'Dodge', 'Endurance', 'Heal', 'Leadership', 'Lore (Theology)', 'Melee (Any)', 'Pray'],
    talents: ['Bless (Any)', 'Etiquette (Cultists)', 'Read/Write', 'Strong-minded'] },

  // ── UP IN ARMS (expansion careers) ──
  // ACADEMICS
  { id: 'artillerist', name: 'Artillerist', classId: 'academics', book: 'Up in Arms',
    species: ['dwarf', 'halfling', 'human'],
    levels: [{ title: 'Apprentice Artillerist', status: 'Silver 1' }, { title: 'Artillerist', status: 'Silver 3' }, { title: 'Artillerist Captain', status: 'Silver 5' }, { title: 'Master Artillerist', status: 'Gold 1' }],
    skills: ['Animal Care', 'Cool', 'Drive', 'Endurance', 'Evaluate', 'Language (Battle)', 'Melee (Basic)', 'Navigation', 'Perception', 'Ranged (Blackpowder, Catapult, Crossbow or Engineering)'],
    talents: ['Marksman', 'Rapid Reload', 'Strong Back', 'Warrior Born'],
    trappings: ['Dagger', 'Leather Apron'] },
  { id: 'cartographer', name: 'Cartographer', classId: 'academics', book: 'Up in Arms',
    species: ['dwarf', 'halfling', 'high-elf', 'human', 'wood-elf'],
    levels: [{ title: 'Surveyor', status: 'Silver 1' }, { title: 'Cartographer', status: 'Silver 3' }, { title: 'Chartered Cartographer', status: 'Silver 5' }, { title: 'Master Cartographer', status: 'Gold 1' }],
    skills: ['Art (Cartography)', 'Climb', 'Evaluate', 'Lore (Geography)', 'Melee (Basic)', 'Navigation', 'Outdoor Survival', 'Perception', 'Ride (Horse)', 'Stealth (Rural)'],
    talents: ['Artistic', 'Orientation', 'Read/Write', 'Rover'],
    trappings: ['Vellum', 'Writing Kit'] },
  // RANGERS
  { id: 'camp-follower', name: 'Camp Follower', classId: 'rangers', book: 'Up in Arms',
    species: ['dwarf', 'halfling', 'high-elf', 'human', 'wood-elf'],
    levels: [{ title: 'Ribaud', status: 'Brass 1' }, { title: 'Camp Follower', status: 'Brass 4' }, { title: 'Seasoned Scavenger', status: 'Silver 1' }, { title: 'Camp Chief', status: 'Silver 4' }],
    skills: ['Charm', 'Consume Alcohol', 'Dodge', 'Entertain (Any)', 'Gossip', 'Haggle', 'Melee (Any)', 'Outdoor Survival', 'Perception', 'Perform (Dance)'],
    talents: ['Attractive', 'Beneath Notice', 'Blather', 'Dirty Fighting'],
    trappings: ['Bed Roll', 'Dagger', 'Pack'] },
  // WARRIORS
  { id: 'archer', name: 'Archer', classId: 'warriors', book: 'Up in Arms',
    species: ['halfling', 'high-elf', 'human', 'wood-elf'],
    levels: [{ title: 'Bowman', status: 'Silver 1' }, { title: 'Archer', status: 'Silver 3' }, { title: 'Archer Sergeant', status: 'Silver 5' }, { title: 'Archer Captain', status: 'Gold 1' }],
    skills: ['Athletics', 'Climb', 'Consume Alcohol', 'Dodge', 'Endurance', 'Language (Battle)', 'Perception', 'Play (Horn)', 'Ranged (Bow)', 'Stealth (Rural)'],
    talents: ['Accurate Shot', 'Fast Shot', 'Strong Back', 'Warrior Born'],
    trappings: ['Quiver and 10 Arrows', 'Bow', 'Dagger', 'Pack', 'Uniform'] },
  { id: 'freelance', name: 'Freelance', classId: 'warriors', book: 'Up in Arms',
    species: ['human'],
    levels: [{ title: 'Squire', status: 'Silver 1' }, { title: 'Freelance Knight', status: 'Silver 2' }, { title: 'Freelance Captain', status: 'Gold 1' }, { title: 'Knight Commander', status: 'Gold 3' }],
    skills: ['Athletics', 'Animal Care', 'Charm Animal', 'Consume Alcohol', 'Heal', 'Gossip', 'Melee (Cavalry)', 'Outdoor Survival', 'Ride (Horse)', 'Trade (Farrier)'],
    talents: ['Roughrider', 'Sturdy', 'Warrior Born', 'Combat Aware'],
    trappings: ['Leather Jack', 'Mail Shirt', 'Riding Horse with Saddle and Tack', 'Shield', 'Trade Tools (Farrier)'] },
  { id: 'greatsword', name: 'Greatsword', classId: 'warriors', book: 'Up in Arms',
    species: ['human'],
    levels: [{ title: 'Greatsword Cadet', status: 'Silver 1' }, { title: 'Greatsword', status: 'Silver 3' }, { title: 'Greatsword Sergeant', status: 'Silver 5' }, { title: 'Greatsword Captain', status: 'Gold 1' }],
    skills: ['Athletics', 'Consume Alcohol', 'Cool', 'Dodge', 'Endurance', 'Gossip', 'Language (Battle)', 'Melee (Basic)', 'Melee (Two-handed)', 'Play (Drum)'],
    talents: ['Coolheaded', 'Drilled', 'Strong Back', 'Warrior Born'],
    trappings: ['Dagger', 'Metal Breastplate', 'Uniform', 'Zweihänder'] },
  { id: 'halberdier', name: 'Halberdier', classId: 'warriors', book: 'Up in Arms',
    species: ['dwarf', 'halfling', 'human'],
    levels: [{ title: 'Halberdier Recruit', status: 'Silver 1' }, { title: 'Halberdier', status: 'Silver 3' }, { title: 'Halberdier Sergeant', status: 'Silver 5' }, { title: 'Halberdier Captain', status: 'Gold 1' }],
    skills: ['Athletics', 'Consume Alcohol', 'Cool', 'Dodge', 'Endurance', 'Language (Battle)', 'Melee (Basic)', 'Melee (Polearm)', 'Perform (Parade)', 'Play (Drum)'],
    talents: ['Diceman', 'Drilled', 'Strong Back', 'Warrior Born'],
    trappings: ['Dagger', 'Halberd', 'Leather Breastplate', 'Uniform'] },
  { id: 'handgunner', name: 'Handgunner', classId: 'warriors', book: 'Up in Arms',
    species: ['dwarf', 'halfling', 'human'],
    levels: [{ title: 'Handgunner Recruit', status: 'Silver 1' }, { title: 'Handgunner', status: 'Silver 3' }, { title: 'Handgunner Sergeant', status: 'Silver 5' }, { title: 'Handgunner Captain', status: 'Gold 1' }],
    skills: ['Athletics', 'Consume Alcohol', 'Cool', 'Dodge', 'Endurance', 'Language (Battle)', 'Melee (Basic)', 'Perception', 'Play (Flute)', 'Ranged (Blackpowder)'],
    talents: ['Accurate Shot', 'Gunner', 'Marksman', 'Sniper'],
    trappings: ['Dagger', 'Handgun', 'Uniform'] },
  { id: 'knight-blazing-sun', name: 'Knight of the Blazing Sun', classId: 'warriors', book: 'Up in Arms',
    species: ['human'],
    levels: [{ title: 'Novice', status: 'Silver 3' }, { title: 'Knight', status: 'Silver 5' }, { title: 'Hochmeister', status: 'Gold 2' }, { title: 'Knight of the Inner Circle', status: 'Gold 4' }],
    skills: ['Athletics', 'Animal Care', 'Charm Animal', 'Heal', 'Language (Classical)', 'Lore (Heraldry)', 'Lore (Any)', 'Melee (Basic)', 'Melee (Cavalry)', 'Ride (Horse)'],
    talents: ['Etiquette (Any)', 'Read/Write', 'Roughrider', 'Warrior Born'],
    trappings: ['Leather Jack', 'Mail Shirt', 'Riding Horse with Saddle and Tack', 'Shield', 'Trade Tools (Farrier)', 'Religious Symbol (Myrmidia)'] },
  { id: 'knight-white-wolf', name: 'Knight of the White Wolf', classId: 'warriors', book: 'Up in Arms',
    species: ['human'],
    levels: [{ title: 'Novice', status: 'Silver 3' }, { title: 'Knight', status: 'Silver 5' }, { title: 'Templar Sergeant', status: 'Gold 2' }, { title: 'Company Commander (Inner Circle)', status: 'Gold 3' }],
    skills: ['Athletics', 'Animal Care', 'Charm Animal', 'Heal', 'Lore (Heraldry)', 'Melee (Basic)', 'Melee (Cavalry)', 'Outdoor Survival', 'Ride (Horse)', 'Trade (Farrier)'],
    talents: ['Roughrider', 'Sturdy', 'Warrior Born', 'Hardy'],
    trappings: ['Leather Jack', 'Mail Shirt', 'Riding Horse with Saddle and Tack', 'Trade Tools (Farrier)', 'Religious Symbol (Ulric)'] },
  { id: 'knight-panther', name: 'Knight Panther', classId: 'warriors', book: 'Up in Arms',
    species: ['human'],
    levels: [{ title: 'Squire', status: 'Silver 3' }, { title: 'Knight', status: 'Silver 5' }, { title: 'First Knight', status: 'Gold 2' }, { title: 'Company Commander (Inner Circle)', status: 'Gold 4' }],
    skills: ['Athletics', 'Animal Care', 'Charm Animal', 'Heal', 'Lore (Empire)', 'Lore (Heraldry)', 'Melee (Basic)', 'Melee (Cavalry)', 'Ride (Horse)', 'Trade (Farrier)'],
    talents: ['Etiquette (Any)', 'Roughrider', 'Sturdy', 'Warrior Born'],
    trappings: ['Leather Jack', 'Mail Shirt', 'Riding Horse with Saddle and Tack', 'Shield', 'Trade Tools (Farrier)'] },
  { id: 'light-cavalry', name: 'Light Cavalry', classId: 'warriors', book: 'Up in Arms',
    species: ['high-elf', 'human'],
    levels: [{ title: 'Reiver', status: 'Brass 3' }, { title: 'Light Cavalry', status: 'Silver 2' }, { title: 'Lance', status: 'Silver 5' }, { title: 'Captain', status: 'Gold 1' }],
    skills: ['Animal Care', 'Dodge', 'Endurance', 'Haggle', 'Heal', 'Language (Battle)', 'Melee (Basic)', 'Outdoor Survival', 'Ranged (Throwing)', 'Ride (Horse)'],
    talents: ['Etiquette (Mercenaries)', 'Field Dressing', 'Flee!', 'Strong Back'],
    trappings: ['Shield or Buckler', 'Leather Jack', 'Riding Horse with Saddle and Tack', 'Javelin'] },
  { id: 'pikeman', name: 'Pikeman', classId: 'warriors', book: 'Up in Arms',
    species: ['human'],
    levels: [{ title: 'Recruit', status: 'Brass 5' }, { title: 'Pikeman', status: 'Silver 1' }, { title: 'File Leader', status: 'Silver 4' }, { title: 'Banner Captain', status: 'Gold 1' }],
    skills: ['Athletics', 'Climb', 'Consume Alcohol', 'Dodge', 'Endurance', 'Gamble', 'Language (Battle)', 'Language (Tilean)', 'Melee (Basic)', 'Melee (Polearm)'],
    talents: ['Drilled', 'Reaction Strike', 'Very Strong', 'Warrior Born'],
    trappings: ['Hand Weapon', 'Leather Breastplate', 'Leather Skullcap', 'Pike', 'Uniform in Unit Colours'] },
  { id: 'priest-myrmidia', name: 'Priest of Myrmidia', classId: 'warriors', book: 'Up in Arms',
    species: ['human'],
    levels: [{ title: 'First Eagle', status: 'Silver 2' }, { title: 'Warrior Priest', status: 'Silver 3' }, { title: 'Priest Sergeant', status: 'Silver 4' }, { title: 'Priest Captain', status: 'Silver 5' }],
    skills: ['Cool', 'Dodge', 'Language (Battle)', 'Leadership', 'Lore (Warfare)', 'Lore (Theology)', 'Melee (Basic)', 'Melee (Polearm)', 'Perception', 'Pray'],
    talents: ['Bless (Myrmidia)', 'Combat Aware', 'Etiquette (Cultists)', 'Read/Write'],
    trappings: ['Myrmidian Holy Book', 'Leather Jerkin', 'Myrmidian Icon', 'White Robes', 'Spear'] },
  { id: 'siege-specialist', name: 'Siege Specialist', classId: 'warriors', book: 'Up in Arms',
    species: ['dwarf', 'high-elf', 'human'],
    levels: [{ title: 'Crossbowman', status: 'Silver 1' }, { title: 'Siege Specialist', status: 'Silver 3' }, { title: 'Sapper', status: 'Silver 5' }, { title: 'Siege Master', status: 'Gold 1' }],
    skills: ['Athletics', 'Climb', 'Consume Alcohol', 'Endurance', 'Gamble', 'Gossip', 'Language (Battle)', 'Melee (Basic)', 'Outdoor Survival', 'Ranged (Crossbow)'],
    talents: ['Etiquette (Mercenaries)', 'Marksman', 'Rapid Reload', 'Strong Back'],
    trappings: ['Crossbow and Ammunition', 'Hand Weapon', 'Pavise', 'Leather Jack and Skullcap', 'Feathered Hat'] },
]

// ── RANDOM TALENTS TABLE ────────────────────────────────────────────────────
// d100 → talent. Humans roll 3 times, Halflings 2, the rest 0 (see SPECIES).
export const RANDOM_TALENTS = [
  { range: '01–03', talent: 'Acute Sense (Any)' },
  { range: '04–06', talent: 'Ambidextrous' },
  { range: '07–09', talent: 'Animal Affinity' },
  { range: '10–12', talent: 'Artistic' },
  { range: '13–15', talent: 'Attractive' },
  { range: '16–18', talent: 'Coolheaded' },
  { range: '19–21', talent: 'Craftsman (Any)' },
  { range: '22–24', talent: 'Flee!' },
  { range: '25–28', talent: 'Hardy' },
  { range: '29–31', talent: 'Lightning Reflexes' },
  { range: '32–34', talent: 'Linguistics' },
  { range: '35–38', talent: 'Luck' },
  { range: '39–41', talent: 'Marksman' },
  { range: '42–44', talent: 'Mimic' },
  { range: '45–47', talent: 'Night Vision' },
  { range: '48–50', talent: 'Nimble Fingered' },
  { range: '51–52', talent: 'Noble Blood' },
  { range: '53–55', talent: 'Orientation' },
  { range: '56–58', talent: 'Perfect Pitch' },
  { range: '59–62', talent: 'Pure Soul' },
  { range: '63–65', talent: 'Read/Write' },
  { range: '66–68', talent: 'Resistance (Any)' },
  { range: '69–71', talent: 'Savvy' },
  { range: '72–74', talent: 'Sharp' },
  { range: '75–78', talent: 'Sixth Sense' },
  { range: '79–81', talent: 'Strong Legs' },
  { range: '82–84', talent: 'Sturdy' },
  { range: '85–87', talent: 'Suave' },
  { range: '88–91', talent: 'Super Numerate' },
  { range: '92–94', talent: 'Very Resilient' },
  { range: '95–97', talent: 'Very Strong' },
  { range: '98–00', talent: 'Warrior Born' },
]

// Pick a random talent from the table (used for species random-talent rolls).
export function rollRandomTalent() {
  return RANDOM_TALENTS[Math.floor(Math.random() * RANDOM_TALENTS.length)].talent
}

// ── STARTING WEALTH ──────────────────────────────────────────────────────────
// Determined by the first career level's Status: per point of Standing you roll
// the listed dice (Gold is a flat amount, not rolled).
export const STARTING_WEALTH = {
  Brass: { perStanding: '2d10', unit: 'brass pennies', d: 10, n: 2, flat: false },
  Silver: { perStanding: '1d10', unit: 'silver shillings', d: 10, n: 1, flat: false },
  Gold: { perStanding: '1', unit: 'gold crowns', flat: true },
}

// ── EQUIPMENT CATALOG (Up in Arms, The Quartermaster's Store pp. 88–102) ──────
// Consolidated gear and weapon tables. Melee items carry `reach`, missile items
// `range` (yards; 'As weapon' for ammunition). `dmg` is the damage column and
// `qualities` the Qualities & Flaws column. Prices use the book's notation
// (GC gold crowns / shillings'/–' / d pennies).
export const UIA_EQUIPMENT = [
  {
    group: 'General Equipment',
    items: [
      { name: 'Theodolite', price: '6 GC', enc: 3, avail: 'Exotic' },
      { name: 'Ostrich Feather', price: '3/–', enc: 0, avail: 'Rare' },
      { name: 'Compass', price: '10/–', enc: 0, avail: 'Scarce' },
      { name: 'Bandoleer', price: '6/–', enc: 1, avail: 'Common' },
      { name: 'Slow Match', price: '2d/yard', enc: 1, avail: 'Common' },
      { name: 'Fuse', price: '3d/yard', enc: 1, avail: 'Scarce' },
      { name: 'Bow String', price: '4/–', enc: 0, avail: 'Common' },
      { name: 'Whetstone', price: '2/6', enc: 0, avail: 'Common' },
      { name: 'Sealskin', price: '30/–', enc: 1, avail: 'Scarce' },
      { name: 'Silk Underwear', price: '1 GC', enc: 0, avail: 'Scarce' },
      { name: "Captain Braun's Multi-Stove", price: '10/–', enc: 3, avail: 'Scarce' },
      { name: "Captain Braun's Insta-Boiler", price: '6/–', enc: 2, avail: 'Scarce' },
    ],
  },
  {
    group: 'Basic Weapons — Melee (Basic)',
    items: [
      { name: 'Axe', price: '10/–', enc: 1, avail: 'Common', reach: 'Average', dmg: '+SB+4', qualities: 'Hack, Unbalanced' },
      { name: 'Ballock Knife', price: '16/–', enc: 0, avail: 'Scarce', reach: 'Very Short', dmg: '+SB+1', qualities: 'Impale*, Penetrating, Precise* (* vs Surprised/Prone only)' },
      { name: 'Club', price: '4/–', enc: 0, avail: 'Common', reach: 'Average', dmg: '+SB+4', qualities: 'Undamaging, Unbalanced' },
      { name: 'Dagger', price: '16/–', enc: 0, avail: 'Common', reach: 'Very Short', dmg: '+SB+2', qualities: '' },
      { name: 'Improvised Weapon', price: 'N/A', enc: 'Varies', avail: 'N/A', reach: 'Varies', dmg: '+SB+1', qualities: 'Undamaging, Unbalanced' },
      { name: 'Knife', price: '8/–', enc: 0, avail: 'Common', reach: 'Very Short', dmg: '+SB+1', qualities: 'Undamaging' },
      { name: 'Mace', price: '15/–', enc: 1, avail: 'Common', reach: 'Average', dmg: '+SB+4', qualities: 'Pummel, Unbalanced' },
      { name: 'Military Pick', price: '15/–', enc: 1, avail: 'Scarce', reach: 'Average', dmg: '+SB+4', qualities: 'Penetrating, Unbalanced' },
      { name: 'Scimitar', price: '1 GC', enc: 1, avail: 'Scarce', reach: 'Short', dmg: '+SB+4', qualities: 'Slash (1A)' },
      { name: 'Sword', price: '1 GC', enc: 1, avail: 'Common', reach: 'Average', dmg: '+SB+4', qualities: '' },
      { name: 'Warhammer', price: '1 GC', enc: 1, avail: 'Scarce', reach: 'Average', dmg: '+SB+4', qualities: 'Unbalanced, Pummel or Penetrating' },
    ],
  },
  {
    group: 'Shields',
    items: [
      { name: 'Shield (Buckler)', price: '18/2', enc: 0, avail: 'Common', reach: 'Personal', dmg: '+SB+1', qualities: 'Shield 1, Defensive, Undamaging' },
      { name: 'Shield', price: '2 GC', enc: 1, avail: 'Common', reach: 'Very Short', dmg: '+SB+2', qualities: 'Shield 2, Defensive, Undamaging' },
      { name: 'Shield (Large)', price: '3 GC', enc: 3, avail: 'Common', reach: 'Very Short', dmg: '+SB+3', qualities: 'Shield 3, Defensive, Undamaging' },
      { name: 'Pavise', price: '3 GC 15/–', enc: 4, avail: 'Rare', reach: 'N/A', dmg: '+SB+2', qualities: 'Shield 5' },
    ],
  },
  {
    group: 'Cavalry Weapons',
    items: [
      { name: 'Cavalry Hammer', price: '3 GC', enc: 3, avail: 'Scarce', reach: 'Long', dmg: '+SB+5', qualities: 'Pummel (uses Melee (Two-Handed))' },
      { name: 'Demi-Lance', price: '1 GC', enc: 2, avail: 'Scarce', reach: 'Long', dmg: '+SB+5*', qualities: 'Impact, Impale (* Improvised when not charging mounted)' },
      { name: 'Lance', price: '1 GC', enc: 3, avail: 'Scarce', reach: 'Very Long', dmg: '+SB+6*', qualities: 'Impact, Impale (* Improvised when not charging mounted)' },
      { name: 'Sabre', price: '2 GC', enc: 1, avail: 'Scarce', reach: 'Average', dmg: '+SB+4', qualities: 'Slash (1A)' },
    ],
  },
  {
    group: 'Fencing Weapons',
    items: [
      { name: 'Foil', price: '5 GC', enc: 1, avail: 'Scarce', reach: 'Average', dmg: '+SB+3', qualities: 'Fast, Impale, Precise, Undamaging' },
      { name: 'Rapier', price: '5 GC', enc: 1, avail: 'Scarce', reach: 'Long', dmg: '+SB+4', qualities: 'Fast, Impale' },
      { name: 'Smallsword', price: '4 GC', enc: 1, avail: 'Scarce', reach: 'Average', dmg: '+SB+2', qualities: 'Fast, Impale, Precise' },
    ],
  },
  {
    group: 'Brawling Weapons',
    items: [
      { name: 'Spiked Gauntlet', price: '2 GC', enc: 1, avail: 'Scarce', reach: 'Personal', dmg: '+SB+3', qualities: 'Impale, Unbalanced' },
      { name: 'Boat Hook', price: '6/–', enc: 0, avail: 'Common', reach: 'Short', dmg: '+SB+4', qualities: 'Trip, Undamaging' },
      { name: 'Garrote', price: '1/–', enc: 0, avail: 'Rare', reach: 'Personal', dmg: '+SB+2', qualities: 'Entangle, Slow, Unbalanced, Undamaging' },
      { name: 'Knuckledusters', price: '2/6', enc: 0, avail: 'Common', reach: 'Personal', dmg: '+SB+2', qualities: '' },
      { name: 'Locked Gauntlet', price: '1 GC', enc: 1, avail: 'Scarce', reach: 'Personal', dmg: '+SB+2', qualities: 'Undamaging' },
      { name: 'Sap', price: '1/–', enc: 0, avail: 'Rare', reach: 'Personal', dmg: '+SB+1', qualities: 'Pummel, Unbalanced, Undamaging' },
    ],
  },
  {
    group: 'Flail Weapons',
    items: [
      { name: 'Grain Flail', price: '10/–', enc: 1, avail: 'Common', reach: 'Average', dmg: '+SB+3', qualities: 'Distract, Imprecise, Wrap' },
      { name: 'Flail', price: '2 GC', enc: 1, avail: 'Scarce', reach: 'Average', dmg: '+SB+5', qualities: 'Distract, Wrap' },
      { name: 'Military Flail', price: '3 GC', enc: 2, avail: 'Rare', reach: 'Long', dmg: '+SB+6', qualities: 'Distract, Impact, Tiring, Wrap' },
    ],
  },
  {
    group: 'Parrying Weapons',
    items: [
      { name: 'Cloak', price: '10/–', enc: 1, avail: 'Common', reach: 'Short', dmg: '+SB+0', qualities: 'Entangle, Defensive, Undamaging' },
      { name: 'Main Gauche', price: '1 GC', enc: 0, avail: 'Rare', reach: 'Very Short', dmg: '+SB+2', qualities: 'Defensive' },
      { name: 'Swordbreaker', price: '1 GC 2/6', enc: 1, avail: 'Scarce', reach: 'Short', dmg: '+SB+1', qualities: 'Defensive, Trap Blade' },
      { name: 'Weighted Net', price: '1 GC 10/–', enc: 1, avail: 'Rare', reach: 'Short', dmg: '+SB+0', qualities: 'Entangle, Defensive, Shield 1, Slow, Undamaging, Wrap' },
    ],
  },
  {
    group: 'Polearms',
    items: [
      { name: 'Ahlspiess', price: '2 GC', enc: 2, avail: 'Scarce', reach: 'Very Long', dmg: '+SB+3', qualities: 'Impale, Penetrating' },
      { name: 'Bill', price: '2 GC', enc: 3, avail: 'Scarce', reach: 'Long', dmg: '+SB+4', qualities: 'Defensive, Hack or Trip' },
      { name: 'Halberd', price: '2 GC', enc: 3, avail: 'Common', reach: 'Long', dmg: '+SB+4', qualities: 'Defensive, Hack or Impale' },
      { name: 'Mancatcher', price: '2 GC', enc: 3, avail: 'Rare', reach: 'Long', dmg: '+SB+2', qualities: 'Defensive, Entangle' },
      { name: 'Partizan/Glaive', price: '2 GC', enc: 3, avail: 'Scarce', reach: 'Long', dmg: '+SB+4', qualities: 'Defensive, Impale or Slash (2A)' },
      { name: 'Pollaxe', price: '2 GC', enc: 3, avail: 'Scarce', reach: 'Long', dmg: '+SB+4', qualities: 'Defensive, Hack or Impale or Pummel' },
      { name: 'Spear', price: '15/–', enc: 2, avail: 'Common', reach: 'Very Long', dmg: '+SB+4', qualities: 'Impale' },
      { name: 'Pike', price: '18/–', enc: 4, avail: 'Rare', reach: 'Massive', dmg: '+SB+4', qualities: 'Impale' },
      { name: 'Quarterstaff', price: '3/–', enc: 2, avail: 'Common', reach: 'Long', dmg: '+SB+4', qualities: 'Defensive, Pummel' },
    ],
  },
  {
    group: 'Two-Handed Weapons',
    items: [
      { name: 'Bastard Sword', price: '8 GC', enc: 3, avail: 'Scarce', reach: 'Long', dmg: '+SB+5', qualities: 'Damaging, Defensive' },
      { name: 'Great Axe', price: '4 GC', enc: 3, avail: 'Common', reach: 'Long', dmg: '+SB+6', qualities: 'Hack, Impact, Tiring' },
      { name: 'Flamberge Zweihander', price: '30 GC', enc: 3, avail: 'Exotic', reach: 'Long', dmg: '+SB+5', qualities: 'Damaging, Hack, Slash (2A)' },
      { name: 'Pick', price: '9/–', enc: 3, avail: 'Common', reach: 'Average', dmg: '+SB+5', qualities: 'Damaging, Impale, Slow' },
      { name: 'Warhammer (Two-handed)', price: '3 GC', enc: 3, avail: 'Common', reach: 'Average', dmg: '+SB+6', qualities: 'Damaging, Pummel, Slow' },
      { name: 'Zweihander', price: '10 GC', enc: 3, avail: 'Scarce', reach: 'Long', dmg: '+SB+5', qualities: 'Damaging, Hack' },
    ],
  },
  {
    group: 'Blackpowder Weapons',
    items: [
      { name: 'Blunderbuss', price: '2 GC', enc: 1, avail: 'Scarce', range: '20', dmg: '+8', qualities: 'Dangerous, Reload 2' },
      { name: 'Hochland Long Rifle', price: '100 GC', enc: 3, avail: 'Exotic', range: '100', dmg: '+9', qualities: 'Accurate, Precise, Reload 4' },
      { name: 'Handgun', price: '4 GC', enc: 2, avail: 'Scarce', range: '50', dmg: '+9', qualities: 'Dangerous, Reload 3' },
      { name: 'Pistol', price: '8 GC', enc: 0, avail: 'Scarce', range: '20', dmg: '+8', qualities: 'Pistol, Reload 1' },
      { name: 'Matchlock Handgun', price: '2 GC', enc: 2, avail: 'Rare', range: '50', dmg: '+8', qualities: 'Dangerous, Reload 4' },
      { name: 'Matchlock Blunderbuss', price: '1 GC', enc: 1, avail: 'Rare', range: '20', dmg: '+7', qualities: 'Spread 3, Dangerous, Reload 3' },
      { name: 'Arquebus', price: '5 GC', enc: 3, avail: 'Exotic', range: '40', dmg: '+9', qualities: 'Dangerous, Imprecise, Reload 5' },
      { name: 'Double-barrelled Handgun', price: '7 GC', enc: 3, avail: 'Exotic', range: '50', dmg: '+9', qualities: 'Dangerous, Repeater 2, Reload 4' },
      { name: 'Griffonfoot Pistol', price: '10 GC', enc: 1, avail: 'Exotic', range: '10', dmg: '+7', qualities: 'Imprecise, Spread 5, Reload 6' },
      { name: 'Gun Axe', price: '8 GC', enc: 1, avail: 'Exotic', range: '30', dmg: '+9', qualities: 'Imprecise, Dangerous, Reload 4' },
      { name: 'Gun Halberd', price: '10 GC', enc: 3, avail: 'Exotic', range: '30', dmg: '+9', qualities: 'Imprecise, Dangerous, Reload 4' },
    ],
  },
  {
    group: 'Engineering Weapons',
    items: [
      { name: 'Repeater Handgun', price: '10 GC', enc: 3, avail: 'Rare', range: '30', dmg: '+9', qualities: 'Dangerous, Reload 5, Repeater 4' },
      { name: 'Repeater Pistol', price: '15 GC', enc: 1, avail: 'Rare', range: '10', dmg: '+8', qualities: 'Dangerous, Pistol, Reload 4, Repeater 4' },
      { name: 'Pepperbox', price: '12 GC', enc: 1, avail: 'Rare', range: '10', dmg: '+8', qualities: 'Dangerous, Pistol, Reload 4, Repeater 4 (manual rotation)' },
      { name: 'Hand Mortar', price: '50 GC', enc: 3, avail: 'Exotic', range: '30', dmg: '+7', qualities: 'Dangerous, Imprecise, Reload 2' },
      { name: 'Cane Pistol', price: '15 GC', enc: 1, avail: 'Exotic', range: '10', dmg: '+8', qualities: 'Dangerous, Imprecise, Reload 6' },
    ],
  },
  {
    group: 'Ammunition (Traditional)',
    items: [
      { name: 'Arrow (12)', price: '5/–', enc: 0, avail: 'Common', range: 'As weapon', dmg: '–', qualities: 'Impale' },
      { name: 'Barbed Arrow (12)', price: '8/–', enc: 0, avail: 'Scarce', range: 'As weapon', dmg: '–', qualities: 'Impale, Slash (1A)' },
      { name: 'Bodkin Arrow (12)', price: '8/–', enc: 0, avail: 'Scarce', range: 'As weapon', dmg: '–', qualities: 'Impale, Penetrating' },
      { name: 'Elf Arrow', price: '6/–', enc: 0, avail: 'Exotic', range: '+50', dmg: '+1', qualities: 'Accurate, Impale, Penetrating' },
      { name: 'Sharp Stick', price: 'N/A', enc: 0, avail: 'Common', range: 'Half weapon', dmg: '–2', qualities: 'Dangerous, Imprecise, Undamaging' },
      { name: 'Bolt (12)', price: '5/–', enc: 0, avail: 'Common', range: 'As weapon', dmg: '–', qualities: 'Impale' },
      { name: 'Lead Bullet (12)', price: '4d', enc: 0, avail: 'Common', range: '–10', dmg: '+1', qualities: 'Pummel' },
      { name: 'Pebble', price: 'N/A', enc: 0, avail: 'Common', range: '–10', dmg: '–2', qualities: 'Imprecise, Undamaging' },
      { name: 'Stone Bullet (12)', price: '2d', enc: 0, avail: 'Common', range: 'As weapon', dmg: '–', qualities: 'Pummel' },
    ],
  },
  {
    group: 'Ammunition (Blackpowder & Engineering)',
    items: [
      { name: 'Bullet and Powder (12)', price: '3/3', enc: 0, avail: 'Common', range: 'As weapon', dmg: '+1', qualities: 'Impale, Penetrating' },
      { name: 'Paper Cartridge (12)', price: '5/–', enc: 0, avail: 'Scarce', range: 'As weapon', dmg: '+1', qualities: 'Impale, Penetrating (+10 to reload a suitable weapon)' },
      { name: 'Aqshy-Infused Powder (12)', price: '1 GC', enc: 0, avail: 'Exotic', range: '+10', dmg: '+2', qualities: 'Impale, Penetrating (failed Test on 10s die counts as Fumble)' },
      { name: 'Precision Shot and Powder (12)', price: '3/–', enc: 0, avail: 'Common', range: 'As weapon', dmg: '+1', qualities: 'Impale, Penetrating, Precise' },
      { name: 'Improvised Shot and Powder', price: '3d', enc: 0, avail: 'Common', range: 'Half weapon', dmg: '–', qualities: '' },
      { name: 'Small Shot and Powder (12)', price: '3/3', enc: 0, avail: 'Common', range: 'As weapon', dmg: '–', qualities: 'Spread +3' },
      { name: 'Scrap and Powder (12)', price: '2/–', enc: 0, avail: 'Common', range: 'Half weapon', dmg: '–1', qualities: 'Spread +3, Infected' },
      { name: 'Large Bullet and Powder (12)', price: '1 GC', enc: 0, avail: 'Scarce', range: 'As weapon', dmg: '+2', qualities: 'Impale, Impact, Penetrating' },
      { name: 'Bomb', price: '3 GC', enc: 0, avail: 'Rare', range: 'As weapon', dmg: '+5', qualities: 'Blast 5, Dangerous, Impact' },
      { name: 'Incendiary', price: '1 GC', enc: 0, avail: 'Scarce', range: 'As weapon', dmg: 'Special', qualities: 'Blast 4, Dangerous' },
      { name: 'Grapple', price: '2 GC', enc: 1, avail: 'Scarce', range: 'Half weapon', dmg: '+2', qualities: 'Penetrating, Reload +2' },
    ],
  },
]

// One-line trapping text for a catalog item (what lands in the inventory list).
export function equipmentItemText(item) {
  const stats = []
  if (item.reach && item.reach !== 'N/A') stats.push(`Reach ${item.reach}`)
  if (item.range) stats.push(`Range ${item.range}`)
  if (item.dmg && item.dmg !== '–') stats.push(`Dmg ${item.dmg}`)
  if (item.qualities) stats.push(item.qualities)
  return stats.length ? `${item.name} (${stats.join('; ')})` : item.name
}

// ── XP BONUSES ────────────────────────────────────────────────────────────────
// Bonus XP granted for accepting random results during creation.
export const XP_BONUSES = {
  species: 20, // accept the random species roll
  careerFirstRoll: 50, // accept the first random career roll
  careerPickOfThree: 25, // roll three and pick one
  charKeep: 50, // keep rolled characteristics in order
  charRearrange: 25, // rearrange the rolled values, then keep
}

// ── ADVANCEMENT XP COSTS (rulebook p.47) ───────────────────────────────────────
// Cost per advance, in 5-advance bands: 0–5, 6–10, 11–15, … 66–70, then 70+.
// The band is chosen by how many advances have ALREADY been taken.
export const CHAR_ADV_COSTS = [25, 30, 40, 50, 70, 90, 120, 150, 190, 230, 280, 330, 390, 450, 520]
export const SKILL_ADV_COSTS = [10, 15, 20, 30, 40, 60, 80, 110, 140, 180, 220, 270, 320, 380, 440]

const bandCost = (table, already) => table[Math.min(Math.floor((already || 0) / 5), table.length - 1)]

// Cost of the NEXT advance given how many are already taken.
export const charAdvanceCost = (already) => bandCost(CHAR_ADV_COSTS, already)
export const skillAdvanceCost = (already) => bandCost(SKILL_ADV_COSTS, already)
// A talent costs 100 XP × (times already taken + 1).
export const talentCost = (timesAlready) => 100 * ((timesAlready || 0) + 1)

// Advances required in each Characteristic / 8 Skills / 1 Talent to COMPLETE a
// career level, indexed by level (1→4). Completing unlocks moving to the next
// level, which raises Status and costs CAREER_CHANGE_COST.
export const CAREER_LEVEL_ADVANCES = [5, 10, 15, 20]
export const CAREER_CHANGE_COST = 100 // XP to move to a new level of a completed career
export const CAREER_CHANGE_INCOMPLETE_COST = 200 // changing career before completing the current level
export const CAREER_CHANGE_CROSS_CLASS = 100 // surcharge for entering a career in a different Class

// Cost (XP) to change to a brand-new career at its first level.
export function careerChangeCost(completed, sameClass) {
  return (completed ? CAREER_CHANGE_COST : CAREER_CHANGE_INCOMPLETE_COST) + (sameClass ? 0 : CAREER_CHANGE_CROSS_CLASS)
}

// Cumulative cost to buy `n` characteristic advances from scratch.
export function costForCharAdvances(n) {
  let total = 0
  for (let i = 0; i < n; i += 1) total += charAdvanceCost(i)
  return total
}
// Cumulative cost to buy `purchased` skill advances on top of `creationAdv`
// free advances (the band is based on total advances already taken).
export function costForSkillAdvances(creationAdv, purchased) {
  let total = 0
  for (let i = 0; i < purchased; i += 1) total += skillAdvanceCost((creationAdv || 0) + i)
  return total
}

// ── SKILL/TALENT ALLOCATION RULES ──────────────────────────────────────────────
export const SPECIES_SKILL_RULE = { at5: 3, at3: 3 } // 3 skills @ +5, 3 skills @ +3
export const SPECIES_SKILL_ADVANCES = SPECIES_SKILL_RULE.at5 * 5 + SPECIES_SKILL_RULE.at3 * 3 // 24
export const CAREER_SKILL_ADVANCES = 40
export const CAREER_SKILL_CAP = 10 // max advances per single skill at creation

// ── DETAIL TABLES ─────────────────────────────────────────────────────────────
// Simple example name pools per species for the Adding Detail step (the rulebook
// offers far longer lists; these are enough to roll something evocative).
export const NAME_POOLS = {
  human: ['Adhemar', 'Anders', 'Artur', 'Beatrijs', 'Clementia', 'Detlev', 'Helga', 'Henryk', 'Irmina', 'Jehanne', 'Karl', 'Kruger', 'Lorelay', 'Marieke', 'Sieghard', 'Wilhelmina'],
  dwarf: ['Bardin', 'Dolgan', 'Grombrindal', 'Gunnar', 'Kazador', 'Morgrim', 'Snorri', 'Thorgrim', 'Brunhilda', 'Helga'],
  halfling: ['Anrik', 'Hisme', 'Lowenna', 'Mossy', 'Pim', 'Rosa', 'Sam', 'Tobble', 'Wim'],
  'high-elf': ['Aurelion', 'Caradryel', 'Elurien', 'Fellaeth', 'Imrik', 'Liriel', 'Tyrion', 'Yrtle'],
  'wood-elf': ['Araloth', 'Drycha', 'Elatha', 'Fendrel', 'Naieth', 'Sceolan', 'Sylvine', 'Wychwethyl'],
}

// ── SKILL → CHARACTERISTIC ─────────────────────────────────────────────────
// Governing characteristic for each WFRP skill, so the sheet can show a skill
// total (characteristic + advances). Keyed by the skill's base name (the part
// before any parenthetical specialism, e.g. "Melee" for "Melee (Basic)").
export const SKILL_CHAR = {
  Art: 'Dex', Athletics: 'Ag', Bribery: 'Fel', Charm: 'Fel', 'Charm Animal': 'WP',
  Climb: 'S', Cool: 'WP', 'Consume Alcohol': 'T', Dodge: 'Ag', Drive: 'Ag',
  Endurance: 'T', Entertain: 'Fel', Gamble: 'Int', Gossip: 'Fel', Haggle: 'Fel',
  Intimidate: 'S', Intuition: 'I', Leadership: 'Fel', Melee: 'WS', Navigation: 'I',
  'Outdoor Survival': 'Int', Perception: 'I', Ride: 'Ag', Row: 'S', Stealth: 'Ag',
  'Animal Care': 'Int', 'Animal Training': 'WP', Channelling: 'WP', Evaluate: 'Int',
  Heal: 'Int', Lore: 'Int', Language: 'Int', Ranged: 'BS', Research: 'Int',
  Sail: 'Ag', 'Set Trap': 'Dex', 'Sleight of Hand': 'Dex', Swim: 'S', Track: 'I',
  Trade: 'Dex', Play: 'Dex', Pray: 'Fel', Perform: 'Ag', 'Secret Signs': 'Int',
}

// The governing characteristic key for a (possibly specialised) skill name.
export function skillCharacteristic(name) {
  if (!name) return null
  if (SKILL_CHAR[name]) return SKILL_CHAR[name]
  const base = name.replace(/\s*\(.*\)\s*$/, '').trim()
  return SKILL_CHAR[base] || null
}

// Eye- and hair-colour options per species, drawn from the rulebook's Eye/Hair
// Colour tables (p. 38). Randomising picks one uniformly.
export const EYE_COLOURS = {
  human: ['Green', 'Pale Blue', 'Blue', 'Pale Grey', 'Grey', 'Brown', 'Hazel', 'Dark Brown', 'Black'],
  dwarf: ['Coal', 'Lead', 'Steel', 'Blue', 'Earth Brown', 'Dark Brown', 'Hazel', 'Green', 'Copper'],
  halfling: ['Light Grey', 'Grey', 'Pale Blue', 'Blue', 'Green', 'Hazel', 'Brown', 'Copper', 'Dark Brown'],
  'high-elf': ['Amethyst', 'Aquamarine', 'Sapphire', 'Turquoise', 'Emerald', 'Amber', 'Copper', 'Citrine', 'Gold'],
  'wood-elf': ['Charcoal', 'Ivy Green', 'Mossy Green', 'Chestnut', 'Dark Brown', 'Tan', 'Sandy Brown', 'Violet'],
}

export const HAIR_COLOURS = {
  human: ['White Blond', 'Golden Blond', 'Red Blond', 'Golden Brown', 'Light Brown', 'Dark Brown', 'Black', 'Auburn', 'Red', 'Grey'],
  dwarf: ['White', 'Grey', 'Pale Blond', 'Golden', 'Copper', 'Brown', 'Dark Brown', 'Reddish Brown', 'Black'],
  halfling: ['Grey', 'Flaxen', 'Russet', 'Honey', 'Chestnut', 'Mustard', 'Almond', 'Chocolate', 'Liquorice'],
  'high-elf': ['Silver', 'White', 'Pale Blond', 'Blond', 'Yellow Blond', 'Copper Blond', 'Red Blond', 'Red', 'Black'],
  'wood-elf': ['Birch Silver', 'Ash Blond', 'Rose Gold', 'Honey Blond', 'Brown', 'Mahogany Brown', 'Dark Brown', 'Sienna', 'Blue-Black'],
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
export const rollEyeColour = (speciesId) => pick(EYE_COLOURS[speciesId] || EYE_COLOURS.human)
export const rollHairColour = (speciesId) => pick(HAIR_COLOURS[speciesId] || HAIR_COLOURS.human)

// Roll a height from a species' height formula (e.g. `4'9" + 2d10"`), returning
// a formatted feet'inches" string.
export function rollHeight(species) {
  if (!species) return ''
  const m = String(species.height).match(/(\d+)'(\d+)"\s*\+\s*(\d+)d(\d+)/)
  if (!m) return ''
  const baseInches = Number(m[1]) * 12 + Number(m[2])
  const n = Number(m[3]), d = Number(m[4])
  let add = 0
  for (let i = 0; i < n; i += 1) add += 1 + Math.floor(Math.random() * d)
  const total = baseInches + add
  return `${Math.floor(total / 12)}'${total % 12}"`
}

export const speciesById = (id) => SPECIES.find((s) => s.id === id) || null
export const careerById = (id) => CAREERS.find((c) => c.id === id) || null
export const classById = (id) => CLASSES.find((c) => c.id === id) || null
export const careersByClass = (classId) => CAREERS.filter((c) => c.classId === classId)
