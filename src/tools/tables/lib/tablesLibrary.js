import { v4 as uuid } from 'uuid'

export const TABLES_KEY = 'tables:library'
export const TABLES_VERSION = 1
export const MAX_HISTORY = 30

// Helper for compact starter-pack definitions: name, description, then
// each entry text as a string. All entries get default weight 1.
function pack(name, description, ...entries) {
  return {
    name,
    description,
    entries: entries.map((text) => ({ text })),
  }
}

export const STARTER_TABLES = [
  pack(
    'NPC name (fantasy)',
    'A general-purpose first-name pool — mix of cultures and tones.',
    'Aila', 'Bram', 'Cael', 'Doryn', 'Eira', 'Faelan', 'Greta', 'Hesta',
    'Ilya', 'Jorin', 'Kael', 'Loren', 'Mira', 'Nessa', 'Orin', 'Petra',
    'Quill', 'Rolan', 'Sera', 'Tomas', 'Una', 'Vael', 'Wren', 'Yara',
    'Zorin', 'Aldric', 'Brena', 'Corwin', 'Dara', 'Elias',
  ),

  pack(
    'NPC profession',
    'A trade or station to anchor an unnamed person.',
    'Apothecary', 'Baker', 'Beggar', 'Blacksmith', 'Bookbinder', 'Brewer',
    'Caravan guard', 'Cartographer', 'Cobbler', 'Cooper', 'Courier',
    'Farmer', 'Fishmonger', 'Hedge witch', 'Herbalist', 'Hunter',
    'Innkeeper', 'Jeweler', 'Locksmith', 'Mason', 'Miller', 'Minstrel',
    'Pickpocket', 'Priest', 'Sage', 'Scribe', 'Tanner', 'Tax collector',
    'Tinker', 'Weaver',
  ),

  pack(
    'NPC appearance',
    'A distinguishing feature so they are remembered.',
    'A pale scar from forehead to chin',
    'Eyes of two different colors',
    'A milky-white left eye',
    'Three fingers on the off hand',
    'A perpetually crooked smile',
    'Heavy bags under the eyes',
    'Hair shaved on one side',
    'A neck tattoo half-hidden by a collar',
    'A missing front tooth',
    'A tongue too quick for the face',
    'Scars on the knuckles',
    'A nervous tic in the left eye',
    'A faint scent of lavender',
    'Calluses from a craft long abandoned',
    'A limp on the right side',
    'Hands stained with old ink',
    "A laugh that doesn't reach the eyes",
    'An ear lobe with three rings',
    'A faint birthmark on the cheek',
    'Posture too straight for a peasant',
  ),

  pack(
    'Tavern name',
    'A place to drink, rest, or be overheard.',
    'The Crooked Goat', 'The Sleeping Dragon', 'Three Oaks',
    'The Last Lantern', "Mother Bess's", 'The Salty Crow',
    'The Wayfarer', 'Hood and Hatchet', 'The Brass Anchor',
    'The Painted Door', 'Old Hen and Hammer', 'The Quiet Mug',
    'The Drunken Friar', 'The Burnt Loaf', 'The Silver Stag',
    'The Drowned Rat', 'The Cracked Bell', 'The Iron Knot',
    "The Pilgrim's Cup", 'The Singing Stone', 'The Foxhound',
    'The Last Coin', 'The Tilting Tankard', 'The Cold Hearth',
  ),

  pack(
    'Tavern patron',
    "Who's at the bar tonight?",
    'A merchant nursing wine and reading a folded letter.',
    'A pair of soldiers — one drunk, one wary.',
    'A hooded figure who flinches when the door opens.',
    'A bard tuning a stringed instrument too slowly.',
    "Three apprentices arguing about a master's debt.",
    "An old woman who hasn't said a word in an hour.",
    'A traveler tracing a map on the table with a finger.',
    'A young noble pretending not to be one.',
    'Twin brothers playing dice for stupid stakes.',
    'A hunter with a fresh wound and a story.',
    'A scribe sketching the regulars.',
    "A retired adventurer who's told this tale before.",
    'A priest of an obscure local saint.',
    'A cook taking a rare break, smelling of onions.',
    'A drunk singing the wrong words to a familiar song.',
    'A smuggler arguing prices in low tones with the keeper.',
  ),

  pack(
    'Rumour',
    'Something overheard or whispered.',
    "The miller's youngest hasn't been seen in three days.",
    'Lights have been moving on the old hill at night.',
    'A stranger paid the inn in foreign coin.',
    'The trail through the wood is washed out, but a path no one remembers is open instead.',
    "The reeve's son's hand is bandaged and he's saying nothing.",
    'A wolf has been seen too close to the village, and not behaving like a wolf.',
    'The shrine on the hill has new offerings, but no one will say from whom.',
    'A peddler is selling charms that he claims work.',
    'The high road is closed but the toll-collector is still there.',
    'Cattle have stopped grazing the south meadow.',
    'A child described, in detail, a person no one knows.',
    'The river ran black for an hour at dawn.',
    'Old debts are being collected by someone new.',
    'A rider came at midnight, asked for the priest, left at dawn.',
    "There's a coin minted in a kingdom that hasn't existed for years.",
    "The cooper's apprentice has been talking in his sleep — and not in his own voice.",
  ),

  pack(
    'Plot hook',
    'A seed for the next session.',
    'A box arrives addressed to no one, locked, and humming faintly.',
    "A child says they've seen the same dream three nights running, and so has another child.",
    'A merchant offers an absurd reward for the safe escort of an ordinary-looking crate.',
    "A friend's letter ends mid-sentence.",
    'A bell tolls in a church no one remembers being there yesterday.',
    'The price of bread has tripled overnight in the next town.',
    'A friendly NPC asks the party to deliver a message they cannot read.',
    "A coin from the party's last reward turns out to be cursed.",
    'A familiar face on a wanted poster — but the name is wrong.',
    'The lord summons the party for a private audience and arrives wounded.',
    "A map is drawn into the dust at the inn's door each morning, fading by noon.",
    'An old enemy sends a gift.',
    'The party wakes covered in soot and cannot remember the night.',
    'The well in the village square reflects the wrong sky.',
  ),

  pack(
    'Wilderness encounter',
    'A meeting on the road, in the woods, or off the trail.',
    'A pack of wild dogs, hungry and bold.',
    'A merchant cart, axle broken, owner panicked.',
    'A hooded rider going the other way, who never looks up.',
    'A copse where every tree has been bled to mark a path.',
    'A child, alone and unhurt, refusing to speak.',
    'Smoke on the wind from no fire you can see.',
    'A clearing where the grass has been pressed flat in a circle.',
    "A wounded animal that doesn't run from you.",
    'A stone with new markings on it.',
    'A hunter who claims the woods are wrong today.',
    'A traveler with a story too good for these parts.',
    'A shrine, freshly tended, far from any town.',
    'Birds wheeling over a single point a mile off.',
    'Footprints that go forward and stop.',
    'A stretch of road where the air feels thick.',
    'A messenger riding too hard for safety.',
  ),

  pack(
    'Urban encounter',
    "Something happens on the city's streets.",
    'A pickpocket bumps into the party and apologizes too much.',
    "A street performer's audience scatters mid-song.",
    'A dog refuses to enter a particular shop.',
    'Two guards argue in a side street about who saw what.',
    'A child hands the party a folded note, then runs.',
    "A wagon spills its contents — what was inside isn't what was claimed.",
    "A duel has just ended; the winner is calm, the watch isn't.",
    "Funeral procession of someone the city doesn't agree was important.",
    "Someone is selling something cheap that obviously isn't theirs.",
    'A street preacher names the party in his sermon.',
    'Beggars cluster around a doorway no one will enter.',
    'A horse collapses and people argue about whose it is.',
    'A merchant runs after a customer for the wrong reason.',
    "A patrol stops the party to ask about someone matching their description.",
    'Two children play a game that involves a chant in a dead language.',
    'A door opens of its own accord, briefly, then closes.',
  ),

  pack(
    'Mundane loot',
    'What you find in a pocket, a pouch, a drawer.',
    'A handful of polished river stones.',
    'Three dice carved from bone.',
    'A cracked pewter spoon.',
    'A sealed bottle, contents unknown.',
    'A small brass bell on a leather thong.',
    'A single fine silver button.',
    "A child's drawing of a stranger.",
    'A coil of strong, thin wire.',
    'A bundle of dried herbs, unlabeled.',
    'A chipped ceramic cup with a faded crest.',
    'A wax seal stamp of an unfamiliar sigil.',
    'A half-eaten loaf of dark bread.',
    "A wooden whistle that doesn't make a sound.",
    'A ring of keys, none fitting any lock you know.',
    'A bone needle and gut thread.',
    'A folded scrap of vellum with a list of names crossed out.',
  ),

  pack(
    'Magic-item spark',
    'The small twist that makes an item interesting.',
    "The wielder briefly hears their own thoughts in another voice.",
    'Once per day, the holder dreams a true thing about a stranger.',
    'In firelight the metal looks like another metal entirely.',
    "Animals will not approach within an arm's length of it.",
    'Snow does not stick to the bearer.',
    'Coins balanced on it never fall.',
    'The bearer can always tell true north.',
    "Plants nearby grow, slightly, when it's drawn.",
    'It hums faintly when a lie is spoken in its presence.',
    'It feels warm to the bearer even in winter.',
    'Once a month, it weighs nothing for an hour.',
    'It has a name no one taught you.',
    'Birds that see it follow for a while.',
    'Its shadow lags by half a heartbeat.',
  ),

  pack(
    'Weather today',
    "What the sky is doing.",
    'Clear and cold; breath visible.',
    'Overcast with low, heavy clouds.',
    'Steady, fine drizzle.',
    'Bright sun and a sharp wind.',
    'Fog so thick the next building is rumour.',
    'A morning of rain, an afternoon of sun.',
    'Cloudless and hot; the road shimmers.',
    'Sleet, sharp enough to sting.',
    'Heavy snow, falling straight down.',
    'Wind out of an unusual quarter.',
    'Threatening sky that never breaks.',
    'A still grey day — no wind, no birds.',
    "Light snow that doesn't settle.",
    'Hail for ten minutes, then nothing.',
    'Warm and humid; everything sticks.',
    'Strange amber light, like dusk at midday.',
  ),

  pack(
    'Distant sound',
    'The noise that breaks the silence.',
    'A bell, tolling once, far off.',
    'The clatter of something metal falling, thrice.',
    'A long, drawn-out note from no instrument you know.',
    "Children laughing where there shouldn't be children.",
    'A horse, distressed, then silent.',
    'A door slamming, again, the same door.',
    'Wood splitting under weight.',
    "A song with words you can almost catch.",
    'Something heavy being dragged.',
    'A whistle, three sharp notes.',
    'Wings, large, moving fast.',
    'Many small footsteps, not running.',
    'A blade being drawn, then sheathed.',
    "A laugh that isn't quite a laugh.",
  ),

  pack(
    'Strange smell',
    "What your nose catches that shouldn't be there.",
    'Something sweet, just on the edge of cloying.',
    'Wet stone and old rust.',
    "Smoke that doesn't smell of any wood you know.",
    'A scent of cooking from an empty kitchen.',
    'Fresh bread where there is no bakery.',
    'A perfume someone you used to know wore.',
    'The clean cold smell of deep water.',
    'Dry leaves underfoot in the wrong season.',
    'Lamp oil, faint, with a metallic edge.',
    'Animal musk, but not from any animal you can name.',
    'Brine, far from any sea.',
    'The aftermath of a fire long since extinguished.',
  ),

  pack(
    'Critical hit flair',
    'Description for a clean blow.',
    'A clean, decisive blow — the kind bards exaggerate later.',
    'Knocks the target back a full pace.',
    "Splits the haft of an enemy's weapon.",
    'Sends a helmet rolling.',
    'Draws a long line of bright blood across cloth.',
    'Lifts the target from their feet for an instant.',
    'Lodges, briefly; you have to twist it free.',
    'Shears straps and laces in a way that exposes more than the wound.',
    'A glancing blow that nonetheless strikes a nerve — they go briefly numb.',
    'The stroke smashes the buckle of a belt; pouches fall.',
    'Strikes near the eye; vision in that eye is impaired.',
    'Ribs crack audibly.',
    'Disarms; their weapon spins through the air.',
    'The crack of the strike echoes off nearby walls.',
  ),

  pack(
    'Mishap on a long rest',
    'What went a little wrong overnight.',
    'Boots are wet through; takes an hour to dry them.',
    "Someone's cloak was torn by a careless branch.",
    'A pack of dried meat went off in the night.',
    'A small thief took something — a coin, a needle, a button.',
    'The watch missed an hour, and there are unfamiliar tracks just beyond camp.',
    'A horse came up lame in the night.',
    "A dream so vivid one of you can't shake it.",
    'Rain found the gear despite the cover.',
    'A spell focus has hairline cracks none of you can explain.',
    'The fire died early; everyone is colder than they should be.',
    'A flask of water tastes faintly of iron in the morning.',
    "One of you woke with a feeling that shouldn't be there yet.",
    'A bowstring snapped without being touched.',
    'A page is missing from a book you keep close.',
  ),
]

export function newEntry(overrides = {}) {
  return {
    id: uuid(),
    text: overrides.text ?? '',
    weight: clampWeight(overrides.weight ?? 1),
  }
}

export function newTable(overrides = {}) {
  return {
    id: uuid(),
    name: overrides.name ?? 'New table',
    description: overrides.description ?? '',
    entries: overrides.entries
      ? overrides.entries.map(newEntry)
      : [newEntry({ text: '' })],
  }
}

function clampWeight(w) {
  const n = Number(w)
  if (!isFinite(n) || n < 0) return 1
  return Math.min(1000, Math.max(0, n))
}

export function emptyLibrary() {
  return {
    version: TABLES_VERSION,
    tables: [
      newTable({
        name: 'Random NPC quirk',
        description: 'Roll for a quick NPC mannerism.',
        entries: [
          { text: 'Speaks in a constant whisper.' },
          { text: 'Refers to themselves in the third person.' },
          { text: 'Always hungry; eats during conversations.' },
          { text: 'Carries a small, fidget-worthy talisman.' },
          { text: 'Suspicious of anyone in good shoes.' },
          { text: 'Has a beloved pet they mention often.' },
          { text: 'Avoids saying their own name aloud.' },
          { text: 'Constantly checks the position of the sun or moon.' },
          { text: 'Always pays in copper, even for large purchases.' },
          { text: 'Sneezes when telling a lie.' },
          { text: 'Hates being touched on the shoulder.' },
          { text: 'Counts coins three times before pocketing them.' },
          { text: 'Wears too many rings; jingles when walking.' },
          { text: 'Speaks with a foreign accent that slips when angry.' },
          { text: 'Quotes a long-dead philosopher in every conversation.' },
          { text: 'Insists doors should always be closed behind people.' },
          { text: 'Carries a notebook full of unfinished poems.' },
          { text: 'Knows the name of every dog in town.' },
          { text: 'Suspects every shadow contains an agent of an old enemy.' },
          { text: 'Smells faintly of a strong, unidentifiable spice.' },
          { text: 'Has one milk-white eye that twitches when nervous.' },
          { text: 'Begins every sentence with "Now, listen here…"' },
          { text: 'Sings under their breath while working.' },
          { text: 'Refuses to enter a building without first asking permission.' },
          { text: 'Cracks knuckles after every controversial statement.' },
          { text: 'Owes money to a dangerous person and avoids the topic.' },
          { text: 'Believes themselves the rightful heir of a forgotten title.' },
          { text: 'Names every weapon they own.' },
          { text: 'Talks to a hand-puppet they keep in their belt.' },
          { text: 'Insists on shaking hands twice before any deal.' },
          { text: 'Lost a sibling and mistakes strangers for them.' },
          { text: 'Refuses to make eye contact with anyone in armor.' },
          { text: 'Has a perfect memory for prices but forgets faces.' },
          { text: 'Fingers a holy symbol whenever startled.' },
          { text: 'Grew up at sea and finds inland weather unsettling.' },
          { text: 'Loves riddles, hates straight answers.' },
          { text: 'Once survived a wolf attack and never wears wool.' },
          { text: 'Calls everyone, regardless of age, "kid".' },
          { text: 'Carries a flask of something they never offer to share.' },
          { text: 'Eats only food they cooked themselves.' },
          { text: 'Reads the bones of animals to plan their day.' },
          { text: 'Refuses to step on shadows during the day.' },
          { text: 'Always sits with their back to a wall.' },
          { text: 'Has been thrown out of three taverns this month.' },
          { text: 'Wears a coat several sizes too large, "in case I grow into it".' },
          { text: 'Believes they are being followed by a kindly ghost.' },
          { text: 'Translates aloud what their dog or horse "is thinking".' },
          { text: 'Whispers to plants in the marketplace.' },
          { text: 'Loves bad puns and rates them out of ten.' },
          { text: 'Will not light a fire on the first night of a journey.' },
        ],
      }),
    ],
    activeTableId: null,
    history: [],
  }
}

export function migrateLibrary(value) {
  if (!value || typeof value !== 'object') return emptyLibrary()
  const tables = Array.isArray(value.tables)
    ? value.tables.map((t) => ({
        id: t.id ?? uuid(),
        name: typeof t.name === 'string' ? t.name : 'Table',
        description: typeof t.description === 'string' ? t.description : '',
        entries: Array.isArray(t.entries) && t.entries.length > 0
          ? t.entries.map((e) => ({
              id: e.id ?? uuid(),
              text: typeof e.text === 'string' ? e.text : '',
              weight: clampWeight(e.weight ?? 1),
            }))
          : [newEntry()],
      }))
    : []
  return {
    version: TABLES_VERSION,
    tables,
    activeTableId:
      tables.find((t) => t.id === value.activeTableId)?.id ??
      tables[0]?.id ??
      null,
    history: Array.isArray(value.history) ? value.history.slice(0, MAX_HISTORY) : [],
  }
}

export function rollTable(table) {
  // Filter out empty-text entries before rolling so blank rows aren't
  // hit as a valid result.
  const usable = table.entries.filter((e) => e.text.trim() && e.weight > 0)
  if (usable.length === 0) return null
  const total = usable.reduce((s, e) => s + e.weight, 0)
  let r = Math.random() * total
  for (const e of usable) {
    r -= e.weight
    if (r <= 0) return e
  }
  return usable[usable.length - 1]
}

export function addHistoryEntry(library, tableId, tableName, entry) {
  const item = {
    id: uuid(),
    at: Date.now(),
    tableId,
    tableName,
    text: entry.text,
  }
  return { ...library, history: [item, ...library.history].slice(0, MAX_HISTORY) }
}

// Adds every STARTER_TABLES entry that the library doesn't already have
// by name (case-insensitive). Returns { library, addedCount }.
export function applyStarterPack(library) {
  const existing = new Set(
    library.tables.map((t) => t.name.trim().toLowerCase()),
  )
  const additions = STARTER_TABLES.filter(
    (t) => !existing.has(t.name.toLowerCase()),
  ).map((t) => newTable(t))
  return {
    library: { ...library, tables: [...library.tables, ...additions] },
    addedCount: additions.length,
  }
}

/* ---------- Export / Import ---------- */
function safeFilename(name) {
  return (name || 'table').replace(/[^a-z0-9-_ ]/gi, '_').trim() || 'table'
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

export function downloadTableJson(table) {
  triggerDownload(
    { kind: 'randomTable', version: TABLES_VERSION, table },
    `${safeFilename(table.name)}.table.json`,
  )
}

export function downloadLibraryJson(library) {
  triggerDownload(library, 'tables-library.json')
}

function normalizeTableForImport(t) {
  return {
    id: uuid(),
    name: typeof t.name === 'string' && t.name ? t.name : 'Imported table',
    description: typeof t.description === 'string' ? t.description : '',
    entries:
      Array.isArray(t.entries) && t.entries.length > 0
        ? t.entries.map((e) => ({
            id: uuid(),
            text: typeof e.text === 'string' ? e.text : '',
            weight: clampWeight(e.weight ?? 1),
          }))
        : [newEntry()],
  }
}

// Returns { kind: 'table', table } or { kind: 'library', library }.
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
        if (parsed.kind === 'randomTable' && parsed.table) {
          resolve({ kind: 'table', table: normalizeTableForImport(parsed.table) })
          return
        }
        if (Array.isArray(parsed.tables)) {
          resolve({ kind: 'library', library: migrateLibrary(parsed) })
          return
        }
        reject(new Error('File does not look like a tables export.'))
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}
