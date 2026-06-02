// State shape, persistence, and the pure derivation for a Twilight: 2000
// character built with the archetype method.
import {
  ATTR_KEYS, RANK_DESC, DIE, rankIndex, BASE_INCREASES,
  SKILLS, SKILL_SPREAD, hitCapacity, stressCapacity,
  archetypeById, nationalityById, specialtyById, skillById,
} from './t2kData.js'

export const T2K_KEY = 't2k-character-creator'

const baseAttrs = () => ({ STR: 'C', AGL: 'C', INT: 'C', EMP: 'C' })

export function emptyState() {
  return {
    version: 1,
    archetypeId: null,
    nationality: 'american',
    branch: '',
    rank: '',
    name: '',
    nickname: '',
    attrs: baseAttrs(),
    skills: {}, // { skillId: 'A'|'B'|'C'|'D' }
    specialty: '',
    moralCode: '',
    bigDream: '',
    howMet: '',
    appearance: '',
    buddy: '',
    rads: null, // D6 starting permanent radiation
    notes: '',
  }
}

export function migrateState(s) {
  const base = emptyState()
  const out = { ...base, ...(s || {}) }
  out.attrs = { ...base.attrs, ...(s?.attrs || {}) }
  out.skills = { ...(s?.skills || {}) }
  return out
}

export function deriveCharacter(state) {
  const archetype = archetypeById(state.archetypeId)
  const nationality = nationalityById(state.nationality)

  // Attributes (baseline C; raise up to A, may drop one to D for an extra raise).
  const attrs = {}
  for (const k of ATTR_KEYS) attrs[k] = state.attrs?.[k] || 'C'
  let upSteps = 0, downSteps = 0
  for (const k of ATTR_KEYS) {
    const d = rankIndex(attrs[k]) - rankIndex('C')
    if (d > 0) upSteps += d; else if (d < 0) downSteps += -d
  }
  const increasesUsed = upSteps
  const increasesAllowed = BASE_INCREASES + Math.min(downSteps, 1)
  const attrValid = downSteps <= 1 && increasesUsed === increasesAllowed

  const hitCap = hitCapacity(attrs)
  const stressCap = stressCapacity(attrs)

  // Skills — assemble all twelve with their level/die, and validate the spread.
  const counts = { A: 0, B: 0, C: 0, D: 0 }
  let bSkillId = null
  for (const [id, lvl] of Object.entries(state.skills || {})) {
    if (counts[lvl] != null) counts[lvl] += 1
    if (lvl === 'B') bSkillId = id
  }
  const skills = SKILLS.map((sk) => {
    const level = state.skills?.[sk.id] || 'F'
    return { ...sk, level, attrDie: DIE[attrs[sk.attr]], skillDie: DIE[level] }
  })
  const spreadOk = counts.A === 0
    && counts.B === SKILL_SPREAD.B && counts.C === SKILL_SPREAD.C && counts.D === SKILL_SPREAD.D
  const bSkillOk = !!bSkillId && !!archetype && archetype.keySkills.includes(bSkillId)
  const skillsValid = spreadOk && bSkillOk

  const specialty = specialtyById(state.specialty)
  const cuf = archetype ? archetype.cuf : null
  const nameOk = !!(state.name || '').trim()

  const valid = !!archetype && attrValid && skillsValid && !!specialty && nameOk

  return {
    archetype, nationality,
    attrs, attrRankDesc: RANK_DESC,
    increasesUsed, increasesAllowed, decreasesUsed: downSteps, attrValid,
    hitCap, stressCap,
    skills, skillCounts: counts, spreadOk, bSkillOk, bSkillId, skillsValid,
    specialty, cuf,
    nameOk, valid,
    SKILL_SPREAD,
  }
}

export { skillById }
