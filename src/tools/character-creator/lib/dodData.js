// Drakar och Demoner (1991, "Äventyrsspel"), Bok I: Rollpersonen.
// All character-creation data transcribed from the scanned rulebook.
// Terms are kept in Swedish, faithful to the source.
//
// Creation is point-buy: every rollperson starts with START_BP background
// points (bakgrundspoäng) spent across race, attributes, STO, social class,
// starting capital and special abilities. Age then grants erfarenhetspoäng
// (EP) used to raise skill values (FV) from their baschans (BC).

export const START_BP = 125

// ── KRAFTNIVÅ (Krigarens Handbok) ───────────────────────────────────────────
// Rollpersonens kraftnivå skalar BP, antal slag på särskilda-förmågor-tabellen,
// erfarenhetspoäng (EP) och högsta FV vid start.
export const POWER_TIERS = [
  { id: 'vanlig', namn: 'Vanlig', bp: 125, formageRolls: 1 },
  { id: 'extraordinar', namn: 'Extraordinär', bp: 150, formageRolls: 2 },
  { id: 'hjalte', namn: 'Hjälte', bp: 175, formageRolls: 3 },
]
// EP per (ålder × kraftnivå).
export const TIER_EP = {
  vanlig: { ung: 150, mogen: 200, medelalders: 250, gammal: 300 },
  extraordinar: { ung: 175, mogen: 225, medelalders: 275, gammal: 325 },
  hjalte: { ung: 200, mogen: 250, medelalders: 300, gammal: 350 },
}
// Max FV från start per (ålder × kraftnivå).
export const TIER_MAXFV = {
  vanlig: { ung: 13, mogen: 15, medelalders: 17, gammal: 19 },
  extraordinar: { ung: 15, mogen: 17, medelalders: 19, gammal: 20 },
  hjalte: { ung: 17, mogen: 19, medelalders: 20, gammal: 20 },
}
// Alver (Äventyrsspel) använder fasta EP- och Max-FV-värden per kraftnivå,
// oberoende av ålder (Alver s. 22). BP (125/150/175) och antal förmågeslag
// (1/2/3) är desamma som POWER_TIERS ovan. Dessa tillämpas när en alvsläkt
// (RACES[*].source === 'alver') är vald.
export const ALV_TIER_EP = { vanlig: 150, extraordinar: 200, hjalte: 250 }
export const ALV_TIER_MAXFV = { vanlig: 15, extraordinar: 17, hjalte: 19 }

// The six bought grundegenskaper, in sheet order. STO is handled separately
// (it is not bought from this cost table — see RACES[*].sto and STO_* below).
export const ATTRS = ['STY', 'FYS', 'SMI', 'INT', 'PSY', 'KAR']
export const ALL_ATTRS = ['STY', 'FYS', 'SMI', 'INT', 'PSY', 'KAR', 'STO']

export const ATTR_NAMES = {
  STY: 'Styrka',
  FYS: 'Fysik',
  SMI: 'Smidighet',
  INT: 'Intelligens',
  PSY: 'Psyke',
  KAR: 'Karisma',
  STO: 'Storlek',
}

// Pris i BP för att köpa ett visst råvärde i en grundegenskap (före
// rasmodifikation). Råvärdet kan vara 3–18. Standardvärdet 3 kostar 0 BP.
export const ATTR_BUY_COST = {
  3: 0, 4: 1, 5: 2, 6: 3, 7: 5, 8: 7, 9: 9, 10: 10, 11: 11,
  12: 12, 13: 14, 14: 17, 15: 20, 16: 25, 17: 30, 18: 40,
}
export const ATTR_MIN = 3
export const ATTR_MAX = 18

// STO köps inte som övriga egenskaper. Varje ras har ett normalvärde; man kan
// spendera BP för att bli större, eller få extra BP för att bli mindre.
export const STO_RAISE_COST = { 1: 2, 2: 4, 3: 6, 4: 8, 5: 10 } // BP-kostnad per +N
export const STO_LOWER_GAIN = { 1: 1, 2: 2, 3: 3, 4: 5, 5: 7 } // extra BP per -N

// ── RASER ────────────────────────────────────────────────────────────────
// cost: BP-kostnad. mod: rasmodifikation på grundegenskaperna.
// sto: {min, max, normal}. bonus: automatiska FV-bonusar. social: modifikation
// på slaget för Socialt stånd. lang: språk man får baschans i.
export const RACES = [
  {
    id: 'manniska', namn: 'Människa', cost: 10, grupp: 'Grundraser',
    mod: { STY: 0, FYS: 0, SMI: 0, INT: 0, PSY: 0, KAR: 0 },
    sto: { min: 8, max: 18, normal: 13 },
    bonus: [], social: 0,
    lang: ['Ett människospråk'],
    desc: 'Det vanligaste folkslaget. Passar bra till alla yrken. Inga rasmodifikationer.',
  },
  {
    id: 'alv', namn: 'Alv', cost: 25, grupp: 'Grundraser',
    mod: { STY: -1, FYS: 0, SMI: 3, INT: 3, PSY: 0, KAR: 2 },
    sto: { min: 8, max: 14, normal: 11 },
    bonus: [{ skill: 'Upptäcka fara', fv: 4 }, { skill: 'Lyssna', fv: 4 }],
    social: 1,
    lang: ['Alviska', 'Ett människospråk'],
    desc: 'Odödliga, visa och smidiga med kattögon och spetsiga öron. Ofta magiker eller utbygdsjägare. Sover bara var 20:e timme.',
  },
  // ── Alvsläkter (Alver, Äventyrsspel) ──────────────────────────────────────
  // De sex alvsläkterna med egna grundegenskapsmodifikationer (Alver s. 22).
  // Mörkersyn/kattögon och alvernas övriga särdrag beskrivs i texten; de
  // räcktabellsbundna syn-/hörselbonusarna är här satta till en representativ
  // automatisk FV-bonus i linje med grundreglernas alv.
  {
    id: 'grottalv', namn: 'Grottalv', cost: 25, source: 'alver', grupp: 'Alver',
    mod: { STY: -1, FYS: 1, SMI: 2, INT: 3, PSY: 1, KAR: 2 },
    sto: { min: 7, max: 17, normal: 12 },
    bonus: [{ skill: 'Upptäcka fara', fv: 4 }, { skill: 'Lyssna', fv: 4 }, { skill: 'Geologi', fv: 3 }],
    social: 1,
    lang: ['Alviska', 'Ett människospråk'],
    desc: 'Alvsläkt som lämnat naturens skönhet för att leva djupt under bergen i hallar och smedjor upplysta av magiska eldar. Skarp mörkersyn, känsla för metall och sten. Besläktad med grå- och skogsalver.',
  },
  {
    id: 'graalv', namn: 'Gråalv', cost: 25, source: 'alver', grupp: 'Alver',
    mod: { STY: -1, FYS: 2, SMI: 1, INT: 3, PSY: 1, KAR: 2 },
    sto: { min: 5, max: 15, normal: 10 },
    bonus: [{ skill: 'Simma', fv: 6 }, { skill: 'Sjökunnighet', fv: 5 }, { skill: 'Navigera', fv: 4 }, { skill: 'Upptäcka fara', fv: 3 }],
    social: 1,
    lang: ['Alviska', 'Ett människospråk'],
    desc: 'Havets alver som lever på väldiga skepp ute på de oändliga oceanerna. Kortare och mörkhyade, mästerliga sjöfarare och simmare. Blir lätt "sjösjuka" av att vistas på land.',
  },
  {
    id: 'hogalv', namn: 'Högalv', cost: 65, source: 'alver', grupp: 'Alver',
    mod: { STY: -2, FYS: -3, SMI: 0, INT: 10, PSY: 10, KAR: 2 },
    sto: { min: 13, max: 23, normal: 18 },
    bonus: [{ skill: 'Upptäcka fara', fv: 4 }, { skill: 'Lyssna', fv: 4 }],
    social: 2,
    lang: ['Alviska', 'Ett människospråk'],
    desc: 'Uråldrig, tillbakadragen alvsläkt i fönsterlösa torn ute på ödsliga slätter. Enormt intelligenta och visa telepater och mästermagiker (behärskar minst två magiskolor). Egentligen inte avsedda som spelarrollpersoner — kräver SL:s tillåtelse.',
  },
  {
    id: 'injir', namn: 'Injir', cost: 25, source: 'alver', grupp: 'Alver',
    mod: { STY: 0, FYS: 1, SMI: 2, INT: 3, PSY: 0, KAR: 1 },
    sto: { min: 7, max: 17, normal: 12 },
    bonus: [{ skill: 'Rida', fv: 6 }, { skill: 'Upptäcka fara', fv: 4 }, { skill: 'Lyssna', fv: 4 }],
    social: 1,
    lang: ['Alviska', 'Ett människospråk'],
    desc: 'Hästbröderna — en av de större alvsläkterna som lever med sina hästar på vidsträckta slätter och i djupa skogar. Legendariska ryttare och de mest krigiska alverna. Tål temperaturer från −40 °C till +90 °C utan men.',
  },
  {
    id: 'morkeralv', namn: 'Mörkeralv', cost: 25, source: 'alver', grupp: 'Alver',
    mod: { STY: 2, FYS: 0, SMI: 1, INT: 3, PSY: 3, KAR: -1 },
    sto: { min: 7, max: 22, normal: 15 },
    bonus: [{ skill: 'Upptäcka fara', fv: 4 }, { skill: 'Lyssna', fv: 4 }, { skill: 'Smyga', fv: 4 }],
    social: 1,
    lang: ['Alviska', 'Ett människospråk'],
    desc: 'Grymma alver i borgar högt i bergen som förslavar människor, alver och dvärgar. Starkast av alverna, skarp mörkersyn, högmodiga och svekfulla. I strid grips de av blodtörst.',
  },
  {
    id: 'skogsalv', namn: 'Skogsalv', cost: 30, source: 'alver', grupp: 'Alver',
    mod: { STY: 0, FYS: 0, SMI: 3, INT: 3, PSY: 1, KAR: 2 },
    sto: { min: 8, max: 18, normal: 13 },
    bonus: [{ skill: 'Gömma sig', fv: 6 }, { skill: 'Kamouflage', fv: 6 }, { skill: 'Smyga', fv: 4 }, { skill: 'Spåra', fv: 3 }],
    social: 0,
    lang: ['Alviska', 'Ett människospråk'],
    desc: 'Skogens alver (satari) som lever som jägare djupt i utbygdernas väldiga skogar och bygger sina boningar i trädkronorna. Grönskimrande hår och naturfärgade kläder — nästan omöjliga att upptäcka i skog. +5 i CL på Gömma sig och Kamouflage i skogsmiljö.',
  },
  {
    id: 'anka', namn: 'Anka', cost: 0, grupp: 'Grundraser',
    mod: { STY: -4, FYS: 2, SMI: 2, INT: 0, PSY: 0, KAR: -3 },
    sto: { min: 3, max: 6, normal: 5 },
    bonus: [{ skill: 'Simma', fv: 20 }, { skill: 'Smyga', fv: 4 }],
    social: -2,
    lang: ['Ett människospråk'],
    desc: 'En stor anka med armar i stället för vingar. Små och klena men uthålliga och smidiga. Passar som sjöfarare, tjuv, jägare eller magiker.',
  },
  {
    id: 'dvarg', namn: 'Dvärg', cost: 25, grupp: 'Grundraser',
    mod: { STY: 3, FYS: 2, SMI: 0, INT: 0, PSY: 2, KAR: 0 },
    sto: { min: 4, max: 9, normal: 7 },
    bonus: [{ skill: 'Geologi', fv: 5, asPrimary: true }],
    social: -2,
    lang: ['Dvärgiska', 'Ett människospråk'],
    desc: 'Korta, kraftiga och skäggiga. Perfekt mörkersyn, mästare på smide, gruvdrift och sten. Oftast utmärkta krigare. Geologi räknas som primär färdighet.',
  },
  {
    id: 'halvalv', namn: 'Halvalv', cost: 15, grupp: 'Grundraser',
    mod: { STY: 0, FYS: 0, SMI: 2, INT: 0, PSY: 0, KAR: 1 },
    sto: { min: 7, max: 16, normal: 12 },
    bonus: [{ skill: 'Upptäcka fara', fv: 2 }, { skill: 'Lyssna', fv: 2 }],
    social: 0,
    lang: ['Ett människospråk eller alviska'],
    desc: 'Avkomma av alv och människa. Något smidigare än människor, dubbelt så god hörsel och syn. Lever länge men är inte odödliga. Passar alla yrken.',
  },
  {
    id: 'halvlangdsman', namn: 'Halvlängdsman', cost: 15, grupp: 'Grundraser',
    mod: { STY: -4, FYS: 3, SMI: 3, INT: 0, PSY: 2, KAR: 0 },
    sto: { min: 3, max: 6, normal: 5 },
    bonus: [{ skill: 'Gömma sig', fv: 4 }],
    social: -2,
    lang: ['Ett människospråk'],
    desc: 'Knappt en meter långa, fredliga, men förvånansvärt uthålliga och modiga. Smidiga — passar utmärkt som tjuvar. Blir normalt inte magiker.',
  },
  {
    id: 'halvorch', namn: 'Halvorch', cost: 10, grupp: 'Grundraser',
    mod: { STY: 2, FYS: 2, SMI: -1, INT: 0, PSY: 0, KAR: -3 },
    sto: { min: 8, max: 18, normal: 13 },
    bonus: [{ skill: 'Slagsmål', fv: 4 }],
    social: 0,
    lang: ['Ett människospråk'],
    desc: 'Korsning mellan orch och människa. Starkare och kraftigare än människor, men ofta med motbjudande utseende. Passar bra till alla yrken.',
  },
  // ── Monsterboxen (1990), Bok II: De humanoida raserna ─────────────────────
  // Samtliga humanoida raser ur Monsterboxen överförda till BP-köpsystemet.
  // Grundegenskapsmodifikationerna är härledda ur respektive ras inköpspris
  // (teckenvänt: billigare att köpa = rasen är bättre på det). STO modelleras
  // via sto-intervallet, kalibrerat mot bokens STO-värden. Raser som redan
  // finns i verktyget (ur grundreglerna/Alver) ligger kvar oförändrade —
  // Monsterboxen-varianterna är separata val med egen markering.
  //
  // ── Människoraser (Monsterboxen s. 3–9) ──
  {
    id: 'halvalv-mb', namn: 'Halvalv', cost: 15, source: 'monsterboxen', grupp: 'Människoraser',
    mod: { STY: -1, FYS: 0, SMI: 1, INT: 0, PSY: 0, KAR: 1 },
    sto: { min: 8, max: 18, normal: 13 },
    bonus: [], social: 0,
    lang: ['Ett människospråk eller alviska'],
    desc: 'Monsterboxens halvalv (s. 4). Avkomma av alv och människa — smidigare och mer karismatisk än människan, men något klenare.',
  },
  {
    id: 'halvlangdsman-mb', namn: 'Halvlängdsman', cost: 15, source: 'monsterboxen', grupp: 'Människoraser',
    mod: { STY: -2, FYS: 0, SMI: 1, INT: 0, PSY: 1, KAR: 0 },
    sto: { min: 3, max: 10, normal: 5 },
    bonus: [], social: -2,
    lang: ['Ett människospråk'],
    desc: 'Monsterboxens halvlängdsman (s. 5). Småväxt, fredlig och förvånansvärt seg — smidig och viljestark men svag och liten.',
  },
  {
    id: 'hogman', namn: 'Högman', cost: 10, source: 'monsterboxen', grupp: 'Människoraser',
    mod: { STY: 1, FYS: 0, SMI: -1, INT: 0, PSY: 0, KAR: 0 },
    sto: { min: 11, max: 21, normal: 16 },
    bonus: [], social: 0,
    lang: ['Ett människospråk'],
    desc: 'Storväxt människoras (s. 6). Huvudet högre än vanliga människor, starka och resliga men en aning klumpiga.',
  },
  {
    id: 'magir', namn: 'Magir', cost: 15, source: 'monsterboxen', grupp: 'Människoraser',
    mod: { STY: -1, FYS: -1, SMI: 0, INT: 1, PSY: 1, KAR: 0 },
    sto: { min: 8, max: 18, normal: 13 },
    bonus: [], social: 0,
    lang: ['Ett människospråk'],
    desc: 'Människoras med naturlig fallenhet för magi (s. 7). Skarpsinniga och viljestarka, men fysiskt klenare än vanliga människor. Passar utmärkt som magiker.',
  },
  {
    id: 'raggman', namn: 'Raggman', cost: 15, source: 'monsterboxen', grupp: 'Människoraser',
    mod: { STY: 1, FYS: 1, SMI: -1, INT: -1, PSY: 0, KAR: 0 },
    sto: { min: 8, max: 18, normal: 13 },
    bonus: [], social: -1,
    lang: ['Ett människospråk'],
    desc: 'Raggig, härdad människoras (s. 8). Stark och uthållig med tjock kroppsbehåring, men grov och enkel i sättet.',
  },
  {
    id: 'skogsman', namn: 'Skogsman', cost: 10, source: 'monsterboxen', grupp: 'Människoraser',
    mod: { STY: 0, FYS: 1, SMI: 1, INT: -1, PSY: 0, KAR: -1 },
    sto: { min: 8, max: 18, normal: 13 },
    bonus: [{ skill: 'Överlevnad', fv: 3 }], social: -1,
    lang: ['Ett människospråk'],
    desc: 'Skygg människoras som lever som jägare och samlare i de djupa skogarna (s. 9). Sega och smidiga, men ovana vid civilisationens seder.',
  },
  // ── Människokulturer i Ereb Altor (Monsterboxen s. 10–17) ──
  // Lokala kulturer, inte egna raser: människans kostnad 10 BP, men med
  // kulturella särdrag i grundegenskaperna.
  {
    id: 'barbier', namn: 'Barbier', cost: 10, source: 'monsterboxen', kultur: true, grupp: 'Kulturer (Ereb Altor)',
    mod: { STY: 1, FYS: 0, SMI: 0, INT: -1, PSY: 0, KAR: -1 },
    sto: { min: 10, max: 20, normal: 15 },
    bonus: [], social: 0,
    lang: ['Ett människospråk'],
    desc: 'Storväxta barbarfolk från Ereb Altors utmarker (s. 11). Starka och resliga, men föga bevandrade i boklig bildning och hovets seder.',
  },
  {
    id: 'dalker', namn: 'Dalker', cost: 10, source: 'monsterboxen', kultur: true, grupp: 'Kulturer (Ereb Altor)',
    mod: { STY: 0, FYS: 1, SMI: 0, INT: 0, PSY: 1, KAR: -1 },
    sto: { min: 8, max: 18, normal: 13 },
    bonus: [], social: 0,
    lang: ['Ett människospråk'],
    desc: 'Härdat dalfolk (s. 12). Uthålliga och viljestarka, men slutna och kärva i umgänget med främlingar.',
  },
  {
    id: 'erebosier', namn: 'Erebosier', cost: 10, source: 'monsterboxen', kultur: true, grupp: 'Kulturer (Ereb Altor)',
    mod: { STY: -1, FYS: 0, SMI: 0, INT: 1, PSY: 0, KAR: 1 },
    sto: { min: 8, max: 18, normal: 13 },
    bonus: [], social: 1,
    lang: ['Ett människospråk'],
    desc: 'Kulturfolket kring Erebs gamla rikens städer (s. 13). Bildade och vältaliga handelsmän och diplomater, men fysiskt veka.',
  },
  {
    id: 'felecier', namn: 'Felecier', cost: 10, source: 'monsterboxen', kultur: true, grupp: 'Kulturer (Ereb Altor)',
    mod: { STY: 0, FYS: 1, SMI: 1, INT: 0, PSY: -1, KAR: 0 },
    sto: { min: 8, max: 18, normal: 13 },
    bonus: [], social: 0,
    lang: ['Ett människospråk'],
    desc: 'Livligt och rörligt folk (s. 14). Smidiga och friska, men flyktiga till sinnet och lätt distraherade.',
  },
  {
    id: 'hynsolger', namn: 'Hynsolger', cost: 10, source: 'monsterboxen', kultur: true, grupp: 'Kulturer (Ereb Altor)',
    mod: { STY: 1, FYS: 1, SMI: 0, INT: -1, PSY: 0, KAR: 0 },
    sto: { min: 8, max: 18, normal: 13 },
    bonus: [], social: 0,
    lang: ['Ett människospråk'],
    desc: 'Krigarfolk från Hynsolge (s. 15). Starka och härdade av ett liv i fält, men med ringa intresse för lärdom.',
  },
  {
    id: 'magiller', namn: 'Magiller', cost: 10, source: 'monsterboxen', kultur: true, grupp: 'Kulturer (Ereb Altor)',
    mod: { STY: 0, FYS: 0, SMI: 1, INT: 1, PSY: 0, KAR: 0 },
    sto: { min: 5, max: 15, normal: 10 },
    bonus: [], social: 0,
    lang: ['Ett människospråk'],
    desc: 'Småväxt, klipskt folk från Magilre (s. 16). Snabbtänkta och fingerfärdiga, men mindre och spensligare än andra människor.',
  },
  {
    id: 'ransarder', namn: 'Ransarder', cost: 10, source: 'monsterboxen', kultur: true, grupp: 'Kulturer (Ereb Altor)',
    mod: { STY: 1, FYS: 1, SMI: 0, INT: 0, PSY: 0, KAR: -1 },
    sto: { min: 8, max: 18, normal: 13 },
    bonus: [], social: 0,
    lang: ['Ett människospråk'],
    desc: 'Sjöfarar- och plundrarfolk från Ransard (s. 17). Starka och vädervana, men med ett rykte som gör dem illa sedda i söderns hamnar.',
  },
  // ── Älvedalen: alver (Monsterboxen s. 18–27) ──
  // Monsterboxens alvsläkter. Använder alvernas EP/Max-FV-regler (alv: true).
  {
    id: 'blodsalv', namn: 'Blodsalv', cost: 25, source: 'monsterboxen', alv: true, grupp: 'Alver',
    mod: { STY: 0, FYS: 0, SMI: 1, INT: 0, PSY: 1, KAR: -1 },
    sto: { min: 5, max: 15, normal: 10 },
    bonus: [{ skill: 'Upptäcka fara', fv: 4 }, { skill: 'Lyssna', fv: 4 }],
    social: 0,
    lang: ['Alviska', 'Ett människospråk'],
    desc: 'Krigisk, fruktad alvsläkt (s. 19). Smidiga och viljestarka, men deras blodiga rykte gör dem illa omtyckta bland andra folk.',
  },
  {
    id: 'frostalv', namn: 'Frostalv', cost: 25, source: 'monsterboxen', alv: true, grupp: 'Alver',
    mod: { STY: -1, FYS: 0, SMI: 1, INT: 1, PSY: 0, KAR: 0 },
    sto: { min: 6, max: 16, normal: 11 },
    bonus: [{ skill: 'Upptäcka fara', fv: 4 }, { skill: 'Lyssna', fv: 4 }, { skill: 'Överlevnad', fv: 3 }],
    social: 1,
    lang: ['Alviska', 'Ett människospråk'],
    desc: 'Nordens alver (s. 20). Lever i de iskalla ödemarkerna och tål köld som ingen annan. Smidiga och kloka, men spensligt byggda.',
  },
  {
    id: 'grottalv-mb', namn: 'Grottalv', cost: 25, source: 'monsterboxen', alv: true, grupp: 'Alver',
    mod: { STY: 0, FYS: 1, SMI: 1, INT: 0, PSY: 0, KAR: -1 },
    sto: { min: 5, max: 15, normal: 10 },
    bonus: [{ skill: 'Geologi', fv: 3 }, { skill: 'Upptäcka fara', fv: 4 }],
    social: 0,
    lang: ['Alviska', 'Ett människospråk'],
    desc: 'Monsterboxens grottalv (s. 21). Alvsläkt som lever djupt under bergen — härdig och smidig med skarp mörkersyn, men främmande för ytvärldens umgänge.',
  },
  {
    id: 'graalv-mb', namn: 'Gråalv', cost: 25, source: 'monsterboxen', alv: true, grupp: 'Alver',
    mod: { STY: -1, FYS: 0, SMI: 1, INT: 1, PSY: 0, KAR: 0 },
    sto: { min: 6, max: 16, normal: 11 },
    bonus: [{ skill: 'Upptäcka fara', fv: 4 }, { skill: 'Lyssna', fv: 4 }],
    social: 1,
    lang: ['Alviska', 'Ett människospråk'],
    desc: 'Monsterboxens gråalv (s. 22). Stillsam, grubblande alvsläkt — klok och smidig men fysiskt vek.',
  },
  {
    id: 'havsalv', namn: 'Havsalv', cost: 25, source: 'monsterboxen', alv: true, grupp: 'Alver',
    mod: { STY: 0, FYS: 1, SMI: 1, INT: 0, PSY: 0, KAR: -1 },
    sto: { min: 5, max: 15, normal: 10 },
    bonus: [{ skill: 'Simma', fv: 6 }, { skill: 'Sjökunnighet', fv: 4 }],
    social: 0,
    lang: ['Alviska', 'Ett människospråk'],
    desc: 'Havets alver (s. 23). Lever på och i havet, mästerliga simmare och seglare — sega och smidiga men fåordiga mot landkrabbor.',
  },
  {
    id: 'hogalv-mb', namn: 'Högalv', cost: 25, source: 'monsterboxen', alv: true, grupp: 'Alver',
    mod: { STY: 0, FYS: 0, SMI: 0, INT: 1, PSY: 1, KAR: 1 },
    sto: { min: 4, max: 14, normal: 9 },
    bonus: [{ skill: 'Upptäcka fara', fv: 4 }, { skill: 'Lyssna', fv: 4 }],
    social: 2,
    lang: ['Alviska', 'Ett människospråk'],
    desc: 'Monsterboxens högalv (s. 24). Alvernas adel — vis, viljestark och karismatisk, men finlemmad. Kräver SL:s tillåtelse.',
  },
  {
    id: 'ljusalv', namn: 'Ljusalv', cost: 25, source: 'monsterboxen', alv: true, grupp: 'Alver',
    mod: { STY: -1, FYS: 0, SMI: 1, INT: 0, PSY: 0, KAR: 1 },
    sto: { min: 6, max: 16, normal: 11 },
    bonus: [{ skill: 'Upptäcka fara', fv: 4 }, { skill: 'Lyssna', fv: 4 }],
    social: 1,
    lang: ['Alviska', 'Ett människospråk'],
    desc: 'Ljusets alver (s. 25). Strålande vackra och vänliga, omtyckta vart de kommer — men klenare byggda än människor.',
  },
  {
    id: 'silveralv', namn: 'Silveralv', cost: 25, source: 'monsterboxen', alv: true, grupp: 'Alver',
    mod: { STY: -1, FYS: 0, SMI: 0, INT: 1, PSY: 0, KAR: 1 },
    sto: { min: 5, max: 15, normal: 10 },
    bonus: [{ skill: 'Upptäcka fara', fv: 4 }, { skill: 'Lyssna', fv: 4 }],
    social: 1,
    lang: ['Alviska', 'Ett människospråk'],
    desc: 'Silverhårig, lärd alvsläkt (s. 26). Kloka och karismatiska sångare och lärde, men fysiskt veka.',
  },
  {
    id: 'skogsalv-mb', namn: 'Skogsalv', cost: 25, source: 'monsterboxen', alv: true, grupp: 'Alver',
    mod: { STY: -1, FYS: 0, SMI: 1, INT: 0, PSY: 0, KAR: 1 },
    sto: { min: 6, max: 16, normal: 11 },
    bonus: [{ skill: 'Smyga', fv: 4 }, { skill: 'Gömma sig', fv: 4 }],
    social: 0,
    lang: ['Alviska', 'Ett människospråk'],
    desc: 'Monsterboxens skogsalv (s. 27). Skogens jägare — smidig, vänsäll och nästan osynlig bland träden, men klen i närstrid.',
  },
  // ── Älvefolk: övriga (Monsterboxen s. 28–37) ──
  // Naturväsen och magiska småfolk. Irrbloss (s. 28) är utelämnad — saknar
  // fysisk kropp och är enligt boken ej lämplig som rollperson.
  {
    id: 'hustomte', namn: 'Hustomte', cost: 15, source: 'monsterboxen', grupp: 'Älvefolk',
    mod: { STY: -2, FYS: 0, SMI: 2, INT: 0, PSY: 1, KAR: 0 },
    sto: { min: 2, max: 4, normal: 3 },
    bonus: [{ skill: 'Gömma sig', fv: 4 }], social: -2,
    lang: ['Ett människospråk'],
    desc: 'Litet, flitigt väsen som vakar över gård och fä (s. 29). Snabb, viljestark och svårupptäckt, men mycket liten och svag.',
  },
  {
    id: 'dryad', namn: 'Dryad', cost: 25, source: 'monsterboxen', grupp: 'Älvefolk',
    mod: { STY: -1, FYS: 0, SMI: 1, INT: 0, PSY: 0, KAR: 2 },
    sto: { min: 2, max: 12, normal: 7 },
    bonus: [], social: 0,
    lang: ['Alviska', 'Ett människospråk'],
    desc: 'Trädens nymf (s. 30). Bunden till sitt träd, förtrollande vacker och ett med skogen — men spenslig. Kräver SL:s tillåtelse.',
  },
  {
    id: 'najad', namn: 'Najad', cost: 25, source: 'monsterboxen', grupp: 'Älvefolk',
    mod: { STY: -1, FYS: 0, SMI: 1, INT: 0, PSY: 0, KAR: 2 },
    sto: { min: 2, max: 12, normal: 7 },
    bonus: [{ skill: 'Simma', fv: 8 }], social: 0,
    lang: ['Alviska', 'Ett människospråk'],
    desc: 'Källornas och vattendragens nymf (s. 31). Förtrollande vacker och hemmastadd i vatten, men spenslig. Kräver SL:s tillåtelse.',
  },
  {
    id: 'oread', namn: 'Oread', cost: 25, source: 'monsterboxen', grupp: 'Älvefolk',
    mod: { STY: -1, FYS: 0, SMI: 1, INT: 0, PSY: 0, KAR: 2 },
    sto: { min: 2, max: 12, normal: 7 },
    bonus: [{ skill: 'Klättra', fv: 5 }], social: 0,
    lang: ['Alviska', 'Ett människospråk'],
    desc: 'Bergens nymf (s. 33). Förtrollande vacker och hemmastadd bland klippor och branter, men spenslig. Kräver SL:s tillåtelse.',
  },
  {
    id: 'alva', namn: 'Älva', cost: 25, source: 'monsterboxen', grupp: 'Älvefolk',
    mod: { STY: -1, FYS: 0, SMI: 1, INT: 0, PSY: 0, KAR: 2 },
    sto: { min: 2, max: 12, normal: 7 },
    bonus: [{ skill: 'Smyga', fv: 4 }], social: 0,
    lang: ['Alviska', 'Ett människospråk'],
    desc: 'Ängarnas och dimmornas älva (s. 34, 37). Dansar i månsken och förtrollar vandrare med sin skönhet, men är spenslig. Kräver SL:s tillåtelse.',
  },
  {
    id: 'hagga', namn: 'Hagga', cost: 20, source: 'monsterboxen', grupp: 'Älvefolk',
    mod: { STY: 1, FYS: 0, SMI: -1, INT: 0, PSY: 1, KAR: -2 },
    sto: { min: 8, max: 18, normal: 13 },
    bonus: [], social: -2,
    lang: ['Ett människospråk'],
    desc: 'Vanskaplig, illasinnad häxa ur älvefolket (s. 32). Stark och viljestark men vedervärdig att skåda. Kräver SL:s tillåtelse.',
  },
  {
    id: 'pyssling', namn: 'Pyssling', cost: 15, source: 'monsterboxen', grupp: 'Älvefolk',
    mod: { STY: -2, FYS: 0, SMI: 2, INT: 0, PSY: 1, KAR: 0 },
    sto: { min: 2, max: 4, normal: 3 },
    bonus: [{ skill: 'Gömma sig', fv: 4 }], social: -2,
    lang: ['Ett människospråk'],
    desc: 'Pytteliten skälm ur älvefolket (s. 35). Kvick, fingerfärdig och omöjlig att hitta när den inte vill bli funnen — men mycket liten och svag.',
  },
  {
    id: 'satyr', namn: 'Satyr', cost: 20, source: 'monsterboxen', grupp: 'Älvefolk',
    mod: { STY: 0, FYS: 0, SMI: 1, INT: -1, PSY: 0, KAR: 1 },
    sto: { min: 7, max: 16, normal: 12 },
    bonus: [], social: -1,
    lang: ['Alviska', 'Ett människospråk'],
    desc: 'Bockbent, vinglad festprisse (s. 36). Smidig, charmig och musikalisk, men lättsinnig och föga boksynt.',
  },
  // ── Stenfolk & jättar (Monsterboxen s. 38–45) ──
  {
    id: 'stenfolk', namn: 'Stenfolk', cost: 25, source: 'monsterboxen', grupp: 'Stenfolk & jättar',
    mod: { STY: 1, FYS: 2, SMI: -2, INT: -2, PSY: 0, KAR: 0 },
    sto: { min: 8, max: 18, normal: 13 },
    bonus: [{ skill: 'Geologi', fv: 4 }], social: -1,
    lang: ['Dvärgiska', 'Ett människospråk'],
    desc: 'Urgammalt folk av levande sten (s. 38). Otroligt tåliga och starka, men långsamma i både kropp och tanke.',
  },
  {
    id: 'cyklop', namn: 'Cyklop', cost: 30, source: 'monsterboxen', grupp: 'Stenfolk & jättar',
    mod: { STY: 2, FYS: 0, SMI: -1, INT: -2, PSY: 0, KAR: 0 },
    sto: { min: 12, max: 22, normal: 17 },
    bonus: [], social: -2,
    lang: ['Ett människospråk'],
    desc: 'Enögd jätte (s. 39). Väldig styrka och grov kroppshydda, men enfaldig och utan djupseende. Kräver SL:s tillåtelse.',
  },
  {
    id: 'dvarg-mb', namn: 'Dvärg', cost: 25, source: 'monsterboxen', grupp: 'Stenfolk & jättar',
    mod: { STY: 0, FYS: 1, SMI: -1, INT: 0, PSY: 1, KAR: 0 },
    sto: { min: 5, max: 15, normal: 10 },
    bonus: [{ skill: 'Geologi', fv: 4 }], social: -2,
    lang: ['Dvärgiska', 'Ett människospråk'],
    desc: 'Monsterboxens dvärg (s. 40). Seg och viljestark bergsbo, mästare på smide och gruvdrift — men styvbent och föga smidig.',
  },
  {
    id: 'gigant', namn: 'Gigant', cost: 40, source: 'monsterboxen', grupp: 'Stenfolk & jättar',
    mod: { STY: 3, FYS: 0, SMI: -3, INT: -3, PSY: 0, KAR: 0 },
    sto: { min: 18, max: 28, normal: 23 },
    bonus: [], social: -2,
    lang: ['Ett människospråk'],
    desc: 'Väldig jätteras (s. 41). Ofantlig styrka och kroppshydda, men klumpig och trögtänkt. Kräver SL:s tillåtelse.',
  },
  {
    id: 'jatte', namn: 'Jätte', cost: 40, source: 'monsterboxen', grupp: 'Stenfolk & jättar',
    mod: { STY: 3, FYS: 0, SMI: -3, INT: -3, PSY: 0, KAR: 0 },
    sto: { min: 18, max: 28, normal: 23 },
    bonus: [], social: -2,
    lang: ['Ett människospråk'],
    desc: 'Sagornas jätte (s. 42). Ofantlig styrka och kroppshydda, men klumpig och trögtänkt. Kräver SL:s tillåtelse.',
  },
  {
    id: 'stenbitare', namn: 'Stenbitare', cost: 25, source: 'monsterboxen', grupp: 'Stenfolk & jättar',
    mod: { STY: 0, FYS: 1, SMI: -1, INT: 0, PSY: 1, KAR: 0 },
    sto: { min: 5, max: 15, normal: 10 },
    bonus: [{ skill: 'Geologi', fv: 4 }], social: -2,
    lang: ['Dvärgiska', 'Ett människospråk'],
    desc: 'Dvärgsläkting som äter sig fram genom berget (s. 43). Använder samma spelvärden som Monsterboxens dvärg.',
  },
  {
    id: 'titan', namn: 'Titan', cost: 45, source: 'monsterboxen', grupp: 'Stenfolk & jättar',
    mod: { STY: 4, FYS: 0, SMI: -3, INT: -3, PSY: 0, KAR: 0 },
    sto: { min: 22, max: 32, normal: 27 },
    bonus: [], social: -2,
    lang: ['Ett människospråk'],
    desc: 'Den största av alla humanoida raser (s. 44). Övermänsklig styrka och enorm kroppshydda, men klumpig och trögtänkt. Kräver SL:s tillåtelse.',
  },
  {
    id: 'troglodyt', namn: 'Troglodyt', cost: 20, source: 'monsterboxen', grupp: 'Stenfolk & jättar',
    mod: { STY: 1, FYS: 1, SMI: 0, INT: -2, PSY: 0, KAR: -1 },
    sto: { min: 8, max: 18, normal: 13 },
    bonus: [], social: -2,
    lang: ['Ett människospråk'],
    desc: 'Grottlevande, primitiv humanoid (s. 45). Stark och seg med god mörkersyn, men enfaldig och frånstötande.',
  },
  // ── Svartfolk (Monsterboxen s. 46–54) ──
  {
    id: 'illvatte', namn: 'Illvätte', cost: 5, source: 'monsterboxen', grupp: 'Svartfolk',
    mod: { STY: -2, FYS: 0, SMI: 2, INT: 0, PSY: 0, KAR: -1 },
    sto: { min: 2, max: 10, normal: 5 },
    bonus: [{ skill: 'Smyga', fv: 4 }], social: -2,
    lang: ['Svartiska'],
    desc: 'Det minsta och elakaste av svartfolken (s. 47). Kvick och lömsk, men liten, svag och allmänt avskydd.',
  },
  {
    id: 'svartnisse', namn: 'Svartnisse', cost: 5, source: 'monsterboxen', grupp: 'Svartfolk',
    mod: { STY: -2, FYS: 0, SMI: 2, INT: 0, PSY: 0, KAR: -1 },
    sto: { min: 2, max: 10, normal: 5 },
    bonus: [{ skill: 'Smyga', fv: 4 }], social: -2,
    lang: ['Svartiska'],
    desc: 'Litet, fegt svartfolk (s. 51). Samma spelvärden som illvätten — kvick och lömsk men liten, svag och föraktad även av andra svartfolk.',
  },
  {
    id: 'orch', namn: 'Orch', cost: 10, source: 'monsterboxen', grupp: 'Svartfolk',
    mod: { STY: 1, FYS: 1, SMI: 0, INT: -1, PSY: 0, KAR: -1 },
    sto: { min: 8, max: 18, normal: 13 },
    bonus: [], social: -2,
    lang: ['Svartiska', 'Ett människospråk'],
    desc: 'Svartfolkens ryggrad (s. 48). Stark och härdig krigare med god mörkersyn, men rå, enfaldig och illa sedd bland andra folk.',
  },
  {
    id: 'rese', namn: 'Rese', cost: 45, source: 'monsterboxen', grupp: 'Svartfolk',
    mod: { STY: 3, FYS: 0, SMI: 0, INT: -3, PSY: 0, KAR: -3 },
    sto: { min: 15, max: 25, normal: 20 },
    bonus: [], social: -2,
    lang: ['Svartiska'],
    desc: 'Svartfolkens jätte (s. 49). Ofantligt stark och stor, men dum, vidrig och fruktad av alla. Kräver SL:s tillåtelse.',
  },
  {
    id: 'svartalf', namn: 'Svartalf', cost: 5, source: 'monsterboxen', grupp: 'Svartfolk',
    mod: { STY: -1, FYS: 0, SMI: 1, INT: 0, PSY: 0, KAR: -1 },
    sto: { min: 2, max: 12, normal: 7 },
    bonus: [{ skill: 'Smyga', fv: 4 }], social: -2,
    lang: ['Svartiska'],
    desc: 'Litet, listigt svartfolk (s. 50). Smidig och snabbfotad, men klen och illa omtyckt. Det vanligaste och billigaste av svartfolken att spela.',
  },
  {
    id: 'grottroll', namn: 'Grottroll', cost: 35, source: 'monsterboxen', grupp: 'Svartfolk',
    mod: { STY: 2, FYS: 0, SMI: 0, INT: -3, PSY: 0, KAR: -2 },
    sto: { min: 14, max: 24, normal: 19 },
    bonus: [], social: -2,
    lang: ['Svartiska'],
    desc: 'Väldigt troll som lever i bergens grottor (s. 52). Enorm styrka och tjock hud, men dumt och vedervärdigt. Kräver SL:s tillåtelse.',
  },
  {
    id: 'skogstroll', namn: 'Skogstroll', cost: 35, source: 'monsterboxen', grupp: 'Svartfolk',
    mod: { STY: 2, FYS: 0, SMI: 0, INT: -3, PSY: 0, KAR: -2 },
    sto: { min: 14, max: 24, normal: 19 },
    bonus: [], social: -2,
    lang: ['Svartiska'],
    desc: 'Väldigt troll som lever i de djupa skogarna (s. 53). Samma spelvärden som grottrollet — enorm styrka men dumt och vedervärdigt. Kräver SL:s tillåtelse.',
  },
  {
    id: 'vatte', namn: 'Vätte', cost: 10, source: 'monsterboxen', grupp: 'Svartfolk',
    mod: { STY: -1, FYS: 0, SMI: 1, INT: -1, PSY: 1, KAR: 0 },
    sto: { min: 4, max: 12, normal: 8 },
    bonus: [], social: -2,
    lang: ['Svartiska', 'Ett människospråk'],
    desc: 'Smått svartfolk med vaket sinne (s. 54). Smidig och viljestark, men klen och inte särskilt klyftig.',
  },
  // ── Djurfolk (Monsterboxen s. 55–62) ──
  {
    id: 'anka-mb', namn: 'Anka', cost: 10, source: 'monsterboxen', grupp: 'Djurfolk',
    mod: { STY: 0, FYS: 1, SMI: 0, INT: 0, PSY: 0, KAR: -1 },
    sto: { min: 3, max: 10, normal: 5 },
    bonus: [{ skill: 'Simma', fv: 20 }], social: -2,
    lang: ['Ett människospråk'],
    desc: 'Monsterboxens anka (s. 55). Uthållig och simkunnig som ingen annan, men har svårt att bli tagen på allvar.',
  },
  {
    id: 'karkion', namn: 'Karkion', cost: 35, source: 'monsterboxen', grupp: 'Djurfolk',
    mod: { STY: 1, FYS: 1, SMI: 1, INT: -1, PSY: 0, KAR: -2 },
    sto: { min: 8, max: 18, normal: 13 },
    bonus: [], social: -1,
    lang: ['Ett människospråk'],
    desc: 'Sällsynt djurfolk med vass kroppspansar (s. 56). Stark, seg och smidig på samma gång, men skrämmande till utseendet.',
  },
  {
    id: 'kattman', namn: 'Kattman', cost: 25, source: 'monsterboxen', grupp: 'Djurfolk',
    mod: { STY: 0, FYS: 1, SMI: 2, INT: 0, PSY: -1, KAR: 0 },
    sto: { min: 2, max: 12, normal: 7 },
    bonus: [{ skill: 'Smyga', fv: 4 }], social: -1,
    lang: ['Ett människospråk'],
    desc: 'Kattlikt djurfolk (s. 57). Smidig och tyst som en katt med skarp mörkersyn, men nyckfull och lättdistraherad.',
  },
  {
    id: 'kentaur', namn: 'Kentaur', cost: 30, source: 'monsterboxen', grupp: 'Djurfolk',
    mod: { STY: 1, FYS: 0, SMI: -1, INT: -1, PSY: 0, KAR: 0 },
    sto: { min: 15, max: 25, normal: 20 },
    bonus: [], social: -1,
    lang: ['Ett människospråk'],
    desc: 'Hälften människa, hälften häst (s. 58). Stark och snabbfotad som en springare, men kan varken rida eller klättra.',
  },
  {
    id: 'minotaur', namn: 'Minotaur', cost: 35, source: 'monsterboxen', grupp: 'Djurfolk',
    mod: { STY: 2, FYS: 0, SMI: -2, INT: -2, PSY: 0, KAR: 0 },
    sto: { min: 14, max: 24, normal: 19 },
    bonus: [], social: -2,
    lang: ['Ett människospråk'],
    desc: 'Tjurhövdad jätteras (s. 59). Fruktansvärd styrka och stor kroppshydda, men hetlevrad, klumpig och trögtänkt. Kräver SL:s tillåtelse.',
  },
  {
    id: 'reptilman', namn: 'Reptilman', cost: 20, source: 'monsterboxen', grupp: 'Djurfolk',
    mod: { STY: 1, FYS: 1, SMI: -1, INT: -1, PSY: 0, KAR: 0 },
    sto: { min: 8, max: 18, normal: 13 },
    bonus: [{ skill: 'Simma', fv: 4 }], social: -1,
    lang: ['Ett människospråk'],
    desc: 'Fjällbeklätt ödlefolk (s. 60). Stark och seg med naturligt hudpansar, men trög i kyla och främmande till sättet.',
  },
  {
    id: 'serpent', namn: 'Serpent', cost: 20, source: 'monsterboxen', grupp: 'Djurfolk',
    mod: { STY: 1, FYS: 1, SMI: -1, INT: -1, PSY: 0, KAR: 0 },
    sto: { min: 8, max: 18, normal: 13 },
    bonus: [{ skill: 'Simma', fv: 4 }], social: -1,
    lang: ['Ett människospråk'],
    desc: 'Ormlikt reptilsläkte (s. 61). Samma spelvärden som reptilmannen — stark och seg med naturligt hudpansar, men kallblodig och fruktad.',
  },
  {
    id: 'vargman', namn: 'Vargman', cost: 20, source: 'monsterboxen', grupp: 'Djurfolk',
    mod: { STY: 0, FYS: 1, SMI: 1, INT: -1, PSY: 0, KAR: -1 },
    sto: { min: 8, max: 18, normal: 13 },
    bonus: [{ skill: 'Spåra', fv: 3 }], social: -1,
    lang: ['Ett människospråk'],
    desc: 'Varglikt djurfolk med skarpa sinnen (s. 62). Seg och smidig jägare med ypperligt luktsinne, men styrs av starka instinkter.',
  },
  // ── Övriga humanoider (Monsterboxen s. 63–64) ──
  {
    id: 'halvorch-mb', namn: 'Halvorch', cost: 10, source: 'monsterboxen', grupp: 'Övriga',
    mod: { STY: 1, FYS: 1, SMI: 0, INT: -1, PSY: 0, KAR: -1 },
    sto: { min: 8, max: 18, normal: 13 },
    bonus: [], social: 0,
    lang: ['Ett människospråk'],
    desc: 'Monsterboxens halvorch (s. 63). Korsning mellan orch och människa — stark och härdig men grov i dragen.',
  },
  {
    id: 'lindskiarn', namn: 'Lindskiarn', cost: 30, source: 'monsterboxen', grupp: 'Övriga',
    mod: { STY: 0, FYS: 0, SMI: -1, INT: 1, PSY: 1, KAR: 0 },
    sto: { min: 6, max: 16, normal: 11 },
    bonus: [], social: 0,
    lang: ['Ett människospråk'],
    desc: 'Sällsynt, drakättat reptilsläkte (s. 64). Klok och viljestark med uråldrig värdighet, men stel och långsam i rörelserna.',
  },
]

// ── YRKEN ────────────────────────────────────────────────────────────────
// krav: minsta tillåtna (rasmodifierade, åldersmodifierade) grundegenskapsvärde.
// formaga: yrkesförmåga (text). yrkesCount: antal yrkesfärdigheter man väljer.
// magic: får lära besvärjelser från start.
// Magikerns grunduppsättning yrkesfärdigheter (motsvarar grundreglernas Magiker
// plus de magikerfärdigheter alla magiker har enligt Magikerns Handbok). De nya
// specialistyrkena nedan bygger sina pooler på denna lista + några extra.
const MAGIKER_BASE_SKILLS = [
  'alkemi', 'astrologi', 'djurhelning', 'djurtraning', 'drogkunskap', 'giftkunskap',
  'kanna-magi', 'kunskap-demoner', 'kunskap-magi', 'kunskap-ododa', 'magisk-kanalisering',
  'magiskola', 'rakning', 'sprakkunskap', 'zoologi', 'ortkunskap', 'geografi',
  'kulturkannedom', 'simma', 'trastav', 'provsmaka', 'lasa-skriva-frammande',
  'tala-frammande', 'forkladnad', 'tortyr',
  // Nya magikerfärdigheter (Magikerns Handbok) som alla magiker kan välja:
  'improviserad-magi', 'kunskap-alkemi', 'kunskap-spadom', 'magistudier', 'minimagi',
  'pergament', 'memorera-besvarjelse',
]
const MAGIKER_GROUP_PICKS = { magiskola: 1, 'tala-frammande': 3, 'lasa-skriva-frammande': 3 }

// Alvyrkenas möjliga yrkesfärdigheter (Alver s. 27–31). Bokens listor är här
// anpassade till verktygets befintliga färdighets-id:n; de få färdigheter som
// saknar motsvarighet (t.ex. Manövrera, Avvärja) är utelämnade.
const ALV_WARRIOR_POOL = [
  'vapenfardigheter', 'tala-frammande', 'anfall-bakifran', 'avvapna', 'dans', 'djurhelning',
  'djurtraning', 'dolk', 'dra-vapen', 'forhora', 'geografi', 'giftkunskap', 'hantverk',
  'hantera-fallor', 'kamouflage', 'knopar', 'kulturkannedom', 'orientering', 'simma',
  'sla-medvetslos', 'slass-till-hast', 'strategi', 'stridskonster', 'taktik', 'teckensprak',
  'tva-vapen', 'zoologi', 'ortkunskap', 'overlevnad',
]
const ALV_RANGER_POOL = [
  'vapenfardigheter', 'tala-frammande', 'brottas-med-djur', 'djurhelning', 'djurtraning', 'dolk',
  'drogkunskap', 'fly', 'geografi', 'geologi', 'giftkunskap', 'hantverk', 'hantera-fallor',
  'kamouflage', 'knopar', 'kulturkannedom', 'orientering', 'simma', 'spa-vader', 'zoologi',
  'ortkunskap', 'overlevnad',
]

export const PROFESSIONS = [
  {
    id: 'bard', namn: 'Bard', krav: { KAR: 14 }, yrkesCount: 12,
    formaga: 'Genom sång eller spel (minst 1 minut + lyckat slag) höjs hans KAR med 5 i en timme — påverkar alla KAR-baserade färdigheter (Muta, Övertala, Bluffa, Skådespeleri).',
  },
  {
    id: 'helare', namn: 'Helare', krav: { INT: 12, PSY: 12 }, yrkesCount: 12,
    formaga: 'Botar med handpåläggning: läker 1 KP/SR till en kostnad av 1 PSY-poäng per KP. Kan även driva ut sjukdom eller neutralisera gift (PSY/2 mot svårighetsgrad/STY).',
  },
  {
    id: 'krigare', namn: 'Krigare', krav: { STY: 14, FYS: 14 }, yrkesCount: 12,
    formaga: 'Får alltid +5 på alla initiativslag.',
  },
  {
    id: 'lardman', namn: 'Lärd man', krav: { INT: 16 }, yrkesCount: 12,
    formaga: 'Har genom sin snusförnuftiga inställning alltid −5 på alla slag på Skräcktabellen.',
  },
  {
    id: 'lonnmordare', namn: 'Lönnmördare', krav: { SMI: 12, INT: 12 }, yrkesCount: 12,
    formaga: 'Anfall bakifrån + lyckat slag i Smyga ger dubbel skada (perfekt slag: fyrdubbel). Skadebonus används ej. Endast mot humanoider högst 2 m längre än lönnmördaren.',
  },
  {
    id: 'magiker', namn: 'Magiker', krav: { INT: 12, PSY: 14 }, yrkesCount: 9, magic: true,
    formaga: 'Ingen särskild yrkesförmåga, men kan lära sig en magiskola och besvärjelser från start. Väljer 9 yrkesfärdigheter (besvärjelser tillkommer).',
  },
  {
    id: 'munk', namn: 'Munk', krav: { PSY: 12, KAR: 12 }, yrkesCount: 12,
    formaga: 'Meditation (en hel SR) höjer ett valfritt FV med 1, kumulativt upp till dubbla ursprungs-FV. Gäller ett enda slag inom en minut.',
  },
  {
    id: 'sjofarare', namn: 'Sjöfarare', krav: { FYS: 12, SMI: 12 }, yrkesCount: 12,
    formaga: '+5 på FYS, STO eller STY på alla motståndsslag mot besvärjelser som rör elementen eller mot naturliga element (eldvågor, iskyla).',
  },
  {
    id: 'riddare', namn: 'Riddare', krav: { STY: 14, KAR: 12 }, yrkesCount: 12,
    formaga: 'Spendera 5 PSY-poäng för att antingen träffa valfri kroppsdel utan CL-avdrag, eller göra maximal skada inkl. maximal skadebonus.',
  },
  {
    id: 'tjuv', namn: 'Tjuv', krav: { SMI: 16 }, yrkesCount: 12,
    formaga: 'Spendera PSY-poäng för +1 CL per poäng (max 3) på valfri färdighet. Max två gånger per sovperiod (8 tim, 20 tim för alver).',
  },
  {
    id: 'utbygdsjagare', namn: 'Utbygdsjägare', krav: { FYS: 12, SMI: 12 }, yrkesCount: 12,
    formaga: 'Har Animism som yrkesförmåga: kan lära magiskolan Animism och besvärjelser med skolnivå 12 eller lägre (dock inga besvärjelser från start).',
  },
  // ── Krigaryrken ur Krigarens Handbok ──
  {
    id: 'barbar', namn: 'Barbar', source: 'kh', krav: { STY: 14, FYS: 15 }, yrkesCount: 12,
    formaga: 'Tål mer än en vanlig människa: +3 på STO och/eller FYS när KP räknas ut.',
    groupPicks: { vapenfardigheter: 5, 'tala-frammande': 1 },
    pool: ['vapenfardigheter', 'tala-frammande', 'anfall-bakifran', 'brottas-med-djur', 'bryta-grepp', 'gomma-sig', 'geografi', 'hantera-fallor', 'djurtraning', 'dolk', 'dra-vapen', 'duellera', 'fallteknik', 'hasardspel', 'harskri', 'kamouflage', 'marschera', 'orientering', 'simma', 'sla-medvetslos', 'slass-till-hast', 'spa-vader', 'strid-i-luften', 'strid-i-morker', 'trastav', 'vagnsforare', 'zoologi', 'ortkunskap', 'overlevnad'],
  },
  {
    id: 'gladiator', namn: 'Gladiator', source: 'kh', krav: { STY: 14, FYS: 12, SMI: 12 }, yrkesCount: 12,
    formaga: '+3 i BC på alla vapenfärdigheter som han har som yrkesfärdigheter.',
    groupPicks: { vapenfardigheter: 6, 'tala-frammande': 2 },
    pool: ['vapenfardigheter', 'tala-frammande', 'anfall-bakifran', 'avvapna', 'brottas-med-djur', 'bryta-grepp', 'harskri', 'kamouflage', 'djurtraning', 'dolk', 'dra-vapen', 'duellera', 'fallteknik', 'hasardspel', 'kulturkannedom', 'muta', 'simma', 'sla-medvetslos', 'strid-i-morker', 'stridskonster', 'trastav', 'tva-vapen', 'vagnsforare'],
  },
  {
    id: 'krigarmunk', namn: 'Krigarmunk', source: 'kh', krav: { STY: 14, FYS: 12, SMI: 16, PSY: 15, INT: 11 }, yrkesCount: 12,
    formaga: 'Betalar bara halva grundkostnaden för vapentekniker (avrunda uppåt).',
    groupPicks: { vapenfardigheter: 1, 'tala-frammande': 2, 'lasa-skriva-frammande': 1, hantverk: 1 },
    pool: ['vapenfardigheter', 'tala-frammande', 'lasa-skriva-frammande', 'akrobatik', 'anfall-bakifran', 'avvapna', 'bryta-grepp', 'drogkunskap', 'duellera', 'fallteknik', 'geografi', 'hantverk', 'historia', 'harskri', 'kamouflage', 'kulturkannedom', 'lakekonst', 'massage', 'simma', 'sla-medvetslos', 'strid-i-morker', 'stridskonster', 'trastav', 'ortkunskap', 'overlevnad'],
  },
  {
    id: 'paladin', namn: 'Paladin', source: 'kh', krav: { STY: 15, FYS: 12, PSY: 14, INT: 12 }, yrkesCount: 12, magic: true,
    formaga: 'Kan lära Mentalism som yrkesfärdighet (mentalistbesvärjelser med skolvärde ≤12). Max 1/3 av EP på besvärjelser från start. Kräver religiös bakgrund.',
    groupPicks: { vapenfardigheter: 4, 'tala-frammande': 3, 'lasa-skriva-frammande': 3, 'spela-instrument': 1, magiskola: 1 },
    pool: ['vapenfardigheter', 'tala-frammande', 'lasa-skriva-frammande', 'avvapna', 'bryta-grepp', 'dolk', 'djurtraning', 'dra-vapen', 'duellera', 'fallteknik', 'geografi', 'heraldik', 'historia', 'harskri', 'kulturkannedom', 'kunskap-demoner', 'kunskap-magi', 'kunskap-ododa', 'magiskola', 'schack-bradspel', 'simma', 'sla-medvetslos', 'slass-till-hast', 'spela-instrument', 'strategi', 'strid-i-luften', 'strid-i-morker', 'taktik', 'trastav', 'tva-vapen', 'vagnsforare'],
  },
  {
    id: 'prisjagare', namn: 'Prisjägare', source: 'kh', krav: { STY: 14, FYS: 12, SMI: 14 }, yrkesCount: 12,
    formaga: 'Ett sjätte sinne för fysisk fara — har alltid minst CL 17 i Upptäcka fara.',
    groupPicks: { vapenfardigheter: 3, 'tala-frammande': 1 },
    pool: ['vapenfardigheter', 'tala-frammande', 'anfall-bakifran', 'hantera-fallor', 'spara', 'dra-vapen', 'dolk', 'fallteknik', 'giftkunskap', 'kamouflage', 'kulturkannedom', 'marschera', 'muta', 'orientering', 'simma', 'sla-medvetslos', 'slass-till-hast', 'strategi', 'strid-i-luften', 'strid-i-morker', 'taktik', 'trastav', 'tva-vapen', 'undre-varlden', 'vagnsforare', 'overlevnad'],
  },
  {
    id: 'soldat', namn: 'Soldat', source: 'kh', krav: { STY: 14, FYS: 12 }, yrkesCount: 12,
    formaga: 'Goda kontakter i armén: KAR/4 ggr/år kan vänner komma till hjälp (menig 1T3, sergeant 1T6, kapten 2T6, överste 3T10) och anställning ges.',
    groupPicks: { vapenfardigheter: 5, 'tala-frammande': 1, hantverk: 1 },
    pool: ['vapenfardigheter', 'tala-frammande', 'administration', 'anfall-bakifran', 'avvapna', 'bryta-grepp', 'djurtraning', 'dolk', 'dra-vapen', 'duellera', 'hantverk', 'hasardspel', 'heraldik', 'historia', 'harskri', 'kamouflage', 'kulturkannedom', 'marschera', 'muta', 'orientering', 'simma', 'sla-medvetslos', 'slass-till-hast', 'strategi', 'strid-i-luften', 'strid-i-morker', 'taktik', 'trastav', 'tva-vapen', 'vagnsforare', 'overlevnad'],
  },
  {
    id: 'spratthok', namn: 'Sprätthök', source: 'kh', krav: { STY: 14, FYS: 12, SMI: 15 }, yrkesCount: 12,
    formaga: 'Kan lyckas med våghalsiga, heroiska stunts som ingen annan klarar — så länge de håller stämningen uppe och för historien framåt (SL avgör).',
    groupPicks: { vapenfardigheter: 5, 'tala-frammande': 3, 'lasa-skriva-frammande': 3 },
    pool: ['vapenfardigheter', 'tala-frammande', 'lasa-skriva-frammande', 'avvapna', 'bryta-grepp', 'buktala', 'dans', 'dolk', 'dra-vapen', 'duellera', 'fallteknik', 'forfalskning', 'geografi', 'hasardspel', 'historia', 'harskri', 'kulturkannedom', 'muta', 'simma', 'skadespeleri', 'sla-medvetslos', 'strid-i-morker', 'trastav', 'tva-vapen', 'undre-varlden'],
  },
  {
    id: 'vapenmastare', namn: 'Vapenmästare', source: 'kh', krav: { STY: 14, FYS: 12, SMI: 15, PSY: 12 }, yrkesCount: 12,
    formaga: 'Behärskar ett vapen så väl att han kan spendera 5 PSY-poäng för en extra parering eller attack under en SR.',
    groupPicks: { vapenfardigheter: 1, 'tala-frammande': 3, 'lasa-skriva-frammande': 3 },
    pool: ['vapenfardigheter', 'tala-frammande', 'lasa-skriva-frammande', 'anfall-bakifran', 'avvapna', 'bryta-grepp', 'dans', 'dolk', 'dra-vapen', 'duellera', 'fallteknik', 'geografi', 'historia', 'harskri', 'kulturkannedom', 'simma', 'sla-medvetslos', 'slass-till-hast', 'strategi', 'strid-i-luften', 'strid-i-morker', 'stridskonster', 'taktik', 'trastav'],
  },
  // ── Bardyrken ur Tjuvar och Lönnmördare ──
  {
    id: 'bedragare', namn: 'Bedragare', source: 'tl', krav: { SMI: 12, INT: 14, KAR: 16 }, yrkesCount: 12,
    formaga: 'Bondfångare som lurar folk med mirakelmediciner, falska botemedel och värdelösa kram sålda som fina varor.',
    groupPicks: { vapenfardigheter: 1, 'tala-frammande': 2, 'lasa-skriva-frammande': 1 },
    pool: ['vapenfardigheter', 'tala-frammande', 'lasa-skriva-frammande', 'anfall-bakifran', 'fallteknik', 'kamouflage', 'sla-medvetslos', 'strid-i-morker', 'dolja', 'tortyr', 'forhora', 'ljuga', 'provsmaka', 'fly', 'skugga', 'forkladnad', 'utbrytarkonst', 'fingerfardighet', 'spela-dod', 'allmankunskap', 'imitera-roster', 'forfora', 'haleri', 'spakonst', 'tigga'],
  },
  {
    id: 'gycklare', namn: 'Gycklare', source: 'tl', krav: { SMI: 14, KAR: 16 }, yrkesCount: 12,
    formaga: 'Kan med en medhjälpare vittja fickor medan han framför gycklarkonster (spendera PSY för att stjäla oförmärkt).',
    groupPicks: { vapenfardigheter: 1, 'tala-frammande': 2, 'lasa-skriva-frammande': 1 },
    pool: ['vapenfardigheter', 'tala-frammande', 'lasa-skriva-frammande', 'administration', 'avvapna', 'dolk', 'dra-vapen', 'geografi', 'hantverk', 'hasardspel', 'knopar', 'lasdyrkning', 'lapplasning', 'muta', 'simma', 'skadespeleri', 'gyckelkonster', 'akrobatik', 'teckensprak', 'trastav', 'undre-varlden', 'anterhake', 'dolja', 'spakonst', 'forfora', 'ljuga', 'provsmaka', 'fly', 'utbrytarkonst', 'fingerfardighet', 'haleri'],
  },
  {
    id: 'kurtisan', namn: 'Kurtisan', source: 'tl', krav: { SMI: 12, KAR: 14 }, yrkesCount: 12,
    formaga: 'Kan förvrida huvudet på en förälskad och locka fram information, värdesaker eller lojalitet (spendera PSY mot offrets PSY).',
    groupPicks: { vapenfardigheter: 1, 'tala-frammande': 2, 'lasa-skriva-frammande': 1 },
    pool: ['vapenfardigheter', 'tala-frammande', 'lasa-skriva-frammande', 'administration', 'avvapna', 'dolk', 'djurtraning', 'dra-vapen', 'geografi', 'hantverk', 'hasardspel', 'hypnotisera', 'gyckelkonster', 'knopar', 'kulturkannedom', 'skadespeleri', 'spela-instrument', 'spakonst', 'teckensprak', 'undre-varlden', 'forfora', 'ljuga', 'provsmaka', 'fingerfardighet', 'dans'],
  },
  {
    id: 'spelare', namn: 'Spelare', source: 'tl', krav: { SMI: 14, INT: 12, KAR: 14 }, yrkesCount: 12,
    formaga: 'Professionell hasardspelare med (oftast) osannolik tur i spel — kan spendera PSY för att vända turen.',
    groupPicks: { vapenfardigheter: 1, 'tala-frammande': 2, 'lasa-skriva-frammande': 1 },
    pool: ['vapenfardigheter', 'tala-frammande', 'lasa-skriva-frammande', 'administration', 'akrobatik', 'avvapna', 'dolk', 'dra-vapen', 'geografi', 'hantera-fallor', 'hantverk', 'hasardspel', 'knopar', 'lasdyrkning', 'lapplasning', 'muta', 'simma', 'skadespeleri', 'spela-instrument', 'sprakkunskap', 'stavhopp', 'stridskonster', 'teckensprak', 'undre-varlden', 'anterhake', 'dolja', 'spakonst', 'forfora', 'ljuga', 'provsmaka', 'fingerfardighet', 'allmankunskap', 'imitera-roster'],
  },
  {
    id: 'fingerkonstnar', namn: 'Fingerkonstnär', source: 'tl', krav: { SMI: 16, KAR: 14 }, yrkesCount: 12,
    formaga: 'Skicklig illusionist som kan en begränsad mängd minimagi och stjäl medan publiken distraheras av fingertrick.',
    groupPicks: { vapenfardigheter: 1, 'tala-frammande': 2, 'lasa-skriva-frammande': 1 },
    pool: ['vapenfardigheter', 'tala-frammande', 'lasa-skriva-frammande', 'administration', 'akrobatik', 'knopar', 'fingerfardighet', 'dolja', 'spakonst', 'forfora', 'ljuga', 'provsmaka', 'fly', 'utbrytarkonst', 'skadespeleri', 'gyckelkonster', 'haleri', 'allmankunskap', 'imitera-roster'],
  },
  // ── Lönnmördaryrken ur Tjuvar och Lönnmördare ──
  {
    id: 'kunskapare', namn: 'Kunskapare', source: 'tl', krav: { SMI: 14, INT: 12, PSY: 12, KAR: 12 }, yrkesCount: 12,
    formaga: 'Nästlar sig in hos fienden, samlar information om honom och undanröjer honom sedan.',
    groupPicks: { vapenfardigheter: 2, 'tala-frammande': 2, 'lasa-skriva-frammande': 1 },
    pool: ['vapenfardigheter', 'tala-frammande', 'lasa-skriva-frammande', 'administration', 'akrobatik', 'avvapna', 'dans', 'dolk', 'dra-vapen', 'forkladnad', 'geografi', 'hantera-fallor', 'hantverk', 'hasardspel', 'historia', 'hypnotisera', 'kulturkannedom', 'lasdyrkning', 'lapplasning', 'muta', 'rakning', 'skadespeleri', 'spela-instrument', 'sprakkunskap', 'stavhopp', 'stridskonster', 'teckensprak', 'undre-varlden', 'dolja', 'forfora', 'ljuga', 'provsmaka', 'fly', 'skugga', 'utbrytarkonst', 'fingerfardighet', 'allmankunskap', 'dubbeltunga', 'anfall-bakifran', 'kamouflage', 'sla-medvetslos', 'strid-i-morker'],
  },
  {
    id: 'giftmastare', namn: 'Giftmästare', source: 'tl', krav: { SMI: 14, INT: 16, PSY: 12 }, yrkesCount: 12,
    formaga: 'Kan med ett INT-slag skapa gift av tillgängligt material (giftets STY = 1T6 + offrade PSY, mot offrets FYS).',
    groupPicks: { vapenfardigheter: 2, 'tala-frammande': 2, 'lasa-skriva-frammande': 1 },
    pool: ['vapenfardigheter', 'tala-frammande', 'lasa-skriva-frammande', 'administration', 'alkemi', 'astrologi', 'dolk', 'drogkunskap', 'geografi', 'giftkunskap', 'hantverk', 'hypnotisera', 'kulturkannedom', 'lakekonst', 'rakning', 'stridskonster', 'teckensprak', 'undre-varlden', 'zoologi', 'ortkunskap', 'anfall-bakifran', 'strid-i-morker', 'tortyr', 'forhora', 'ljuga', 'provsmaka', 'allmankunskap', 'dubbeltunga'],
  },
  {
    id: 'kultist', namn: 'Kultist', source: 'tl', krav: { SMI: 14, PSY: 12 }, yrkesCount: 12,
    formaga: 'Religiös fanatiker som mördar i en kults eller demons tjänst och bär demoniska kroppsliga mutationer (SL & spelare bestämmer).',
    groupPicks: { vapenfardigheter: 2, 'tala-frammande': 2, 'lasa-skriva-frammande': 1 },
    pool: ['vapenfardigheter', 'tala-frammande', 'lasa-skriva-frammande', 'administration', 'avvapna', 'barsarkagang', 'dolk', 'dra-vapen', 'geografi', 'giftkunskap', 'hypnotisera', 'knopar', 'kulturkannedom', 'kunskap-demoner', 'kunskap-magi', 'lasdyrkning', 'simma', 'stavhopp', 'stridskonster', 'teckensprak', 'undre-varlden', 'anfall-bakifran', 'dolja', 'tortyr', 'forhora', 'forfora', 'ljuga', 'provsmaka', 'fly', 'skugga', 'forkladnad', 'utbrytarkonst', 'fingerfardighet', 'allmankunskap', 'dubbeltunga'],
  },
  {
    id: 'spion', namn: 'Spion', source: 'tl', krav: { SMI: 14, INT: 14, PSY: 14, KAR: 14 }, yrkesCount: 12,
    formaga: 'Kan övertygande spela en främmande person och har en förbluffande intuition om andras avsikter (spendera PSY).',
    groupPicks: { vapenfardigheter: 2, 'tala-frammande': 2, 'lasa-skriva-frammande': 1 },
    pool: ['vapenfardigheter', 'tala-frammande', 'lasa-skriva-frammande', 'administration', 'avvapna', 'dolk', 'dra-vapen', 'forkladnad', 'hantera-fallor', 'hantverk', 'hasardspel', 'historia', 'heraldik', 'knopar', 'kulturkannedom', 'lasdyrkning', 'lapplasning', 'muta', 'skadespeleri', 'stavhopp', 'stridskonster', 'teckensprak', 'undre-varlden', 'kamouflage', 'sla-medvetslos', 'strid-i-morker', 'dolja', 'tortyr', 'forhora', 'forfora', 'ljuga', 'provsmaka', 'fly', 'skugga', 'utbrytarkonst', 'fingerfardighet', 'allmankunskap', 'dubbeltunga'],
  },
  // ── Tjuvyrken ur Tjuvar och Lönnmördare ──
  {
    id: 'ficktjuv', namn: 'Ficktjuv', source: 'tl', krav: { SMI: 16 }, yrkesCount: 12,
    formaga: 'Stjäl små föremål oförmärkt — CL i Stjäla föremål kan som lägst bli 5, och risken för vittnen halveras.',
    groupPicks: { vapenfardigheter: 1 },
    pool: ['vapenfardigheter', 'administration', 'dolk', 'dra-vapen', 'geografi', 'hantverk', 'hasardspel', 'knopar', 'kulturkannedom', 'lasdyrkning', 'muta', 'teckensprak', 'trastav', 'undre-varlden', 'kamouflage', 'sla-medvetslos', 'tigga', 'dolja', 'ljuga', 'provsmaka', 'fly', 'skugga', 'fingerfardighet', 'haleri'],
  },
  {
    id: 'fixare', namn: 'Fixare', source: 'tl', krav: { SMI: 16, INT: 9, KAR: 12 }, yrkesCount: 12,
    formaga: 'Mannen med kontakter — kopplar samman folk via administration och kan bedöma vem som passar för en uppgift.',
    groupPicks: { vapenfardigheter: 2, 'tala-frammande': 3, 'lasa-skriva-frammande': 1 },
    pool: ['vapenfardigheter', 'tala-frammande', 'lasa-skriva-frammande', 'administration', 'dolk', 'forfalskning', 'geografi', 'giftkunskap', 'hantverk', 'hasardspel', 'heraldik', 'historia', 'knopar', 'kulturkannedom', 'kunskap-magi', 'lasdyrkning', 'massage', 'muta', 'malning', 'rakning', 'schack-bradspel', 'simma', 'sprakkunskap', 'stridskonster', 'teckensprak', 'undre-varlden', 'dolja', 'forfora', 'ljuga', 'provsmaka', 'fly', 'kunskap-takvagar', 'allmankunskap', 'haleri'],
  },
  {
    id: 'gentlemannatjuv', namn: 'Gentlemannatjuv', source: 'tl', krav: { SMI: 16, KAR: 14 }, yrkesCount: 12,
    formaga: 'Belevad tjuv som kan offra 1 PSY-poäng per fummel för att i stället räkna det som ett lyckat resultat.',
    groupPicks: { vapenfardigheter: 2, 'tala-frammande': 3, 'lasa-skriva-frammande': 1 },
    pool: ['vapenfardigheter', 'tala-frammande', 'lasa-skriva-frammande', 'administration', 'akrobatik', 'avvapna', 'dans', 'djurtraning', 'dolk', 'dra-vapen', 'geografi', 'hantera-fallor', 'hasardspel', 'heraldik', 'historia', 'knopar', 'kulturkannedom', 'kunskap-magi', 'lasdyrkning', 'massage', 'muta', 'malning', 'rakning', 'schack-bradspel', 'simma', 'spela-instrument', 'sprakkunskap', 'stavhopp', 'trastav', 'teckensprak', 'undre-varlden', 'skugga', 'forkladnad', 'kunskap-takvagar', 'allmankunskap', 'haleri'],
  },
  {
    id: 'gillrare', namn: 'Gillrare', source: 'tl', krav: { SMI: 16, INT: 16 }, yrkesCount: 12,
    formaga: 'Per offrad PSY-poäng +1 CL (max +3) i en av: Hantera fällor, Låsdyrkning, Hantverk, Finna dolda ting eller Knopar.',
    groupPicks: { vapenfardigheter: 2, 'tala-frammande': 3, 'lasa-skriva-frammande': 1 },
    pool: ['vapenfardigheter', 'tala-frammande', 'lasa-skriva-frammande', 'administration', 'dolk', 'geografi', 'geologi', 'hantera-fallor', 'hantverk', 'knopar', 'kulturkannedom', 'kunskap-magi', 'lasdyrkning', 'muta', 'orientering', 'rakning', 'schack-bradspel', 'teckensprak', 'undre-varlden', 'kamouflage', 'sla-medvetslos', 'strid-i-morker', 'ljuga', 'provsmaka', 'fly', 'kunskap-takvagar', 'utbrytarkonst', 'fingerfardighet', 'haleri'],
  },
  {
    id: 'gravplundrare', namn: 'Gravplundrare', source: 'tl', krav: { SMI: 16, FYS: 12 }, yrkesCount: 12,
    formaga: 'Plundrar gravar och gravhögar; härdad mot fasor och skicklig på att finna dolda gravskatter.',
    groupPicks: { vapenfardigheter: 2, 'tala-frammande': 2, 'lasa-skriva-frammande': 1 },
    pool: ['vapenfardigheter', 'tala-frammande', 'lasa-skriva-frammande', 'administration', 'dolk', 'forfalskning', 'geografi', 'giftkunskap', 'hantera-fallor', 'historia', 'knopar', 'kulturkannedom', 'kunskap-ododa', 'lasdyrkning', 'muta', 'orientering', 'rakning', 'teckensprak', 'undre-varlden', 'sla-medvetslos', 'strid-i-morker', 'forhora', 'forfora', 'provsmaka', 'fly', 'haleri'],
  },
  {
    id: 'hantlangare', namn: 'Hantlangare', source: 'tl', krav: { STY: 14, SMI: 16 }, yrkesCount: 12,
    formaga: 'Lejd buse som även har krigarens yrkesförmåga (+5 på alla initiativslag).',
    groupPicks: { vapenfardigheter: 3, 'tala-frammande': 1, 'lasa-skriva-frammande': 1 },
    pool: ['vapenfardigheter', 'tala-frammande', 'lasa-skriva-frammande', 'administration', 'avvapna', 'barsarkagang', 'dolk', 'dra-vapen', 'forkladnad', 'geografi', 'hantverk', 'hasardspel', 'knopar', 'kulturkannedom', 'kunskap-ododa', 'lasdyrkning', 'muta', 'orientering', 'rakning', 'teckensprak', 'undre-varlden', 'sla-medvetslos', 'strid-i-morker', 'ljuga', 'provsmaka', 'fly', 'haleri'],
  },
  {
    id: 'stratrovare', namn: 'Stråtrövare', source: 'tl', krav: { FYS: 12, SMI: 16 }, yrkesCount: 12,
    formaga: 'Har minst CL 10 i Överlevnad (skog); kan offra PSY för +3 i Gömma sig, Orientering, Kamouflage, Smyga och Spåra i skogen.',
    groupPicks: { vapenfardigheter: 3, 'tala-frammande': 2, 'lasa-skriva-frammande': 1 },
    pool: ['vapenfardigheter', 'tala-frammande', 'lasa-skriva-frammande', 'administration', 'djurtraning', 'dolk', 'dra-vapen', 'geografi', 'giftkunskap', 'hantera-fallor', 'hantverk', 'knopar', 'kulturkannedom', 'lasdyrkning', 'muta', 'orientering', 'overlevnad', 'anfall-bakifran', 'kamouflage', 'sla-medvetslos', 'forhora', 'provsmaka', 'fly', 'ljuga', 'skugga'],
  },
  {
    id: 'tiggare', namn: 'Tiggare', source: 'tl', krav: { SMI: 16 }, yrkesCount: 12,
    formaga: 'Kan förstärka utseende och beteende för att verka svårt sjuk eller handikappad (PSY mot tvivlarens INT). Slår 1T20 på handikapptabellen.',
    groupPicks: { vapenfardigheter: 1 },
    pool: ['vapenfardigheter', 'administration', 'dolk', 'dra-vapen', 'geografi', 'hantverk', 'hasardspel', 'knopar', 'kulturkannedom', 'lasdyrkning', 'muta', 'teckensprak', 'trastav', 'undre-varlden', 'kamouflage', 'sla-medvetslos', 'tigga', 'dolja', 'ljuga', 'provsmaka', 'fly', 'skugga', 'fingerfardighet', 'haleri'],
  },
  // ── Nya magikeryrken ur Magikerns Handbok (Target Games, 1993) ──
  // Specialiserade magiker. Alla kan lära magiskola + besvärjelser (magic: true)
  // och väljer 9 yrkesfärdigheter ur en pool byggd på MAGIKER_BASE_SKILLS.
  {
    id: 'akademiker', namn: 'Akademiker', source: 'mh', krav: { INT: 15, PSY: 14 }, yrkesCount: 9, magic: true,
    formaga: 'Kan känna igen och avläsa magiska artefakter och förnimma magiska krafter (slag mot INT eller halva PSY).',
    groupPicks: MAGIKER_GROUP_PICKS,
    pool: [...MAGIKER_BASE_SKILLS, 'historia', 'kunskap-andeplanet', 'kunskap-overnaturliga', 'kunskap-teknologi'],
  },
  {
    id: 'alkemist', namn: 'Alkemist', source: 'mh', krav: { SMI: 12, FYS: 13, INT: 12, PSY: 14 }, yrkesCount: 9, magic: true,
    formaga: 'Mästare på alkemi — kan i ett välutrustat laboratorium framställa elixir, salvor och preparat.',
    groupPicks: MAGIKER_GROUP_PICKS,
    pool: [...MAGIKER_BASE_SKILLS, 'kunskap-teknologi'],
  },
  {
    id: 'andebesvarjare', namn: 'Andebesvärjare', source: 'mh', krav: { INT: 12, PSY: 15 }, yrkesCount: 9, magic: true,
    formaga: 'Specialist på att frammana, besvärja och kommunicera med andar och andevärldens väsen.',
    groupPicks: MAGIKER_GROUP_PICKS,
    pool: [...MAGIKER_BASE_SKILLS, 'ritualmagi', 'kunskap-andeplanet', 'kunskap-overnaturliga'],
  },
  {
    id: 'artefaktmagiker', namn: 'Artefaktmagiker', source: 'mh', krav: { STY: 11, SMI: 13, INT: 12, PSY: 14 }, yrkesCount: 9, magic: true,
    formaga: 'Kan tillverka magiska föremål och vapen genom att lägga in besvärjelser i dem.',
    groupPicks: MAGIKER_GROUP_PICKS,
    pool: [...MAGIKER_BASE_SKILLS, 'kunskap-teknologi'],
  },
  {
    id: 'druid', namn: 'Druid', source: 'mh', krav: { INT: 12, PSY: 14, KAR: 12 }, yrkesCount: 9, magic: true,
    formaga: 'Naturmagiker som lever i samklang med naturen; behärskar Animism och dess underskolor.',
    groupPicks: MAGIKER_GROUP_PICKS,
    pool: [...MAGIKER_BASE_SKILLS, 'spa-vader', 'overlevnad', 'orientering'],
  },
  {
    id: 'bastardmagiker', namn: 'Bastardmagiker', source: 'mh', krav: { INT: 12, PSY: 14 }, yrkesCount: 9, magic: true,
    formaga: 'Behärskar en kombination av två yrken eller magiskolor; krav och förmågor varierar (SL avgör).',
    groupPicks: MAGIKER_GROUP_PICKS,
    pool: [...MAGIKER_BASE_SKILLS],
  },
  {
    id: 'larling', namn: 'Lärling', source: 'mh', krav: { SMI: 12, INT: 12, PSY: 14 }, yrkesCount: 9, magic: true,
    formaga: 'Magikerlärling i början av sin bana — billigare att lära men med begränsad tillgång till mästarens kunskap.',
    groupPicks: MAGIKER_GROUP_PICKS,
    pool: [...MAGIKER_BASE_SKILLS],
  },
  {
    id: 'nekromantiker', namn: 'Nekromantiker', source: 'mh', krav: { FYS: 13, INT: 12, PSY: 15 }, yrkesCount: 9, magic: true,
    formaga: 'Behärskar de dödas och förruttnelsens magi; kan väcka och behärska odöda.',
    groupPicks: MAGIKER_GROUP_PICKS,
    pool: [...MAGIKER_BASE_SKILLS, 'kunskap-animal-magnetism', 'kunskap-andeplanet'],
  },
  {
    id: 'arkemagiker', namn: 'Ärkemagiker', source: 'mh', krav: { INT: 15, PSY: 15 }, yrkesCount: 9, magic: true,
    formaga: 'Mästarmagiker som kan lära sig ritualer och de mäktigaste besvärjelserna.',
    groupPicks: MAGIKER_GROUP_PICKS,
    pool: [...MAGIKER_BASE_SKILLS, 'ritualmagi', 'kunskap-overnaturliga', 'kunskap-andeplanet'],
  },
  // ── Alvyrken (Alver, Äventyrsspel s. 27–31) ───────────────────────────────
  // Egna alvyrken. Yrkesförmågorna är sammanfattade; antal yrkesfärdigheter och
  // poolerna är anpassade till verktyget (boken anger främst ett maxtak för
  // vapenfärdigheter per yrke).
  {
    id: 'alv-dodsbringare', namn: 'Dödsbringare', source: 'alver', krav: { STY: 15, SMI: 15, FYS: 14, INT: 14 }, yrkesCount: 10,
    formaga: 'Fruktad alvkrigare som ägnat livet åt att jaga svartfolk. Inför striden mässar han en dödssång som ger honom bonus i strid mot svartfolk och annat ont. Har även alvkrigarens förmåga att känna svartfolks närvaro.',
    groupPicks: { vapenfardigheter: 8, 'tala-frammande': 1 },
    pool: [...ALV_WARRIOR_POOL, 'barsarkagang', 'harskri'],
  },
  {
    id: 'alv-dodsdansare', namn: 'Dödsdansare', source: 'alver', krav: { SMI: 18, FYS: 15, INT: 17 }, yrkesCount: 10,
    formaga: 'Ensam alv som mästrar dödsdansen — en dödlig stridsteknik. Hans otroliga förmåga att lära in vapentekniker gör att stridsteknikerna kostar mindre för honom. Har även alvkrigarens vanliga yrkesförmåga.',
    groupPicks: { vapenfardigheter: 6, 'tala-frammande': 1 },
    pool: [...ALV_WARRIOR_POOL, 'akrobatik'],
  },
  {
    id: 'alv-hantverkare', namn: 'Hantverkare', source: 'alver', krav: { SMI: 15 }, yrkesCount: 10,
    formaga: 'Alvisk hantverkare vars föremål alltid blir utomordentligt vackra — baschansen räknas alltid som ett (1) steg högre när det gäller föremålens skönhet, särskilt smycken och prydnadsföremål.',
    groupPicks: { 'tala-frammande': 1 },
    pool: ['tala-frammande', 'dans', 'djurhelning', 'djurtraning', 'dolk', 'drogkunskap', 'geografi', 'geologi', 'giftkunskap', 'hantverk', 'hantera-fallor', 'kamouflage', 'knopar', 'kulturkannedom', 'kunskap-magi', 'orientering', 'simma', 'spela-instrument', 'zoologi', 'ortkunskap', 'overlevnad'],
  },
  {
    id: 'alv-helare', namn: 'Helare', source: 'alver', krav: { INT: 14, PSY: 14 }, yrkesCount: 10,
    formaga: 'Botar med handpåläggning (läker 1 KP/SR mot PSY-poäng) och kan driva ut infektioner och gift. Mörkeralvernas helare kan istället tillfoga skada med samma teknik.',
    groupPicks: { 'tala-frammande': 1 },
    pool: ['tala-frammande', 'alkemi', 'astrologi', 'djurhelning', 'drogkunskap', 'geografi', 'giftkunskap', 'hantverk', 'kulturkannedom', 'kunskap-magi', 'lakekonst', 'massage', 'orientering', 'provsmaka', 'simma', 'zoologi', 'ortkunskap', 'overlevnad'],
  },
  {
    id: 'alv-injirkrigare', namn: 'Injirkrigare', source: 'alver', krav: { FYS: 12, SMI: 12 }, yrkesCount: 10,
    formaga: 'Injirsläktets mest vildsinta, barbariska krigare som slåss i blodrus. Har alvkrigarens yrkesförmåga och dessutom 1T3−1 kraftfulla tatueringar med egna verkningar.',
    groupPicks: { vapenfardigheter: 6, 'tala-frammande': 1 },
    pool: [...ALV_WARRIOR_POOL, 'akrobatik', 'barsarkagang', 'brottas-med-djur', 'harskri'],
  },
  {
    id: 'alv-jagare', namn: 'Jägare', source: 'alver', krav: { FYS: 14, SMI: 15, PSY: 12 }, yrkesCount: 10,
    formaga: 'Ensam jägare för vilken naturens röst alltid talar. Mästare på att spåra, lägga försåt och förlita sig på dolda fällor — en utveckling av utbygdsjägaren.',
    groupPicks: { vapenfardigheter: 6, 'tala-frammande': 1 },
    pool: ALV_RANGER_POOL,
  },
  {
    id: 'alv-krigare', namn: 'Krigare', source: 'alver', krav: { STY: 12, FYS: 12, SMI: 15 }, yrkesCount: 10,
    formaga: 'Alvkrigare med krigarens vanliga yrkesförmåga, samt förmågan att med ett PSY-slag känna närvaron av svartfolk och drägg inom 100 meter (svårare ju längre bort).',
    groupPicks: { vapenfardigheter: 6, 'tala-frammande': 1 },
    pool: ALV_WARRIOR_POOL,
  },
  {
    id: 'alv-mistali', namn: 'Mistali', source: 'alver', krav: { STY: 14, FYS: 16, PSY: 14 }, yrkesCount: 10,
    formaga: 'Gråalvernas främsta krigare, mästare på snabba blodiga sjöräder. Har outtröttlig uthållighet i vatten: simmar i princip hur långt som helst, dubbelt så snabbt som en olastad människa, och håller andan i upp till fem minuter. Har även krigarens yrkesförmåga.',
    groupPicks: { vapenfardigheter: 6, 'tala-frammande': 1 },
    pool: [...ALV_WARRIOR_POOL, 'sjokunnighet', 'navigera'],
  },
  {
    id: 'alv-morkerbroder', namn: 'Mörkerbroder', source: 'alver', krav: { STY: 17, FYS: 15, SMI: 14, PSY: 15 }, yrkesCount: 10,
    formaga: 'Mörkeralvernas mest blodtörstiga krigare ur Blodiga kallens brödraskap. Synen av en mörkerbroder kan Skräckslå (1/0) motståndare. Har krigarens och alvkrigarens förmågor, men känner lukten av alver istället för svartfolk.',
    groupPicks: { vapenfardigheter: 6, 'tala-frammande': 1 },
    pool: [...ALV_WARRIOR_POOL, 'barsarkagang', 'tortyr'],
  },
  {
    id: 'alv-spejare', namn: 'Spejare', source: 'alver', krav: { STY: 13, FYS: 16, SMI: 13, PSY: 13 }, yrkesCount: 10,
    formaga: 'Vältränad krigare som spejar bakom fiendens linjer. Har krigarens yrkesförmåga och en extraordinär uthållighet (klarar sig länge på minimala ransoner) samt motstår smärta — i praktiken immun mot tortyr.',
    groupPicks: { vapenfardigheter: 6, 'tala-frammande': 1 },
    pool: [...ALV_WARRIOR_POOL, 'akrobatik', 'skugga', 'utbrytarkonst', 'drogkunskap'],
  },
  {
    id: 'alv-tradformare', namn: 'Trädformare', source: 'alver', krav: { INT: 17, PSY: 16 }, yrkesCount: 10,
    formaga: 'Skogsalv som kan forma och få träd att växa med blotta händerna på minuter (mot PSY-poäng) — ett ekollon kan på en natt bli en fullväxt ek. Växter i hans närhet växer snabbare.',
    groupPicks: { vapenfardigheter: 1, 'tala-frammande': 1 },
    pool: ['vapenfardigheter', 'tala-frammande', 'dans', 'djurhelning', 'djurtraning', 'dolk', 'drogkunskap', 'geografi', 'geologi', 'giftkunskap', 'hantverk', 'hantera-fallor', 'kamouflage', 'knopar', 'kulturkannedom', 'kunskap-magi', 'orientering', 'simma', 'spela-instrument', 'spa-vader', 'zoologi', 'ortkunskap', 'overlevnad'],
  },
  {
    id: 'alv-vindvavare', namn: 'Vindvävare', source: 'alver', krav: { INT: 17, PSY: 18 }, yrkesCount: 10,
    formaga: 'Gråalv som väver gynnsamma vindar (motsvarar Vindkontroll) och styr väder (motsvarar Regnkontroll) — en effektgrad per spenderad PSY-poäng — och kan skingra dimma med ett PSY-slag.',
    groupPicks: { vapenfardigheter: 1, 'tala-frammande': 1 },
    pool: ['vapenfardigheter', 'tala-frammande', 'astrologi', 'dans', 'drogkunskap', 'geografi', 'hantverk', 'knopar', 'kulturkannedom', 'kunskap-magi', 'navigera', 'simma', 'sjokunnighet', 'spela-instrument', 'spa-vader', 'zoologi', 'overlevnad'],
  },
]

// ── FÄRDIGHETER ──────────────────────────────────────────────────────────
// typ: 'primär' | 'sekundär'. grund: grundegenskap som baschansen baseras på.
// yrken: 'Alla' eller lista över yrkes-id som får välja den som yrkesfärdighet.
// group: true om färdigheten består av flera separata val (språk, hantverk,
//   instrument, vapen) — picks anger max antal val per yrke.
// Primära färdigheter har alla rollpersoner; sekundära kan bara väljas som
// yrkesfärdigheter (eller fås via särskild förmåga).
export const PRIMARY_SKILLS = [
  { id: 'bluffa', namn: 'Bluffa', grund: 'KAR' },
  { id: 'finna-dolda-ting', namn: 'Finna dolda ting', grund: 'INT' },
  { id: 'forsta-hjalpen', namn: 'Första hjälpen', grund: 'INT' },
  { id: 'gomma-sig', namn: 'Gömma sig', grund: 'SMI' },
  { id: 'hoppa', namn: 'Hoppa', grund: 'SMI' },
  { id: 'klattra', namn: 'Klättra', grund: 'SMI' },
  { id: 'kopsla', namn: 'Köpslå', grund: 'KAR' },
  { id: 'lyssna', namn: 'Lyssna', grund: 'INT' },
  { id: 'lasa-skriva-modersmal', namn: 'Läsa/Skriva modersmål', grund: 'INT', special: true },
  { id: 'rida', namn: 'Rida', grund: 'SMI' },
  { id: 'sjunga', namn: 'Sjunga', grund: 'KAR' },
  { id: 'slagsmal', namn: 'Slagsmål', grund: 'STY' },
  { id: 'smyga', namn: 'Smyga', grund: 'SMI' },
  { id: 'spara', namn: 'Spåra', grund: 'INT' },
  { id: 'stjala-foremal', namn: 'Stjäla föremål', grund: 'SMI' },
  { id: 'tala-modersmal', namn: 'Tala modersmål', grund: 'INT', special: true },
  { id: 'upptacka-fara', namn: 'Upptäcka fara', grund: 'PSY' },
  { id: 'varda', namn: 'Värdera', grund: 'INT' },
  { id: 'overtala', namn: 'Övertala', grund: 'KAR' },
  { id: 'smyga-osedd', namn: 'Smyga osedd', grund: 'SMI', tl: true },
]

// Sekundära färdigheter. picks: {yrkesId: maxAntal} för gruppfärdigheter.
export const SECONDARY_SKILLS = [
  { id: 'administration', namn: 'Administration', grund: 'INT', yrken: ['bard', 'lardman', 'lonnmordare', 'riddare', 'tjuv'] },
  { id: 'akrobatik', namn: 'Akrobatik', grund: 'SMI', yrken: ['bard', 'lonnmordare', 'sjofarare', 'tjuv'] },
  { id: 'alkemi', namn: 'Alkemi', grund: 'INT', yrken: ['helare', 'lardman', 'magiker'] },
  { id: 'astrologi', namn: 'Astrologi', grund: 'INT', yrken: ['lardman', 'magiker'] },
  { id: 'avvapna', namn: 'Avväpna', grund: 'SMI', yrken: ['krigare', 'munk', 'riddare'] },
  { id: 'buktala', namn: 'Buktala', grund: 'PSY', yrken: ['bard', 'tjuv'] },
  { id: 'barsarkagang', namn: 'Bärsärkagång', grund: 'PSY', yrken: ['krigare'] },
  { id: 'dans', namn: 'Dans', grund: 'SMI', yrken: ['bard', 'sjofarare', 'riddare'] },
  { id: 'djurhelning', namn: 'Djurhelning', grund: 'INT', yrken: ['helare', 'magiker', 'munk', 'utbygdsjagare'] },
  { id: 'djurtraning', namn: 'Djurträning', grund: 'INT', yrken: ['bard', 'magiker', 'riddare', 'utbygdsjagare'] },
  { id: 'dolk', namn: 'Dolk', grund: 'SMI', yrken: ['bard', 'krigare', 'lardman', 'lonnmordare', 'sjofarare', 'riddare', 'tjuv', 'utbygdsjagare'] },
  { id: 'dra-vapen', namn: 'Dra vapen', grund: 'SMI', yrken: ['krigare', 'lonnmordare', 'riddare', 'tjuv'] },
  { id: 'drogkunskap', namn: 'Drogkunskap', grund: 'INT', yrken: ['helare', 'lardman', 'magiker', 'munk', 'utbygdsjagare'] },
  { id: 'forfalskning', namn: 'Förfalskning', grund: 'INT', yrken: ['bard', 'lardman', 'lonnmordare', 'munk', 'tjuv'] },
  { id: 'geografi', namn: 'Geografi', grund: 'INT', yrken: 'Alla' },
  { id: 'geologi', namn: 'Geologi', grund: 'INT', yrken: ['lardman', 'utbygdsjagare'] },
  { id: 'giftkunskap', namn: 'Giftkunskap', grund: 'INT', yrken: ['helare', 'lardman', 'lonnmordare', 'magiker', 'munk', 'tjuv', 'utbygdsjagare'] },
  { id: 'gyckelkonster', namn: 'Gyckelkonster', grund: 'SMI', yrken: ['bard', 'sjofarare', 'tjuv'] },
  { id: 'hantera-fallor', namn: 'Hantera fällor', grund: 'SMI', yrken: ['lonnmordare', 'tjuv', 'utbygdsjagare'] },
  { id: 'hantverk', namn: 'Hantverk', grund: 'INT', group: true, yrken: ['bard', 'helare', 'krigare', 'munk', 'sjofarare', 'utbygdsjagare'] },
  { id: 'hasardspel', namn: 'Hasardspel', grund: 'PSY', yrken: ['bard', 'krigare', 'lardman', 'lonnmordare', 'sjofarare', 'tjuv'] },
  { id: 'heraldik', namn: 'Heraldik', grund: 'INT', yrken: ['bard', 'lardman', 'munk', 'riddare'] },
  { id: 'historia', namn: 'Historia', grund: 'INT', yrken: ['bard', 'lardman', 'munk', 'riddare'] },
  { id: 'hypnotisera', namn: 'Hypnotisera', grund: 'PSY', yrken: ['bard', 'helare', 'lonnmordare', 'tjuv'] },
  { id: 'knopar', namn: 'Knopar', grund: 'SMI', yrken: ['bard', 'lonnmordare', 'munk', 'sjofarare', 'tjuv', 'utbygdsjagare'] },
  { id: 'kulturkannedom', namn: 'Kulturkännedom', grund: 'INT', yrken: 'Alla' },
  { id: 'kunskap-demoner', namn: 'Kunskap om demoner', grund: 'INT', yrken: ['helare', 'lardman', 'magiker', 'munk'] },
  { id: 'kunskap-magi', namn: 'Kunskap om magi', grund: 'INT', yrken: ['helare', 'lardman', 'magiker', 'munk', 'riddare'] },
  { id: 'kunskap-ododa', namn: 'Kunskap om odöda', grund: 'INT', yrken: ['helare', 'lardman', 'magiker', 'munk', 'riddare'] },
  { id: 'kanna-magi', namn: 'Känna magi', grund: 'PSY', yrken: ['magiker'], note: 'Primär för magiker, sekundär för övriga.' },
  { id: 'lasdyrkning', namn: 'Låsdyrkning', grund: 'SMI', yrken: ['lonnmordare', 'tjuv'] },
  { id: 'lakekonst', namn: 'Läkekonst', grund: 'INT', yrken: ['helare', 'munk'] },
  { id: 'lapplasning', namn: 'Läppläsning', grund: 'INT', yrken: ['bard', 'tjuv'] },
  { id: 'lasa-skriva-frammande', namn: 'Läsa/Skriva främmande språk', grund: 'INT', group: true, yrken: ['bard', 'helare', 'lardman', 'magiker', 'munk', 'sjofarare', 'riddare'], picks: { bard: 1, helare: 1, lardman: 4, magiker: 3, munk: 3, sjofarare: 1, riddare: 1 } },
  { id: 'magisk-kanalisering', namn: 'Magisk kanalisering', grund: 'INT', yrken: ['magiker'] },
  { id: 'magiskola', namn: 'Magiskola', grund: 'INT', group: true, yrken: ['magiker', 'utbygdsjagare'], picks: { magiker: 1, utbygdsjagare: 1 }, options: ['Animism', 'Elementarmagi', 'Mentalism', 'Falsk drakmagi', 'Sann drakmagi', 'Demonologi', 'Portalmagi', 'Mörkermagi'], note: 'Grundskolorna Animism, Elementarmagi och Mentalism har underskolor (t.ex. Djurhamn, Eldmagi) som ingår i huvudskolan — du behärskar dem gratis upp till FV 7 och kan specialisera dig på en underskola per huvudskola för att nå högre. Övriga val (Falsk/Sann drakmagi, Demonologi, Portalmagi, Mörkermagi) är specialskolor ur Magikerns Handboks besvärjelseregister (s. 91–93); deras besvärjelser beskrivs i källböckerna Drakar, Kaos väktare och Nidland.' },
  { id: 'massage', namn: 'Massage', grund: 'SMI', yrken: ['helare', 'munk'] },
  { id: 'muta', namn: 'Muta', grund: 'KAR', yrken: ['bard', 'lonnmordare', 'sjofarare', 'tjuv'] },
  { id: 'malning', namn: 'Målning', grund: 'SMI', yrken: ['bard', 'munk', 'sjofarare', 'riddare'] },
  { id: 'navigera', namn: 'Navigera', grund: 'INT', yrken: ['sjofarare'] },
  { id: 'orientering', namn: 'Orientering', grund: 'INT', yrken: ['helare', 'sjofarare', 'utbygdsjagare'] },
  { id: 'rakning', namn: 'Räkning', grund: 'INT', yrken: ['lardman', 'magiker', 'munk', 'riddare', 'tjuv'] },
  { id: 'schack-bradspel', namn: 'Schack & brädspel', grund: 'INT', yrken: ['bard', 'lardman', 'sjofarare', 'riddare'] },
  { id: 'simma', namn: 'Simma', grund: 'SMI', yrken: 'Alla' },
  { id: 'sjokunnighet', namn: 'Sjökunnighet', grund: 'INT', yrken: ['sjofarare'] },
  { id: 'skadespeleri', namn: 'Skådespeleri', grund: 'KAR', yrken: ['bard', 'lonnmordare', 'tjuv'] },
  { id: 'spela-instrument', namn: 'Spela instrument', grund: 'KAR', group: true, yrken: ['bard', 'munk', 'sjofarare', 'riddare', 'tjuv'], picks: { munk: 2, sjofarare: 2, riddare: 2, tjuv: 2 } },
  { id: 'sprakkunskap', namn: 'Språkkunskap', grund: 'INT', yrken: ['bard', 'helare', 'lardman', 'magiker', 'munk', 'riddare'] },
  { id: 'spa-vader', namn: 'Spå väder', grund: 'INT', yrken: ['sjofarare', 'utbygdsjagare'] },
  { id: 'stavhopp', namn: 'Stavhopp', grund: 'STY', yrken: ['lonnmordare', 'sjofarare', 'tjuv'] },
  { id: 'stridskonster', namn: 'Stridskonster', grund: 'SMI', yrken: ['krigare', 'lonnmordare', 'munk'] },
  { id: 'tala-frammande', namn: 'Tala främmande språk', grund: 'INT', group: true, yrken: ['bard', 'helare', 'krigare', 'lardman', 'lonnmordare', 'magiker', 'munk', 'sjofarare', 'riddare', 'utbygdsjagare'], picks: { bard: 2, helare: 2, krigare: 1, lardman: 5, lonnmordare: 1, magiker: 3, munk: 3, sjofarare: 1, riddare: 1, utbygdsjagare: 1 } },
  { id: 'teckensprak', namn: 'Teckenspråk', grund: 'INT', yrken: ['lonnmordare', 'tjuv'] },
  { id: 'trastav', namn: 'Trästav', grund: 'SMI', yrken: 'Alla' },
  { id: 'tva-vapen', namn: 'Två vapen', grund: 'SMI', yrken: ['krigare', 'riddare'] },
  { id: 'undre-varlden', namn: 'Undre världen', grund: 'INT', yrken: ['lonnmordare', 'sjofarare', 'tjuv'] },
  { id: 'vapenfardigheter', namn: 'Vapenfärdigheter', grund: 'SMI', group: true, yrken: ['bard', 'krigare', 'lonnmordare', 'sjofarare', 'riddare', 'tjuv', 'utbygdsjagare'], picks: { bard: 1, krigare: 12, lonnmordare: 1, sjofarare: 3, riddare: 5, tjuv: 2, utbygdsjagare: 3 } },
  { id: 'zoologi', namn: 'Zoologi', grund: 'INT', yrken: ['helare', 'lardman', 'magiker', 'munk', 'utbygdsjagare'] },
  { id: 'anterhake', namn: 'Änterhake', grund: 'SMI', yrken: ['lonnmordare', 'sjofarare', 'tjuv'] },
  { id: 'ortkunskap', namn: 'Örtkunskap', grund: 'INT', yrken: ['helare', 'lardman', 'magiker', 'munk', 'utbygdsjagare'] },
  { id: 'overlevnad', namn: 'Överlevnad', grund: 'INT', yrken: ['helare', 'utbygdsjagare'] },
  // ── Nya färdigheter ur Krigarens Handbok ──
  { id: 'anfall-bakifran', namn: 'Anfall bakifrån', grund: 'SMI', kh: true, yrken: ['tjuv', 'lonnmordare'] },
  { id: 'brottas-med-djur', namn: 'Brottas med djur', grund: 'STY', kh: true, yrken: ['utbygdsjagare'] },
  { id: 'bryta-grepp', namn: 'Bryta grepp', grund: 'STY', kh: true, yrken: ['munk', 'riddare'] },
  { id: 'duellera', namn: 'Duellera', grund: 'INT', kh: true, yrken: ['bard', 'lardman', 'riddare'] },
  { id: 'fallteknik', namn: 'Fallteknik', grund: 'SMI', kh: true, yrken: ['lonnmordare', 'munk', 'tjuv', 'utbygdsjagare', 'riddare'] },
  { id: 'harskri', namn: 'Härskri', grund: 'KAR', kh: true, yrken: ['sjofarare', 'riddare'] },
  { id: 'kamouflage', namn: 'Kamouflage', grund: 'SMI', kh: true, yrken: ['lonnmordare', 'tjuv', 'utbygdsjagare'] },
  { id: 'marschera', namn: 'Marschera', grund: 'FYS', kh: true, yrken: ['utbygdsjagare'] },
  { id: 'sla-medvetslos', namn: 'Slå medvetslös', grund: 'STY', kh: true, yrken: ['lonnmordare', 'munk', 'sjofarare', 'tjuv', 'utbygdsjagare', 'riddare'] },
  { id: 'slass-till-hast', namn: 'Släss till häst', grund: 'SMI', kh: true, yrken: ['riddare'] },
  { id: 'strategi', namn: 'Strategi', grund: 'INT', kh: true, yrken: ['lardman', 'riddare'] },
  { id: 'strid-i-luften', namn: 'Strid i luften', grund: 'SMI', kh: true, yrken: ['riddare'] },
  { id: 'strid-i-morker', namn: 'Strid i mörker', grund: 'PSY', kh: true, yrken: ['lonnmordare', 'munk', 'tjuv', 'utbygdsjagare', 'riddare'] },
  { id: 'taktik', namn: 'Taktik', grund: 'INT', kh: true, yrken: ['lardman', 'riddare'] },
  { id: 'vagnsforare', namn: 'Vagnsförare', grund: 'SMI', kh: true, yrken: ['riddare'] },
  // ── Nya färdigheter ur Tjuvar och Lönnmördare ──
  { id: 'allmankunskap', namn: 'Allmänkunskap', grund: 'INT', tl: true, yrken: ['bard', 'lonnmordare', 'lardman', 'munk', 'sjofarare', 'riddare', 'helare'] },
  { id: 'dubbeltunga', namn: 'Dubbeltunga', grund: 'INT', tl: true, yrken: ['lonnmordare'] },
  { id: 'dolja', namn: 'Dölja', grund: 'SMI', tl: true, yrken: ['bard', 'lonnmordare', 'tjuv'] },
  { id: 'fingerfardighet', namn: 'Fingerfärdighet', grund: 'SMI', tl: true, yrken: ['bard', 'lonnmordare', 'tjuv', 'sjofarare'] },
  { id: 'fly', namn: 'Fly', grund: 'SMI', tl: true, yrken: ['bard', 'lonnmordare', 'tjuv', 'krigare'] },
  { id: 'forfora', namn: 'Förföra', grund: 'KAR', tl: true, yrken: ['bard', 'lonnmordare', 'krigare', 'riddare'] },
  { id: 'forhora', namn: 'Förhöra', grund: 'PSY', tl: true, yrken: ['lonnmordare', 'tjuv', 'krigare', 'lardman', 'sjofarare', 'riddare'] },
  { id: 'forkladnad', namn: 'Förklädnad', grund: 'INT', tl: true, yrken: ['bard', 'lonnmordare', 'tjuv', 'magiker'] },
  { id: 'haleri', namn: 'Häleri', grund: 'INT', tl: true, yrken: ['bard', 'tjuv', 'krigare', 'sjofarare'] },
  { id: 'imitera-roster', namn: 'Imitera röster', grund: 'INT', tl: true, yrken: ['bard', 'lonnmordare'] },
  { id: 'kunskap-takvagar', namn: 'Kunskap om takvägar', grund: 'INT', tl: true, yrken: ['tjuv'] },
  { id: 'ljuga', namn: 'Ljuga', grund: 'INT', tl: true, yrken: ['bard', 'lonnmordare', 'tjuv', 'lardman', 'sjofarare'] },
  { id: 'provsmaka', namn: 'Provsmaka', grund: 'INT', tl: true, yrken: 'Alla' },
  { id: 'skugga', namn: 'Skugga', grund: 'SMI', tl: true, yrken: ['lonnmordare', 'tjuv', 'krigare', 'utbygdsjagare'] },
  { id: 'spela-dod', namn: 'Spela död', grund: 'PSY', tl: true, yrken: ['lonnmordare'] },
  { id: 'spakonst', namn: 'Spåkonst', grund: 'PSY', tl: true, yrken: ['bard', 'magiker', 'munk', 'sjofarare'] },
  { id: 'tigga', namn: 'Tigga', grund: 'PSY', tl: true, yrken: ['tjuv'] },
  { id: 'tortyr', namn: 'Tortyr', grund: 'INT', tl: true, yrken: ['lonnmordare', 'tjuv', 'krigare', 'lardman', 'magiker'] },
  { id: 'utbrytarkonst', namn: 'Utbrytarkonst', grund: 'SMI', tl: true, yrken: ['bard', 'lonnmordare', 'krigare'] },
  // ── Nya färdigheter ur Magikerns Handbok ──
  { id: 'improviserad-magi', namn: 'Improviserad magi', grund: 'INT', mh: true, yrken: ['magiker', 'akademiker', 'alkemist', 'andebesvarjare', 'artefaktmagiker', 'druid', 'bastardmagiker', 'larling', 'nekromantiker', 'arkemagiker'] },
  { id: 'kunskap-alkemi', namn: 'Kunskap om alkemi', grund: 'INT', mh: true, yrken: ['magiker', 'akademiker', 'alkemist', 'andebesvarjare', 'artefaktmagiker', 'druid', 'bastardmagiker', 'larling', 'nekromantiker', 'arkemagiker'] },
  { id: 'kunskap-andeplanet', namn: 'Kunskap om andeplanet', grund: 'INT', mh: true, yrken: ['andebesvarjare', 'nekromantiker', 'akademiker', 'arkemagiker'] },
  { id: 'kunskap-animal-magnetism', namn: 'Kunskap om animal magnetism', grund: 'INT', mh: true, yrken: ['nekromantiker'] },
  { id: 'kunskap-overnaturliga', namn: 'Kunskap om det övernaturliga', grund: 'INT', mh: true, yrken: ['andebesvarjare', 'akademiker', 'arkemagiker'] },
  { id: 'kunskap-spadom', namn: 'Kunskap om spådom', grund: 'INT', mh: true, yrken: ['magiker', 'akademiker', 'alkemist', 'andebesvarjare', 'artefaktmagiker', 'druid', 'bastardmagiker', 'larling', 'nekromantiker', 'arkemagiker'] },
  { id: 'kunskap-teknologi', namn: 'Kunskap om teknologi', grund: 'INT', mh: true, yrken: ['artefaktmagiker', 'akademiker', 'alkemist'] },
  { id: 'magistudier', namn: 'Magistudier', grund: 'INT', mh: true, yrken: ['magiker', 'akademiker', 'alkemist', 'andebesvarjare', 'artefaktmagiker', 'druid', 'bastardmagiker', 'larling', 'nekromantiker', 'arkemagiker'] },
  { id: 'memorera-besvarjelse', namn: 'Memorera besvärjelse', grund: 'INT', mh: true, yrken: ['magiker', 'akademiker', 'alkemist', 'andebesvarjare', 'artefaktmagiker', 'druid', 'bastardmagiker', 'larling', 'nekromantiker', 'arkemagiker'], note: 'Automatisk färdighet — alla magiker har den.' },
  { id: 'minimagi', namn: 'Minimagi', grund: 'INT', mh: true, yrken: ['magiker', 'akademiker', 'alkemist', 'andebesvarjare', 'artefaktmagiker', 'druid', 'bastardmagiker', 'larling', 'nekromantiker', 'arkemagiker'] },
  { id: 'pergament', namn: 'Pergament', grund: 'INT', mh: true, yrken: ['magiker', 'akademiker', 'alkemist', 'andebesvarjare', 'artefaktmagiker', 'druid', 'bastardmagiker', 'larling', 'nekromantiker', 'arkemagiker'] },
  { id: 'ritualmagi', namn: 'Ritualmagi', grund: 'INT', mh: true, yrken: ['andebesvarjare', 'arkemagiker', 'nekromantiker', 'druid'] },
  { id: 'matlagning', namn: 'Matlagning', grund: 'INT', mh: true, yrken: 'Alla' },
]

export const ALL_SKILLS = [...PRIMARY_SKILLS, ...SECONDARY_SKILLS]

// ── MAGI & BESVÄRJELSER (DrakarOchDemoner V4 Spelarboken, RiotMinds) ────────
// Besvärjelserna är transkriberade ur Spelarbokens magikapitel. En magiker lär
// sig en magiskola (färdigheten Magiskola, se SECONDARY_SKILLS) och kan därefter
// lära besvärjelser ur den skolan vars skolvärde ≤ hans FV i skolan. Allmänna
// besvärjelser kan läras av alla som behärskar minst en magiskola.
//
// niva  = skolvärde (lägsta FV i skolan som krävs för att lära besvärjelsen).
// flags = F (Fysisk – verkar alltid vid lyckat slag), K (Kvick – snabb att lägga),
//         R (Ritual – kräver lugn och tid; minst FV 1 i ritualen).
export const MAGIC_FLAG_NAMES = { F: 'Fysisk', K: 'Kvick', R: 'Ritual' }

export const MAGIC_SCHOOLS = [
  {
    id: 'allman', namn: 'Allmänna besvärjelser', general: true,
    desc: 'Grundläggande besvärjelser som varje magiker kan lära oavsett magiskola. Skolvärdet jämförs mot magikerns högsta magiskole-FV.',
  },
  {
    id: 'animism', namn: 'Animism',
    desc: 'Naturens magi — djur, växter, väder och kropp. Utbygdsjägarens enda magiskola.',
  },
  {
    id: 'elementarmagi', namn: 'Elementarmagi',
    desc: 'Universums byggstenar: eld, luft, vatten, jord och mörker. Stridsmagikerns skola.',
  },
  {
    id: 'mentalism', namn: 'Mentalism',
    desc: 'Sinnets och tankens kraft — kontroll över egen och andras kropp och medvetande.',
  },
  // ── Registerskolor (Magikerns Handbok, besvärjelseregistret s. 91–93) ──
  // Specialskolor som bara indexeras i Magikerns Handbok (namn + skolvärde +
  // sidhänvisning). Besvärjelsernas fullständiga regeltext finns i respektive
  // källbok (Drakar, Kaos väktare, Nidland), inte i Magikerns Handbok.
  // Besvärjelsenamnen är OCR-tolkade ur registret och kan innehålla fel.
  {
    id: 'falsk-drakmagi', namn: 'Falsk drakmagi', register: true, sourceBook: 'Drakar',
    desc: 'Drakmagikerns härmade drakmagi. Besvärjelserna beskrivs i Drakar (s. 76–79); Magikerns Handboks register listar bara namn och skolvärde.',
  },
  {
    id: 'sann-drakmagi', namn: 'Sann drakmagi', register: true, sourceBook: 'Drakar',
    desc: 'Den äkta drakmagin som riktiga drakar behärskar. Beskrivs i Drakar (s. 80–82).',
  },
  {
    id: 'demonologi', namn: 'Demonologi', register: true, sourceBook: 'Kaos väktare',
    desc: 'Konsten att frammana, binda och behärska demoner. Beskrivs i Kaos väktare (s. 44–48).',
  },
  {
    id: 'portalmagi', namn: 'Portalmagi', register: true, sourceBook: 'Kaos väktare',
    desc: 'Magi för att läsa, dölja, skapa och förgöra portaler. Beskrivs i Kaos väktare (s. 49–51).',
  },
  {
    id: 'morkermagi', namn: 'Mörkermagi', register: true, sourceBook: 'Nidland',
    desc: 'Vicotniks mörka magi. Beskrivs i Nidland (s. 38–41). Besvärjelsenamnen är särskilt osäkra (OCR ur registret).',
  },
]

// EP-kostnad för att lära en besvärjelse, efter skolvärde (Kostnad för
// besvärjelser, Spelarboken s. 25): 1–3 → 2, 4–6 → 4, … +2 per ytterligare 3.
export function spellLearnCost(niva) {
  return 2 * Math.ceil(Math.max(1, niva) / 3)
}

// Varje besvärjelse: skola (MAGIC_SCHOOLS-id), niva (skolvärde), flags,
// rackvidd, varaktighet, desc (kort sammanfattning av effekten).
export const SPELLS = [
  // ── Allmänna besvärjelser ──
  { id: 'antimagi', namn: 'Antimagi', skola: 'allman', niva: 3, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'S/4 minuter', desc: 'Skapar en magisk sköld (volym upp till 125 m³) som negerar inkommande besvärjelser vars effektgrad inte överstiger Antimagins.' },
  { id: 'skingra', namn: 'Skingra', skola: 'allman', niva: 6, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Omedelbar', desc: 'Upphäver effekten av en redan lagd besvärjelse (t.ex. Förtrolla vapen eller Beskyddare) om effektgraden räcker.' },
  { id: 'varseblivning', namn: 'Varseblivning', skola: 'allman', niva: 6, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Omedelbar', desc: 'Lokaliserar något magikern specificerar — en person, ett föremål eller en viss besvärjelse — inom räckvidden.' },
  { id: 'beskyddare', namn: 'Beskyddare', skola: 'allman', niva: 9, flags: [], rackvidd: 'Beröring', varaktighet: 'Permanent', desc: 'Bildar en skyddande kub (≈3×3×3 m) runt målet som negerar besvärjelser likt en personlig Antimagi tills energin tar slut.' },
  { id: 'foryngra', namn: 'Föryngra', skola: 'allman', niva: 14, flags: ['R'], rackvidd: 'Beröring', varaktighet: 'S/4 veckor', desc: 'Ritual som tillfälligt föryngrar en person och höjer dess fysiska grundegenskaper (Ex5).' },
  { id: 'laddning', namn: 'Laddning', skola: 'allman', niva: 14, flags: ['R'], rackvidd: 'Beröring', varaktighet: 'Permanent', desc: 'Ritual som lagrar PSY-poäng i ett engångsbatteri (t.ex. en formel) för senare bruk.' },

  // ── Animism ──
  { id: 'finna-vatten', namn: 'Finna vatten', skola: 'animism', niva: 1, flags: [], rackvidd: 'S/4 km', varaktighet: 'Omedelbar', desc: 'Känner av riktning och avstånd till vatten och vattensamlingar inom räckvidden.' },
  { id: 'traeld', namn: 'Träeld', skola: 'animism', niva: 2, flags: ['F', 'K'], rackvidd: 'Beröring', varaktighet: 'Omedelbar', desc: 'Antänder ett stycke torrt, dött trä som sedan brinner av egen kraft; per extra effektgrad antänds ytterligare ett trästycke.' },
  { id: 'sparlos', namn: 'Spårlös', skola: 'animism', niva: 4, flags: [], rackvidd: 'Beröring', varaktighet: 'S/4 minuter', desc: 'Målet rör sig utan att lämna spår; per extra effektgrad omfattas ännu en varelse.' },
  { id: 'vaxtkunskap', namn: 'Växtkunskap', skola: 'animism', niva: 5, flags: [], rackvidd: 'Beröring', varaktighet: 'Omedelbar', desc: 'Ger omedelbart full kunskap om en växt magikern rör vid — vad den är och vad den används till.' },
  { id: 'minska', namn: 'Minska', skola: 'animism', niva: 6, flags: [], rackvidd: 'Beröring', varaktighet: 'S/4 minuter', desc: 'Sänker en varelses STY, FYS, STO, KAR eller SMI med effektgraden i poäng.' },
  { id: 'nedkalla-askvigg', namn: 'Nedkalla åskvigg', skola: 'animism', niva: 6, flags: ['F'], rackvidd: 'Sx10 rutor', varaktighet: 'Omedelbar', desc: 'Kallar ned en åskvigg ur regnmoln mot ett mål; kräver moln. Vållar skada likt elementarbesvärjelsen Blixt.' },
  { id: 'vindpil', namn: 'Vindpil', skola: 'animism', niva: 6, flags: ['F'], rackvidd: 'Sx2 rutor', varaktighet: 'Sx1 SR', desc: 'Formar en pil av vind som skjuts mot ett mål och vållar skada.' },
  { id: 'oka', namn: 'Öka', skola: 'animism', niva: 6, flags: [], rackvidd: 'Beröring', varaktighet: 'S/4 minuter', desc: 'Höjer en varelses STY, FYS, STO, KAR eller SMI med effektgraden i poäng (motsatsen till Minska).' },
  { id: 'ortrankor', namn: 'Örtrankor', skola: 'animism', niva: 6, flags: ['F'], rackvidd: 'Särskild', varaktighet: 'Sx1 SR', desc: 'Kastar ett knippe frön som växer till rankor och snärjer in ett mål (en effektgrad per 10 STO hos offret).' },
  { id: 'kamouflage', namn: 'Kamouflage', skola: 'animism', niva: 7, flags: [], rackvidd: 'Personlig', varaktighet: 'S/4 minuter', desc: 'Smälter in magikern i omgivningen så han blir mycket svår att upptäcka; söka kräver lyckat slag mot effektgraden.' },
  { id: 'vindkontroll', namn: 'Vindkontroll', skola: 'animism', niva: 11, flags: [], rackvidd: 'Sx1 km', varaktighet: 'Sx1 timmar', desc: 'Förändrar vindens styrka och riktning inom räckvidden.' },
  { id: 'forandra', namn: 'Förändra', skola: 'animism', niva: 12, flags: [], rackvidd: 'Sx2 rutor', varaktighet: 'Sx1 min', desc: 'Förvandlar föremål och varelser; varje grad räcker till tre poäng STO och man måste täcka hela målets STO.' },
  { id: 'hela', namn: 'Hela', skola: 'animism', niva: 12, flags: [], rackvidd: 'Beröring', varaktighet: 'Omedelbar', desc: 'Läker 1T6 KP per effektgrad på en levande varelse och kan även bota sjukdomar.' },
  { id: 'kanna-fiendskap', namn: 'Känna fiendskap', skola: 'animism', niva: 12, flags: [], rackvidd: 'Sx2 rutor', varaktighet: 'Omedelbar', desc: 'Känner av om en intelligent varelse är fientligt inställd mot någon.' },
  { id: 'regnkontroll', namn: 'Regnkontroll', skola: 'animism', niva: 13, flags: [], rackvidd: 'S/4 km', varaktighet: 'Sx1 timmar', desc: 'Samlar moln och kallar fram regn inom räckvidden.' },
  { id: 'dimma', namn: 'Dimma', skola: 'animism', niva: 15, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'S/4 timmar', desc: 'Framkallar dimma som täcker området; kräver tillgång till vatten eller fukt.' },
  { id: 'neutralisera-gift', namn: 'Neutralisera gift', skola: 'animism', niva: 15, flags: ['F'], rackvidd: 'Beröring', varaktighet: 'Omedelbar', desc: 'Neutraliserar 1T6+1 poäng giftstyrka per effektgrad; verkar automatiskt utan att läka redan vållad skada.' },
  // Varelsebesvärjelser — lärs separat för varje djurgrupp (däggdjur, fåglar,
  // kräldjur, groddjur, fiskar, insekter/spindlar, skaldjur, maskar, blötdjur, växter).
  { id: 'tillkalla-varelse', namn: 'Tillkalla varelse', skola: 'animism', niva: 2, flags: [], rackvidd: 'Sx4 km', varaktighet: 'Omedelbar', varelse: true, desc: 'Tillkallar 20 poäng STO varelser per effektgrad ur en vald djurgrupp inom räckvidden (ej kontroll). Lärs per djurgrupp.' },
  { id: 'tala-med-varelse', namn: 'Tala med varelse', skola: 'animism', niva: 5, flags: [], rackvidd: 'Personlig', varaktighet: 'Sx1 minuter', varelse: true, desc: 'Kommunicerar med en varelse ur en vald djurgrupp. Lärs per djurgrupp.' },
  { id: 'kontrollera-varelse', namn: 'Kontrollera varelse', skola: 'animism', niva: 10, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Sx1 SR', varelse: true, desc: 'Tar full kontroll över 20 poäng STO varelser per effektgrad ur en vald djurgrupp. Lärs per djurgrupp.' },

  // ── Elementarmagi ──
  { id: 'ljus', namn: 'Ljus', skola: 'elementarmagi', niva: 2, flags: ['F'], rackvidd: 'Sx10 rutor', varaktighet: 'Sx4 minuter', desc: 'Får en del av ett föremål (≈50 cm³) att lysa; lyser upp allt inom tre meter. Per effektgrad ökad styrka eller varaktighet.' },
  { id: 'laga', namn: 'Låga', skola: 'elementarmagi', niva: 2, flags: ['F', 'K'], rackvidd: 'Personlig', varaktighet: '1T3 SR', desc: 'En liten låga slår upp ur tummen; kan tända saker men skadar inte magikern.' },
  { id: 'forsegla', namn: 'Försegla', skola: 'elementarmagi', niva: 3, flags: ['F'], rackvidd: 'Beröring', varaktighet: 'Sx1 minuter', desc: 'Binder samman två icke-levande föremål; STY som krävs för att bryta förseglingen ges av effektgraden.' },
  { id: 'morker', namn: 'Mörker', skola: 'elementarmagi', niva: 3, flags: ['F'], rackvidd: 'Sx10 rutor', varaktighet: 'S/4 minuter', desc: 'Skapar mörker i ett område (1 m diameter per grad); motverkar Ljus.' },
  { id: 'skold', namn: 'Sköld', skola: 'elementarmagi', niva: 3, flags: ['F', 'K'], rackvidd: 'Personlig', varaktighet: 'Omedelbar', desc: 'Formar en sköld framför magikern med BV 4 (+2 per effektgrad) som parerar första anfallet automatiskt.' },
  { id: 'flammande-hand', namn: 'Flammande hand', skola: 'elementarmagi', niva: 4, flags: ['F'], rackvidd: 'Beröring', varaktighet: '1T3 minuter', desc: 'Ena handen flammar och ger 1T3 extra skada per effektgrad på utdelade slag; antänder lättantändliga föremål.' },
  { id: 'kalla-handen', namn: 'Kalla handen', skola: 'elementarmagi', niva: 4, flags: ['F', 'K'], rackvidd: 'S/2 rutor', varaktighet: 'Omedelbar', desc: 'Avfyrar en köldstråle från handen mot en varelse.' },
  { id: 'blixt', namn: 'Blixt', skola: 'elementarmagi', niva: 6, flags: ['F', 'K'], rackvidd: 'Sx10 rutor', varaktighet: 'Omedelbar', desc: 'En blixt slår från magikern till målet; 1T6 skada per effektgrad rakt från totala KP (rustning skyddar ej).' },
  { id: 'eld', namn: 'Eld', skola: 'elementarmagi', niva: 6, flags: ['F'], rackvidd: 'Sx10 rutor', varaktighet: 'Omedelbar', desc: 'Tillfällig hetta i en sfär (1 m diameter); 1T6 skada per effektgrad och antänder lättantändligt. Kan spridas på flera sfärer.' },
  { id: 'energistrale', namn: 'Energistråle', skola: 'elementarmagi', niva: 6, flags: ['F'], rackvidd: 'Sx10 rutor', varaktighet: 'Omedelbar', desc: 'En stråle av magisk kraft träffar målet; 1T6 skada per effektgrad — Sköld och rustning skyddar inte.' },
  { id: 'frost', namn: 'Frost', skola: 'elementarmagi', niva: 6, flags: ['F'], rackvidd: 'Sx10 rutor', varaktighet: 'Omedelbar', desc: 'Plötslig köld i en sfär; verkar som Eld fast med kyla.' },
  { id: 'forbanna-vapen', namn: 'Förbanna vapen', skola: 'elementarmagi', niva: 6, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Sx1 minuter', desc: 'Sänker ett vapens chans att träffa och dess skada med 1 CL per effektgrad.' },
  { id: 'fortrolla-vapen', namn: 'Förtrolla vapen', skola: 'elementarmagi', niva: 6, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Sx1 minuter', desc: 'Höjer ett vapens chans att träffa och dess skada med 1 CL per effektgrad.' },
  { id: 'knacka', namn: 'Knäcka', skola: 'elementarmagi', niva: 6, flags: ['F', 'K'], rackvidd: 'Sx2 rutor', varaktighet: 'Omedelbar', desc: 'Skadar ett icke-levande föremål och sänker dess BV; kan knäcka vapen och lås.' },
  { id: 'oppna', namn: 'Öppna', skola: 'elementarmagi', niva: 6, flags: ['F'], rackvidd: 'Beröring', varaktighet: 'Omedelbar', desc: 'Öppnar låsta dörrar, luckor och kistor (motsats till Försegla och lås).' },
  { id: 'viggfangare', namn: 'Viggfångare', skola: 'elementarmagi', niva: 7, flags: ['F'], rackvidd: 'Personlig', varaktighet: 'Omedelbar', desc: 'Kastas under åskväder och fångar in en blixt; energin lagras som PSY-poäng (8 + 4 per effektgrad) att använda inom en timme.' },
  { id: 'virvelskold', namn: 'Virvelsköld', skola: 'elementarmagi', niva: 8, flags: ['F'], rackvidd: 'Personlig', varaktighet: 'Sx1 SR', desc: 'En kraftig luftvirvel (≈75 cm diameter) kring magikern som avvärjer inkommande och avfyrade projektiler.' },
  { id: 'frammana-elementar', namn: 'Frammana/skicka bort elementar', skola: 'elementarmagi', niva: 9, flags: ['F'], rackvidd: 'Sx10 rutor', varaktighet: 'Sx1 SR', desc: 'Frammanar eller skickar bort en elementarvarelse av de fyra elementen (sylf, gnom, undin, salamander) eller mörker (umbra).' },
  { id: 'astralvapen', namn: 'Astralvapen', skola: 'elementarmagi', niva: 10, flags: ['F'], rackvidd: 'S/2 rutor', varaktighet: 'Sx1 SR', desc: 'Frammanar ett vapen av magisk energi med skärande egg (en effektgrad per kg). Räknas som magiskt, vållar två poäng mindre skada, väger ingenting.' },
  { id: 'explosion', namn: 'Explosion', skola: 'elementarmagi', niva: 11, flags: ['F', 'K'], rackvidd: 'Sx10 rutor', varaktighet: 'Omedelbar', desc: 'En eld- och kraftexplosion i en punkt; skada per effektgrad rakt från totala KP i en radie, träffar alla i området (även magikern).' },

  // ── Mentalism ──
  { id: 'sprang', namn: 'Språng', skola: 'mentalism', niva: 1, flags: ['K'], rackvidd: 'Beröring', varaktighet: 'S/4 SR', desc: 'Ett jättesprång utan ansats — upp till fyra meter vågrätt och två meter lodrätt per effektgrad. Normalt SMI-slag vid landning.' },
  { id: 'motstandskraft', namn: 'Motståndskraft', skola: 'mentalism', niva: 3, flags: [], rackvidd: 'Beröring', varaktighet: 'Sx1 minuter', desc: 'Skyddar mot Eld, Frost och annan hetta/kyla; reducerar skadan med ett poäng per effektgrad.' },
  { id: 'levitation', namn: 'Levitation', skola: 'mentalism', niva: 4, flags: [], rackvidd: 'Personlig', varaktighet: 'Sx1 minuter', desc: 'Svävar långsamt upp och ned i luften.' },
  { id: 'kanslolasning', namn: 'Känsloläsning', skola: 'mentalism', niva: 5, flags: [], rackvidd: 'Sx2 rutor', varaktighet: 'S/4 SR', desc: 'Avläser en varelses känslor utan att den märker det.' },
  { id: 'lyft', namn: 'Lyft', skola: 'mentalism', niva: 6, flags: [], rackvidd: 'Sx4 rutor', varaktighet: 'Sx1 minuter', desc: 'Lyfter och flyttar ett föremål telekinetiskt (tre poäng STO per effektgrad).' },
  { id: 'skydd', namn: 'Skydd', skola: 'mentalism', niva: 6, flags: [], rackvidd: 'Beröring', varaktighet: 'S/4 minuter', desc: 'Fungerar likt bepansring — varje effektgrad ger en poäng absorbering.' },
  { id: 'tankeoverforing', namn: 'Tankeöverföring', skola: 'mentalism', niva: 6, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Sx1 SR', desc: 'Kommunicerar med en varelse via tanken; endast enkla tankar och känslor kan överföras.' },
  { id: 'vattenandning', namn: 'Vattenandning', skola: 'mentalism', niva: 7, flags: [], rackvidd: 'Beröring', varaktighet: 'Sx1 timmar', desc: 'Låter den förhäxade andas under vatten utan problem.' },
  { id: 'flyga', namn: 'Flyga', skola: 'mentalism', niva: 8, flags: [], rackvidd: 'Beröring', varaktighet: 'Sx5 rutor', desc: 'Ger förmågan att flyga fritt; hastighet Sx5 rutor, +20 STO buren vikt per effektgrad.' },
  { id: 'laderhud', namn: 'Läderhud', skola: 'mentalism', niva: 8, flags: [], rackvidd: 'Personlig', varaktighet: 'Sx1 timmar', desc: 'Härdar huden till seg, brunaktig läderhud som ger skydd; KAR-baserade färdigheter −2.' },
  { id: 'morkersyn', namn: 'Mörkersyn', skola: 'mentalism', niva: 8, flags: [], rackvidd: 'Beröring', varaktighet: 'Sx1 timmar', desc: 'Uppfattar värmestrålning och ser temperaturskillnader i mörker upp till ≈120 m.' },
  { id: 'osynlighet', namn: 'Osynlighet', skola: 'mentalism', niva: 9, flags: [], rackvidd: 'Beröring', varaktighet: 'Sx1 minuter', desc: 'Gör målet osynligt (6 PSY per effektgrad); bryts om den osynlige anfaller eller använder magi.' },
  { id: 'syn', namn: 'Syn', skola: 'mentalism', niva: 9, flags: [], rackvidd: 'Personlig', varaktighet: 'Sx1 SR', desc: 'Magikern ser och hör vad någon eller något inom räckvidden ser och hör (fjärrseende).' },
  { id: 'elchock', namn: 'Elchock', skola: 'mentalism', niva: 10, flags: ['F', 'K'], rackvidd: 'Beröring', varaktighet: 'Omedelbar', desc: 'En elektrisk urladdning vid beröring; 1T4 skada per effektgrad — metallrustning absorberar bara hälften.' },
  { id: 'tankelasning', namn: 'Tankeläsning', skola: 'mentalism', niva: 11, flags: [], rackvidd: 'Sx2 rutor', varaktighet: 'Sx1 minuter', desc: 'Läser en intelligent varelses tankar utan att offret märker något.' },
  { id: 'kontrollera-person', namn: 'Kontrollera person', skola: 'mentalism', niva: 12, flags: [], rackvidd: 'Sx4 rutor', varaktighet: 'Sx1 minuter', desc: 'Kontrollerar en intelligent varelse (övervinn dess PSY); kan ej tvinga till självskada eller magi.' },
  { id: 'telepati', namn: 'Telepati', skola: 'mentalism', niva: 12, flags: [], rackvidd: 'Special', varaktighet: 'Sx1 minuter', desc: 'Tankekommunikation med en känd intelligent varelse oavsett avstånd; magikern fungerar som telepatisk växel.' },
  { id: 'teleportera', namn: 'Teleportera', skola: 'mentalism', niva: 12, flags: [], rackvidd: 'Beröring', varaktighet: 'Omedelbar', desc: 'Teleporterar tre poäng STO per effektgrad upp till Sx1 km; ovillig varelse får göra motstånd med PSY.' },
  { id: 'magisk-syn', namn: 'Magisk syn', skola: 'mentalism', niva: 13, flags: [], rackvidd: 'Beröring', varaktighet: 'Sx1 minuter', desc: 'Förhäxad syn som ser osynliga och dolda ting (t.ex. den som gjort sig osynlig) samt avslöjar besvärjelser.' },
  { id: 'oradd', namn: 'Orädd', skola: 'mentalism', niva: 14, flags: [], rackvidd: 'Beröring', varaktighet: 'Sx1 timmar', desc: 'Den förhäxade behöver inte slå på Skräcktabellen oavsett vad han möter.' },

  // ── Nya besvärjelser ur Magikerns Handbok (Target Games, 1993), source 'MH' ──
  // Underskolor (disciplin) ligger under sin huvudskola; en magiker når dem med
  // halva sitt FV i huvudskolan (se schoolFv-beräkningen i characterLibrary).
  { id: 'mh-skapa-tempel', namn: 'Skapa tempel', skola: 'allman', disciplin: null, niva: 3, flags: ['R'], rackvidd: 'Beröring', varaktighet: 'Permanent', source: 'MH', desc: 'Inviger en byggnad eller plats till magiskt tempel som ger fördelar åt besvärjelser som utförs där.' },
  { id: 'mh-symbol', namn: 'Symbol', skola: 'allman', disciplin: null, niva: 12, flags: [], rackvidd: 'Spec', varaktighet: 'Spec', source: 'MH', desc: 'Lagrar en annan besvärjelse i ett föremål så att den utlöses när angivna villkor uppfylls.' },
  { id: 'mh-skapa-alkemiskt-elixir', namn: 'Skapa alkemiskt elixir', skola: 'allman', disciplin: null, niva: 15, flags: [], rackvidd: 'Beröring', varaktighet: 'Permanent', source: 'MH', desc: 'Framställer ett magiskt elixir som bär en lagrad besvärjelses verkan i flytande form.' },
  { id: 'mh-sigill', namn: 'Sigill', skola: 'allman', disciplin: null, niva: 17, flags: [], rackvidd: 'Beröring', varaktighet: 'Tills det aktiveras', source: 'MH', desc: 'Binder en lagrad besvärjelse till en symbol som utlöses när den bryts eller berörs.' },
  { id: 'mh-permanens', namn: 'Permanens', skola: 'allman', disciplin: null, niva: 19, flags: ['R'], rackvidd: 'Beröring', varaktighet: 'Permanent', source: 'MH', desc: 'Ritual som gör effekten hos ett sigill eller liknande lagrad besvärjelse permanent.' },
  { id: 'mh-nexus', namn: 'Nexus', skola: 'allman', disciplin: null, niva: 20, flags: ['R'], rackvidd: 'Beröring', varaktighet: 'Permanent', source: 'MH', desc: 'Skapar ett fokus som samlar naturens magiska flöden och lagrar stora mängder PSY för senare bruk.' },
  { id: 'mh-kanna-best', namn: 'Känna best', skola: 'animism', disciplin: null, niva: 1, flags: [], rackvidd: 'Sx4 kilometer', varaktighet: 'Sx4 SR', source: 'MH', desc: 'Magikern förnimmer var djur befinner sig inom räckvidden.' },
  { id: 'mh-eldfluga', namn: 'Eldfluga', skola: 'animism', disciplin: null, niva: 2, flags: [], rackvidd: 'Sx2 rutor', varaktighet: 'Sx4 timmar', source: 'MH', desc: 'Frammanar ett svalt lysande sken likt en eldfluga som lyser upp omgivningen.' },
  { id: 'mh-finna-best', namn: 'Finna best', skola: 'animism', disciplin: null, niva: 3, flags: [], rackvidd: 'Sx4 kilometer', varaktighet: 'Sx4 SR', source: 'MH', desc: 'Anger riktning och avstånd till ett visst djur inom räckvidden.' },
  { id: 'mh-lugna-best', namn: 'Lugna best', skola: 'animism', disciplin: null, niva: 4, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Sx1 minuter', source: 'MH', desc: 'Lugnar ett djur så att det blir vänligt och fogligt mot magikern.' },
  { id: 'mh-rida', namn: 'Rida', skola: 'animism', disciplin: null, niva: 5, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Sx4 timmar', source: 'MH', desc: 'Låter magikern rida ett djur utan sadel och tygel med full kontroll.' },
  { id: 'mh-hela-best', namn: 'Hela best', skola: 'animism', disciplin: null, niva: 6, flags: [], rackvidd: 'Beröring', varaktighet: 'Omedelbar', source: 'MH', desc: 'Botar skador och sjukdom hos ett djur som magikern rör vid.' },
  { id: 'mh-tamja', namn: 'Tämja', skola: 'animism', disciplin: null, niva: 7, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Sx4 timmar', source: 'MH', desc: 'Får ett vilt djur att uppträda som ett tamt och lydigt djur.' },
  { id: 'mh-fordriva-insekter', namn: 'Fördriva insekter', skola: 'animism', disciplin: null, niva: 10, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Sx1 SR', source: 'MH', desc: 'Driver bort alla insekter inom räckvidden från ett område.' },
  { id: 'mh-djurminne', namn: 'Djurminne', skola: 'animism', disciplin: null, niva: 13, flags: [], rackvidd: 'Beröring', varaktighet: 'Spec', source: 'MH', desc: 'Låter magikern ta del av och tolka ett djurs minnesbilder.' },
  { id: 'mh-fordriva-best', namn: 'Fördriva best', skola: 'animism', disciplin: null, niva: 14, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Sx1 SR', source: 'MH', desc: 'Tvingar djur inom räckvidden att vända om och fly från området.' },
  { id: 'mh-tjanande-best', namn: 'Tjänande best', skola: 'animism', disciplin: null, niva: 15, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Sx10 timmar', source: 'MH', desc: 'Får ett djur att tjäna magikern lojalt och utföra enklare uppgifter.' },
  { id: 'mh-fordriva-skogens-fiende', namn: 'Fördriva skogens fiende', skola: 'animism', disciplin: null, niva: 16, flags: ['R'], rackvidd: 'Sx10 rutor', varaktighet: 'Permanent', source: 'MH', desc: 'Ritual som driver bort varelser som hotar den naturliga ordningen i skogen.' },
  { id: 'mh-skogsfrande', namn: 'Skogsfrände', skola: 'animism', disciplin: null, niva: 17, flags: [], rackvidd: 'Sx4 kilometer', varaktighet: 'Sx4 timmar', source: 'MH', desc: 'Ger magikern fullständig kunskap om ett område och dess invånare så länge besvärjelsen varar.' },
  { id: 'mh-insektssvarm', namn: 'Insektssvärm', skola: 'animism', disciplin: null, niva: 18, flags: ['F'], rackvidd: 'Sx10 meter', varaktighet: 'Sx4 SR', source: 'MH', desc: 'Frammanar en svärm aggressiva flygande insekter som angriper magikerns fiender.' },
  { id: 'mh-akalla-storm', namn: 'Åkalla storm', skola: 'animism', disciplin: null, niva: 19, flags: ['F'], rackvidd: 'Sx4 kilometer', varaktighet: 'Sx1 timmar', source: 'MH', desc: 'Frammanar oväder med åska och skyfall över ett område.' },
  { id: 'mh-djurradare', namn: 'Djurrådare', skola: 'animism', disciplin: null, niva: 20, flags: ['R'], rackvidd: 'Sx2 rutor', varaktighet: 'Spec', source: 'MH', desc: 'Kallar fram en djurrådare som kan ge magikern råd och hjälp.' },
  { id: 'mh-den-vilda-jakten', namn: 'Den vilda jakten', skola: 'animism', disciplin: null, niva: 24, flags: [], rackvidd: '1 kilometer', varaktighet: 'Spec', source: 'MH', desc: 'Åkallar en spöklik jaktskara som förföljer och anfaller en utpekad fiende.' },
  { id: 'mh-skorda', namn: 'Skörda', skola: 'animism', disciplin: 'Växtrikets magi', niva: 26, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Omedelbar', source: 'MH', desc: 'Påskyndar utvecklingen för en hel åker odlad gröda så den växer färdig; missbrukad kan den suga ut all magisk kraft ur jorden tills den är steril.' },
  { id: 'mh-nattsyn', namn: 'Nattsyn', skola: 'animism', disciplin: 'Djurhamn', niva: 5, flags: [], rackvidd: 'Beröring', varaktighet: 'Sx1 timmar', source: 'MH', desc: 'Ger förmågan att se klart i mörker likt ett nattdjur.' },
  { id: 'mh-klor', namn: 'Klor', skola: 'animism', disciplin: 'Djurhamn', niva: 8, flags: ['F'], rackvidd: 'Beröring', varaktighet: 'Sx1 minuter', source: 'MH', desc: 'Förvandlar magikerns händer till vassa klor som kan användas som vapen.' },
  { id: 'mh-kaftar', namn: 'Käftar', skola: 'animism', disciplin: 'Djurhamn', niva: 8, flags: ['F'], rackvidd: 'Beröring', varaktighet: 'Sx1 minuter', source: 'MH', desc: 'Ger magikern ett rovdjurs käftar och tänder att bita med.' },
  { id: 'mh-bjornsjal', namn: 'Björnsjäl', skola: 'animism', disciplin: 'Djurhamn', niva: 10, flags: [], rackvidd: 'Beröring', varaktighet: 'Sx1 timmar', source: 'MH', desc: 'Förlänar magikern en björns styrka och egenskaper.' },
  { id: 'mh-leopardsjal', namn: 'Leopardsjäl', skola: 'animism', disciplin: 'Djurhamn', niva: 10, flags: [], rackvidd: 'Beröring', varaktighet: 'Sx1 timmar', source: 'MH', desc: 'Förlänar magikern en leopards snabbhet och rörlighet.' },
  { id: 'mh-djurisk-intelligens', namn: 'Djurisk intelligens', skola: 'animism', disciplin: 'Djurhamn', niva: 12, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Sx1 SR', source: 'MH', desc: 'Sänker tillfälligt en varelses intelligens till djurnivå.' },
  { id: 'mh-ornvingar', namn: 'Örnvingar', skola: 'animism', disciplin: 'Djurhamn', niva: 13, flags: [], rackvidd: 'Beröring', varaktighet: 'Sx1 timmar', source: 'MH', desc: 'Ger magikern vingar att flyga med likt en örn.' },
  { id: 'mh-vildman', namn: 'Vildman', skola: 'animism', disciplin: 'Djurhamn', niva: 15, flags: [], rackvidd: 'Sx2 rutor', varaktighet: 'Sx4 rutor', source: 'MH', desc: 'Förvandlar offret till en vild best som angriper allt i närheten.' },
  { id: 'mh-bestpakt', namn: 'Bestpakt', skola: 'animism', disciplin: 'Djurhamn', niva: 18, flags: ['R'], rackvidd: 'Sx2 rutor', varaktighet: 'Permanent', source: 'MH', desc: 'Ritual som binder magikerns själ samman med ett djur i en bestående pakt.' },
  { id: 'mh-bota-varulv', namn: 'Bota varulv', skola: 'animism', disciplin: 'Djurhamn', niva: 20, flags: [], rackvidd: 'Sx2 rutor', varaktighet: 'Omedelbar', source: 'MH', desc: 'Botar en person från varulvsförbannelse.' },
  { id: 'mh-djurskepnad', namn: 'Djurskepnad', skola: 'animism', disciplin: 'Djurhamn', niva: 20, flags: [], rackvidd: 'Beröring', varaktighet: 'Sx1 timmar', source: 'MH', desc: 'Förvandlar magikern helt till ett djur med dess gestalt och egenskaper.' },
  { id: 'mh-formanskliga-best', namn: 'Förmänskliga best', skola: 'animism', disciplin: 'Djurhamn', niva: 24, flags: [], rackvidd: 'Beröring', varaktighet: 'Permanent', source: 'MH', desc: 'Ger ett djur människans intelligens och förmåga att tala.' },
  { id: 'mh-forma-vaxt', namn: 'Forma växt', skola: 'animism', disciplin: 'Växtrikets magi', niva: 5, flags: [], rackvidd: 'Sx2 rutor', varaktighet: 'Permanent', source: 'MH', desc: 'Magikern formar en växt efter sin vilja, till exempel till en figur eller form.' },
  { id: 'mh-hela-vaxt', namn: 'Hela växt', skola: 'animism', disciplin: 'Växtrikets magi', niva: 6, flags: [], rackvidd: 'Beröring', varaktighet: 'Omedelbar', source: 'MH', desc: 'Botar skador och sjukdom hos en växt.' },
  { id: 'mh-tala-med-vaxt', namn: 'Tala med växt', skola: 'animism', disciplin: 'Växtrikets magi', niva: 7, flags: [], rackvidd: 'Sx2 rutor', varaktighet: 'Sx4 minuter', source: 'MH', desc: 'Låter magikern samtala med en växt och få den att besvara frågor.' },
  { id: 'mh-valsigna-sadd', namn: 'Välsigna sådd', skola: 'animism', disciplin: 'Växtrikets magi', niva: 8, flags: [], rackvidd: 'Sx2 rutor', varaktighet: 'Permanent', source: 'MH', desc: 'Välsignar utsäde så att grödan växer rikligt och frodigt.' },
  { id: 'mh-skogsskydd', namn: 'Skogsskydd', skola: 'animism', disciplin: 'Växtrikets magi', niva: 9, flags: [], rackvidd: 'Personlig', varaktighet: 'Sx1 timmar', source: 'MH', desc: 'Döljer magikern i skogen så att han blir mycket svår att upptäcka.' },
  { id: 'mh-skapa-vaxt', namn: 'Skapa växt', skola: 'animism', disciplin: 'Växtrikets magi', niva: 10, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Permanent', source: 'MH', desc: 'Får växter att snabbt spira upp ur marken på en plats.' },
  { id: 'mh-vaxtminne', namn: 'Växtminne', skola: 'animism', disciplin: 'Växtrikets magi', niva: 13, flags: [], rackvidd: 'Beröring', varaktighet: 'Spec', source: 'MH', desc: 'Låter magikern ta del av en växts intryck och minnesbilder.' },
  { id: 'mh-levande-natur', namn: 'Levande natur', skola: 'animism', disciplin: 'Växtrikets magi', niva: 15, flags: ['F'], rackvidd: 'Sx10 rutor', varaktighet: 'Sx4 SR', source: 'MH', desc: 'Väcker växterna i ett område till liv så att de angriper magikerns fiender.' },
  { id: 'mh-tornegrav', namn: 'Törnegrav', skola: 'animism', disciplin: 'Växtrikets magi', niva: 16, flags: ['F'], rackvidd: 'Sx10 rutor', varaktighet: 'Omedelbar', source: 'MH', desc: 'Låter törniga rankor spira upp och fånga och skada ett offer.' },
  { id: 'mh-kropp-av-vaxter', namn: 'Kropp av växter', skola: 'animism', disciplin: 'Växtrikets magi', niva: 18, flags: [], rackvidd: 'Beröring', varaktighet: 'Sx4 timmar', source: 'MH', desc: 'Förvandlar magikerns kropp till en gestalt av sammanflätade växter.' },
  { id: 'mh-kanna-manniska', namn: 'Känna människa', skola: 'mentalism', disciplin: null, niva: 2, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Omedelbar', source: 'MH', desc: 'Magikern känner om någon människa befinner sig inom räckvidden och åt vilket håll, även om personen är dold.' },
  { id: 'mh-gomma-sinne', namn: 'Gömma sinne', skola: 'mentalism', disciplin: null, niva: 5, flags: [], rackvidd: 'Personlig', varaktighet: 'Sx1 minuter', source: 'MH', desc: 'Gör magikerns sinne oåtkomligt för besvärjelser som påverkar tankar och känslor.' },
  { id: 'mh-panik', namn: 'Panik', skola: 'mentalism', disciplin: null, niva: 6, flags: ['K'], rackvidd: 'Sx2 rutor', varaktighet: 'Omedelbar', source: 'MH', desc: 'Ett vald offer måste slå på Skräcktabellen om det inte motstår; verkar ej på odöda eller lägre djur.' },
  { id: 'mh-kanna-logn', namn: 'Känna lögn', skola: 'mentalism', disciplin: null, niva: 7, flags: [], rackvidd: 'Sx2 rutor', varaktighet: 'Omedelbar', source: 'MH', desc: 'Magikern avgör om en person talar sanning, men inte vad sanningen är om personen själv tror på en lögn.' },
  { id: 'mh-aura', namn: 'Aura', skola: 'mentalism', disciplin: null, niva: 9, flags: ['F'], rackvidd: 'Sx10 rutor', varaktighet: 'Omedelbar', source: 'MH', desc: 'Magikern ser en persons aura och avgör om personen är god eller ond samt skadad eller sjuk.' },
  { id: 'mh-tankestot', namn: 'Tankestöt', skola: 'mentalism', disciplin: null, niva: 10, flags: ['F', 'K'], rackvidd: 'Sx10 rutor', varaktighet: 'Omedelbar', source: 'MH', desc: 'En mental attack som gör 1T6 skada per effektgrad mot offrets hjärna och kan slå denne medvetslös.' },
  { id: 'mh-overtyga', namn: 'Övertyga', skola: 'mentalism', disciplin: null, niva: 10, flags: [], rackvidd: 'Sx2 rutor', varaktighet: 'Omedelbar', source: 'MH', desc: 'Magikern kan övertyga någon att göra något denne ändå kunde tänkas göra, men inget som strider mot dess natur.' },
  { id: 'mh-forsta-sprak', namn: 'Förstå språk', skola: 'mentalism', disciplin: null, niva: 11, flags: [], rackvidd: 'Beröring', varaktighet: 'S/4 timmar', source: 'MH', desc: 'Den förhäxade kan förstå och tala ett främmande språk, men inte läsa eller skriva det.' },
  { id: 'mh-charm', namn: 'Charm', skola: 'mentalism', disciplin: null, niva: 12, flags: [], rackvidd: 'Sx1 timmar', varaktighet: 'Omedelbar', source: 'MH', desc: 'Den förhäxade blir magikerns vän, men minns efteråt att han betedde sig underligt.' },
  { id: 'mh-manniskans-minne', namn: 'Människans minne', skola: 'mentalism', disciplin: null, niva: 13, flags: [], rackvidd: 'Beröring', varaktighet: 'Omedelbar', source: 'MH', desc: 'Den förhäxade tvingas minnas tidigare händelser i sitt liv, styrt av magikern, ända till födelsen.' },
  { id: 'mh-radera-minne', namn: 'Radera minne', skola: 'mentalism', disciplin: null, niva: 13, flags: [], rackvidd: 'Beröring', varaktighet: 'Permanent', source: 'MH', desc: 'Raderar ett minne ur den förhäxades medvetande; minnet kan eventuellt återkomma senare.' },
  { id: 'mh-exorcism', namn: 'Exorcism', skola: 'mentalism', disciplin: null, niva: 13, flags: ['R'], rackvidd: 'Beröring', varaktighet: 'Omedelbar', source: 'MH', desc: 'Driver ut en ande som besatt någon; besvärjaren riskerar själv att bli besatt om ritualen misslyckas.' },
  { id: 'mh-vansinne', namn: 'Vansinne', skola: 'mentalism', disciplin: null, niva: 14, flags: [], rackvidd: 'Sx2 rutor', varaktighet: 'S/4 dagar', source: 'MH', desc: 'Den förhäxade förlorar förståndet och drabbas av ett vansinne ur en tabell (katatoni, aggression, fobi m.m.).' },
  { id: 'mh-falskt-minne', namn: 'Falskt minne', skola: 'mentalism', disciplin: null, niva: 15, flags: [], rackvidd: 'Beröring', varaktighet: 'Permanent', source: 'MH', desc: 'Implanterar ett falskt minne som personen tror på och inte kan skilja från sina verkliga minnen.' },
  { id: 'mh-forslava', namn: 'Förslava', skola: 'mentalism', disciplin: null, niva: 18, flags: [], rackvidd: 'Sx2 rutor', varaktighet: 'Permanent', source: 'MH', desc: 'Förvandlar en intelligent varelse till en lydig slav som behåller sin personlighet men måste lyda magikern.' },
  { id: 'mh-historia', namn: 'Historia', skola: 'mentalism', disciplin: null, niva: 18, flags: [], rackvidd: 'Beröring', varaktighet: 'Omedelbar', source: 'MH', desc: 'Magikern läser ut ett föremåls historia och vad det varit med om.' },
  { id: 'mh-besatta', namn: 'Besätta', skola: 'mentalism', disciplin: null, niva: 20, flags: [], rackvidd: 'Sx7 rutor', varaktighet: 'Sx1 timmar', source: 'MH', desc: 'Magikern förflyttar sin ande till en annan varelse och styr dess kropp medan hans egen ligger försvarslös.' },
  { id: 'mh-utplana', namn: 'Utplåna', skola: 'mentalism', disciplin: null, niva: 24, flags: [], rackvidd: 'Sx2 rutor', varaktighet: 'Permanent', source: 'MH', desc: 'Raderar fullständigt medvetandet hos en varelse så att kroppen lever kvar utan personlighet eller minne.' },
  { id: 'mh-stanna-tiden', namn: 'Stanna tiden', skola: 'mentalism', disciplin: null, niva: 28, flags: ['F'], rackvidd: 'Sx10 rutor', varaktighet: 'Sx1 SR', source: 'MH', desc: 'Stannar tiden inom ett område (10×10 m) så att allt utom magikern står stilla.' },
  { id: 'mh-utharda-hunger', namn: 'Uthärda hunger', skola: 'mentalism', disciplin: 'Kroppskontroll', niva: 7, flags: [], rackvidd: 'Beröring', varaktighet: 'S/4 dagar', source: 'MH', desc: 'Den förhäxade känner ingen hunger, men förlorar en FYS-poäng per dag utan mat.' },
  { id: 'mh-smarta', namn: 'Smärta', skola: 'mentalism', disciplin: 'Kroppskontroll', niva: 8, flags: ['F'], rackvidd: 'Sx10 rutor', varaktighet: 'Omedelbar', source: 'MH', desc: 'En skärande smärta genomtränger offret; han förlorar 1T10 SP per effektgrad och kan svimma.' },
  { id: 'mh-motsta-sjukdom', namn: 'Motstå sjukdom', skola: 'mentalism', disciplin: 'Kroppskontroll', niva: 8, flags: [], rackvidd: 'Beröring', varaktighet: 'S/4 dagar', source: 'MH', desc: 'Den förhäxade angrips inte av någon sjukdom så länge besvärjelsen varar.' },
  { id: 'mh-utharda-torst', namn: 'Uthärda törst', skola: 'mentalism', disciplin: 'Kroppskontroll', niva: 10, flags: [], rackvidd: 'Beröring', varaktighet: 'S/4 dagar', source: 'MH', desc: 'Den förhäxade känner ingen törst, men förlorar en FYS-poäng per dag utan vatten.' },
  { id: 'mh-forvrida-lem', namn: 'Förvrida lem', skola: 'mentalism', disciplin: 'Kroppskontroll', niva: 10, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Permanent', source: 'MH', desc: 'En arm eller ett ben förvrids till en obrukbar, missbildad lem.' },
  { id: 'mh-paralysera', namn: 'Paralysera', skola: 'mentalism', disciplin: 'Kroppskontroll', niva: 11, flags: [], rackvidd: 'Sx1 minuter', varaktighet: 'Sx1 SR', source: 'MH', desc: 'Alla inom ett område (E rutors radie) grips av paralyserande kramper och kan inte röra sig.' },
  { id: 'mh-sjukdom', namn: 'Sjukdom', skola: 'mentalism', disciplin: 'Kroppskontroll', niva: 11, flags: ['F'], rackvidd: 'Sx10 rutor', varaktighet: 'S/4 dagar', source: 'MH', desc: 'Slår den drabbade med en våldsam infektionssjukdom som försämrar FYS varje dag.' },
  { id: 'mh-andra-kropp', namn: 'Ändra kropp', skola: 'mentalism', disciplin: 'Kroppskontroll', niva: 18, flags: [], rackvidd: 'Beröring', varaktighet: 'Sx1 timmar', source: 'MH', desc: 'Den förhäxades kropp byggs tillfälligt om — STO ändras med en poäng per effektgrad.' },
  { id: 'mh-forvrida-kropp', namn: 'Förvrida kropp', skola: 'mentalism', disciplin: 'Kroppskontroll', niva: 24, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Permanent', source: 'MH', desc: 'Offrets hela kropp förvrids permanent till en vanskaplig, humanoid eller djurisk form.' },
  { id: 'mh-doda', namn: 'Döda', skola: 'mentalism', disciplin: 'Kroppskontroll', niva: 30, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Omedelbar', source: 'MH', desc: 'Offrets kropp förvrids och förstörs inifrån tills den dör; används mot draker och mycket motståndskraftiga varelser.' },
  { id: 'mh-illusion', namn: 'Illusion', skola: 'mentalism', disciplin: 'Illusionism', niva: 7, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Omedelbar', source: 'MH', desc: 'Skapar en falsk bild (upp till 10 STO) som kan röra sig och låta naturtroget men inte göra verklig skada.' },
  { id: 'mh-perfekt-illusion', namn: 'Perfekt illusion', skola: 'mentalism', disciplin: 'Illusionism', niva: 10, flags: ['F'], rackvidd: 'Sx10 rutor', varaktighet: 'Omedelbar', source: 'MH', desc: 'En illusion så perfekt att den uppfattas som verklig av alla sinnen och kan göra verklig skada (PSY för att motstå).' },
  { id: 'mh-se-genom-illusion', namn: 'Se genom illusion', skola: 'mentalism', disciplin: 'Illusionism', niva: 10, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Omedelbar', source: 'MH', desc: 'Magikern ser rakt igenom alla illusioner, även en perfekt illusion.' },
  { id: 'mh-konturlos', namn: 'Konturlös', skola: 'mentalism', disciplin: 'Illusionism', niva: 11, flags: [], rackvidd: 'Beröring', varaktighet: 'Sx1 SR', source: 'MH', desc: 'Den förhäxades kontur blir diffus och svajande, vilket gör honom svårträffad (avdrag på anfall mot honom).' },
  { id: 'mh-kamouflage', namn: 'Kamouflage', skola: 'mentalism', disciplin: 'Illusionism', niva: 12, flags: [], rackvidd: 'Beröring', varaktighet: 'Sx1 timmar', source: 'MH', desc: 'Den förhäxade smälter samman med bakgrunden som en kameleont och får bonus på att gömma sig.' },
  { id: 'mh-forkladnad', namn: 'Förklädnad', skola: 'mentalism', disciplin: 'Illusionism', niva: 15, flags: [], rackvidd: 'Beröring', varaktighet: 'Sx1 timmar', source: 'MH', desc: 'En illusion förvandlar den förhäxades utseende till en annan person eller varelse, ner till röst och rörelser.' },
  { id: 'mh-skapa-foremal', namn: 'Skapa föremål', skola: 'mentalism', disciplin: 'Illusionism', niva: 16, flags: [], rackvidd: 'Sx2 rutor', varaktighet: 'Sx1 timmar', source: 'MH', desc: 'Skapar ett verkligt föremål av illusionär materia; kan inte vara magiskt eller riddat.' },
  { id: 'mh-fata-morgana', namn: 'Fata morgana', skola: 'mentalism', disciplin: 'Illusionism', niva: 17, flags: ['F'], rackvidd: 'Sx1 kilometer', varaktighet: 'Sx1 timmar', source: 'MH', desc: 'En väldig hägring (oas, flygande stad) som kan förvilla och locka fienden mot en falsk syn.' },
  { id: 'mh-skapa-best', namn: 'Skapa best', skola: 'mentalism', disciplin: 'Illusionism', niva: 19, flags: [], rackvidd: 'Sx2 meter', varaktighet: 'Sx1 timmar', source: 'MH', desc: 'Skapar en levande varelse med djurisk intelligens som kan slåss och utföra enkla uppgifter.' },
  { id: 'mh-skapa-tjanare', namn: 'Skapa tjänare', skola: 'mentalism', disciplin: 'Illusionism', niva: 21, flags: [], rackvidd: 'Sx2 meter', varaktighet: 'Sx1 timmar', source: 'MH', desc: 'Skapar en intelligent humanoid varelse med egen kunskap som kan utföra färdighetsuppgifter.' },
  { id: 'mh-sant-skapande', namn: 'Sant skapande', skola: 'mentalism', disciplin: 'Illusionism', niva: 25, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Permanent', source: 'MH', desc: 'Skapar permanent ett föremål av naturligt material ur tomma intet.' },
  { id: 'mh-morkerljus', namn: 'Mörkerljus', skola: 'mentalism', disciplin: 'Dödens magi', niva: 4, flags: ['F', 'K'], rackvidd: 'Personlig', varaktighet: 'Sx1 minuter', source: 'MH', desc: 'Magikern omger sig med ogenomträngligt mörker som hindrar alla utom honom själv att se.' },
  { id: 'mh-zombie', namn: 'Zombie', skola: 'mentalism', disciplin: 'Dödens magi', niva: 10, flags: ['R'], rackvidd: 'Beröring', varaktighet: 'Permanent', source: 'MH', desc: 'Väcker en död kropp till en lydig zombie som tjänar magikern.' },
  { id: 'mh-den-dodes-minne', namn: 'Den dödes minne', skola: 'mentalism', disciplin: 'Dödens magi', niva: 13, flags: [], rackvidd: 'Beröring', varaktighet: 'Konc', source: 'MH', desc: 'Magikern läser ut minnen ur en död person genom att röra vid kroppen.' },
  { id: 'mh-blodstortning', namn: 'Blodstörtning', skola: 'mentalism', disciplin: 'Dödens magi', niva: 15, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Omedelbar', source: 'MH', desc: 'Brister fina blodkärl i offrets kropp; blod sprutar ur kroppsöppningarna, 1T6 skada per effektgrad och SR.' },
  { id: 'mh-forruttnelse', namn: 'Förruttnelse', skola: 'mentalism', disciplin: 'Dödens magi', niva: 16, flags: [], rackvidd: 'Beröring', varaktighet: 'Omedelbar', source: 'MH', desc: 'Offrets kött börjar ruttna och falla av; han förlorar FYS 1T8 om han överlever.' },
  { id: 'mh-fortvina', namn: 'Förtvina', skola: 'mentalism', disciplin: 'Dödens magi', niva: 17, flags: [], rackvidd: 'Beröring', varaktighet: 'S/4 timmar', source: 'MH', desc: 'Offrets STY, FYS och SMI sänks tillfälligt till 1 så att han knappt kan stå upp.' },
  { id: 'mh-dodslank', namn: 'Dödslänk', skola: 'mentalism', disciplin: 'Dödens magi', niva: 17, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Sx1 minuter', source: 'MH', desc: 'All skada som drabbar magikern överförs i stället till en förhäxad person.' },
  { id: 'mh-stjala-ungdom', namn: 'Stjäla ungdom', skola: 'mentalism', disciplin: 'Dödens magi', niva: 18, flags: ['R'], rackvidd: 'Beröring', varaktighet: 'Permanent', source: 'MH', desc: 'Ritual som överför ungdomskraft från ett offer till magikern; offret åldras i motsvarande grad.' },
  { id: 'mh-pest', namn: 'Pest', skola: 'mentalism', disciplin: 'Dödens magi', niva: 20, flags: ['F'], rackvidd: 'Personlig', varaktighet: 'Sx1 timmar', source: 'MH', desc: 'Magikern blir en vandrande pesthärd; alla i hans närhet smittas av en dödlig pest.' },
  { id: 'mh-forbannelse', namn: 'Förbannelse', skola: 'mentalism', disciplin: 'Dödens magi', niva: 24, flags: [], rackvidd: 'Spec', varaktighet: 'Spec', source: 'MH', desc: 'Lägger en förbannelse över en person eller dess ätt så att otur och olyckor drabbar dem tills ett villkor uppfylls.' },
  { id: 'mh-zombiehar', namn: 'Zombiehär', skola: 'mentalism', disciplin: 'Dödens magi', niva: 28, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Permanent', source: 'MH', desc: 'Väcker en hel armé döda kroppar till odöda tjänare som lyder magikerns befallningar.' },
  { id: 'mh-ododas-furste', namn: 'Odödas furste', skola: 'mentalism', disciplin: 'Dödens magi', niva: 30, flags: ['R'], rackvidd: 'Personlig', varaktighet: 'Permanent', source: 'MH', desc: 'Förvandlar magikern till en mäktig odöd härskare över de odöda så att han består efter döden.' },
  { id: 'mh-se-genom-sten', namn: 'Se genom sten', skola: 'elementarmagi', disciplin: 'Jordmagi', niva: 5, flags: [], rackvidd: 'Personlig', varaktighet: 'Konc', source: 'MH', desc: 'Magikern ser rakt igenom tio meter kompakt jord eller sten per effektgrad.' },
  { id: 'mh-forma-sten', namn: 'Forma sten', skola: 'elementarmagi', disciplin: 'Jordmagi', niva: 7, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Permanent', source: 'MH', desc: 'Formar och omformar fritt sten och jord, en kubikmeter per effektgrad.' },
  { id: 'mh-krossande-klippblock', namn: 'Krossande klippblock', skola: 'elementarmagi', disciplin: 'Jordmagi', niva: 12, flags: ['F'], rackvidd: 'Sx10 meter', varaktighet: 'Omedelbar', source: 'MH', desc: 'Slungar ett stenblock mot ett mål som tar skada.' },
  { id: 'mh-klippsvarm', namn: 'Klippsvärm', skola: 'elementarmagi', disciplin: 'Jordmagi', niva: 16, flags: ['F'], rackvidd: 'Sx10 meter', varaktighet: 'Omedelbar', source: 'MH', desc: 'En svärm flygande stenblock slår mot ett område och gör 1T10 skada per träffad person.' },
  { id: 'mh-kropp-av-sten', namn: 'Kropp av sten', skola: 'elementarmagi', disciplin: 'Jordmagi', niva: 19, flags: [], rackvidd: 'Beröring', varaktighet: 'S/4 timmar', source: 'MH', desc: 'Förvandlar den förtrollades kropp till sten — skyddande men stel och orörlig.' },
  { id: 'mh-jordbavning', namn: 'Jordbävning', skola: 'elementarmagi', disciplin: 'Jordmagi', niva: 20, flags: ['F'], rackvidd: '500 meter', varaktighet: 'Sx1 SR', source: 'MH', desc: 'Skapar ett jordskalv (E×25 m radie) som påverkar byggnader och varelser.' },
  { id: 'mh-stenjatte', namn: 'Stenjätte', skola: 'elementarmagi', disciplin: 'Jordmagi', niva: 21, flags: [], rackvidd: 'Sx10 meter', varaktighet: 'Sx1 minuter', source: 'MH', desc: 'Frambesvärjer en mäktig jätte av sten som lyder magikerns befallning.' },
  { id: 'mh-ren-luft', namn: 'Ren luft', skola: 'elementarmagi', disciplin: 'Luftmagi', niva: 3, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Omedelbar', source: 'MH', desc: 'Renar förorenad eller rökfylld luft inom ett område.' },
  { id: 'mh-stoppa-regn', namn: 'Stoppa regn', skola: 'elementarmagi', disciplin: 'Luftmagi', niva: 6, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'S/4 timmar', source: 'MH', desc: 'Allt regn upphör inom ett område (E×10 m radie).' },
  { id: 'mh-spa-vader', namn: 'Spå väder', skola: 'elementarmagi', disciplin: 'Luftmagi', niva: 7, flags: [], rackvidd: 'Sx1 kilometer', varaktighet: 'Omedelbar', source: 'MH', desc: 'Magikern förutsäger hur vädret kommer att bli på platsen.' },
  { id: 'mh-vindstot', namn: 'Vindstöt', skola: 'elementarmagi', disciplin: 'Luftmagi', niva: 8, flags: ['F'], rackvidd: 'Sx10 rutor', varaktighet: 'Omedelbar', source: 'MH', desc: 'Slungar ut en våldsam vindil som gör 1T6−1 skada.' },
  { id: 'mh-regn', namn: 'Regn', skola: 'elementarmagi', disciplin: 'Luftmagi', niva: 9, flags: [], rackvidd: 'S/4 kilometer', varaktighet: 'S/4 timmar', source: 'MH', desc: 'Skapar ett kraftigt hällregn inom ett område (E×10 m radie).' },
  { id: 'mh-lugna-storm', namn: 'Lugna storm', skola: 'elementarmagi', disciplin: 'Luftmagi', niva: 12, flags: [], rackvidd: 'S/4 kilometer', varaktighet: 'Omedelbar', source: 'MH', desc: 'Stillar en rasande storm inom räckvidden.' },
  { id: 'mh-giftmoln', namn: 'Giftmoln', skola: 'elementarmagi', disciplin: 'Luftmagi', niva: 14, flags: ['F'], rackvidd: 'Sx10 meter', varaktighet: 'Sx1 minuter', source: 'MH', desc: 'Skapar ett giftigt gasmoln som driver med vinden och förgiftar dem som andas in det.' },
  { id: 'mh-kvava', namn: 'Kväva', skola: 'elementarmagi', disciplin: 'Luftmagi', niva: 14, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Konc', source: 'MH', desc: 'Driver på magisk väg luften ur en persons lungor så att han inte kan andas.' },
  { id: 'mh-kropp-av-luft', namn: 'Kropp av luft', skola: 'elementarmagi', disciplin: 'Luftmagi', niva: 19, flags: [], rackvidd: 'Beröring', varaktighet: 'S/4 timmar', source: 'MH', desc: 'Förvandlar den förtrollades kropp till en osynlig varelse av luft med oerhörd rörlighet.' },
  { id: 'mh-stormfagel', namn: 'Stormfågel', skola: 'elementarmagi', disciplin: 'Luftmagi', niva: 21, flags: [], rackvidd: 'Sx1 minuter', varaktighet: 'Sx1 minuter', source: 'MH', desc: 'Frambesvärjer en väldig fågel formad av stormkraft som lyder magikern.' },
  { id: 'mh-forma-eld', namn: 'Forma eld', skola: 'elementarmagi', disciplin: 'Eldmagi', niva: 7, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Konc', source: 'MH', desc: 'Formar och kontrollerar eld inom området; skapar eller släcker lågor efter sin vilja.' },
  { id: 'mh-eldklot', namn: 'Eldklot', skola: 'elementarmagi', disciplin: 'Eldmagi', niva: 12, flags: ['F'], rackvidd: 'Sx10 meter', varaktighet: 'Omedelbar', source: 'MH', desc: 'Slungar ett brinnande eldklot mot ett mål; 1T6 skada per effektgrad.' },
  { id: 'mh-mur-av-eld', namn: 'Mur av eld', skola: 'elementarmagi', disciplin: 'Eldmagi', niva: 14, flags: ['F'], rackvidd: 'Sx10 meter', varaktighet: 'Omedelbar', source: 'MH', desc: 'Skapar en två meter hög eldmur (en meter per effektgrad) som gör 1T6 skada vid passage.' },
  { id: 'mh-inre-eld', namn: 'Inre eld', skola: 'elementarmagi', disciplin: 'Eldmagi', niva: 16, flags: [], rackvidd: 'Sx10 meter', varaktighet: 'Omedelbar', source: 'MH', desc: 'Tänder en magisk eld inuti offrets kropp så att han förtärs av hetta inifrån.' },
  { id: 'mh-kropp-av-eld', namn: 'Kropp av eld', skola: 'elementarmagi', disciplin: 'Eldmagi', niva: 19, flags: [], rackvidd: 'Beröring', varaktighet: 'S/4 timmar', source: 'MH', desc: 'Förvandlar den förtrollades kropp till en varelse av flammande eld.' },
  { id: 'mh-eldstorm', namn: 'Eldstorm', skola: 'elementarmagi', disciplin: 'Eldmagi', niva: 19, flags: ['F'], rackvidd: 'Sx10 rutor', varaktighet: 'Omedelbar', source: 'MH', desc: 'Ett ursinnigt eldinferno sveper över området och gör skada inom radien.' },
  { id: 'mh-elddrake', namn: 'Elddrake', skola: 'elementarmagi', disciplin: 'Eldmagi', niva: 21, flags: [], rackvidd: 'Sx1 minuter', varaktighet: 'Sx1 minuter', source: 'MH', desc: 'Frambesvärjer en drake av flammande eld som lyder magikern; 1T6 skada per effektgrad.' },
  { id: 'mh-rena-vattensamling', namn: 'Rena vattensamling', skola: 'elementarmagi', disciplin: 'Vattenmagi', niva: 3, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Permanent', source: 'MH', desc: 'Renar en liten förorenad vattensamling, som en brunn eller källa.' },
  { id: 'mh-se-genom-vatten', namn: 'Se genom vatten', skola: 'elementarmagi', disciplin: 'Vattenmagi', niva: 5, flags: [], rackvidd: 'Personlig', varaktighet: 'Konc', source: 'MH', desc: 'Magikern ser rakt igenom tio meter vatten per effektgrad.' },
  { id: 'mh-forma-vatten', namn: 'Forma vatten', skola: 'elementarmagi', disciplin: 'Vattenmagi', niva: 7, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Konc', source: 'MH', desc: 'Formar och kontrollerar vatten fritt inom området, en kubikmeter per effektgrad.' },
  { id: 'mh-skapa-vatten', namn: 'Skapa vatten', skola: 'elementarmagi', disciplin: 'Vattenmagi', niva: 9, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Permanent', source: 'MH', desc: 'Skapar en kubikmeter rent vatten (1000 liter) ur tomma luften per effektgrad.' },
  { id: 'mh-dranka', namn: 'Dränka', skola: 'elementarmagi', disciplin: 'Vattenmagi', niva: 14, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'S/4 minuter', source: 'MH', desc: 'Fyller den förtrollades lungor med vatten så att han drunknar.' },
  { id: 'mh-kropp-av-vatten', namn: 'Kropp av vatten', skola: 'elementarmagi', disciplin: 'Vattenmagi', niva: 19, flags: [], rackvidd: 'Beröring', varaktighet: 'S/4 timmar', source: 'MH', desc: 'Förvandlar den förtrollades kropp till en vattenelementar med stor rörlighet.' },
  { id: 'mh-leviathan', namn: 'Leviathan', skola: 'elementarmagi', disciplin: 'Vattenmagi', niva: 21, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Sx1 minuter', source: 'MH', desc: 'Frambesvärjer ur en vattensamling ett väldigt havsodjur som lyder magikern.' },
  { id: 'mh-sanka-skepp', namn: 'Sänka skepp', skola: 'elementarmagi', disciplin: 'Vattenmagi', niva: 24, flags: [], rackvidd: 'Sx10 meter', varaktighet: 'Sx1 minuter', source: 'MH', desc: 'Sänker ett skepp med upp till fem meters köl ned i vågorna.' },
  { id: 'mh-flodvag', namn: 'Flodvåg', skola: 'elementarmagi', disciplin: 'Vattenmagi', niva: 26, flags: ['F'], rackvidd: '500 meter', varaktighet: 'Sx1 minuter', source: 'MH', desc: 'Skapar en tio meter hög flodvåg ur tomma intet som sveper fram och förstör allt i sin väg.' },
  { id: 'mh-forma-is', namn: 'Forma is', skola: 'elementarmagi', disciplin: 'Köldmagi', niva: 7, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Permanent', source: 'MH', desc: 'Formar och kontrollerar is fritt inom området, en kubikmeter per effektgrad.' },
  { id: 'mh-isklot', namn: 'Isklot', skola: 'elementarmagi', disciplin: 'Köldmagi', niva: 10, flags: [], rackvidd: 'Sx10 meter', varaktighet: 'Omedelbar', source: 'MH', desc: 'Slungar ett isblock mot ett mål med våldsam kraft; 1T8 skada.' },
  { id: 'mh-ismissiler', namn: 'Ismissiler', skola: 'elementarmagi', disciplin: 'Köldmagi', niva: 14, flags: ['F'], rackvidd: 'Sx10 meter', varaktighet: 'Omedelbar', source: 'MH', desc: 'En svärm isspjut slungas mot målen; 1T8 skada per effektgrad.' },
  { id: 'mh-forfrysa', namn: 'Förfrysa', skola: 'elementarmagi', disciplin: 'Köldmagi', niva: 15, flags: [], rackvidd: 'Sx10 meter', varaktighet: 'Omedelbar', source: 'MH', desc: 'Sänker temperaturen i en levande kropp till strax under fryspunkten.' },
  { id: 'mh-kropp-av-is', namn: 'Kropp av is', skola: 'elementarmagi', disciplin: 'Köldmagi', niva: 18, flags: [], rackvidd: 'Beröring', varaktighet: 'S/4 timmar', source: 'MH', desc: 'Förvandlar den förtrollades kropp till en hård isvarelse — skyddande men stel.' },
  { id: 'mh-isstorm', namn: 'Isstorm', skola: 'elementarmagi', disciplin: 'Köldmagi', niva: 19, flags: ['F'], rackvidd: '500 meter', varaktighet: 'Sx1 minuter', source: 'MH', desc: 'En storm med orkanvindar slungar isfragment omkring sig; 1T4 skada per SR.' },
  { id: 'mh-isorm', namn: 'Isorm', skola: 'elementarmagi', disciplin: 'Köldmagi', niva: 21, flags: [], rackvidd: 'Sx10 rutor', varaktighet: 'Sx1 minuter', source: 'MH', desc: 'Frambesvärjer en ringlande orm av is med vassa köldhuggtänder som lyder magikern.' },
]

// ── Registerskolor: besvärjelser ur Magikerns Handboks besvärjelseregister (s. 91–93) ──
// Magikerns Handbok listar dessa fem specialskolor enbart i registret: namn,
// skolvärde och en sidhänvisning till källboken. Den fullständiga regeltexten
// (räckvidd, varaktighet, effekt) finns i respektive bok (Drakar, Kaos väktare,
// Nidland), inte i Magikerns Handbok. Tabellen nedan är [skolvärde, namn, flaggor,
// källsida]; 'M' = minimagi (behandlas som skolvärde 1). Namnen är OCR-tolkade ur
// registret och kan innehålla fel — särskilt Demonologi och Mörkermagi.
const REGISTER_BOOKS = {
  'falsk-drakmagi': { source: 'D', bok: 'Drakar' },
  'sann-drakmagi': { source: 'D', bok: 'Drakar' },
  'demonologi': { source: 'KV', bok: 'Kaos väktare' },
  'portalmagi': { source: 'KV', bok: 'Kaos väktare' },
  'morkermagi': { source: 'Nid', bok: 'Nidland' },
}
const REGISTER_SPELLS = {
  'falsk-drakmagi': [
    ['M', 'Drakröst', [], 76], ['M', 'Draktunga', [], 76], ['M', 'Genomskåda', [], 76],
    ['M', 'Skrämsel', [], 76], ['M', 'Varsel', [], 76], ['M', 'Blottlägga psyke', [], 76],
    [1, 'Begränsad empati', [], 76], [1, 'Orientering', [], 76], [2, 'Draksyn', [], 76],
    [2, 'Elementarmotståndskraft', [], 76], [3, 'Fysisk motståndskraft', [], 76],
    [3, 'Väckning', [], 77], [4, 'Känsloläsning', [], 77], [5, 'Avläsa PSY-mängd', [], 77],
    [6, 'Paralysering', [], 77], [7, 'Flyga', [], 77], [8, 'Syn', [], 77],
    [9, 'Telepatisk påverkan', [], 77], [10, 'Draksinne', [], 77], [10, 'Drakskydd', [], 77],
    [11, 'Kontrollera person', [], 77], [11, 'Kommando', [], 77], [11, 'Mental aura', [], 78],
    [12, 'Telepatisk sondering', [], 78], [13, 'Namnlös fasa', [], 78], [14, 'Vattenstråle', [], 78],
    [14, 'Köldkon', [], 78], [15, 'Ljusknippe', [], 78], [16, 'Eldkvast', [], 78],
    [17, 'Mörkerkon', [], 79], [18, 'Sondera föremål', [], 79], [19, 'Telepatisk illusion', [], 79],
    [21, 'Tala med död', [], 79], [22, 'Kontrollera drake', [], 79], [23, 'Total kontroll', [], 79],
    [24, 'Återuppliva', [], 79], [25, 'Tillkalla drake', [], 79], [30, 'Kontrollera högre drake', [], 79],
    [34, 'Fängsla draksjäl', [], 79],
  ],
  'sann-drakmagi': [
    ['M', 'Ordning', [], 80], [3, 'Empati', [], 80], [5, 'Tveksamhet', [], 80],
    [5, 'Stumhet', [], 80], [6, 'Dövhet', [], 80], [7, 'Blindhet', [], 80],
    [10, 'Upphäva drakmagi', [], 80], [12, 'Hela drake', [], 80], [15, 'Själsfrände', [], 80],
    [18, 'Drakcharm', [], 80], [18, 'Total sensorisk avskärmning', [], 81], [19, 'Drakvänskap', [], 81],
    [23, 'Ödesläsning', [], 81], [24, 'Elddom', [], 81], [25, 'Telepatisk dödförklaring', [], 81],
    [30, 'Massivt mörker', [], 82],
  ],
  'demonologi': [
    ['M', 'Svordom', [], 44], ['M', 'Demonsyn', [], 44], ['M', 'Ordning', [], 44],
    [1, 'Finna demonväsen', [], 44], [2, 'Tala med demon', [], 44], [3, 'Tillkalla demon', [], 44],
    [3, 'Fångsla demon', ['R'], 44], [10, 'Befria demon', [], 45], [10, 'Nedkalla demon', ['R'], 45],
    [12, 'Kontrollera demon', [], 46], [12, 'Binda demon', ['R'], 46], [14, 'Kontakta väktare', [], 47],
    [15, 'Forma demon', ['R'], 47], [16, 'Driva bort demon', ['R'], 47], [18, 'Skapa demongissel', ['R'], 48],
  ],
  'portalmagi': [
    [9, 'Läsa portal', [], 49], [10, 'Dölja portal', [], 49], [11, 'Mental barriär', [], 49],
    [13, 'Skapa kommunikationsportal', ['R'], 49], [14, 'Hemkalla resenär', ['R'], 50],
    [14, 'Förgöra portal', [], 50], [16, 'Skapa portal', ['R'], 51],
  ],
  'morkermagi': [
    [1, 'Vicotniks onda öga', [], 38], [3, 'Vicotniks mörka sanning', [], 38], [5, 'Vicotniks fasa', [], 38],
    [6, 'Vicotniks mörkerblixt', [], 39], [8, 'Vicotniks förbannelse', [], 39],
    [10, 'Vicotniks oorganiska förgörelse', [], 39], [11, 'Vicotniks märke', [], 40], [12, 'Vicotniks aura', [], 40],
    [12, 'Vicotniks organiska förgörelse', [], 40], [14, 'Vicotniks mörka terror', [], 40],
    [15, 'Vicotniks saknadsförgörelse', [], 40], [16, 'Vicotniks osynlighet', [], 41],
    [18, 'Vicotniks sinnesförgörelse', [], 41], [18, 'Vicotniks själaförgörelse', [], 41],
    [19, 'Vicotniks själavändning', [], 41], [25, 'Vicotniks verklighetsförvandling', [], 41],
  ],
}
for (const [skola, list] of Object.entries(REGISTER_SPELLS)) {
  const { source, bok } = REGISTER_BOOKS[skola]
  list.forEach(([niva, namn, flags, sida], i) => {
    const minimagi = niva === 'M'
    SPELLS.push({
      id: `reg-${skola}-${i + 1}`, namn, skola, niva: minimagi ? 1 : niva, flags,
      rackvidd: '—', varaktighet: '—', source, register: true, minimagi,
      desc: `${minimagi ? 'Minimagi. ' : ''}Beskrivs i ${bok} (s. ${sida}). Indexerad i Magikerns Handboks register (s. 91–93); namnet är OCR-tolkat ur registret.`,
    })
  })
}

// Underskolor (disciplin) per huvudskola — för gruppering i UI och rollformulär.
export const MAGIC_DISCIPLINES = [
  { namn: 'Djurhamn', skola: 'animism' },
  { namn: 'Växtrikets magi', skola: 'animism' },
  { namn: 'Kroppskontroll', skola: 'mentalism' },
  { namn: 'Illusionism', skola: 'mentalism' },
  { namn: 'Dödens magi', skola: 'mentalism' },
  { namn: 'Jordmagi', skola: 'elementarmagi' },
  { namn: 'Luftmagi', skola: 'elementarmagi' },
  { namn: 'Eldmagi', skola: 'elementarmagi' },
  { namn: 'Vattenmagi', skola: 'elementarmagi' },
  { namn: 'Köldmagi', skola: 'elementarmagi' },
]

export const spellById = (id) => SPELLS.find((s) => s.id === id) || null
export const schoolById = (id) => MAGIC_SCHOOLS.find((s) => s.id === id) || null

// ── BASCHANS (BC) ────────────────────────────────────────────────────────
// Gratis FV man får på primära färdigheter och yrkesfärdigheter, från
// grundegenskapsvärdet som färdigheten baseras på.
export function bcFromAttr(value) {
  if (value <= 3) return 0
  if (value <= 8) return 1
  if (value <= 12) return 2
  if (value <= 16) return 3
  if (value <= 20) return 4
  return 5
}

// ── KROPPSPOÄNG (KP) per träffområde ──────────────────────────────────────
// Index efter totala KP. Bortom 40 ger varje +5 totala KP +1 på varje område.
export const KP_LOCATIONS = ['Huvud', 'Bröstkorg', 'Mage', 'Höger arm', 'Vänster arm', 'Höger ben', 'Vänster ben']
const KP_TABLE = {
  Huvud: [3, 4, 5, 6, 7, 8, 9, 10],
  Bröstkorg: [4, 5, 6, 7, 8, 9, 10, 11],
  Mage: [3, 4, 5, 6, 7, 8, 9, 10],
  'Höger arm': [2, 3, 4, 5, 6, 7, 8, 9],
  'Vänster arm': [2, 3, 4, 5, 6, 7, 8, 9],
  'Höger ben': [3, 4, 5, 6, 7, 8, 9, 10],
  'Vänster ben': [3, 4, 5, 6, 7, 8, 9, 10],
}
const KP_THRESHOLDS = [7, 11, 15, 20, 25, 30, 35, 40]
export function bodyLocationKP(totalKP) {
  let idx = KP_THRESHOLDS.findIndex((t) => totalKP <= t)
  let extra = 0
  if (idx === -1) {
    idx = 7
    extra = Math.ceil((totalKP - 40) / 5)
  }
  const out = {}
  for (const loc of KP_LOCATIONS) out[loc] = KP_TABLE[loc][idx] + extra
  return out
}

// ── SKADEBONUS (STY + STO) ─────────────────────────────────────────────────
const SKADEBONUS_TABLE = [
  [26, 'ingen'], [29, '+1'], [32, '+1T2'], [40, '+1T4'], [50, '+1T6'],
  [60, '+1T10'], [80, '+2T6'], [100, '+3T6'], [140, '+4T6'], [180, '+5T6'],
]
export function skadebonus(styPlusSto) {
  for (const [max, sb] of SKADEBONUS_TABLE) if (styPlusSto <= max) return sb
  return '+5T6'
}

// ── FÖRFLYTTNING (STO + FYS + SMI) ─────────────────────────────────────────
const FORFLYTTNING_TABLE = [
  [11, 7], [20, 8], [29, 9], [38, 10], [47, 11], [56, 12], [65, 13], [74, 14], [83, 15], [92, 16],
]
export function forflyttning(sum) {
  for (const [max, f] of FORFLYTTNING_TABLE) if (sum <= max) return f
  return 16 + Math.ceil((sum - 92) / 8)
}

// ── SYN & HÖRSEL (Krigarens Handbok) — slå 1T6 + BP ─────────────────────────
// Syn-bonusen läggs på FV i Upptäcka fara OCH Finna dolda ting; hörsel-bonusen
// läggs på FV i Upptäcka fara. Bonusarna är kumulativa.
const SYN_HORSEL_TABLE = [
  [1, 'Dålig', -2], [2, 'Nedsatt', -1], [4, 'Normal', 0],
  [6, 'God', 1], [9, 'Mycket god', 2], [Infinity, 'Utmärkt', 3],
]
export function synHorsel(total) {
  for (const [max, namn, bonus] of SYN_HORSEL_TABLE) if (total <= max) return { namn, bonus }
  return { namn: 'Utmärkt', bonus: 3 }
}

// ── SOCIALT STÅND (2T6 + BP + rasmod) ──────────────────────────────────────
export const SOCIAL_STAND_TABLE = [
  [2, 'Egendomslös', 'träl, slav, straffånge, tiggarmunk, livegen'],
  [4, 'Lägre underklass', 'tiggare, latrintömmare, gravgrävare'],
  [7, 'Högre underklass', 'lärling, gesäll, novis'],
  [11, 'Lägre medelklass', 'grovhantverkare, arbetande köpman, stadsvakt'],
  [16, 'Högre medelklass', 'finhantverkare, köpman, präst, självägande bonde'],
  [22, 'Lägre överklass', 'rådman, hovfolk, hantverksmästare'],
  [29, 'Högre överklass', 'borgmästare, skråmästare, riksämbetsman'],
  [37, 'Lågadel', 'riddare, friherre, baron, markis, jarl, biskop'],
  [Infinity, 'Högadel', 'greve, hertig, prins, kardinal, påve, kung, kejsare'],
]
export function socialStand(total) {
  for (const row of SOCIAL_STAND_TABLE) if (total <= row[0]) return { namn: row[1], exempel: row[2] }
  return { namn: 'Högadel', exempel: '' }
}

// ── STARTKAPITAL (2T6 + BP + halva socialt-stånd-BP) i silvermynt (sm) ──────
const STARTKAPITAL_TABLE = [
  [2, 200], [4, 400], [7, 600], [11, 1000], [16, 2000], [22, 3000],
  [29, 5000], [37, 10000], [46, 20000], [56, 30000], [Infinity, 50000],
]
export function startkapital(total) {
  for (const [max, sm] of STARTKAPITAL_TABLE) if (total <= max) return sm
  return 50000
}

// ── ÅLDER ──────────────────────────────────────────────────────────────────
// mod: åldersmodifikation på grundegenskaper. ep: erfarenhetspoäng.
// kapMult: multiplikator på startkapital. maxFV: högsta FV man får köpa vid start.
export const AGE_CATEGORIES = [
  { id: 'ung', namn: 'Ung', mod: { STY: -1, FYS: 1, SMI: 1, INT: 0, PSY: -1, KAR: 0 }, ep: 150, kapMult: 1, maxFV: 13 },
  { id: 'mogen', namn: 'Mogen', mod: { STY: 0, FYS: 0, SMI: 0, INT: 0, PSY: 0, KAR: 0 }, ep: 200, kapMult: 1.5, maxFV: 15 },
  { id: 'medelalders', namn: 'Medelålders', mod: { STY: -2, FYS: -1, SMI: -1, INT: 1, PSY: 2, KAR: 1 }, ep: 250, kapMult: 2, maxFV: 17 },
  { id: 'gammal', namn: 'Gammal', mod: { STY: -5, FYS: -3, SMI: -3, INT: 1, PSY: 4, KAR: 1 }, ep: 300, kapMult: 2.5, maxFV: 19 },
]
// Åldersintervall (år) per ras och ålderskategori.
export const AGE_BY_RACE = {
  anka: { ung: '16–20', mogen: '21–40', medelalders: '41–60', gammal: '61–80' },
  alv: { ung: '50–100', mogen: '101–300', medelalders: '301–600', gammal: '601+' },
  dvarg: { ung: '21–40', mogen: '41–150', medelalders: '151–250', gammal: '251–400' },
  halvalv: { ung: '30–40', mogen: '41–70', medelalders: '71–100', gammal: '101–130' },
  halvlangdsman: { ung: '20–30', mogen: '31–60', medelalders: '61–75', gammal: '76–100' },
  halvorch: { ung: '12–18', mogen: '19–30', medelalders: '31–45', gammal: '46–55' },
  manniska: { ung: '16–20', mogen: '21–45', medelalders: '46–60', gammal: '61–80' },
}

// EP-kostnaden för att höja FV ges av kostnadstabellen EP_FV_COST längre ned
// (FV du har → FV du vill köpa). Sekundära färdigheter kan normalt inte höjas
// vid start (bara primära och yrkesfärdigheter).

// ── SÄRSKILDA FÖRMÅGOR (slå 2T20 + spenderade BP) ───────────────────────────
export const SARSKILDA_FORMAGOR = [
  [3, 4, '+1 på FV på valfri sekundär färdighet (utom förbjudna).'],
  [5, 6, 'Sjöfararbakgrund: +2 på FV i Sjökunnighet och Navigera.'],
  [7, 8, 'Starka vrister: +3 på FV på Hoppa.'],
  [9, 10, 'Bråkig uppväxt: +3 på FV i Slagsmål.'],
  [11, 12, 'Hantverkarbakgrund: +3 på FV i valfri hantverksfärdighet.'],
  [13, 14, 'Smidig kropp: +3 på FV i Akrobatik.'],
  [15, 16, 'Köpmannabakgrund: +3 på FV i Värdera.'],
  [17, 18, 'God koordinationsförmåga: +3 på FV i Två vapen.'],
  [19, 20, 'Hobbyist: FV 3 i en valfri sekundär färdighet (kan läras från start).'],
  [21, 22, 'Starka nypor: alltid +3 på CL i Klättra.'],
  [23, 24, 'Mottagligt medium: +5 på CL i Magisk kanalisering (passiv part).'],
  [25, 26, 'Hängiven student: +2 på valfritt FV (höjer även ev. begränsning).'],
  [27, 28, 'Övertygande tonfall: alltid +3 på CL i Övertala och Muta.'],
  [29, 30, 'Sjätte sinne: +1 på FV i Upptäcka fara och Finna dolda ting.'],
  [31, 32, 'Stirrande blick: alltid +5 på CL i Hypnotisera.'],
  [33, 34, 'Magikänsla: alltid +5 på CL i Känna magi.'],
  [35, 36, 'Gott språksinne: FV 20 (B5) i att Tala och Läsa/Skriva ett valfritt språk.'],
  [37, 38, 'Stort kunskapsområde: två extra valfria sekundära färdigheter som yrkesfärdigheter.'],
  [39, 40, 'God bågskytt: alla räckvidder för projektilvapen ökas med 25%.'],
  [41, 42, 'Absolut gehör: grundkostnaden för Spela instrument och Sjunga är alltid 1.'],
  [43, 44, 'Precisionssinne: CL +1 på alla vapenfärdigheter.'],
  [45, 46, 'Dubbelhänt (se Svärdshand).'],
  [47, 48, 'God tidskänsla: vet alltid hur mycket klockan är på 10 minuter när.'],
  [49, 51, 'Absolut ögonmått: bedömer avstånd med 5% felmarginal.'],
  [52, 54, 'Mycket uppmärksam: +2 på CL i Finna dolda ting och Upptäcka fara.'],
  [55, 55, 'Blixtrande reflexer: +3 på alla initiativslag.'],
  [56, 56, 'Bärsärk: +5 på FV i Bärsärkagång.'],
  [57, 57, 'Gott balanssinne: +5 på SMI vid balansakter och fall.'],
  [58, 58, 'Hästarnas herre: +10 på FV i Rida; kan aldrig bli avkastad.'],
  [59, 59, 'Ambidextriös (se Svärdshand).'],
  [60, 60, 'Djurvän: blir aldrig anfallen av vanliga djur.'],
  [61, 61, 'Turgubbe: modifiera en CL med +1 genom att spendera 1 PSY-poäng.'],
  [62, 62, 'Magisk empati: kan identifiera besvärjelser lagda på magiska föremål.'],
  [63, 63, 'Gudarnas gunstling: 25% chans att guden återställer alla KP vid 0.'],
  [64, 64, 'Lättlärd: grundkostnaden för sekundära färdigheter minskas till 4.'],
  [65, 65, 'Extremt smärttålig: totala KP × 1,5.'],
  [66, 66, 'Snabbslående: slår alltid först i varje SR.'],
  [67, 67, 'Baneman: +5 på CL vid attacker mot en svuren ras/folkslag.'],
  [68, 68, 'God kroppskontroll: höj STY +5 i 3 SR via FYS-slag (max 2 ggr/dag).'],
  [69, 69, 'Järnnäve: alltid maximal skada i obeväpnad strid.'],
  [70, 70, 'Extremt orädd: −5 på alla slag på Skräcktabellen.'],
  [71, 71, 'Orubblig vilja: +5 på PSY på PSY-mot-PSY och Motståndstabellen.'],
  [72, 72, 'Härdig mot element: +5 på FYS mot eld, köld, vatten, vind.'],
  [73, 73, 'Gott läkekött: KP-förluster läker dubbelt så fort.'],
  [74, 74, 'God mental kontroll: återfår PSY på halva tiden.'],
  [75, 75, 'Naturlig färdighet med vapen: FV +5 på en valfri vapenfärdighet.'],
  [76, 76, 'Kluven personlighet: välj även en annan yrkesförmåga.'],
  [77, 77, 'God känsla för yrket: halverad kostnad för en besvärjelse/yrkesfärdighet.'],
  [78, 78, 'Hamnbytare: kan förvandlas till ett djur (slå 1T6).'],
  [79, 79, 'Snabb uppfattningsförmåga: +5 på CL vid vapenpareringar; parerar projektiler.'],
  [80, 80, 'God PSY-potential: −5 på slaget för att höja PSY.'],
  [81, Infinity, 'Höjd grundegenskap: +1 på tre olika grundegenskaper, eller +2 på en.'],
]
export function lookupFormaga(total) {
  for (const [min, max, namn] of SARSKILDA_FORMAGOR) if (total >= min && total <= max) return namn
  return SARSKILDA_FORMAGOR[0][2]
}

// Magikerns särskilda förmågor (Magikerns Handbok) — egen 2T20+BP-tabell med
// magikerinriktade utfall. Används av magikeryrken i stället för tabellen ovan.
export const SARSKILDA_FORMAGOR_MAGIKER = [
  [3, 4, '+1 på FV på valfri sekundär färdighet (utom förbjudna).'],
  [5, 6, 'Sjöfararbakgrund: +2 på FV i Sjökunnighet och Navigera.'],
  [7, 8, 'Kock: +3 på FV i Matlagning.'],
  [9, 10, 'Född bokmal: +3 på FV i Läsa/Skriva.'],
  [11, 12, 'Hantverkarbakgrund: +3 på FV i valfri hantverksfärdighet.'],
  [13, 14, 'Smidig kropp: +3 på FV i Akrobatik.'],
  [15, 16, 'Köpmannabakgrund: +3 på FV i Värdera.'],
  [17, 18, 'Kunnig: +3 på FV i en valfri kunskapsfärdighet.'],
  [19, 20, 'Förmänniska: FV 3 i en valfri sekundär färdighet (kan läras från start).'],
  [21, 22, 'Starka nypor: alltid +3 på CL i Klättra.'],
  [23, 24, 'Mottagligt medium: +5 på CL i Magisk kanalisering (passiva parten).'],
  [25, 26, 'Hängiven student: +2 på valfritt FV (höjer även ev. begränsning).'],
  [27, 28, 'Magikerbakgrund: +3 på FV i valfri magikerfärdighet (ej besvärjelser/magiskola).'],
  [29, 30, 'Sjätte sinne: +1 på FV i Upptäcka fara och Finna dolda ting.'],
  [31, 32, 'Född hypnotisör: +5 på CL i Hypnotisera.'],
  [33, 34, 'Magikänsla: +5 på CL i Känna magi.'],
  [35, 36, 'Gott språksinne: FV 20 (B5) i att Tala och Läsa/Skriva ett valfritt språk.'],
  [37, 38, 'Stort kunskapsområde: två extra valfria sekundära färdigheter som yrkesfärdigheter.'],
  [39, 40, 'Lätt att lära magi: +1 på FV i tre valfria besvärjelser.'],
  [41, 42, 'Absolut gehör: grundkostnaden för Spela instrument och Sjunga är alltid 1.'],
  [43, 44, 'Precisionssinne: +1 på CL på alla vapenfärdigheter.'],
  [45, 46, 'Alvvän: +5 på FV i Alviska samt Tala och Läsa/Skriva alviska.'],
  [47, 48, 'God tidskänsla: vet alltid ungefär hur mycket klockan är (10 min när).'],
  [49, 51, 'Absolut ögonmått: bedömer avstånd med 5% felmarginal.'],
  [52, 54, 'Mycket uppmärksam: +2 på CL i Finna dolda ting och Upptäcka fara.'],
  [55, 55, 'Blixtrande reflexer: +3 på alla initiativslag.'],
  [56, 56, 'Demonsläkt: demonblod i ätten; lär demonspråk till FV 12.'],
  [57, 57, 'Gott balanssinne: +5 på SMI vid balansakter och fall.'],
  [58, 58, 'Hästarnas herre: +10 på FV i Rida; kan aldrig bli avkastad.'],
  [59, 59, 'Lätt för improviserad magi: +5 i Improviserad magi.'],
  [60, 60, 'Djurvän: blir aldrig anfallen av vanliga djur.'],
  [61, 61, 'Tur: modifiera en CL med +1 per spenderad PSY-poäng (max +3).'],
  [62, 62, 'Magisk empati: kan identifiera besvärjelser i magiska föremål du övervinner med PSY.'],
  [63, 63, 'Gudarnas gunstling: 25% chans att guden återställer alla KP vid 0.'],
  [64, 64, 'Lättlärd: grundkostnaden för sekundära färdigheter minskas till 4.'],
  [65, 65, 'Eldsjäl: skyddas mot normal eld i 2T6 SR.'],
  [66, 67, 'Tusen och en natt: äger en flygande matta (se Magiska föremål).'],
  [68, 68, 'Hög PSY: +1 på ditt PSY-värde.'],
  [69, 69, 'Hög INT: +1 på ditt INT-värde.'],
  [70, 70, 'Extremt orädd: −5 på alla slag på Skräcktabellen.'],
  [71, 71, 'Orubblig vilja: +5 på PSY på PSY-mot-PSY och Motståndstabellen.'],
  [72, 72, 'Gott läkekött: KP-förluster läker dubbelt så fort.'],
  [73, 73, 'Härdig mot element: +5 på FYS mot eld, köld, vatten, vind.'],
  [74, 74, 'God mental kontroll: återfår PSY och besvärjelser dubbelt så fort.'],
  [75, 75, 'Magikram: +3 på FV i valfri magiskola.'],
  [76, 76, 'Kluven personlighet: välj även en yrkesförmåga från ett annat yrke.'],
  [77, 77, 'God känsla för yrket: halverad kostnad för en besvärjelse/yrkesfärdighet.'],
  [78, 78, 'Hamnskiftare: kan förvandlas till ett djur (slå 1T6).'],
  [79, 79, 'Född till magiker: +5 på FV i valfri magiskola och +3 FV (se DoD Magi).'],
  [80, 80, 'God PSY-potential: −5 på slaget för att höja PSY.'],
  [81, Infinity, 'Vild magi: du behärskar vild magi gratis (se Vild magi).'],
]
export function lookupFormagaMagiker(total) {
  for (const [min, max, namn] of SARSKILDA_FORMAGOR_MAGIKER) if (total >= min && total <= max) return namn
  return SARSKILDA_FORMAGOR_MAGIKER[0][2]
}

// Alvernas särskilda förmågor (Alver s. 23–24). Boken listar bara de resultat
// som AVVIKER från grundtabellen, plus släktspecifika resultat. lookupFormagaAlv
// kollar släktets egna resultat först, sedan de alvgemensamma, och faller annars
// tillbaka på grundtabellen (lookupFormaga).
const SARSKILDA_FORMAGOR_ALV = [
  [7, 8, 'Vän stämma: alltid +3 på FV i Sjunga.'],
  [27, 28, 'Fager: alltid +3 på Förföra; människor känner sig instinktivt trygga i din närhet.'],
  [29, 30, 'Stigfinnare: mästerlig spårare — alltid +4 i CL på Spåra.'],
  [31, 32, 'Absolut gehör: +3 på FV i ett valfritt instrument eller Sjunga.'],
  [39, 40, 'Mästerskytt: alla projektilvapnens räckvidder ökar 25 %; alltid +3 i CL på båge.'],
  [63, 63, 'Kattfotad: landar alltid på fötter vid fall och tar halv fallskada.'],
  [67, 67, 'Baneman: som grundreglerna men bonusen är +10 (gäller svartfolk, eller dvärgar om du är grottalv).'],
  [72, 72, 'Härdig mot element: som grundreglerna men +15 istället (är du injir: +20).'],
]
const SARSKILDA_FORMAGOR_ALV_SLAKT = {
  grottalv: [
    [56, 56, 'Metallkänsla: identifierar automatiskt metaller genom att titta, lukta och känna på dem.'],
    [64, 64, 'Mörkerseende: ser även i totalt mörker, som vore det dager.'],
  ],
  graalv: [
    [56, 56, 'Utmärkt simmare: behärskar Simma utomordentligt och kan simma mycket långa sträckor.'],
    [75, 75, 'Delfinkommunikation: kan telepatiskt tala med delfiner, som villkorslöst hjälper dig i nöd.'],
  ],
  injir: [
    [21, 22, 'Skicklig ryttare: alltid +4 i CL på Rida och Slåss till häst.'],
    [70, 70, 'Stålsättning: ignorera smärtan och sänk SB-skadan med 2 (annars KP-skadan med 1) när du träffas av ett slag.'],
  ],
  morkeralv: [
    [64, 64, 'Blodtörst: +3 i CL i strid efter att du gjort den första KP:n i skada på din motståndare.'],
  ],
  skogsalv: [
    [9, 10, 'Utmärkt balanssinne: +5 i CL på alla SMI-slag som rör balans.'],
    [15, 16, 'Växtkännare: känner automatiskt igen växter med lägre vanlighet än 6.'],
    [56, 56, 'Pilmakare: pilar du snidat ger +1 i CL på båge.'],
    [75, 75, 'Andarnas vän: når lätt naturandarna — vid bruk av en visa anländer alltid minst en vänlig ande.'],
  ],
}
export function lookupFormagaAlv(total, raceId) {
  for (const [min, max, namn] of (SARSKILDA_FORMAGOR_ALV_SLAKT[raceId] || [])) if (total >= min && total <= max) return namn
  for (const [min, max, namn] of SARSKILDA_FORMAGOR_ALV) if (total >= min && total <= max) return namn
  return lookupFormaga(total)
}

// Alviska namn (Alver s. 34): slå 1T20 för förstavelse + 1T20 för ändelse.
export const ALV_NAME_PREFIX = ['Lo', 'Tan', 'Rali', 'Arna', 'Elo', 'Lana', 'Cer', 'Leth', 'Car', 'Eli', 'Ler', 'Tav', 'Mal', 'Sin', 'Gal', 'Tista', 'Vari', 'Oli', 'Far', 'Dor']
export const ALV_NAME_SUFFIX = ['rion', 'stari', 'ilion', 'riel', 'dion', 'ili', 'athlon', 'iol', 'alion', 'estion', 'arin', 'olori', 'iriol', 'asti', 'nion', 'lion', 'riol', 'nael', 'orion', 'anior']
const VOWELS = 'aeiouyåäöáàâéíóúý'
const ACCENT = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú', y: 'ý', å: 'å', ä: 'ä', ö: 'ö' }
function accentLastVowel(word) {
  for (let i = word.length - 1; i >= 0; i--) {
    const c = word[i].toLowerCase()
    if (VOWELS.includes(c)) return word.slice(0, i) + (ACCENT[c] || c) + word.slice(i + 1)
  }
  return word
}
// Sätter samman förstavelse + ändelse (Alver s. 34). Krockar två vokaler tas den
// sista bort och en accent sätts på den första (Arna+alion → Arnálion). Krockar
// samma konsonant dubblerat tas den ena bort och en accent sätts på föregående
// vokal (Cer+rion → Cérion). Annars sammanfogas delarna rakt av.
export function combineAlvName(prefix, suffix) {
  const a = prefix[prefix.length - 1].toLowerCase()
  const b = suffix[0].toLowerCase()
  const aVowel = VOWELS.includes(a)
  const bVowel = VOWELS.includes(b)
  if (aVowel && bVowel) return prefix.slice(0, -1) + (ACCENT[a] || a) + suffix.slice(1)
  if (!aVowel && !bVowel && a === b) return accentLastVowel(prefix) + suffix.slice(1)
  return prefix + suffix
}
export function randomAlvName(rng = Math.random) {
  const p = ALV_NAME_PREFIX[Math.floor(rng() * ALV_NAME_PREFIX.length)]
  const s = ALV_NAME_SUFFIX[Math.floor(rng() * ALV_NAME_SUFFIX.length)]
  return combineAlvName(p, s)
}

// Vild magi & familjar (Magikerns Handbok) — kostnader i bakgrundspoäng.
export const VILD_MAGI_BAS_BP = 15   // första vilda förmågan
export const VILD_MAGI_EXTRA_BP = 10 // per ytterligare förmåga
export function vildMagiCost(antal) { return antal > 0 ? VILD_MAGI_BAS_BP + (antal - 1) * VILD_MAGI_EXTRA_BP : 0 }
export const FAMILJAR_BP = 7

// ── SVÄRDSHAND (slå 2T6 + spenderade BP) ────────────────────────────────────
export function svardshand(total) {
  if (total <= 11) return 'Höger'
  if (total <= 14) return 'Vänster'
  if (total <= 18) return 'Dubbelhänt'
  return 'Ambidextriös'
}

export function rollDice(n, sides) {
  let sum = 0
  for (let i = 0; i < n; i++) sum += 1 + Math.floor(Math.random() * sides)
  return sum
}

// ── UTRUSTNING ──────────────────────────────────────────────────────────────
// Vapen och rustningar är hämtade ur Krigarens Handbok (det detaljerade
// stridssystemet). KP = kroppspoängsskada, SP = smärtpoängsskada, BV = brytvärde,
// abs = absorption. STO/STY-krav (sty) och längd anges i boken men visas ej här.
// Allmän utrustning saknas i böckerna och är generella riktpriser. Priser i sm.
export const EQUIPMENT_NOTE =
  'Grupper märkta (KH) kommer ur Krigarens Handbok (KP/SP-skada, abs KP/SP). ' +
  'Grupper märkta (V4) kommer ur Spelarboken (RiotMinds) och använder ett enkelt ' +
  'Skada- och Absorberingsvärde. Allmän utrustning kommer ur Spelarboken. Priser i sm.'

// Vapen: kp/sp = skada, sty = STY-krav, vikt (kg), bv = brytvärde, pris (sm).
// Avståndsvapen har dessutom rackv (räckvidd), laddn (laddningstid) och pv.
export const WEAPON_GROUPS = [
  {
    id: 'dolkar', namn: 'Dolkar', type: 'weapon', items: [
      { id: 'dolk', namn: 'Dolk', kp: '1T4+1', sp: '1T3', sty: 1, vikt: 0.5, bv: 9, pris: 70 },
      { id: 'testikeldolk', namn: 'Testikeldolk', kp: '1T6', sp: '1T3', sty: 1, vikt: 0.5, bv: 15, pris: 75 },
      { id: 'parerdolk', namn: 'Parerdolk', kp: '1T4+1', sp: '1T3', sty: 1, vikt: 0.5, bv: 15, pris: 80 },
      { id: 'stilett', namn: 'Stilett', kp: '1T3', sp: '1T3', sty: 1, vikt: 0.25, bv: 5, pris: 50 },
    ],
  },
  {
    id: 'enhandssvard', namn: 'Enhandssvärd', type: 'weapon', items: [
      { id: 'bastardsvard', namn: 'Bastardsvärd', kp: '1T10+1', sp: '1T8', sty: 17, vikt: 5.5, bv: 15, pris: 2500 },
      { id: 'bredsvard', namn: 'Bredsvärd', kp: '1T8+1', sp: '1T6', sty: 13, vikt: 4.5, bv: 15, pris: 1000 },
      { id: 'falchion', namn: 'Falchion', kp: '1T8', sp: '1T6', sty: 11, vikt: 4, bv: 15, pris: 500 },
      { id: 'kortsvard', namn: 'Kortsvärd', kp: '1T6+1', sp: '1T4', sty: 7, vikt: 2, bv: 15, pris: 400 },
      { id: 'kroksabel', namn: 'Kroksabel', kp: '1T8+2', sp: '1T6+1', sty: 9, vikt: 3, bv: 15, pris: 650 },
      { id: 'langsvard', namn: 'Långsvärd', kp: '1T10', sp: '1T6', sty: 11, vikt: 4, bv: 15, pris: 1250 },
      { id: 'sabel', namn: 'Sabel', kp: '1T8', sp: '1T4', sty: 9, vikt: 3, bv: 15, pris: 600 },
      { id: 'stickvarja', namn: 'Stickvärja', kp: '1T6+1', sp: '1T3', sty: 7, vikt: 2, bv: 8, pris: 900 },
      { id: 'traningssvard', namn: 'Träningssvärd', kp: '—', sp: '1T6', sty: 7, vikt: 2, bv: 7, pris: 50 },
      { id: 'varja', namn: 'Värja', kp: '1T8+1', sp: '1T6', sty: 9, vikt: 3, bv: 12, pris: 700 },
    ],
  },
  {
    id: 'krossvapen', namn: 'Enhands krossvapen', type: 'weapon', items: [
      { id: 'hjalmkrossare', namn: 'Hjälmkrossare', kp: '1T8+1', sp: '1T10', sty: 11, vikt: 4, bv: 15, pris: 700 },
      { id: 'klubba', namn: 'Klubba', kp: '1T6', sp: '1T6', sty: 5, vikt: 1, bv: 7, pris: 20 },
      { id: 'knogjarn', namn: 'Knogjärn', kp: '+1', sp: '+2', sty: 1, vikt: 0.5, bv: null, pris: 20 },
      { id: 'morgonstjarna', namn: 'Morgonstjärna', kp: '1T8+2', sp: '1T10+1', sty: 13, vikt: 4.5, bv: 11, pris: 1500 },
      { id: 'spikklubba', namn: 'Spikklubba', kp: '1T6', sp: '1T6', sty: 5, vikt: 1, bv: 7, pris: 30 },
      { id: 'stridshammare', namn: 'Stridshammare', kp: '1T6+2', sp: '1T10', sty: 11, vikt: 4, bv: 15, pris: 850 },
      { id: 'stridsklubba', namn: 'Stridsklubba', kp: '1T6', sp: '1T8', sty: 9, vikt: 3, bv: 11, pris: 300 },
      { id: 'tung-spikklubba', namn: 'Tung spikklubba', kp: '2T4', sp: '1T10', sty: 21, vikt: 6, bv: 11, pris: 70 },
      { id: 'tung-traklubba', namn: 'Tung träklubba', kp: '1T8', sp: '1T10', sty: 21, vikt: 6, bv: 11, pris: 50 },
    ],
  },
  {
    id: 'yxor', namn: 'Enhandsyxor', type: 'weapon', items: [
      { id: 'bredyxa', namn: 'Bredyxa', kp: '1T8+1', sp: '1T6', sty: 9, vikt: 3, bv: 11, pris: 350 },
      { id: 'handyxa', namn: 'Handyxa', kp: '1T6+1', sp: '1T4', sty: 9, vikt: 3, bv: 11, pris: 60 },
      { id: 'korpnabb', namn: 'Korpnäbb', kp: '1T8', sp: '1T6', sty: 7, vikt: 2, bv: 15, pris: 600 },
      { id: 'stridsyxa', namn: 'Stridsyxa', kp: '1T8+2', sp: '1T6', sty: 11, vikt: 4, bv: 11, pris: 450 },
    ],
  },
  {
    id: 'tvahandsvapen', namn: 'Tvåhandsvapen', type: 'weapon', items: [
      { id: 'flamberge', namn: 'Flamberge', kp: '2T10+1', sp: '1T10', sty: 31, vikt: 8, bv: 15, pris: 4000 },
      { id: 'skaggyxa', namn: 'Skäggyxa', kp: '2T8+1', sp: '1T8', sty: 25, vikt: 6.5, bv: 11, pris: 1100 },
      { id: 'tvahandsgissel', namn: 'Tvåhandsgissel', kp: '2T6', sp: '2T6+2', sty: 31, vikt: 8, bv: 15, pris: 2500 },
      { id: 'tvahandshammare', namn: 'Tvåhandshammare', kp: '1T10', sp: '2T6+2', sty: 31, vikt: 8, bv: 15, pris: 1750 },
      { id: 'tvahandssvard', namn: 'Tvåhandssvärd', kp: '2T10+2', sp: '1T8+1', sty: 31, vikt: 8, bv: 15, pris: 3500 },
      { id: 'tvahandsyxa', namn: 'Tvåhandsyxa', kp: '2T10+1', sp: '1T8', sty: 31, vikt: 8, bv: 11, pris: 1900 },
    ],
  },
  {
    id: 'stickvapen', namn: 'Stickvapen', type: 'weapon', items: [
      { id: 'jaktspjut', namn: 'Jaktspjut', kp: '1T8', sp: '1T8', sty: 10, vikt: 6, bv: 20, pris: 800 },
      { id: 'kortspjut', namn: 'Kortspjut', kp: '1T6', sp: '1T4', sty: 7, vikt: 2, bv: 11, pris: 90 },
      { id: 'lans', namn: 'Lans', kp: '2T8', sp: '1T10', sty: 25, vikt: 6.5, bv: 15, pris: 650 },
      { id: 'langspjut', namn: 'Långspjut', kp: '1T10', sp: '1T6', sty: 11, vikt: 4, bv: 11, pris: 300 },
      { id: 'latt-lans', namn: 'Lätt lans', kp: '2T6', sp: '1T8', sty: 18, vikt: 5, bv: 15, pris: 400 },
      { id: 'pik', namn: 'Pik', kp: '2T8-1', sp: '1T8', sty: 25, vikt: 6.5, bv: 11, pris: 1900 },
      { id: 'spetum', namn: 'Spetum', kp: '2T8+1', sp: '1T8', sty: 27, vikt: 7, bv: 11, pris: 1250 },
      { id: 'tornerlans', namn: 'Tornerlans', kp: '—', sp: '1T8', sty: 15, vikt: 2, bv: 7, pris: 550 },
      { id: 'treudd', namn: 'Treudd', kp: '3T6-1', sp: '1T6', sty: 15, vikt: 5, bv: 11, pris: 1000 },
    ],
  },
  {
    id: 'kattingvapen', namn: 'Kättingvapen & piskor', type: 'weapon', items: [
      { id: 'bondeslaga', namn: 'Bondeslaga', kp: '1T6', sp: '1T8', sty: 15, vikt: 3, bv: 9, pris: 40 },
      { id: 'stridsgissel-u-spik', namn: 'Stridsgissel u. spik', kp: '1T6', sp: '1T10+1', sty: 11, vikt: 4, bv: 11, pris: 1000 },
      { id: 'stridsgissel-m-spik', namn: 'Stridsgissel m. spik', kp: '1T8', sp: '1T10', sty: 13, vikt: 4.5, bv: 11, pris: 1250 },
      { id: 'stridsslaga', namn: 'Stridsslaga', kp: '1T8+1', sp: '2T6', sty: 25, vikt: 6.5, bv: 11, pris: 1500 },
      { id: 'niosvansad-katt', namn: 'Niosvansad katt', kp: '1T4', sp: '1T8', sty: 12, vikt: 3, bv: 3, pris: 250 },
      { id: 'oxpiska', namn: 'Oxpiska', kp: '1T3', sp: '1T6+1', sty: 11, vikt: 4, bv: 5, pris: 200 },
      { id: 'piska', namn: 'Piska', kp: '1T2', sp: '1T4+1', sty: 9, vikt: 3, bv: 3, pris: 120 },
    ],
  },
  {
    id: 'stangvapen', namn: 'Stångvapen', type: 'weapon', items: [
      { id: 'glav', namn: 'Glav', kp: '2T10', sp: '1T10', sty: 27, vikt: 7, bv: 11, pris: 1600 },
      { id: 'hillebard', namn: 'Hillebard', kp: '3T6+1', sp: '1T8', sty: 29, vikt: 7.5, bv: 11, pris: 1900 },
      { id: 'partisan', namn: 'Partisan', kp: '2T8+2', sp: '1T8', sty: 27, vikt: 7, bv: 11, pris: 1400 },
      { id: 'palyxa', namn: 'Pålyxa', kp: '3T6', sp: '1T8', sty: 29, vikt: 7.5, bv: 11, pris: 1150 },
      { id: 'trastav-vanlig', namn: 'Trästav, vanlig', kp: '1T3', sp: '1T8', sty: 7, vikt: 2, bv: 7, pris: 100 },
      { id: 'trastav-strids', namn: 'Trästav, strids-', kp: '1T4', sp: '1T10', sty: 9, vikt: 3, bv: 11, pris: 400 },
    ],
  },
  {
    id: 'bagar', namn: 'Bågar', type: 'ranged', items: [
      { id: 'kortbage', namn: 'Kortbåge', kp: '1T6+1', sp: '1T4', sty: 18, rackv: '135 m', vikt: 2, laddn: '0 SR', pv: '0/0', pris: 400 },
      { id: 'langbage', namn: 'Långbåge', kp: '1T8+1', sp: '1T6', sty: 30, rackv: '180 m', vikt: 3, laddn: '0 SR', pv: '2/1', pris: 700 },
      { id: 'pilbage', namn: 'Pilbåge', kp: '1T4+1', sp: '1T3', sty: 10, rackv: '135 m', vikt: 1.5, laddn: '0 SR', pv: '1/0', pris: 150 },
      { id: 'ryttarbage', namn: 'Ryttarbåge', kp: '1T8', sp: '1T6', sty: 25, rackv: '100 m', vikt: 3, laddn: '0 SR', pv: '1/1', pris: 500 },
      { id: 'sammansatt-bage', namn: 'Sammansatt båge', kp: '1T10+1', sp: '1T8', sty: 30, rackv: '180 m', vikt: 3.5, laddn: '0 SR', pv: '2/2', pris: 1000 },
    ],
  },
  {
    id: 'armborst', namn: 'Armborst', type: 'ranged', items: [
      { id: 'arbalest', namn: 'Arbalest', kp: '3T6+3', sp: '1T10', sty: 32, rackv: '250 m', vikt: 8, laddn: '12 SR', pv: '4/2', pris: 4000 },
      { id: 'automatarmborst', namn: 'Automatarmborst', kp: '1T6+2', sp: '1T4', sty: 20, rackv: '75 m', vikt: 12, laddn: '0/12', pv: '1/1', pris: 8000 },
      { id: 'latt-armborst', namn: 'Lätt armborst', kp: '2T4+2', sp: '1T6', sty: 26, rackv: '150 m', vikt: 5, laddn: '3 SR', pv: '2/1', pris: 1300 },
      { id: 'tungt-armborst', namn: 'Tungt armborst', kp: '2T6+2', sp: '1T8', sty: 28, rackv: '225 m', vikt: 6, laddn: '6 SR', pv: '2/2', pris: 2250 },
    ],
  },
  {
    id: 'kastvapen', namn: 'Slungor, kastvapen & blåsrör', type: 'ranged', items: [
      { id: 'slunga', namn: 'Slunga', kp: '1T6', sp: '1T4', sty: 10, rackv: '90 m', vikt: 0.5, laddn: '0 SR', pv: '0/0', pris: 40 },
      { id: 'stavslunga', namn: 'Stavslunga', kp: '1T8', sp: '1T6', sty: 22, rackv: '120 m', vikt: 2, laddn: '1 SR', pv: '0/0', pris: 80 },
      { id: 'kastkniv', namn: 'Kastkniv', kp: '1T4+1', sp: '1T3', sty: 3, rackv: 'STY r.', vikt: 0.5, laddn: '—', pv: '0/0', pris: 100 },
      { id: 'kastspjut', namn: 'Kastspjut', kp: '1T6+1', sp: '1T4', sty: 7, rackv: 'STY r.', vikt: 1, laddn: '—', pv: '0/0', pris: 120 },
      { id: 'kastyxa', namn: 'Kastyxa', kp: '1T6+2', sp: '1T4', sty: 11, rackv: 'STY r.', vikt: 3, laddn: '—', pv: '0/0', pris: 90 },
      { id: 'blasror', namn: 'Blåsrör', kp: 'spec', sp: 'spec', sty: 2, rackv: '20 m', vikt: 0.5, laddn: '0 SR', pv: '0/0', pris: 80 },
    ],
  },
  {
    id: 'skoldar', namn: 'Sköldar', type: 'shield', items: [
      { id: 'targ', namn: 'Targ', kp: '1T3', sp: '1T3', sty: 1, vikt: 1, bv: 9, pris: 500 },
      { id: 'rundskold-liten', namn: 'Rundsköld, liten', kp: '1T3', sp: '1T4', sty: 3, vikt: 2, bv: 9, pris: 650 },
      { id: 'rundskold-stor', namn: 'Rundsköld, stor', kp: '1T4', sp: '1T6', sty: 11, vikt: 7, bv: 11, pris: 1000 },
      { id: 'langskold', namn: 'Långsköld', kp: '1T4', sp: '1T6', sty: 7, vikt: 6, bv: 11, pris: 900 },
      { id: 'vanlig-skold', namn: 'Vanlig sköld', kp: '1T4', sp: '1T6', sty: 7, vikt: 6, bv: 11, pris: 850 },
      { id: 'scutata', namn: 'Scutata', kp: '1T4+1', sp: '1T6', sty: 7, vikt: 8, bv: 13, pris: 1100 },
      { id: 'pavise', namn: 'Pavise', kp: '1T4+1', sp: '1T6', sty: 18, vikt: 16, bv: 11, pris: 900 },
    ],
  },
]

// Rustningar: absKp/absSp = absorberade KP/SP, vikt (kg), hb = handlingsavdrag, pris.
export const ARMOUR_GROUPS = [
  {
    id: 'rustningar', namn: 'Rustningar (helkropp)', type: 'armour', items: [
      { id: 'rust-tjockt-tyg', namn: 'Tjockt tyg', absKp: 1, absSp: 2, vikt: 7.5, hb: 0, pris: 275 },
      { id: 'rust-lader', namn: 'Läderrustning', absKp: 2, absSp: 2, vikt: 11, hb: 0, pris: 1300 },
      { id: 'rust-nitlader', namn: 'Nitläder', absKp: 3, absSp: 2, vikt: 16, hb: 0, pris: 2500 },
      { id: 'rust-hardad-lader', namn: 'Härdad läderrustning', absKp: 4, absSp: 3, vikt: 13, hb: 0, pris: 3500 },
      { id: 'rust-vadderad', namn: 'Vadderad rustning', absKp: 3, absSp: 5, vikt: 12, hb: 0, pris: 1500 },
      { id: 'rust-benlamell', namn: 'Benlamellrustning', absKp: 4, absSp: 3, vikt: 18, hb: 0, pris: 2000 },
      { id: 'rust-brigandin', namn: 'Brigandinrustning', absKp: 5, absSp: 3, vikt: 17, hb: 0, pris: 4000 },
      { id: 'rust-ringpansar', namn: 'Ringpansar', absKp: 5, absSp: 3, vikt: 20, hb: 0, pris: 3500 },
      { id: 'rust-fjallpansar', namn: 'Fjällpansar', absKp: 5, absSp: 3, vikt: 40, hb: 0, pris: 3700 },
      { id: 'rust-ringbrynja', namn: 'Ringbrynja', absKp: 5, absSp: 4, vikt: 35, hb: -1, pris: 3700 },
      { id: 'rust-forstarkt-ringbrynja', namn: 'Förstärkt ringbrynja', absKp: 6, absSp: 4, vikt: 51, hb: -1, pris: 4700 },
      { id: 'rust-dubbel-ringbrynja', namn: 'Dubbel ringbrynja', absKp: 7, absSp: 4, vikt: 54, hb: -1, pris: 5000 },
      { id: 'rust-lamell', namn: 'Lamellrustning', absKp: 7, absSp: 3, vikt: 28, hb: 0, pris: 6000 },
      { id: 'rust-laminerad', namn: 'Laminerad rustning', absKp: 8, absSp: 4, vikt: 38, hb: -1, pris: 5600 },
      { id: 'rust-metall', namn: 'Metallrustning', absKp: 8, absSp: 4, vikt: 31, hb: -1, pris: 6000 },
      { id: 'rust-rafflad-metall', namn: 'Räfflad metallrustning', absKp: 9, absSp: 4, vikt: 42, hb: -1, pris: 10000 },
      { id: 'rust-parad', namn: 'Paradrustning', absKp: 10, absSp: 5, vikt: 45, hb: -1, pris: 15000 },
    ],
  },
  {
    id: 'hjalmar', namn: 'Hjälmar', type: 'armour', items: [
      { id: 'hjalm-tyghuva', namn: 'Tyghuva', absKp: 1, absSp: 2, vikt: 0.3, pris: 25 },
      { id: 'hjalm-laderhuva', namn: 'Läderhuva', absKp: 2, absSp: 2, vikt: 0.6, pris: 80 },
      { id: 'hjalm-nitladerhuva', namn: 'Nitläderhuva', absKp: 3, absSp: 2, vikt: 1.2, pris: 180 },
      { id: 'hjalm-hardad-laderhuva', namn: 'Härdad läderhuva', absKp: 4, absSp: 3, vikt: 0.6, pris: 300 },
      { id: 'hjalm-vadderad-huva', namn: 'Vadderad huva', absKp: 3, absSp: 5, vikt: 0.6, pris: 150 },
      { id: 'hjalm-ringbrynjehuva', namn: 'Ringbrynjehuva', absKp: 5, absSp: 4, vikt: 4, pris: 300 },
      { id: 'hjalm-dubbel-ringbrynjehuva', namn: 'Dubbel ringbrynjehuva', absKp: 7, absSp: 4, vikt: 6, pris: 500 },
      { id: 'hjalm-oppen', namn: 'Öppen hjälm', absKp: 6, absSp: 4, vikt: 4, pris: 500 },
      { id: 'hjalm-visir', namn: 'Hjälm med visir', absKp: 7, absSp: 4, vikt: 6, pris: 1500 },
      { id: 'hjalm-tunnhjalm', namn: 'Tunnhjälm', absKp: 8, absSp: 4, vikt: 6, pris: 1000 },
    ],
  },
  {
    id: 'armskydd', namn: 'Armskydd (pris/vikt per arm)', type: 'armour', items: [
      { id: 'arm-tjockt-tyg', namn: 'Tjockt tyg', absKp: 1, absSp: 2, vikt: 0.3, pris: 28 },
      { id: 'arm-lader', namn: 'Läder', absKp: 2, absSp: 2, vikt: 0.6, pris: 130 },
      { id: 'arm-nitlader', namn: 'Nitläder', absKp: 3, absSp: 2, vikt: 1.2, pris: 250 },
      { id: 'arm-vadderat', namn: 'Vadderat', absKp: 3, absSp: 5, vikt: 0.6, pris: 150 },
      { id: 'arm-hardat-lader', namn: 'Härdat läder', absKp: 4, absSp: 3, vikt: 0.6, pris: 300 },
      { id: 'arm-benlamell', namn: 'Benlamell', absKp: 4, absSp: 3, vikt: 0.8, pris: 200 },
      { id: 'arm-brigandin', namn: 'Brigandin', absKp: 5, absSp: 3, vikt: 1.5, pris: 400 },
      { id: 'arm-ringpansar', namn: 'Ringpansar', absKp: 5, absSp: 3, vikt: 2.5, pris: 350 },
      { id: 'arm-ringbrynja', namn: 'Ringbrynja', absKp: 5, absSp: 4, vikt: 2.5, pris: 400 },
      { id: 'arm-forstarkt-ringbrynja', namn: 'Förstärkt ringbrynja', absKp: 6, absSp: 4, vikt: 3.5, pris: 470 },
      { id: 'arm-dubbel-ringbrynja', namn: 'Dubbel ringbrynja', absKp: 7, absSp: 4, vikt: 2.7, pris: 500 },
      { id: 'arm-lamell', namn: 'Lamell', absKp: 7, absSp: 3, vikt: 2.5, pris: 600 },
      { id: 'arm-laminerad', namn: 'Laminerad', absKp: 8, absSp: 4, vikt: 3.5, pris: 560 },
      { id: 'arm-metall', namn: 'Metall', absKp: 8, absSp: 4, vikt: 3, pris: 600 },
      { id: 'arm-rafflad-metall', namn: 'Räfflad metall', absKp: 9, absSp: 4, vikt: 3.5, pris: 1000 },
    ],
  },
  {
    id: 'benskydd', namn: 'Benskydd (pris/vikt per ben)', type: 'armour', items: [
      { id: 'ben-tjockt-tyg', namn: 'Tjockt tyg', absKp: 1, absSp: 2, vikt: 0.45, pris: 42 },
      { id: 'ben-lader', namn: 'Läder', absKp: 2, absSp: 2, vikt: 0.9, pris: 195 },
      { id: 'ben-nitlader', namn: 'Nitläder', absKp: 3, absSp: 2, vikt: 1.8, pris: 375 },
      { id: 'ben-vadderat', namn: 'Vadderat', absKp: 3, absSp: 5, vikt: 0.9, pris: 225 },
      { id: 'ben-hardat-lader', namn: 'Härdat läder', absKp: 4, absSp: 3, vikt: 0.9, pris: 450 },
      { id: 'ben-benlamell', namn: 'Benlamell', absKp: 4, absSp: 3, vikt: 1.2, pris: 300 },
      { id: 'ben-ringpansar', namn: 'Ringpansar', absKp: 5, absSp: 3, vikt: 3.75, pris: 525 },
      { id: 'ben-ringbrynja', namn: 'Ringbrynja', absKp: 5, absSp: 4, vikt: 3.75, pris: 600 },
      { id: 'ben-forstarkt-ringbrynja', namn: 'Förstärkt ringbrynja', absKp: 6, absSp: 4, vikt: 5.25, pris: 705 },
      { id: 'ben-dubbel-ringbrynja', namn: 'Dubbel ringbrynja', absKp: 7, absSp: 4, vikt: 4.05, pris: 750 },
      { id: 'ben-lamell', namn: 'Lamell', absKp: 7, absSp: 3, vikt: 3.75, pris: 900 },
      { id: 'ben-laminerat', namn: 'Laminerat', absKp: 8, absSp: 4, vikt: 5.25, pris: 840 },
      { id: 'ben-metall', namn: 'Metall', absKp: 8, absSp: 4, vikt: 4.5, pris: 900 },
      { id: 'ben-rafflad-metall', namn: 'Räfflad metall', absKp: 9, absSp: 4, vikt: 5.25, pris: 1500 },
    ],
  },
]

export const GEAR = [
  { id: 'ryggsack', namn: 'Ryggsäck', pris: 20 },
  { id: 'sovsack', namn: 'Sovsäck / filt', pris: 15 },
  { id: 'vattenskinn', namn: 'Vattenskinn', pris: 10 },
  { id: 'proviant', namn: 'Proviant (1 vecka)', pris: 35 },
  { id: 'rep', namn: 'Rep (10 m)', pris: 10 },
  { id: 'fackla', namn: 'Fackla', pris: 1 },
  { id: 'lykta', namn: 'Lykta', pris: 30 },
  { id: 'olja', namn: 'Olja (flaska)', pris: 5 },
  { id: 'tandstal', namn: 'Tändstål', pris: 5 },
  { id: 'dyrkar', namn: 'Dyrkar', pris: 50 },
  { id: 'talt', namn: 'Tält', pris: 100 },
  { id: 'mantel', namn: 'Mantel / kappa', pris: 30 },
  { id: 'stovlar', namn: 'Stövlar', pris: 20 },
  { id: 'forband', namn: 'Förband / helande örter', pris: 20 },
  { id: 'riddjur', namn: 'Häst (riddjur)', pris: 1000 },
  { id: 'packdjur', namn: 'Packåsna / mula', pris: 400 },
]

// ── DrakarOchDemoner V4 (Spelarboken, RiotMinds) ────────────────────────────
// Denna utgåva använder ett enkelt skadevärde (skada) och ett absorberingsvärde
// (absorbering) i stället för KP/SP. Tillagd som egna grupper märkta (V4).
export const V4_WEAPON_GROUPS = [
  {
    id: 'v4-narstrid', namn: 'Närstridsvapen', type: 'v4weapon', items: [
      { id: 'v4-knogjarn', namn: 'Knogjärn el. stålhätta', skada: '+1', sty: 1, langd: 0, vikt: 0.5, bv: null, pris: 20 },
      { id: 'v4-parerdolk', namn: 'Parerdolk', skada: '1T4+1', sty: 1, langd: 0, vikt: 0.5, bv: 13, pris: 80 },
      { id: 'v4-dolk', namn: 'Dolk', skada: '1T4+1', sty: 1, langd: 0, vikt: 0.5, bv: 9, pris: 70 },
      { id: 'v4-klubba', namn: 'Klubba', skada: '1T6', sty: 5, langd: 0, vikt: 1, bv: 7, pris: 20 },
      { id: 'v4-spikklubba', namn: 'Spikklubba', skada: '1T6+1', sty: 5, langd: 0, vikt: 1, bv: 7, pris: 30 },
      { id: 'v4-kortsvard', namn: 'Kortsvärd', skada: '1T6+1', sty: 7, langd: 0, vikt: 2, bv: 15, pris: 400 },
      { id: 'v4-kortspjut', namn: 'Kortspjut', skada: '1T6', sty: 7, langd: 1, vikt: 2, bv: 11, pris: 90 },
      { id: 'v4-trastav', namn: 'Trästav', skada: '1T6', sty: 7, langd: 0, vikt: 2, bv: 7, pris: 100 },
      { id: 'v4-kroksabel', namn: 'Kroksabel', skada: '1T8+2', sty: 9, langd: 0, vikt: 3, bv: 15, pris: 650 },
      { id: 'v4-piska', namn: 'Piska', skada: '1T2', sty: 9, langd: 1, vikt: 3, bv: 3, pris: 120 },
      { id: 'v4-handyxa', namn: 'Handyxa', skada: '1T6+1', sty: 9, langd: 0, vikt: 3, bv: 11, pris: 60 },
      { id: 'v4-hjalmkrossare', namn: 'Hjälmkrossare', skada: '1T8+1', sty: 11, langd: 0, vikt: 4, bv: 15, pris: 700 },
      { id: 'v4-stridshammare', namn: 'Stridshammare', skada: '1T6+2', sty: 11, langd: 0, vikt: 4, bv: 15, pris: 850 },
      { id: 'v4-stridsyxa', namn: 'Stridsyxa', skada: '1T8+2', sty: 11, langd: 0, vikt: 4, bv: 11, pris: 450 },
      { id: 'v4-langspjut', namn: 'Långspjut', skada: '1T10', sty: 11, langd: 2, vikt: 4, bv: 11, pris: 300 },
      { id: 'v4-bredsvard', namn: 'Bredsvärd', skada: '1T8+1', sty: 13, langd: 0, vikt: 4.5, bv: 15, pris: 1000 },
      { id: 'v4-stridsspjut', namn: 'Stridsspjut', skada: '1T10', sty: 13, langd: 0, vikt: 4.5, bv: 11, pris: 1250 },
      { id: 'v4-morgonstjarna', namn: 'Morgonstjärna', skada: '1T8+2', sty: 13, langd: 0, vikt: 4.5, bv: 11, pris: 1500 },
      { id: 'v4-treudd', namn: 'Treudd', skada: '3T6-2', sty: 15, langd: 1, vikt: 5, bv: 11, pris: 1000 },
      { id: 'v4-bastardsvard', namn: 'Bastardsvärd', skada: '1T10+1', sty: 17, langd: 0, vikt: 5.5, bv: 15, pris: 2500 },
      { id: 'v4-stor-traklubba', namn: 'Stor träklubba', skada: '2T4', sty: 21, langd: 0, vikt: 6, bv: 11, pris: 50 },
      { id: 'v4-stor-spikklubba', namn: 'Stor spikklubba', skada: '2T4', sty: 21, langd: 0, vikt: 6, bv: 11, pris: 70 },
      { id: 'v4-stridsslaga', namn: 'Stridsslaga', skada: '1T10+1', sty: 25, langd: 0, vikt: 6.5, bv: 11, pris: 1500 },
      { id: 'v4-skaggyxa', namn: 'Skäggyxa', skada: '2T8+1', sty: 25, langd: 0, vikt: 6.5, bv: 11, pris: 1100 },
      { id: 'v4-pik', namn: 'Pik', skada: '2T8-1', sty: 25, langd: 3, vikt: 6.5, bv: 11, pris: 1900 },
      { id: 'v4-lans', namn: 'Lans', skada: '2T8', sty: 25, langd: 2, vikt: 6.5, bv: 15, pris: 650 },
      { id: 'v4-partisan', namn: 'Partisan', skada: '2T8+2', sty: 27, langd: 1, vikt: 7, bv: 11, pris: 1400 },
      { id: 'v4-spetum', namn: 'Spetum', skada: '2T8+1', sty: 27, langd: 1, vikt: 7, bv: 11, pris: 1250 },
      { id: 'v4-glav', namn: 'Glav', skada: '2T10', sty: 27, langd: 1, vikt: 7, bv: 11, pris: 1600 },
      { id: 'v4-palyxa', namn: 'Pålyxa', skada: '3T6', sty: 29, langd: 1, vikt: 7.5, bv: 11, pris: 1150 },
      { id: 'v4-hillebard', namn: 'Hillebard', skada: '3T6+1', sty: 29, langd: 1, vikt: 7.5, bv: 11, pris: 1900 },
      { id: 'v4-tvahandsyxa', namn: 'Tvåhandsyxa', skada: '2T10+1', sty: 31, langd: 1, vikt: 8, bv: 11, pris: 1900 },
      { id: 'v4-tvahandssvard', namn: 'Tvåhandssvärd', skada: '2T10+2', sty: 31, langd: 1, vikt: 8, bv: 15, pris: 3500 },
    ],
  },
  {
    id: 'v4-projektil', namn: 'Projektilvapen', type: 'v4ranged', items: [
      { id: 'v4-liten-bage', namn: 'Liten båge', skada: '1T4+1', sty: 10, rackvidd: '135 m', laddn: '0 SR', vikt: 1.5, pris: 150 },
      { id: 'v4-kortbage', namn: 'Kortbåge', skada: '1T6+1', sty: 18, rackvidd: '135 m', laddn: '0 SR', vikt: 2, pris: 400 },
      { id: 'v4-langbage', namn: 'Långbåge', skada: '1T8+1', sty: 30, rackvidd: '180 m', laddn: '0 SR', vikt: 3, pris: 700 },
      { id: 'v4-sammansatt-bage', namn: 'Sammansatt båge', skada: '1T10+1', sty: 30, rackvidd: '180 m', laddn: '0 SR', vikt: 3.5, pris: 1000 },
      { id: 'v4-slunga', namn: 'Slunga', skada: '1T6', sty: 10, rackvidd: '90 m', laddn: '0 SR', vikt: 0.5, pris: 40 },
      { id: 'v4-stavslunga', namn: 'Stavslunga', skada: '1T8', sty: 22, rackvidd: '120 m', laddn: '1 SR', vikt: 2, pris: 80 },
      { id: 'v4-blasror', namn: 'Blåsrör', skada: 'spec', sty: 2, rackvidd: '20 m', laddn: '0 SR', vikt: 0.5, pris: 80 },
      { id: 'v4-latt-armborst', namn: 'Lätt armborst', skada: '2T4+2', sty: 26, rackvidd: '150 m', laddn: '3 SR', vikt: 5, pris: 1300 },
      { id: 'v4-tungt-armborst', namn: 'Tungt armborst', skada: '2T6+2', sty: 28, rackvidd: '180 m', laddn: '5 SR', vikt: 6, pris: 2250 },
      { id: 'v4-arbalest', namn: 'Arbalest', skada: '3T6+3', sty: 32, rackvidd: '250 m', laddn: '8 SR', vikt: 8, pris: 4000 },
    ],
  },
  {
    id: 'v4-kast', namn: 'Kastvapen', type: 'v4ranged', items: [
      { id: 'v4-kastspjut', namn: 'Kastspjut', skada: '1T6+1', sty: 7, rackvidd: 'STY rutor', laddn: '—', vikt: 1, pris: 120 },
      { id: 'v4-kastkniv', namn: 'Kastkniv', skada: '1T4+1', sty: 3, rackvidd: 'STY rutor', laddn: '—', vikt: 0.5, pris: 100 },
      { id: 'v4-kastyxa', namn: 'Kastyxa', skada: '1T6+2', sty: 11, rackvidd: 'STY rutor', laddn: '—', vikt: 3, pris: 90 },
    ],
  },
  {
    id: 'v4-skoldar', namn: 'Sköldar', type: 'v4shield', items: [
      { id: 'v4-skold-targ', namn: 'Targ (bucklare)', sty: 1, bv: 9, vikt: 1, pris: 500 },
      { id: 'v4-skold-rund-liten', namn: 'Rundsköld, liten', sty: 3, bv: 9, vikt: 2, pris: 650 },
      { id: 'v4-skold-rund-stor', namn: 'Rundsköld, stor', sty: 11, bv: 11, vikt: 7, pris: 1000 },
      { id: 'v4-skold-langskold', namn: 'Långsköld (normandisk)', sty: 7, bv: 11, vikt: 6, pris: 900 },
      { id: 'v4-skold-vanlig', namn: 'Vanlig sköld (trekantig)', sty: 7, bv: 11, vikt: 6, pris: 850 },
      { id: 'v4-skold-scutata', namn: 'Scutata (romersk sköld)', sty: 7, bv: 13, vikt: 8, pris: 1100 },
      { id: 'v4-skold-pavise', namn: 'Pavise (bågskyttesköld)', sty: 18, bv: 11, vikt: 16, pris: 900 },
    ],
  },
]

export const V4_ARMOUR_GROUPS = [
  {
    id: 'v4-rustning-delar', namn: 'Rustningsdelar (per kroppsdel)', type: 'v4armour', items: [
      { id: 'v4-hjalm-tyghuva', namn: 'Hjälm: Tyghuva', absorbering: 1, vikt: 0.5, pris: 25 },
      { id: 'v4-hjalm-laderhuva', namn: 'Hjälm: Läderhuva', absorbering: 2, vikt: 0.5, pris: 80 },
      { id: 'v4-hjalm-nitladerhuva', namn: 'Hjälm: Nitläderhuva', absorbering: 3, vikt: 1, pris: 180 },
      { id: 'v4-hjalm-ringbrynjehuva', namn: 'Hjälm: Ringbrynjehuva', absorbering: 4, vikt: 4, pris: 300 },
      { id: 'v4-hjalm-oppen-metall', namn: 'Hjälm: Öppen metallhjälm', absorbering: 6, vikt: 4, pris: 500 },
      { id: 'v4-hjalm-metall-visir', namn: 'Hjälm: Metallhjälm m. visir', absorbering: 6, vikt: 6, pris: 1500 },
      { id: 'v4-hjalm-tunnhjalm', namn: 'Hjälm: Tunnhjälm', absorbering: 8, vikt: 6, pris: 1000 },
      { id: 'v4-arm-tjockt-tyg', namn: 'Armskydd: Tjockt tyg (par)', absorbering: 1, vikt: 2, pris: 50 },
      { id: 'v4-arm-lader', namn: 'Armskydd: Läder (par)', absorbering: 2, vikt: 3, pris: 250 },
      { id: 'v4-arm-nitlader', namn: 'Armskydd: Nitläder (par)', absorbering: 3, vikt: 5, pris: 500 },
      { id: 'v4-arm-hardat-lader', namn: 'Armskydd: Härdat läder (par)', absorbering: 4, vikt: 3, pris: 750 },
      { id: 'v4-arm-lamellerad', namn: 'Armskydd: Lamellerad (par)', absorbering: 6, vikt: 5.5, pris: 950 },
      { id: 'v4-arm-metall', namn: 'Armskydd: Metall (par)', absorbering: 7, vikt: 6, pris: 1350 },
      { id: 'v4-arm-laminerad', namn: 'Armskydd: Laminerad (par)', absorbering: 8, vikt: 8, pris: 1200 },
      { id: 'v4-ben-tjockt-tyg', namn: 'Benskydd: Tjockt tyg (par)', absorbering: 1, vikt: 3, pris: 80 },
      { id: 'v4-ben-lader', namn: 'Benskydd: Läder (par)', absorbering: 2, vikt: 4, pris: 400 },
      { id: 'v4-ben-nitlader', namn: 'Benskydd: Nitläder (par)', absorbering: 3, vikt: 6, pris: 750 },
      { id: 'v4-ben-hardat-lader', namn: 'Benskydd: Härdat läder (par)', absorbering: 4, vikt: 5, pris: 1150 },
      { id: 'v4-ben-lamellerad', namn: 'Benskydd: Lamellerad (par)', absorbering: 6, vikt: 6, pris: 1550 },
      { id: 'v4-ben-metall', namn: 'Benskydd: Metall (par)', absorbering: 7, vikt: 7, pris: 1850 },
      { id: 'v4-ben-laminerad', namn: 'Benskydd: Laminerad (par)', absorbering: 8, vikt: 9, pris: 1600 },
      { id: 'v4-harnesk-tjockt-tyg', namn: 'Harnesk: Tjockt tyg', absorbering: 1, vikt: 2, pris: 130 },
      { id: 'v4-harnesk-lader', namn: 'Harnesk: Läder', absorbering: 2, vikt: 3, pris: 600 },
      { id: 'v4-harnesk-nitlader', namn: 'Harnesk: Nitläder', absorbering: 3, vikt: 4, pris: 1150 },
      { id: 'v4-harnesk-hardat-lader', namn: 'Harnesk: Härdat läder', absorbering: 4, vikt: 4, pris: 1500 },
      { id: 'v4-harnesk-ringbrynjeskjorta', namn: 'Harnesk: Ringbrynjeskjorta', absorbering: 5, vikt: 10, pris: 1500 },
      { id: 'v4-harnesk-forstarkt', namn: 'Harnesk: Förstärkt ringbrynja', absorbering: 6, vikt: 15, pris: 1150 },
      { id: 'v4-harnesk-fjallpansar', namn: 'Harnesk: Fjällpansar', absorbering: 6, vikt: 14, pris: 1500 },
      { id: 'v4-harnesk-lamellerad', namn: 'Harnesk: Lamellerad', absorbering: 6, vikt: 10, pris: 1550 },
      { id: 'v4-harnesk-metall', namn: 'Harnesk: Metall', absorbering: 7, vikt: 12, pris: 1900 },
      { id: 'v4-harnesk-laminerad', namn: 'Harnesk: Laminerad', absorbering: 8, vikt: 15, pris: 1800 },
      { id: 'v4-brynja-ringbrynja', namn: 'Brynja (+armar): Ringbrynja', absorbering: 5, vikt: 16, pris: 2000 },
      { id: 'v4-brynja-forstarkt', namn: 'Brynja (+armar): Förstärkt ringbrynja', absorbering: 6, vikt: 24, pris: 2500 },
      { id: 'v4-brynjehosor-ringbrynja', namn: 'Brynjehosor (ben): Ringbrynja', absorbering: 5, vikt: 15, pris: 2500 },
      { id: 'v4-brynjehosor-forstarkt', namn: 'Brynjehosor (ben): Förstärkt ringbrynja', absorbering: 6, vikt: 22.5, pris: 3250 },
      { id: 'v4-hauberk-ringbrynja', namn: 'Hauberk (helkropp u. huvud): Ringbrynja', absorbering: 5, vikt: 32, pris: 3500 },
      { id: 'v4-hauberk-forstarkt', namn: 'Hauberk (helkropp u. huvud): Förstärkt ringbrynja', absorbering: 6, vikt: 48, pris: 4500 },
      { id: 'v4-helrustning-metall', namn: 'Helrustning (helkropp u. huvud): Metall', absorbering: 8, vikt: 25, pris: 5100 },
    ],
  },
  {
    id: 'v4-rustning-hela', namn: 'Hela rustningar', type: 'v4armour', items: [
      { id: 'v4-hela-tjockt-tyg', namn: 'Tjockt tyg', absorbering: 1, vikt: 7.5, pris: 275 },
      { id: 'v4-hela-lader', namn: 'Läder', absorbering: 2, vikt: 11, pris: 1300 },
      { id: 'v4-hela-nitlader', namn: 'Nitläder', absorbering: 3, vikt: 16, pris: 2500 },
      { id: 'v4-hela-hardat-lader', namn: 'Härdat läder', absorbering: 4, vikt: 13, pris: 3500 },
      { id: 'v4-hela-ringbrynja', namn: 'Ringbrynja', absorbering: 5, vikt: 35, pris: 3700 },
      { id: 'v4-hela-forstarkt', namn: 'Förstärkt ringbrynja', absorbering: 6, vikt: 51, pris: 4700 },
      { id: 'v4-hela-lamellerad', namn: 'Hel lamellerad rustning', absorbering: 7, vikt: 28, pris: 6000 },
      { id: 'v4-hela-metall', namn: 'Hel metallrustning', absorbering: 8, vikt: 31, pris: 6000 },
      { id: 'v4-hela-laminerad', namn: 'Hel laminerad rustning', absorbering: 9, vikt: 38, pris: 5600 },
    ],
  },
]

// Allmän utrustning ur Spelarboken (V4). Vikt i kg (— = försumbar). Pris i sm.
export const V4_GEAR_GROUPS = [
  {
    id: 'v4-verktyg', namn: 'Verktyg', type: 'gear', items: [
      { id: 'v4-blasbalg', namn: 'Blåsbälg', vikt: 2, pris: 90 },
      { id: 'v4-barbar-smedja', namn: 'Bärbar smedja', vikt: 26, pris: 625 },
      { id: 'v4-barbart-stad', namn: 'Bärbart städ', vikt: 5, pris: 190 },
      { id: 'v4-normalt-stad', namn: 'Normalt städ', vikt: 35, pris: 625 },
      { id: 'v4-hacka', namn: 'Hacka', vikt: 5, pris: 125 },
      { id: 'v4-verktyg-handyxa', namn: 'Handyxa', vikt: 3, pris: 60 },
      { id: 'v4-skogsyxa', namn: 'Skogsyxa', vikt: 5, pris: 125 },
      { id: 'v4-slagga', namn: 'Slägga', vikt: 4, pris: 40 },
      { id: 'v4-spade', namn: 'Spade', vikt: 2, pris: 75 },
      { id: 'v4-verktyg-kniv', namn: 'Kniv', vikt: 0.5, pris: 50 },
      { id: 'v4-trahammare', namn: 'Trähammare', vikt: 1, pris: 2 },
      { id: 'v4-stickhammare', namn: 'Stickhammare', vikt: 1, pris: 18 },
      { id: 'v4-smaspik', namn: 'Småspik (100 st)', vikt: 1, pris: 75 },
      { id: 'v4-grovspik', namn: 'Grov spik (10 st)', vikt: null, pris: 5 },
      { id: 'v4-spik-ogla', namn: 'Spik med ögla (1 st)', vikt: null, pris: 20 },
      { id: 'v4-jarnbommar', namn: 'Järnbommar (5 st)', vikt: null, pris: 50 },
      { id: 'v4-jarnklor', namn: 'Järnklor (3 st)', vikt: null, pris: 15 },
      { id: 'v4-anterhake', namn: 'Änterhake', vikt: 0.5, pris: 40 },
      { id: 'v4-metallsag', namn: 'Metallsåg', vikt: null, pris: 250 },
      { id: 'v4-smorjolja', namn: 'Smörjolja (25 ml)', vikt: null, pris: 8 },
    ],
  },
  {
    id: 'v4-behallare', namn: 'Behållare', type: 'gear', items: [
      { id: 'v4-glasflaska', namn: 'Glasflaska (10 doser)', vikt: null, pris: 160 },
      { id: 'v4-glasplunta', namn: 'Glasplunta (1 dos)', vikt: null, pris: 60 },
      { id: 'v4-koger', namn: 'Koger (20 pilar)', vikt: 0.5, pris: 40 },
      { id: 'v4-lerkruka', namn: 'Lerkruka (4 liter)', vikt: 1, pris: 12 },
      { id: 'v4-penningpung', namn: 'Penningpung (50 mynt)', vikt: null, pris: 9 },
      { id: 'v4-myntlada', namn: 'Myntlåda (100 mynt)', vikt: null, pris: 40 },
      { id: 'v4-ryggsack', namn: 'Ryggsäck (30 liter)', vikt: 1, pris: 20 },
      { id: 'v4-traskrin', namn: 'Träskrin', vikt: 1, pris: 25 },
      { id: 'v4-metallskrin', namn: 'Metallskrin', vikt: 2, pris: 140 },
      { id: 'v4-stor-sack', namn: 'Stor säck (100 liter)', vikt: 1, pris: 4 },
      { id: 'v4-tralada', namn: 'Trälåda (25 liter)', vikt: 4, pris: 20 },
      { id: 'v4-tratunna', namn: 'Trätunna (100 liter)', vikt: 14, pris: 50 },
      { id: 'v4-skinnlagel', namn: 'Skinnlägel (2 liter)', vikt: 0.5, pris: 10 },
      { id: 'v4-vattenskinn', namn: 'Vattenskinn (20 liter)', vikt: 1, pris: 25 },
    ],
  },
  {
    id: 'v4-klader', namn: 'Kläder', type: 'gear', items: [
      { id: 'v4-byxor', namn: 'Byxor', vikt: 0.5, pris: 25 },
      { id: 'v4-balte', namn: 'Bälte', vikt: null, pris: 20 },
      { id: 'v4-handskar', namn: 'Handskar', vikt: null, pris: 40 },
      { id: 'v4-hatt', namn: 'Hatt', vikt: null, pris: 30 },
      { id: 'v4-hosor', namn: 'Hosor', vikt: 0.5, pris: 25 },
      { id: 'v4-jacka', namn: 'Jacka', vikt: 0.5, pris: 30 },
      { id: 'v4-kortbyxor', namn: 'Kortbyxor', vikt: null, pris: 10 },
      { id: 'v4-kapa', namn: 'Kåpa (magiker-/prästkåpa)', vikt: 2, pris: 50 },
      { id: 'v4-kangor', namn: 'Kängor', vikt: 1, pris: 75 },
      { id: 'v4-laderskor', namn: 'Läderskor', vikt: 0.5, pris: 60 },
      { id: 'v4-laderstovlar', namn: 'Läderstövlar, höga', vikt: 1, pris: 200 },
      { id: 'v4-mantel', namn: 'Mantel', vikt: 2, pris: 100 },
      { id: 'v4-sandaler', namn: 'Sandaler', vikt: null, pris: 10 },
      { id: 'v4-skjorta', namn: 'Skjorta', vikt: null, pris: 25 },
      { id: 'v4-tunika', namn: 'Tunika', vikt: null, pris: 30 },
    ],
  },
  {
    id: 'v4-aventyr', namn: 'Äventyrarutrustning', type: 'gear', items: [
      { id: 'v4-armborstbult', namn: 'Armborstbult (10 st)', vikt: 1, pris: 60 },
      { id: 'v4-pilar', namn: 'Pilar (10 st)', vikt: 0.5, pris: 20 },
      { id: 'v4-slungkulor', namn: 'Slungkulor (10 st)', vikt: 0.5, pris: 5 },
      { id: 'v4-bagstrang', namn: 'Bågsträng', vikt: null, pris: 5 },
      { id: 'v4-flinta', namn: 'Flinta & eld', vikt: null, pris: 15 },
      { id: 'v4-vaxljus', namn: 'Vaxljus (1 timme)', vikt: 0.5, pris: 15 },
      { id: 'v4-fackla', namn: 'Fackla (1 timme)', vikt: 1, pris: 6 },
      { id: 'v4-oljelampa', namn: 'Oljelampa', vikt: 1, pris: 7 },
      { id: 'v4-oljelykta', namn: 'Oljelykta (6 timmar)', vikt: 1, pris: 40 },
      { id: 'v4-lampolja', namn: 'Lampolja (1 timme)', vikt: 0.5, pris: 3 },
      { id: 'v4-halmmadrass', namn: 'Halmmadrass', vikt: 2, pris: 60 },
      { id: 'v4-jarngryta', namn: 'Järngryta (2 liter)', vikt: 3, pris: 35 },
      { id: 'v4-fiskenat', namn: 'Fiskenät (5×5 m)', vikt: 1, pris: 40 },
      { id: 'v4-sovfall', namn: 'Sovfäll', vikt: 4, pris: 310 },
      { id: 'v4-talt', namn: 'Tält (2 man)', vikt: 4, pris: 70 },
    ],
  },
  {
    id: 'v4-tjuvverktyg', namn: 'Tjuvverktyg', type: 'gear', items: [
      { id: 'v4-dyrkar-sma', namn: 'Dyrkar (små lås, 10 st)', vikt: 0.5, pris: 225 },
      { id: 'v4-dyrkar-stora', namn: 'Dyrkar (större lås, 10 st)', vikt: 1, pris: 320 },
      { id: 'v4-nyckelamnen', namn: 'Nyckelämnen (10 st)', vikt: 0.5, pris: 140 },
      { id: 'v4-nyckelfilar', namn: 'Nyckelfilar (6 st)', vikt: 1, pris: 100 },
      { id: 'v4-vaxklump', namn: 'Vaxklump', vikt: null, pris: 5 },
      { id: 'v4-dragkrok', namn: 'Dragkrok', vikt: 1, pris: 85 },
      { id: 'v4-glasskarare', namn: 'Glasskärare', vikt: null, pris: 850 },
    ],
  },
  {
    id: 'v4-diverse', namn: 'Diverse', type: 'gear', items: [
      { id: 'v4-rep-1tum', namn: '1-tums rep (10 m, tål 400 kg)', vikt: 12, pris: 80 },
      { id: 'v4-rep-halvtum', namn: '½-tums rep (10 m, tål 100 kg)', vikt: 3, pris: 40 },
      { id: 'v4-kedja', namn: 'Kedja (1 m, tål 500 kg)', vikt: 5, pris: 200 },
      { id: 'v4-kraftig-kedja', namn: 'Kraftig kedja (1 m, tål 1 000 kg)', vikt: 25, pris: 400 },
      { id: 'v4-hanskor', namn: 'Hänskor (4 st)', vikt: 1, pris: 35 },
      { id: 'v4-penna', namn: 'Penna, bläck & pergament', vikt: null, pris: 10 },
      { id: 'v4-repstege', namn: 'Repstege (3 m)', vikt: 3, pris: 18 },
      { id: 'v4-trastege', namn: 'Trästege (2 m)', vikt: 4, pris: 9 },
      { id: 'v4-solur', namn: 'Solur (± 30 minuter)', vikt: 1, pris: 600 },
      { id: 'v4-timglas', namn: 'Timglas', vikt: 4, pris: 875 },
      { id: 'v4-spegel', namn: 'Spegel', vikt: 0.5, pris: 550 },
      { id: 'v4-synal', namn: 'Synål', vikt: null, pris: 2 },
      { id: 'v4-visselpipa', namn: 'Visselpipa', vikt: null, pris: 25 },
      { id: 'v4-signalhorn', namn: 'Signalhorn', vikt: 0.5, pris: 30 },
      { id: 'v4-flojt', namn: 'Flöjt', vikt: null, pris: 90 },
      { id: 'v4-harpa', namn: 'Harpa', vikt: 5, pris: 600 },
      { id: 'v4-luta', namn: 'Luta', vikt: 1, pris: 400 },
      { id: 'v4-lyra', namn: 'Lyra', vikt: 1.5, pris: 375 },
      { id: 'v4-trumma', namn: 'Trumma', vikt: 3, pris: 190 },
    ],
  },
  {
    id: 'v4-mat', namn: 'Mat & dryck', type: 'gear', items: [
      { id: 'v4-svagdricka', namn: 'Svagdricka (1 liter)', vikt: null, pris: 2 },
      { id: 'v4-ol', namn: 'Öl (1 liter)', vikt: null, pris: 4 },
      { id: 'v4-cider', namn: 'Cider (1 liter)', vikt: null, pris: 5 },
      { id: 'v4-mjod', namn: 'Mjöd (1 liter)', vikt: null, pris: 8 },
      { id: 'v4-bordsvin', namn: 'Bordsvin (1 liter)', vikt: null, pris: 3 },
      { id: 'v4-fint-vin', namn: 'Fint vin (1 liter)', vikt: null, pris: 30 },
      { id: 'v4-brannvin', namn: 'Brännvin (1 liter)', vikt: null, pris: 10 },
      { id: 'v4-gronsaksstuvning', namn: 'Enkel grönsaksstuvning', vikt: null, pris: 1 },
      { id: 'v4-kottstuvning', namn: 'Köttstuvning', vikt: null, pris: 4 },
      { id: 'v4-kottstycke', namn: 'Köttstycke och rovor', vikt: null, pris: 8 },
      { id: 'v4-gronsakssoppa', namn: 'Grönsakssoppa', vikt: null, pris: 2 },
      { id: 'v4-kottpaj', namn: 'Köttpaj', vikt: null, pris: 8 },
      { id: 'v4-fagel', namn: 'Fågel', vikt: null, pris: 6 },
      { id: 'v4-fisk', namn: 'Fisk', vikt: null, pris: 4 },
      { id: 'v4-vildsvin', namn: 'Helt vildsvin', vikt: null, pris: 25 },
      { id: 'v4-limpa', namn: 'Limpa', vikt: null, pris: 1 },
      { id: 'v4-skeppsskorpor', namn: 'Skeppsskorpor (1 dagsranson)', vikt: null, pris: 2 },
      { id: 'v4-torkat-kott', namn: 'Torkat kött (1 dagsranson)', vikt: null, pris: 9 },
    ],
  },
  {
    id: 'v4-djur', namn: 'Djur & riddjur', type: 'gear', items: [
      { id: 'v4-hast', namn: 'Häst (riddjur)', vikt: null, pris: 1000 },
      { id: 'v4-packasna', namn: 'Packåsna / mula', vikt: null, pris: 400 },
    ],
  },
]

// ── Tjuvar och Lönnmördare — vapen (samma KP/SP-modell som Krigarens Handbok) ──
export const TL_WEAPON_GROUPS = [
  {
    id: 'tl-tjuvvapen', namn: 'Tjuv- & lönnmördarvapen', type: 'weapon', src: 'TL', items: [
      { id: 'tl-knogjarn-spik', namn: 'Knogjärn m. spikar', kp: '+1T3', sp: '+1', vikt: 0.5, bv: null, pris: 70 },
      { id: 'tl-knogjarnsdolk', namn: 'Knogjärnsdolk', kp: '1T4+1', sp: '1T3', vikt: 1, bv: 9, pris: 110 },
      { id: 'tl-basilard', namn: 'Basilard', kp: '1T6', sp: '1T4', vikt: 1, bv: 15, pris: 300 },
      { id: 'tl-rustningsdolk', namn: 'Rustningsdolk', kp: '1T4', sp: '1T3', vikt: 0.5, bv: 7, pris: 120 },
      { id: 'tl-dubbeldolk', namn: 'Dubbeldolk', kp: '1T4+1', sp: '1T3', vikt: 0.5, bv: 9, pris: 100 },
      { id: 'tl-blydagg', namn: 'Blydagg', kp: '1T2', sp: '1T4', vikt: 0.5, bv: null, pris: 20 },
      { id: 'tl-tigerklor', namn: 'Tigerklor', kp: '1T4+1', sp: '1T3', vikt: 0.5, bv: 5, pris: 80 },
      { id: 'tl-lonnmordarnal', namn: 'Lönnmördarnål', kp: '1T4+1', sp: '1T2', vikt: 0.25, bv: 5, pris: 30 },
      { id: 'tl-fingerknivar', namn: 'Fingerknivar', kp: '1T3', sp: '1', vikt: 0.1, bv: null, pris: 50 },
      { id: 'tl-strypsnara', namn: 'Strypsnara', kp: '1T3', sp: '1T3', vikt: 0.1, bv: null, pris: 20 },
      { id: 'tl-varjbrytare', namn: 'Värjbrytare', kp: '1T4+1', sp: '1T3', vikt: 0.5, bv: 9, pris: 130 },
      { id: 'tl-fangstpale', namn: 'Fångstpåle', kp: 'spec', sp: 'spec', vikt: 9, bv: 11, pris: 140 },
    ],
  },
  {
    id: 'tl-armborst', namn: 'Tjuvarmborst', type: 'ranged', src: 'TL', items: [
      { id: 'tl-armborstpistol', namn: 'Armborstpistol', kp: '1T6+1', sp: '1T4', rackv: '20 m', vikt: 1.8, laddn: '2 SR', pris: 1600 },
    ],
  },
]

// Pilvarianter (specialpilar) — pris per styck (sm).
export const TL_GEAR_GROUPS = [
  {
    id: 'tl-pilvarianter', namn: 'Pilvarianter (special)', type: 'gear', src: 'TL', items: [
      { id: 'tl-eldpil', namn: 'Eldpil (st)', vikt: null, pris: 2 },
      { id: 'tl-roterande-pil', namn: 'Roterande pil (st)', vikt: null, pris: 2 },
      { id: 'tl-klubbpil', namn: 'Klubbpil (st)', vikt: null, pris: 2 },
      { id: 'tl-hullingpil', namn: 'Pil med hullingar (st)', vikt: null, pris: 3 },
      { id: 'tl-giftpil', namn: 'Giftpil (st)', vikt: null, pris: 4 },
      { id: 'tl-repskarande-pil', namn: 'Repskärande pil (st)', vikt: null, pris: 2 },
      { id: 'tl-reppil', namn: 'Reppil (st)', vikt: null, pris: 2 },
      { id: 'tl-krokpil', namn: 'Krokpil (st)', vikt: null, pris: 10 },
      { id: 'tl-vislande-pil', namn: 'Vislande pil (st)', vikt: null, pris: 4 },
    ],
  },
]

export const EQUIPMENT_GROUPS = [
  ...WEAPON_GROUPS,
  ...ARMOUR_GROUPS,
  ...TL_WEAPON_GROUPS,
  ...V4_WEAPON_GROUPS,
  ...V4_ARMOUR_GROUPS,
  ...V4_GEAR_GROUPS,
  ...TL_GEAR_GROUPS,
]

// ── EP-kostnad för att höja FV (FV du har → FV du vill köpa) ────────────────
// Total EP-kostnad för att höja en primär färdighet eller yrkesfärdighet från
// nuvarande FV (rad) till önskat FV (kolumn). Transkriberad ur kostnadstabellen.
export const EP_FV_COST = {
  0: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 12, 12: 14, 13: 16, 14: 18, 15: 21, 16: 24, 17: 27, 18: 31, 19: 35, 20: 39, 21: 44 },
  1: { 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 8, 10: 9, 11: 11, 12: 13, 13: 15, 14: 17, 15: 20, 16: 23, 17: 26, 18: 30, 19: 34, 20: 38, 21: 43 },
  2: { 3: 1, 4: 2, 5: 3, 6: 4, 7: 5, 8: 6, 9: 7, 10: 8, 11: 10, 12: 12, 13: 14, 14: 16, 15: 19, 16: 22, 17: 25, 18: 29, 19: 33, 20: 37, 21: 42 },
  3: { 4: 1, 5: 2, 6: 3, 7: 4, 8: 5, 9: 6, 10: 7, 11: 9, 12: 11, 13: 13, 14: 15, 15: 18, 16: 21, 17: 24, 18: 28, 19: 32, 20: 36, 21: 41 },
  4: { 5: 1, 6: 2, 7: 3, 8: 4, 9: 5, 10: 6, 11: 8, 12: 10, 13: 12, 14: 14, 15: 17, 16: 20, 17: 23, 18: 27, 19: 31, 20: 35, 21: 40 },
  5: { 6: 1, 7: 2, 8: 3, 9: 4, 10: 5, 11: 7, 12: 9, 13: 11, 14: 13, 15: 16, 16: 19, 17: 22, 18: 26, 19: 30, 20: 34, 21: 39 },
  6: { 7: 1, 8: 2, 9: 3, 10: 4, 11: 6, 12: 8, 13: 10, 14: 12, 15: 15, 16: 18, 17: 21, 18: 25, 19: 29, 20: 33, 21: 38 },
  7: { 8: 1, 9: 2, 10: 3, 11: 5, 12: 7, 13: 9, 14: 11, 15: 14, 16: 17, 17: 20, 18: 24, 19: 28, 20: 32, 21: 37 },
  8: { 9: 1, 10: 2, 11: 4, 12: 6, 13: 8, 14: 10, 15: 13, 16: 16, 17: 19, 18: 23, 19: 27, 20: 31, 21: 36 },
  9: { 10: 1, 11: 3, 12: 5, 13: 7, 14: 9, 15: 12, 16: 15, 17: 18, 18: 22, 19: 26, 20: 30, 21: 35 },
  10: { 11: 2, 12: 4, 13: 6, 14: 8, 15: 11, 16: 14, 17: 17, 18: 21, 19: 25, 20: 29, 21: 34 },
  11: { 12: 2, 13: 4, 14: 6, 15: 9, 16: 12, 17: 15, 18: 19, 19: 23, 20: 27, 21: 32 },
  12: { 13: 2, 14: 4, 15: 7, 16: 10, 17: 13, 18: 17, 19: 21, 20: 25, 21: 30 },
  13: { 14: 2, 15: 5, 16: 8, 17: 11, 18: 15, 19: 19, 20: 23, 21: 28 },
  14: { 15: 3, 16: 6, 17: 9, 18: 13, 19: 17, 20: 21, 21: 26 },
  15: { 16: 3, 17: 6, 18: 10, 19: 14, 20: 18, 21: 23 },
  16: { 17: 3, 18: 7, 19: 11, 20: 15, 21: 20 },
  17: { 18: 4, 19: 8, 20: 12, 21: 17 },
  18: { 19: 4, 20: 8, 21: 13 },
  19: { 20: 4, 21: 9 },
  20: { 21: 5 },
}

// Total EP-kostnad att höja FV från `from` till `to` (0 om to <= from).
export function epRaiseCost(from, to) {
  if (to <= from) return 0
  const f = Math.min(Math.max(from, 0), 20)
  const t = Math.min(to, 21)
  const row = EP_FV_COST[f]
  if (!row) return 0
  if (row[t] != null) return row[t]
  return row[21] != null ? row[21] : 0
}
