// Twilight: 2000 (4th edition) game-system descriptor — archetype method.
import { T2K_KEY, emptyState, migrateState, deriveCharacter } from '../lib/t2kLibrary.js'
import IdentityStep from '../components/t2k/IdentityStep.jsx'
import AttributesStep from '../components/t2k/AttributesStep.jsx'
import SkillsStep from '../components/t2k/SkillsStep.jsx'
import SpecialtyStep from '../components/t2k/SpecialtyStep.jsx'
import ProfileStep from '../components/t2k/ProfileStep.jsx'
import T2kSheetView from '../components/t2k/T2kSheetView.jsx'

const STEPS = [
  { id: 'identity', label: 'Archetype', Comp: IdentityStep },
  { id: 'attributes', label: 'Attributes', Comp: AttributesStep },
  { id: 'skills', label: 'Skills', Comp: SkillsStep },
  { id: 'specialty', label: 'Specialty', Comp: SpecialtyStep },
  { id: 'profile', label: 'Profile', Comp: ProfileStep },
  { id: 'sheet', label: 'Character Sheet', Comp: T2kSheetView },
]

function T2kBudgets({ derived }) {
  return (
    <>
      <div className={`cc-krav ${derived.valid ? 'is-ok' : 'is-fail'}`}>
        {derived.valid ? 'Ready to deploy ✓' : 'Character incomplete'}
      </div>
      <div className={`cc-xp ${derived.attrValid ? '' : 'is-over'}`}>
        <span>Attribute increases</span>
        <strong>{derived.increasesUsed}/{derived.increasesAllowed}</strong>
      </div>
      <div className={`cc-xp ${derived.skillsValid ? '' : 'is-over'}`}>
        <span>Skills (B/C/D)</span>
        <strong>{derived.skillCounts.B}/{derived.SKILL_SPREAD.B} {derived.skillCounts.C}/{derived.SKILL_SPREAD.C} {derived.skillCounts.D}/{derived.SKILL_SPREAD.D}</strong>
      </div>
      {derived.cuf && (
        <div className="cc-krav is-ok">CUF {derived.cuf} · Specialty: {derived.specialty ? derived.specialty.name : '—'}</div>
      )}
    </>
  )
}

function stepDone(id, state, derived) {
  switch (id) {
    case 'identity': return !!state.archetypeId && derived.nameOk
    case 'attributes': return derived.attrValid
    case 'skills': return derived.skillsValid
    case 'specialty': return !!derived.specialty
    case 'profile': return state.rads != null
    default: return false
  }
}

export default {
  id: 't2k',
  name: 'Twilight: 2000 (4th Edition)',
  short: 'Twilight: 2000',
  title: 'Survivor',
  subtitle: 'Twilight: 2000 (4E) — the archetype method, for World War III that never was',
  resetConfirm: 'Start a new survivor? All data about this character will be lost.',
  storageKey: T2K_KEY,
  emptyState, migrateState, deriveCharacter,
  steps: STEPS,
  Budgets: T2kBudgets,
  stepDone,
  getName: (state) => state.name,
  getSummary: (state, derived) => `${derived.archetype ? derived.archetype.name : '—'} · ${derived.nationality ? derived.nationality.name : '—'}`,
}
