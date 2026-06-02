// State shape, persistence helpers, and the pure derivation that turns a set of
// point-buy / dice choices into a complete Paranoia Troubleshooter dossier.
import {
  ATTR_KEYS, ATTR_MIN, ATTR_POINTS, SKILL_POINTS, MAX_RANK, SERVICE_ROLLS,
  SKILLS, SKILL_ATTRS, skillBase, lookupStrength, lookupEndurance,
  serviceGroupById, buildName, collectGrants,
  SERVICE_GROUPS, resolveTraining, MUTANT_POWERS, rollSociety, randomNameParts,
} from './paranoiaData.js'

const rint = (rng, n) => Math.floor(rng() * n)
const pick = (arr, rng) => arr[rint(rng, arr.length)]

export const PARANOIA_KEY = 'paranoia-character-creator'

const baseAttrs = () => ATTR_KEYS.reduce((o, k) => ({ ...o, [k]: ATTR_MIN }), {})

export function emptyState() {
  return {
    version: 1,
    genMode: 'points', // 'points' (60) | 'roll' (1d10 each)
    attrs: baseAttrs(),
    attrRolls: {}, // key -> rolled value (roll mode)
    rerollUsed: false,
    // Identity
    firstName: '',
    clearance: 'R', // Troubleshooters start Red
    sector: '',
    cloneNumber: 1,
    // Service group + training
    serviceGroupId: null,
    sgRolls: [], // [{ id, groupId, roll, grants, special, text }]
    // Bought skill ranks: { skillId: ranks }
    skillRanks: {},
    // Secrets
    mutantPower: '', // '' = none / undecided
    mutantRoll: null,
    society: '',
    societyRoll: null,
    societyRank: 1,
    treasonRegistered: false, // confessed mutant power for the yellow stripe?
    stuff: '', // one item rolled on the Stuff table (p.29)
    notes: '',
  }
}

export function migrateState(s) {
  const base = emptyState()
  const out = { ...base, ...(s || {}) }
  out.attrs = { ...base.attrs, ...(s?.attrs || {}) }
  out.attrRolls = { ...(s?.attrRolls || {}) }
  out.skillRanks = { ...(s?.skillRanks || {}) }
  out.sgRolls = Array.isArray(s?.sgRolls) ? s.sgRolls : []
  return out
}

const clampInt = (n, lo, hi) => Math.max(lo, Math.min(hi, Math.round(Number(n) || 0)))

// The core derivation. Pure: state -> full derived dossier + budgets + validity.
export function deriveCharacter(state) {
  const attrs = {}
  for (const k of ATTR_KEYS) attrs[k] = clampInt(state.attrs?.[k] ?? ATTR_MIN, ATTR_MIN, 10)

  // Skill bases per skill-bearing attribute.
  const skillBases = {}
  for (const k of SKILL_ATTRS) skillBases[k] = skillBase(attrs[k])

  // Ranks granted by service-group training (walks any auto-expanded sub-rolls).
  const sgRanks = {}
  for (const r of state.sgRolls || []) collectGrants(r, sgRanks)
  // Ranks bought with skill points.
  const boughtRanks = {}
  let skillPointsUsed = 0
  for (const [id, n] of Object.entries(state.skillRanks || {})) {
    const v = Math.max(0, Math.round(Number(n) || 0))
    if (v > 0) { boughtRanks[id] = v; skillPointsUsed += v }
  }

  // Compose each skill's value and flag any that exceed the five-rank cap.
  const skills = SKILLS.map((sk) => {
    const sg = sgRanks[sk.id] || 0
    const bought = boughtRanks[sk.id] || 0
    const ranks = sg + bought
    const base = skillBases[sk.attr] ?? 0
    return { ...sk, sgRanks: sg, boughtRanks: bought, ranks, base, value: base + ranks, overCap: ranks > MAX_RANK }
  })
  const overRankSkills = skills.filter((s) => s.overCap)

  // Derived physical stats.
  const str = lookupStrength(attrs.STR)
  const end = lookupEndurance(attrs.END)
  const derivedStats = { carry: str.carry, hth: str.hth, macho: end.macho, wounds: end.wounds }

  // Budgets.
  const attrPointsUsed = ATTR_KEYS.reduce((sum, k) => sum + attrs[k], 0)
  const sgRollsDone = (state.sgRolls || []).length

  // Validity.
  const isPoints = state.genMode === 'points'
  const pointsOk = isPoints ? attrPointsUsed === ATTR_POINTS : Object.keys(state.attrRolls || {}).length === ATTR_KEYS.length
  const powerOk = attrs.POW >= 1
  const skillsSpent = skillPointsUsed === SKILL_POINTS
  const noRankOver5 = overRankSkills.length === 0
  const serviceGroup = serviceGroupById(state.serviceGroupId)
  const sgComplete = !!serviceGroup && sgRollsDone >= SERVICE_ROLLS
  const sectorOk = /^[A-Za-z]{3}$/.test((state.sector || '').trim())
  const nameOk = !!(state.firstName || '').trim() && sectorOk
  const fullName = buildName(state)

  const valid = pointsOk && powerOk && skillsSpent && noRankOver5 && sgComplete && nameOk

  return {
    attrs, skillBases, skills, derivedStats,
    serviceGroup,
    attrPointsUsed, attrPointsTotal: ATTR_POINTS,
    skillPointsUsed, skillPointsTotal: SKILL_POINTS,
    sgRollsDone, sgRollsTotal: SERVICE_ROLLS,
    overRankSkills,
    fullName,
    isPoints,
    // validation flags
    pointsOk, powerOk, skillsSpent, noRankOver5, sgComplete, nameOk, sectorOk,
    valid,
  }
}

// Generate a complete, valid random Troubleshooter.
export function rollRandomCharacter(rng = Math.random) {
  const s = emptyState()
  const { firstName, sector } = randomNameParts(rng)
  s.firstName = firstName
  s.sector = sector
  s.clearance = 'R'
  s.cloneNumber = 1
  s.genMode = 'points'

  // Attributes: 60 points across 8, each 1–10, Power ≥ 1.
  const attrs = {}
  for (const k of ATTR_KEYS) attrs[k] = 1
  let rem = ATTR_POINTS - ATTR_KEYS.length
  let guard = 0
  while (rem > 0 && guard++ < 2000) {
    const k = pick(ATTR_KEYS, rng)
    if (attrs[k] < 10) { attrs[k] += 1; rem -= 1 }
  }
  s.attrs = attrs

  // Service group + five resolved training rolls.
  const g = pick(SERVICE_GROUPS, rng)
  s.serviceGroupId = g.id
  s.sgRolls = Array.from({ length: SERVICE_ROLLS }, () => resolveTraining(g.id, rng))

  // Spend all 10 skill points without exceeding 5 total ranks in any skill.
  const sg = {}
  for (const r of s.sgRolls) collectGrants(r, sg)
  const bought = {}
  let pts = SKILL_POINTS
  guard = 0
  while (pts > 0 && guard++ < 4000) {
    const sk = pick(SKILLS, rng)
    if ((sg[sk.id] || 0) + (bought[sk.id] || 0) < MAX_RANK) { bought[sk.id] = (bought[sk.id] || 0) + 1; pts -= 1 }
  }
  s.skillRanks = bought

  // Secrets (flavour — everyclone has them).
  const mr = 1 + rint(rng, 20); s.mutantRoll = mr; s.mutantPower = MUTANT_POWERS[mr - 1]
  const sr = 1 + rint(rng, 20); s.societyRoll = sr; s.society = rollSociety(sr); s.societyRank = 1
  return s
}
