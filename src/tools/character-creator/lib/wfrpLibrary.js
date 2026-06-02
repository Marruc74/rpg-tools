// State shape, persistence helpers, and the pure derivation that turns a set of
// WFRP 4e creation choices into a complete character (characteristics, skills,
// talents, Wounds/Fate/Resilience, trappings, wealth and starting XP).
import {
  CHARACTERISTICS, charBonus, speciesById, careerById, classById,
  skillCharacteristic, SPECIES_SKILL_RULE, SPECIES_SKILL_ADVANCES,
  CAREER_SKILL_ADVANCES, CAREER_SKILL_CAP, STARTING_WEALTH, XP_BONUSES,
  costForCharAdvances, costForSkillAdvances, talentCost,
  CAREER_LEVEL_ADVANCES, CAREER_CHANGE_COST,
  SPECIES, CAREERS, rollRandomTalent,
} from './wfrpData.js'

const wrint = (rng, n) => Math.floor(rng() * n)
const wpick = (arr, rng) => arr[wrint(rng, arr.length)]
const wshuffle = (arr, rng) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = wrint(rng, i + 1);[a[i], a[j]] = [a[j], a[i]] } return a }

export const WFRP_KEY = 'wfrp-character-creator'

export function emptyState() {
  return {
    version: 1,
    name: '',
    player: '',
    // Step 1 — Species
    speciesId: null,
    speciesRandom: false, // accepted a random species roll → +20 XP
    // Step 2 — Class & Career
    careerId: null,
    careerMethod: 'choose', // 'choose' | 'firstRoll' | 'pickOfThree'
    // Step 3 — Characteristics. charBase is the 2d10 portion per characteristic
    // (before species modifier). charRolls keeps the original 2d10 results in
    // characteristic order so the XP method (keep / rearrange / manual) can be
    // derived rather than trusted.
    charBase: {}, // { WS: 11, ... }
    charRolls: [], // [ 11, 7, ... ] original 2d10 results, in CHARACTERISTICS order
    // Step 4 — Skills & Talents
    speciesSkillAdv: {}, // { skillName: advances } — 3 @ 5 and 3 @ 3
    careerSkillAdv: {}, // { skillName: advances } — 40 total, ≤10 each
    speciesTalentChoices: {}, // { pairIndex: chosenTalent }
    speciesRandomTalents: [], // rolled/chosen talent names
    careerTalent: null, // the one career talent learned at creation
    // Step 5 — Trappings & wealth
    fateExtra: 0,
    resilienceExtra: 0,
    moneyRoll: null, // { text, brass, silver, gold }
    extraTrappings: [], // [{ id, text }]
    // Step 6 — Detail
    motivation: '',
    shortAmbition: '',
    longAmbition: '',
    age: '',
    height: '',
    hair: '',
    eyes: '',
    background: '',
    // Step 7 — Advancement (spending XP after creation)
    xpAdded: 0, // experience earned in play, added on top of the starting bonus
    advChar: {}, // { charKey: purchasedAdvances }
    advSkill: {}, // { skillName: purchasedAdvances }
    boughtTalents: [], // [{ id, name }] — repeats allowed (times taken)
    extraSkills: [], // skill names acquired in advancement (non-career → ×2 cost)
    careerLevel: 0, // index into career.levels (0 = first level); raising it lifts Status
    careerChangeXp: 0, // XP locked in by career changes + level-ups of former careers
  }
}

export function migrateState(stored) {
  if (!stored || typeof stored !== 'object') return emptyState()
  const base = emptyState()
  return {
    ...base, ...stored,
    charBase: { ...(stored.charBase || {}) },
    charRolls: Array.isArray(stored.charRolls) ? stored.charRolls : [],
    speciesSkillAdv: { ...(stored.speciesSkillAdv || {}) },
    careerSkillAdv: { ...(stored.careerSkillAdv || {}) },
    speciesTalentChoices: { ...(stored.speciesTalentChoices || {}) },
    speciesRandomTalents: Array.isArray(stored.speciesRandomTalents) ? stored.speciesRandomTalents : [],
    extraTrappings: Array.isArray(stored.extraTrappings) ? stored.extraTrappings : [],
    advChar: { ...(stored.advChar || {}) },
    advSkill: { ...(stored.advSkill || {}) },
    boughtTalents: Array.isArray(stored.boughtTalents) ? stored.boughtTalents : [],
    extraSkills: Array.isArray(stored.extraSkills) ? stored.extraSkills : [],
    careerLevel: Number.isInteger(stored.careerLevel) ? stored.careerLevel : 0,
    careerChangeXp: Number(stored.careerChangeXp) || 0,
  }
}

// Parse a Status string like "Silver 3" into { tier, standing }.
export function parseStatus(status) {
  if (!status) return { tier: 'Brass', standing: 0 }
  const m = String(status).match(/^(Brass|Silver|Gold)\s*(\d+)/i)
  if (!m) return { tier: 'Brass', standing: 0 }
  return { tier: m[1][0].toUpperCase() + m[1].slice(1).toLowerCase(), standing: Number(m[2]) }
}

// Roll the starting wealth for a first-level Status (e.g. "Brass 3").
export function rollStartingWealth(status) {
  const { tier, standing } = parseStatus(status)
  const rule = STARTING_WEALTH[tier] || STARTING_WEALTH.Brass
  const out = { brass: 0, silver: 0, gold: 0 }
  if (rule.flat) {
    out.gold = standing
    return { ...out, text: `${standing} ${rule.unit}` }
  }
  let total = 0
  const dice = []
  for (let i = 0; i < rule.n * standing; i += 1) {
    const r = 1 + Math.floor(Math.random() * rule.d)
    dice.push(r); total += r
  }
  if (tier === 'Silver') out.silver = total
  else out.brass = total
  return { ...out, text: `${total} ${rule.unit} (${rule.n * standing}d${rule.d})`, dice }
}

const clampInt = (n, lo, hi) => Math.max(lo, Math.min(hi, Math.round(n || 0)))

// The core derivation. Pure: depends only on `state` + static data.
export function deriveCharacter(state) {
  const species = speciesById(state.speciesId)
  const career = careerById(state.careerId)
  const klass = career ? classById(career.classId) : null
  const careerL1 = career ? career.levels[0] : null

  // ── Characteristics ───────────────────────────────────────────────────────
  const finalChars = {}
  const bonuses = {}
  for (const c of CHARACTERISTICS) {
    const mod = species ? (species.mods[c.key] ?? 0) : 0
    const base = state.charBase[c.key]
    const hasBase = base != null && base !== ''
    const adv = state.advChar[c.key] || 0 // purchased characteristic advances (+1 each)
    const val = (hasBase ? Number(base) + mod : (species ? mod : 0)) + adv
    finalChars[c.key] = val
    bonuses[c.key] = charBonus(val)
  }
  const charsComplete = !!species && CHARACTERISTICS.every((c) => state.charBase[c.key] != null && state.charBase[c.key] !== '')

  // Derive the characteristic-generation method (for XP) by comparing the
  // assigned base values to the original rolls: identical order = keep (+50),
  // a reordering of the same values = rearrange (+25), anything else = manual.
  const rolls = Array.isArray(state.charRolls) ? state.charRolls : []
  let charMethod = 'manual'
  if (charsComplete && rolls.length === CHARACTERISTICS.length) {
    const baseArr = CHARACTERISTICS.map((c) => Number(state.charBase[c.key]))
    const sameOrder = baseArr.every((v, i) => v === rolls[i])
    const sorted = (a) => [...a].sort((x, y) => x - y).join(',')
    if (sameOrder) charMethod = 'keep'
    else if (sorted(baseArr) === sorted(rolls)) charMethod = 'rearrange'
  }

  // ── Wounds / Movement ───────────────────────────────────────────────────────
  const SB = bonuses.S, TB = bonuses.T, WPB = bonuses.WP
  const wounds = charsComplete
    ? (species && species.woundsNoSB ? 0 : SB) + 2 * TB + WPB
    : null
  const movement = species ? species.movement : null
  const walk = movement != null ? movement * 2 : null
  const run = movement != null ? movement * 4 : null

  // ── Fate / Resilience ───────────────────────────────────────────────────────
  const extraAllowed = species ? species.extra : 0
  const fateExtra = clampInt(state.fateExtra, 0, extraAllowed)
  const resilienceExtra = clampInt(state.resilienceExtra, 0, Math.max(0, extraAllowed - fateExtra))
  const fate = species ? species.fate + fateExtra : 0
  const resilience = species ? species.resilience + resilienceExtra : 0
  const extraSpent = fateExtra + resilienceExtra

  // ── Skills ──────────────────────────────────────────────────────────────────
  const speciesSkills = species ? species.skills : []
  const careerSkills = career ? career.skills : []
  const extraSkills = state.extraSkills || []
  const skillNames = []
  const seen = new Set()
  // Include every skill the character has touched so that skills from a former
  // career (after a career change) and any advanced skill persist in the list.
  for (const n of [
    ...speciesSkills, ...careerSkills, ...extraSkills,
    ...Object.keys(state.careerSkillAdv || {}),
    ...Object.keys(state.advSkill || {}),
  ]) {
    if (n && !seen.has(n)) { seen.add(n); skillNames.push(n) }
  }
  const skills = skillNames.map((name) => {
    const fromSpecies = speciesSkills.includes(name)
    const fromCareer = careerSkills.includes(name)
    const isAdded = extraSkills.includes(name)
    // Anything that isn't a species or CURRENT-career skill is "non-career" and
    // costs double to advance (p.48) — that covers manually-added skills and
    // skills carried over from a former career after a career change.
    const nonCareer = !fromSpecies && !fromCareer
    const creationAdv = (state.speciesSkillAdv[name] || 0) + (state.careerSkillAdv[name] || 0)
    const purchasedAdv = state.advSkill[name] || 0
    const adv = creationAdv + purchasedAdv
    const ck = skillCharacteristic(name)
    const cv = ck ? finalChars[ck] : null
    const source = fromCareer ? 'career' : fromSpecies ? 'species' : isAdded ? 'extra' : 'prior'
    return {
      name, char: ck, charValue: cv,
      advances: adv, creationAdv, purchasedAdv,
      total: cv != null ? cv + adv : null,
      source, nonCareer,
    }
  })

  // ── Talents ───────────────────────────────────────────────────────────────
  const talents = []
  if (species) {
    for (const t of species.talents.fixed) talents.push({ name: t, source: 'species' })
    species.talents.choices.forEach((pair, i) => {
      const chosen = state.speciesTalentChoices[i]
      if (chosen) talents.push({ name: chosen, source: 'species' })
    })
    for (const t of state.speciesRandomTalents) if (t) talents.push({ name: t, source: 'random' })
  }
  if (state.careerTalent) talents.push({ name: state.careerTalent, source: 'career' })

  // Talents gained at creation (counted for talent "times taken" pricing).
  const creationTalentCount = {}
  for (const t of talents) creationTalentCount[t.name] = (creationTalentCount[t.name] || 0) + 1
  for (const t of (state.boughtTalents || [])) {
    if (t && t.name) talents.push({ name: t.name, source: 'bought' })
  }

  // ── Trappings & wealth ──────────────────────────────────────────────────────
  const trappings = []
  if (klass) for (const t of klass.trappings) trappings.push({ text: t, source: 'class' })
  for (const it of (state.extraTrappings || [])) trappings.push({ text: it.text, source: 'custom' })

  // ── XP earned (becomes starting XP) ──────────────────────────────────────────
  let xpStarting = 0
  if (state.speciesRandom) xpStarting += XP_BONUSES.species
  if (state.careerMethod === 'firstRoll') xpStarting += XP_BONUSES.careerFirstRoll
  else if (state.careerMethod === 'pickOfThree') xpStarting += XP_BONUSES.careerPickOfThree
  if (charMethod === 'keep') xpStarting += XP_BONUSES.charKeep
  else if (charMethod === 'rearrange') xpStarting += XP_BONUSES.charRearrange

  // ── Career level & Status ──────────────────────────────────────────────────────
  const maxLevelIdx = career ? career.levels.length - 1 : 0
  const careerLevelIdx = career ? clampInt(state.careerLevel, 0, maxLevelIdx) : 0
  const careerLevelInfo = career ? career.levels[careerLevelIdx] : null
  const status = careerLevelInfo ? careerLevelInfo.status : null

  // ── Advancement XP economy ────────────────────────────────────────────────────
  const xpTotal = xpStarting + (Number(state.xpAdded) || 0)
  let xpSpentAdv = 0
  // Characteristic advances (creation gives 0, so band starts at 0).
  for (const c of CHARACTERISTICS) xpSpentAdv += costForCharAdvances(state.advChar[c.key] || 0)
  // Skill advances (band uses total advances incl. the free creation advances).
  // Non-career (added) skills cost double.
  for (const sk of skills) xpSpentAdv += costForSkillAdvances(sk.creationAdv, sk.purchasedAdv) * (sk.nonCareer ? 2 : 1)
  // Talents — price rises with each copy already held (creation + earlier buys).
  const talentSeen = { ...creationTalentCount }
  for (const t of (state.boughtTalents || [])) {
    if (!t || !t.name) continue
    const already = talentSeen[t.name] || 0
    xpSpentAdv += talentCost(already)
    talentSeen[t.name] = already + 1
  }
  // Level-ups within the CURRENT career (still adjustable), plus XP already
  // locked in by previous career changes / former-career level-ups.
  xpSpentAdv += careerLevelIdx * CAREER_CHANGE_COST + (Number(state.careerChangeXp) || 0)
  const xpAvailable = xpTotal - xpSpentAdv
  const xp = xpStarting // backwards-compatible alias

  // ── Career-level completion (rules to raise Status) ──────────────────────────────
  // Need `req` advances in all the level's characteristics, in eight of its
  // skills, and at least one of its talents. We don't model the exact 3 career
  // characteristics, so we approximate "all characteristics" as "≥3 at the
  // threshold" (every career advances exactly three).
  const req = CAREER_LEVEL_ADVANCES[Math.min(careerLevelIdx, CAREER_LEVEL_ADVANCES.length - 1)]
  const charsAtReq = CHARACTERISTICS.filter((c) => (state.advChar[c.key] || 0) >= req).length
  const careerSkillObjs = skills.filter((s) => careerSkills.includes(s.name))
  const skillsAtReq = careerSkillObjs.filter((s) => s.advances >= req).length
  const skillsNeeded = Math.min(8, careerSkills.length || 8)
  // At least one talent belonging to the CURRENT career (creation pick counts
  // only while you're still in that career; after a change you must earn one).
  const hasCareerTalent = !!career && talents.some((t) => career.talents.includes(t.name))
  const completion = {
    req,
    charsAtReq, charsNeeded: 3,
    skillsAtReq, skillsNeeded,
    talentOk: hasCareerTalent,
    charsOk: charsAtReq >= 3,
    skillsOk: skillsAtReq >= skillsNeeded,
  }
  const careerCompleted = !!career && completion.charsOk && completion.skillsOk && completion.talentOk
  const canAdvanceLevel = careerCompleted && careerLevelIdx < maxLevelIdx && xpAvailable >= CAREER_CHANGE_COST

  // ── Budgets / validation ──────────────────────────────────────────────────────
  // Species advances: rule is 3 skills @ +5 and 3 @ +3.
  const speciesAdvEntries = Object.entries(state.speciesSkillAdv).filter(([, v]) => v > 0)
  const speciesAdvSpent = speciesAdvEntries.reduce((a, [, v]) => a + v, 0)
  const speciesAt5 = speciesAdvEntries.filter(([, v]) => v === 5).length
  const speciesAt3 = speciesAdvEntries.filter(([, v]) => v === 3).length
  const speciesAdvValid = speciesAt5 === SPECIES_SKILL_RULE.at5
    && speciesAt3 === SPECIES_SKILL_RULE.at3
    && speciesAdvEntries.length === SPECIES_SKILL_RULE.at5 + SPECIES_SKILL_RULE.at3

  // Career advances: ≤40 total, ≤10 per skill.
  const careerAdvSpent = Object.values(state.careerSkillAdv).reduce((a, v) => a + (v || 0), 0)
  const careerOverCap = Object.entries(state.careerSkillAdv).filter(([, v]) => v > CAREER_SKILL_CAP).map(([k]) => k)

  const talentChoicesDone = species ? species.talents.choices.every((_, i) => !!state.speciesTalentChoices[i]) : false
  const randomTalentsDone = species ? state.speciesRandomTalents.filter(Boolean).length >= species.talents.random : false

  const issues = []
  if (!species) issues.push('No species chosen')
  if (!career) issues.push('No career chosen')
  if (!charsComplete) issues.push('Characteristics not set')
  if (species && !speciesAdvValid) issues.push(`Species advances must be 3 skills at +5 and 3 at +3 (${speciesAdvSpent}/${SPECIES_SKILL_ADVANCES})`)
  if (careerAdvSpent !== CAREER_SKILL_ADVANCES) issues.push(`Career advances: ${careerAdvSpent}/${CAREER_SKILL_ADVANCES} allocated`)
  if (careerOverCap.length) issues.push(`Over the ${CAREER_SKILL_CAP}-advance cap: ${careerOverCap.join(', ')}`)
  if (species && !talentChoicesDone) issues.push('Resolve species talent choices')
  if (species && !randomTalentsDone) issues.push(`Roll ${species.talents.random} random talent(s)`)
  if (career && !state.careerTalent) issues.push('Choose a career talent')
  if (extraAllowed && extraSpent !== extraAllowed) issues.push(`Distribute Fate/Resilience extra points (${extraSpent}/${extraAllowed})`)
  if (xpAvailable < 0) issues.push(`Overspent XP by ${-xpAvailable}`)

  return {
    species, career, klass, careerL1,
    finalChars, bonuses, charsComplete, charMethod,
    wounds, movement, walk, run,
    fate, fortune: fate, resilience, resolve: resilience,
    extraAllowed, fateExtra, resilienceExtra, extraSpent,
    skills, talents, trappings,
    xp, xpStarting, xpTotal, xpSpentAdv, xpAvailable,
    status, careerLevelIdx, careerLevelInfo, maxLevelIdx,
    completion, careerCompleted, canAdvanceLevel, careerChangeCost: CAREER_CHANGE_COST,
    speciesAdvSpent, speciesAt5, speciesAt3, speciesAdvValid,
    careerAdvSpent, careerOverCap,
    SPECIES_SKILL_ADVANCES, CAREER_SKILL_ADVANCES, CAREER_SKILL_CAP,
    issues,
    valid: issues.length === 0,
  }
}

// Generate a complete, valid random WFRP character.
export function rollRandomCharacter(rng = Math.random) {
  const s = emptyState()
  const sp = wpick(SPECIES, rng)
  const car = wpick(CAREERS, rng)
  s.speciesId = sp.id
  s.careerId = car.id
  s.careerMethod = 'choose'

  // Characteristics: 2d10 each, in CHARACTERISTICS order.
  const rolls = []
  const charBase = {}
  for (const c of CHARACTERISTICS) {
    const v = (1 + wrint(rng, 10)) + (1 + wrint(rng, 10))
    rolls.push(v)
    charBase[c.key] = v
  }
  s.charRolls = rolls
  s.charBase = charBase

  // Species skill advances: SPECIES_SKILL_RULE.at5 @ +5, .at3 @ +3 from species skills.
  const skills = wshuffle(sp.skills, rng)
  const ssa = {}
  skills.slice(0, SPECIES_SKILL_RULE.at5).forEach((n) => { ssa[n] = 5 })
  skills.slice(SPECIES_SKILL_RULE.at5, SPECIES_SKILL_RULE.at5 + SPECIES_SKILL_RULE.at3).forEach((n) => { ssa[n] = 3 })
  s.speciesSkillAdv = ssa

  // Career skill advances: exactly CAREER_SKILL_ADVANCES total, ≤ cap each.
  const csa = {}
  car.skills.forEach((n) => { csa[n] = 0 })
  let rem = CAREER_SKILL_ADVANCES
  let guard = 0
  while (rem > 0 && guard++ < 2000) {
    const n = wpick(car.skills, rng)
    if (csa[n] < CAREER_SKILL_CAP) { csa[n] += 1; rem -= 1 }
  }
  s.careerSkillAdv = csa

  // Talents: resolve every species choice pair, roll the random talents, pick a career talent.
  const tc = {}
  ;(sp.talents.choices || []).forEach((pair, i) => { tc[i] = wpick(pair, rng) })
  s.speciesTalentChoices = tc
  const rt = []
  for (let i = 0; i < (sp.talents.random || 0); i++) { const t = rollRandomTalent(); rt.push(t?.name || t) }
  s.speciesRandomTalents = rt
  s.careerTalent = wpick(car.talents, rng)

  // Distribute the species' extra Fate/Resilience points exactly.
  const extra = sp.extra || 0
  const f = wrint(rng, extra + 1)
  s.fateExtra = f
  s.resilienceExtra = extra - f

  s.motivation = 'Survive the grim and perilous world.'
  return s
}
