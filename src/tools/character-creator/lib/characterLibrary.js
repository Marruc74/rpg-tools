// State shape, persistence helpers, and the pure derivation that turns a set
// of point-buy choices into a complete Drakar och Demoner rollperson.
import {
  START_BP, ATTRS, ATTR_BUY_COST, ATTR_MIN,
  STO_RAISE_COST, STO_LOWER_GAIN,
  RACES, PROFESSIONS, PRIMARY_SKILLS, SECONDARY_SKILLS,
  bcFromAttr, bodyLocationKP, skadebonus, forflyttning,
  socialStand, startkapital, AGE_CATEGORIES, epRaiseCost,
  POWER_TIERS, TIER_EP, TIER_MAXFV, ALV_TIER_EP, ALV_TIER_MAXFV, synHorsel,
  MAGIC_SCHOOLS, MAGIC_DISCIPLINES, SPELLS, spellById, spellLearnCost,
  vildMagiCost, FAMILJAR_BP,
} from './dodData.js'

export const CHARACTER_KEY = 'dod-character-creator'

export function emptyState() {
  return {
    version: 1,
    tier: 'vanlig',
    namn: '',
    spelare: '',
    kon: 'Man',
    raceId: null,
    yrkeId: null,
    alderId: 'mogen',
    alderAr: '',
    base: { STY: ATTR_MIN, FYS: ATTR_MIN, SMI: ATTR_MIN, INT: ATTR_MIN, PSY: ATTR_MIN, KAR: ATTR_MIN },
    stoMod: 0,
    socialBP: 0,
    socialRoll: null, // { dice, total }
    kapitalBP: 0,
    kapitalRoll: null, // { dice, total }
    svardshandBP: 0,
    svardshandRoll: null, // { dice, total }
    synRoll: null, synBP: 0, // { total }
    horselRoll: null, horselBP: 0,
    formagor: [], // [{ id, bp, dice, total, text }]
    yrkesSkills: [], // [{ key, skillId, label }]
    fvBoost: {}, // { key: extraPointsBoughtWithEP }
    spells: [], // [spellId] — lärda besvärjelser (kostar EP, se spellLearnCost)
    vildMagi: 0, // antal vilda förmågor (Magikerns Handbok); 0 = ingen vild magi
    familjar: '', // bunden familjar (typ/namn); kostar FAMILJAR_BP om ifylld
    specialiseringar: [], // [underskolanamn] — specialiserade underskolor (en per huvudskola)
    utseende: '',
    bakgrund: '',
    inventory: [], // [{ id, namn, typ, stat, pris, qty }]
  }
}

export function migrateState(stored) {
  if (!stored || typeof stored !== 'object') return emptyState()
  return {
    ...emptyState(), ...stored,
    base: { ...emptyState().base, ...(stored.base || {}) },
    inventory: Array.isArray(stored.inventory) ? stored.inventory : [],
    spells: Array.isArray(stored.spells) ? stored.spells : [],
    specialiseringar: Array.isArray(stored.specialiseringar) ? stored.specialiseringar : [],
  }
}

// Lookups
export const raceById = (id) => RACES.find((r) => r.id === id) || null
export const profById = (id) => PROFESSIONS.find((p) => p.id === id) || null
const primaryById = (id) => PRIMARY_SKILLS.find((s) => s.id === id) || null
const secondaryById = (id) => SECONDARY_SKILLS.find((s) => s.id === id) || null
export const skillById = (id) => primaryById(id) || secondaryById(id) || null

// Secondary skills a profession may choose as yrkesfärdigheter, with the
// per-profession max count for group skills (språk, vapen, …).
export function availableYrkesSkills(yrkeId) {
  if (!yrkeId) return []
  const prof = profById(yrkeId)
  // Krigarens Handbok-yrken har en explicit pool av tillåtna färdigheter.
  if (prof && Array.isArray(prof.pool)) {
    const picks = prof.groupPicks || {}
    return prof.pool
      .map((id) => secondaryById(id))
      .filter(Boolean)
      .map((s) => ({ ...s, maxPicks: s.group ? (picks[s.id] ?? Infinity) : 1 }))
  }
  return SECONDARY_SKILLS.filter(
    (s) => s.yrken === 'Alla' || (Array.isArray(s.yrken) && s.yrken.includes(yrkeId)),
  ).map((s) => ({
    ...s,
    maxPicks: s.group ? (s.picks ? s.picks[yrkeId] ?? Infinity : Infinity) : 1,
  }))
}

function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)) }

// Läsa/Skriva modersmål — baschans by social class + INT.
function lasSkrivaModersmal(socialNamn, INT) {
  const high = INT >= 15
  const s = socialNamn || ''
  const adel = s.includes('adel')
  if (s.includes('överklass') || adel) return high ? 20 : 16
  if (s.includes('Högre medelklass')) return high ? 16 : 11
  if (s.includes('Lägre medelklass')) return high ? 11 : 5
  if (s.includes('Högre underklass')) return high ? 5 : 1
  return high ? 1 : 0
}

// The core derivation. Returns finalAttrs, derived stats, BP/EP budgets,
// the full skill list with FV/BC, and validation (krav, budget overruns).
export function deriveCharacter(state) {
  const race = raceById(state.raceId)
  const prof = profById(state.yrkeId)
  const age = AGE_CATEGORIES.find((a) => a.id === state.alderId) || AGE_CATEGORIES[1]
  const tier = POWER_TIERS.find((t) => t.id === state.tier) || POWER_TIERS[0]
  // Alvsläkter använder fasta EP/Max-FV per kraftnivå (oberoende av ålder).
  const isAlv = race?.source === 'alver'
  const epPool = isAlv
    ? (ALV_TIER_EP[tier.id] ?? ALV_TIER_EP.vanlig)
    : (TIER_EP[tier.id] || TIER_EP.vanlig)[age.id]
  const maxFV = isAlv
    ? (ALV_TIER_MAXFV[tier.id] ?? ALV_TIER_MAXFV.vanlig)
    : (TIER_MAXFV[tier.id] || TIER_MAXFV.vanlig)[age.id]

  // Syn & Hörsel (Krigarens Handbok) — bonus på vissa primära färdigheter.
  const synBonus = state.synRoll ? synHorsel(state.synRoll.total + (state.synBP || 0)).bonus : 0
  const horselBonus = state.horselRoll ? synHorsel(state.horselRoll.total + (state.horselBP || 0)).bonus : 0
  const senses = { 'upptacka-fara': synBonus + horselBonus, 'finna-dolda-ting': synBonus }

  // Final grundegenskaper = köpt råvärde + rasmod + åldersmod.
  const finalAttrs = {}
  for (const a of ATTRS) {
    const base = state.base[a] ?? ATTR_MIN
    const rmod = race ? race.mod[a] ?? 0 : 0
    const amod = age.mod[a] ?? 0
    finalAttrs[a] = Math.max(1, base + rmod + amod)
  }
  // STO: rasens normalvärde + vald modifikation, inom rasens intervall.
  let sto = 0
  if (race) sto = clamp(race.sto.normal + state.stoMod, race.sto.min, race.sto.max)
  finalAttrs.STO = sto

  const totalKP = sto ? Math.ceil((finalAttrs.FYS + sto) / 2) : 0
  const derived = {
    totalKP,
    body: totalKP ? bodyLocationKP(totalKP) : null,
    skadebonus: sto ? skadebonus(finalAttrs.STY + sto) : '—',
    forflyttning: sto ? forflyttning(sto + finalAttrs.FYS + finalAttrs.SMI) : '—',
  }

  // Socialt stånd & startkapital (roll + spenderade BP).
  const socialTotal = state.socialRoll
    ? state.socialRoll.total + state.socialBP + (race ? race.social : 0)
    : null
  const social = socialTotal != null ? socialStand(socialTotal) : null
  const kapitalTotal = state.kapitalRoll
    ? state.kapitalRoll.total + state.kapitalBP + Math.ceil(state.socialBP / 2)
    : null
  const baseKapital = kapitalTotal != null ? startkapital(kapitalTotal) : null
  const slutKapital = baseKapital != null ? Math.round(baseKapital * age.kapMult) : null

  // ── Färdigheter ───────────────────────────────────────────────────────
  // Race FV bonuses keyed by skill name.
  const raceBonus = {}
  if (race) for (const b of race.bonus) raceBonus[b.skill] = b

  const skills = []
  const epCost = []

  // Primära färdigheter — alla rollpersoner har dem.
  for (const s of PRIMARY_SKILLS) {
    let bc
    if (s.id === 'tala-modersmal') {
      bc = social && (social.namn.includes('överklass') || social.namn.includes('adel')) ? 20 : 16
    } else if (s.id === 'lasa-skriva-modersmal') {
      bc = lasSkrivaModersmal(social ? social.namn : '', finalAttrs.INT)
    } else {
      bc = bcFromAttr(finalAttrs[s.grund])
    }
    const rb = raceBonus[s.namn]
    const raceFV = rb && rb.asPrimary ? rb.fv : 0
    const raceAdd = rb && !rb.asPrimary ? rb.fv : 0
    const boost = state.fvBoost[s.id] || 0
    const floor = Math.max(bc, raceFV) + raceAdd
    const sensesAdd = senses[s.id] || 0
    skills.push({
      key: s.id, namn: s.namn, grund: s.grund, typ: 'Primär',
      bc, boost, raceAdd, sensesAdd, fv: floor + boost + sensesAdd,
    })
    if (boost) epCost.push(epRaiseCost(floor, floor + boost))
  }

  // Yrkesfärdigheter.
  for (const ys of state.yrkesSkills) {
    const s = secondaryById(ys.skillId)
    if (!s) continue
    const rb = raceBonus[s.namn]
    const bc = bcFromAttr(finalAttrs[s.grund])
    const raceFV = rb && rb.asPrimary ? rb.fv : 0
    const raceAdd = rb && !rb.asPrimary ? rb.fv : 0
    const boost = state.fvBoost[ys.key] || 0
    const floor = Math.max(bc, raceFV) + raceAdd
    skills.push({
      key: ys.key, skillId: ys.skillId, label: ys.label,
      namn: ys.label ? `${s.namn} (${ys.label})` : s.namn,
      grund: s.grund, typ: 'Yrkesfärdighet', bc, boost, raceAdd,
      fv: floor + boost,
    })
    if (boost) epCost.push(epRaiseCost(floor, floor + boost))
  }

  // Dvärgens Geologi (primär) om den inte redan finns som yrkesfärdighet.
  if (race && raceBonus['Geologi'] && !skills.some((s) => s.namn.startsWith('Geologi'))) {
    const geo = secondaryById('geologi')
    skills.push({
      key: 'geologi', namn: 'Geologi', grund: geo.grund, typ: 'Primär (ras)',
      bc: raceBonus['Geologi'].fv, boost: 0, raceAdd: 0, fv: raceBonus['Geologi'].fv,
    })
  }

  // ── Magi & besvärjelser ─────────────────────────────────────────────────
  // Kända magiskolor härleds ur de magiskole-yrkesfärdigheter rollpersonen valt
  // (etiketten = skolans namn). FV i skolan styr vilka besvärjelser som kan läras.
  // Magiskolorna är Animism, Elementarmagi och Mentalism. Underskolor (Djurhamn,
  // Eldmagi, …) ingår i sin huvudskola: man behärskar dem gratis upp till FV 7,
  // men kan specialisera sig på EN underskola per huvudskola för att nå högre.
  const FREE_DISC_FV = 7
  const knownMain = [] // [{ id, namn, fv }]
  for (const sk of skills) {
    if (sk.skillId !== 'magiskola') continue
    const main = MAGIC_SCHOOLS.find((s) => !s.general && s.namn.toLowerCase() === (sk.label || '').trim().toLowerCase())
    if (main && !knownMain.some((k) => k.id === main.id)) knownMain.push({ id: main.id, namn: main.namn, fv: sk.fv, register: !!main.register, sourceBook: main.sourceBook || null })
  }
  const mainFv = (id) => knownMain.find((s) => s.id === id)?.fv ?? null
  const allmanFv = knownMain.length ? Math.max(...knownMain.map((s) => s.fv)) : null
  // Behåll bara specialiseringar i underskolor vars huvudskola är känd, högst en per huvudskola.
  const specialiseringar = []
  for (const namn of state.specialiseringar || []) {
    const disc = MAGIC_DISCIPLINES.find((d) => d.namn === namn)
    if (!disc || mainFv(disc.skola) == null) continue
    if (specialiseringar.some((s) => s.skola === disc.skola)) continue
    specialiseringar.push({ namn: disc.namn, skola: disc.skola })
  }
  const isSpecialised = (discNamn) => specialiseringar.some((s) => s.namn === discNamn)
  // FV som styr en besvärjelse. Underskola: huvudskolans FV om specialiserad,
  // annars min(huvudskolans FV, 7).
  const spellGovFv = (sp) => {
    if (sp.skola === 'allman') return allmanFv
    const m = mainFv(sp.skola)
    if (m == null) return null
    if (!sp.disciplin) return m
    return isSpecialised(sp.disciplin) ? m : Math.min(m, FREE_DISC_FV)
  }

  const magicSpells = []
  let spellEp = 0
  for (const id of state.spells || []) {
    const sp = spellById(id)
    if (!sp) continue
    const govFv = spellGovFv(sp)
    const cost = spellLearnCost(sp.niva)
    const overCap = govFv == null || sp.niva > govFv
    spellEp += cost
    magicSpells.push({ ...sp, govFv, cost, overCap })
  }
  const magic = {
    capable: knownMain.length > 0,
    schools: knownMain,
    specialiseringar,
    freeDiscFv: FREE_DISC_FV,
    allmanFv,
    spells: magicSpells,
    spellEp,
    overSpells: magicSpells.filter((s) => s.overCap),
  }

  // ── Budgetar ──────────────────────────────────────────────────────────
  let bpSpent = 0
  if (race) bpSpent += race.cost
  for (const a of ATTRS) bpSpent += ATTR_BUY_COST[state.base[a] ?? ATTR_MIN] ?? 0
  if (state.stoMod > 0) bpSpent += STO_RAISE_COST[state.stoMod] || 0
  if (state.stoMod < 0) bpSpent -= STO_LOWER_GAIN[-state.stoMod] || 0
  bpSpent += (state.socialBP || 0) + (state.kapitalBP || 0) + (state.svardshandBP || 0)
  bpSpent += (state.synBP || 0) + (state.horselBP || 0)
  for (const f of state.formagor) bpSpent += f.bp || 0
  bpSpent += vildMagiCost(state.vildMagi || 0)
  if ((state.familjar || '').trim()) bpSpent += FAMILJAR_BP
  const bpRemaining = tier.bp - bpSpent

  const epSpent = epCost.reduce((a, b) => a + b, 0) + spellEp
  const epRemaining = epPool - epSpent

  // Utrustning — spenderas av startkapital (silvermynt), inte BP/EP.
  const inventory = state.inventory || []
  const utrustningKostnad = inventory.reduce((a, it) => a + (it.pris || 0) * (it.qty || 1), 0)
  const silverKvar = slutKapital != null ? slutKapital - utrustningKostnad : null

  // ── Validering ──────────────────────────────────────────────────────────
  const kravFail = []
  if (prof) {
    for (const [a, min] of Object.entries(prof.krav)) {
      if (finalAttrs[a] < min) kravFail.push({ attr: a, min, has: finalAttrs[a] })
    }
  }
  const yrkesLimit = prof ? prof.yrkesCount : 0
  const yrkesChosen = state.yrkesSkills.length
  const overFV = skills.filter((s) => s.boost && (s.fv - (s.sensesAdd || 0)) > maxFV)

  return {
    race, prof, age, tier, epPool, synBonus, horselBonus,
    finalAttrs, derived, social, socialTotal,
    baseKapital, slutKapital, kapitalTotal, skills,
    bpSpent, bpRemaining, epSpent, epRemaining,
    utrustningKostnad, silverKvar, magic,
    isMagiker: !!(prof && (prof.magic || prof.source === 'mh')),
    isAlv,
    kravFail, yrkesLimit, yrkesChosen, overFV, maxFV,
    valid:
      bpRemaining >= 0 && epRemaining >= 0 && kravFail.length === 0 &&
      !!race && !!prof && yrkesChosen <= yrkesLimit && overFV.length === 0 &&
      magic.overSpells.length === 0,
  }
}
