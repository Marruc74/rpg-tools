// State shape, persistence, and the pure derivation for a Twilight: 2000
// character. Two methods are supported: the quick "archetype" method and the
// detailed "life path" method (build a backstory term by term).
import {
  ATTR_KEYS, RANK_DESC, DIE, rankIndex, BASE_INCREASES,
  SKILLS, SKILL_SPREAD, hitCapacity, stressCapacity,
  archetypeById, nationalityById, specialtyById, skillById,
} from './t2kData.js'
import { CHILDHOODS, childhoodById, careerById, START_AGE } from './t2kLifePathData.js'

export const T2K_KEY = 't2k-character-creator'

const baseAttrs = () => ({ STR: 'C', AGL: 'C', INT: 'C', EMP: 'C' })

export function emptyState() {
  return {
    version: 1,
    method: 'archetype', // 'archetype' | 'lifepath'
    // shared
    nationality: 'american',
    name: '', nickname: '',
    attrs: baseAttrs(),
    moralCode: '', bigDream: '', appearance: '', howMet: '', buddy: '', rads: null, notes: '',
    // archetype method
    archetypeId: null, branch: '', rank: '',
    skills: {}, // { skillId: 'A'|'B'|'C'|'D' }
    specialty: '',
    // life path method
    lpIncreases: null, // rolled 2D3 attribute-increase budget
    childhood: { id: null, skill: null, specialty: null },
    terms: [], // [{ id, careerId, increases:[{skill,steps}], promotion:{success,specialty}|null, ageRoll, agePenaltyAttr, warRoll }]
    atWar: { increases: [], specialty: null, draft: false },
    warOut: false,
  }
}

export function migrateState(s) {
  const base = emptyState()
  const out = { ...base, ...(s || {}) }
  out.attrs = { ...base.attrs, ...(s?.attrs || {}) }
  out.skills = { ...(s?.skills || {}) }
  out.childhood = { ...base.childhood, ...(s?.childhood || {}) }
  out.terms = Array.isArray(s?.terms) ? s.terms : []
  out.atWar = { ...base.atWar, ...(s?.atWar || {}) }
  return out
}

// ── helpers ─────────────────────────────────────────────────────────────────
const STEP_LETTER = ['F', 'D', 'C', 'B', 'A'] // skill steps: 0=F … 4=A
const reduceStep = (letter) => { const o = ['A', 'B', 'C', 'D']; const i = o.indexOf(letter); return o[Math.min(i + 1, 3)] } // toward D
const ENLISTED = ['Private', 'Private First Class', 'Corporal', 'Sergeant', 'Staff Sergeant', 'Sergeant First Class', 'Master Sergeant', 'First Sergeant', 'Sergeant Major']
const OFFICER = ['2nd Lieutenant', '1st Lieutenant', 'Captain', 'Major', 'Lieutenant Colonel', 'Colonel']
const rankPos = (r) => { let i = ENLISTED.indexOf(r); if (i >= 0) return i; i = OFFICER.indexOf(r); return i >= 0 ? 100 + i : -1 }
const higherRank = (a, b) => (rankPos(a) >= rankPos(b) ? a : b)
const advanceRank = (r) => { let i = ENLISTED.indexOf(r); if (i >= 0) return ENLISTED[Math.min(i + 1, ENLISTED.length - 1)]; i = OFFICER.indexOf(r); return i >= 0 ? OFFICER[Math.min(i + 1, OFFICER.length - 1)] : r }

function attrSteps(attrs) {
  let up = 0, down = 0
  for (const k of ATTR_KEYS) {
    const d = rankIndex(attrs[k]) - rankIndex('C')
    if (d > 0) up += d; else if (d < 0) down += -d
  }
  return { up, down }
}
function skillRow(id, level, attrs) {
  const sk = skillById(id)
  return { ...sk, level, attrDie: DIE[attrs[sk.attr]], skillDie: DIE[level] }
}

export function deriveCharacter(state) {
  const method = state.method || 'archetype'
  const nationality = nationalityById(state.nationality)
  const nameOk = !!(state.name || '').trim()
  const chosen = {}
  for (const k of ATTR_KEYS) chosen[k] = state.attrs?.[k] || 'C'

  if (method === 'lifepath') return deriveLifePath(state, { nationality, nameOk, chosen })

  // ── Archetype method ──────────────────────────────────────────────────────
  const archetype = archetypeById(state.archetypeId)
  const { up, down } = attrSteps(chosen)
  const increasesUsed = up
  const increasesAllowed = BASE_INCREASES + Math.min(down, 1)
  const attrValid = down <= 1 && increasesUsed === increasesAllowed

  const counts = { A: 0, B: 0, C: 0, D: 0 }
  let bSkillId = null
  for (const [id, lvl] of Object.entries(state.skills || {})) {
    if (counts[lvl] != null) counts[lvl] += 1
    if (lvl === 'B') bSkillId = id
  }
  const skills = SKILLS.map((sk) => skillRow(sk.id, state.skills?.[sk.id] || 'F', chosen))
  const spreadOk = counts.A === 0 && counts.B === SKILL_SPREAD.B && counts.C === SKILL_SPREAD.C && counts.D === SKILL_SPREAD.D
  const bSkillOk = !!bSkillId && !!archetype && archetype.keySkills.includes(bSkillId)
  const skillsValid = spreadOk && bSkillOk
  const specialty = specialtyById(state.specialty)
  const cuf = archetype ? archetype.cuf : null
  const valid = !!archetype && attrValid && skillsValid && !!specialty && nameOk

  return {
    method, archetype, nationality,
    attrs: chosen, chosenAttrs: chosen, attrRankDesc: RANK_DESC,
    increasesUsed, increasesAllowed, decreasesUsed: down, attrValid,
    hitCap: hitCapacity(chosen), stressCap: stressCapacity(chosen),
    skills, skillCounts: counts, spreadOk, bSkillOk, bSkillId, skillsValid,
    specialty, specialties: specialty ? [specialty] : [], cuf,
    gearCareer: null, gear: archetype ? archetype.gear : [],
    nameOk, valid, SKILL_SPREAD,
  }
}

// ── Life path method ──────────────────────────────────────────────────────
function deriveLifePath(state, { nationality, nameOk, chosen }) {
  const { up, down } = attrSteps(chosen)
  const lpIncreasesRolled = state.lpIncreases != null
  const increasesUsed = up
  const increasesAllowed = (state.lpIncreases || 0) + Math.min(down, 1)
  const attrValid = lpIncreasesRolled && down <= 1 && increasesUsed === increasesAllowed

  const terms = state.terms || []
  const atWar = state.atWar || { increases: [], specialty: null }
  const warOut = !!state.warOut

  // Final attributes = chosen, reduced by any age penalties recorded in terms.
  const finalAttrs = { ...chosen }
  for (const t of terms) if (t.agePenaltyAttr && finalAttrs[t.agePenaltyAttr]) finalAttrs[t.agePenaltyAttr] = reduceStep(finalAttrs[t.agePenaltyAttr])

  // Accumulate skill steps: childhood (1) + every term/At-War increase.
  const steps = {}
  const add = (id, n = 1) => { if (id) steps[id] = (steps[id] || 0) + n }
  const ch = state.childhood || {}
  add(ch.skill, 1)
  for (const t of terms) for (const inc of t.increases || []) add(inc.skill, inc.steps || 1)
  if (warOut) for (const inc of atWar.increases || []) add(inc.skill, inc.steps || 1)
  const skills = SKILLS.map((sk) => skillRow(sk.id, STEP_LETTER[Math.min(4, steps[sk.id] || 0)], finalAttrs))

  // Specialties (unique): childhood + promotions + At War.
  const specIds = []
  const pushSpec = (id) => { if (id && !specIds.includes(id)) specIds.push(id) }
  pushSpec(ch.specialty)
  for (const t of terms) if (t.promotion?.success) pushSpec(t.promotion.specialty)
  if (warOut) pushSpec(atWar.specialty)
  const specialties = specIds.map(specialtyById).filter(Boolean)

  // CUF: start D, +1 per promotion in a military/intel term (max A).
  let cufSteps = 0
  for (const t of terms) {
    const car = careerById(t.careerId)
    if (t.promotion?.success && car && (car.military || car.intel)) cufSteps += 1
  }
  const cuf = ['D', 'C', 'B', 'A'][Math.min(3, cufSteps)]

  // Military rank: first military term sets it; promotions advance it.
  let rank = null
  for (const t of terms) {
    const car = careerById(t.careerId)
    if (!car?.military) continue
    rank = rank == null ? car.startingRank : higherRank(rank, car.startingRank)
    if (t.promotion?.success) rank = advanceRank(rank)
  }

  let age = START_AGE
  for (const t of terms) age += t.ageRoll || 0

  const lastCareer = terms.length ? careerById(terms[terms.length - 1].careerId) : null
  const gearCareer = atWar.draft ? careerById('combat-arms') : lastCareer

  const childhood = childhoodById(ch.id)
  const childhoodDone = !!(childhood && ch.skill && ch.specialty)
  const atWarDone = warOut && (atWar.increases || []).filter((inc) => inc.skill).length >= 2
  const coreValid = childhoodDone && terms.length >= 1 && warOut && atWarDone
  const valid = attrValid && coreValid && nameOk && !!nationality

  return {
    method: 'lifepath', archetype: null, nationality,
    attrs: finalAttrs, chosenAttrs: chosen, attrRankDesc: RANK_DESC,
    increasesUsed, increasesAllowed, decreasesUsed: down, attrValid, lpIncreasesRolled,
    hitCap: hitCapacity(finalAttrs), stressCap: stressCapacity(finalAttrs),
    skills, specialties, specialty: null, cuf,
    childhood, childhoodDone, terms, atWar, warOut, atWarDone, age,
    rank, termsCount: terms.length, gearCareer, gear: gearCareer ? gearCareer.gear : [],
    coreValid, nameOk, valid,
  }
}

export { skillById }
