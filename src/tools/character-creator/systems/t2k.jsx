// Twilight: 2000 (4th edition) game-system descriptor — archetype method.
import { T2K_KEY, emptyState, migrateState, deriveCharacter } from '../lib/t2kLibrary.js'
import IdentityStep from '../components/t2k/IdentityStep.jsx'
import AttributesStep from '../components/t2k/AttributesStep.jsx'
import SkillsStep from '../components/t2k/SkillsStep.jsx'
import SpecialtyStep from '../components/t2k/SpecialtyStep.jsx'
import LifePathStep from '../components/t2k/LifePathStep.jsx'
import LifeSummaryStep from '../components/t2k/LifeSummaryStep.jsx'
import ProfileStep from '../components/t2k/ProfileStep.jsx'
import T2kSheetView from '../components/t2k/T2kSheetView.jsx'

// Step 3 and 4 differ by method: archetype uses Skills + Specialty; life path
// uses the term engine + a read-only summary.
const CoreStep = (p) => (p.state.method === 'lifepath' ? <LifePathStep {...p} /> : <SkillsStep {...p} />)
const DetailStep = (p) => (p.state.method === 'lifepath' ? <LifeSummaryStep {...p} /> : <SpecialtyStep {...p} />)

const STEPS = [
  { id: 'identity', label: 'Survivor', Comp: IdentityStep },
  { id: 'attributes', label: 'Attributes', Comp: AttributesStep },
  { id: 'core', label: 'Skills / Life Path', Comp: CoreStep },
  { id: 'detail', label: 'Specialty / Summary', Comp: DetailStep },
  { id: 'profile', label: 'Profile', Comp: ProfileStep },
  { id: 'sheet', label: 'Character Sheet', Comp: T2kSheetView },
]

function T2kBudgets({ state, derived }) {
  const lifepath = state.method === 'lifepath'
  return (
    <>
      <div className={`cc-krav ${derived.valid ? 'is-ok' : 'is-fail'}`}>
        {derived.valid ? 'Ready to deploy ✓' : 'Character incomplete'}
      </div>
      <div className={`cc-xp ${derived.attrValid ? '' : 'is-over'}`}>
        <span>Attribute increases</span>
        <strong>{derived.increasesUsed}/{derived.increasesAllowed}</strong>
      </div>
      {lifepath ? (
        <>
          <div className={`cc-xp ${derived.coreValid ? '' : 'is-over'}`}>
            <span>Life path</span>
            <strong>{derived.termsCount} term{derived.termsCount !== 1 ? 's' : ''}{derived.warOut ? ' +war' : ''}</strong>
          </div>
          <div className="cc-krav is-ok">Age {derived.age} · {derived.rank || 'civilian'} · CUF {derived.cuf}</div>
        </>
      ) : (
        <>
          <div className={`cc-xp ${derived.skillsValid ? '' : 'is-over'}`}>
            <span>Skills (B/C/D)</span>
            <strong>{derived.skillCounts.B}/{derived.SKILL_SPREAD.B} {derived.skillCounts.C}/{derived.SKILL_SPREAD.C} {derived.skillCounts.D}/{derived.SKILL_SPREAD.D}</strong>
          </div>
          {derived.cuf && <div className="cc-krav is-ok">CUF {derived.cuf} · Specialty: {derived.specialty ? derived.specialty.name : '—'}</div>}
        </>
      )}
    </>
  )
}

function stepDone(id, state, derived) {
  const lifepath = state.method === 'lifepath'
  switch (id) {
    case 'identity': return lifepath ? derived.nameOk : (!!state.archetypeId && derived.nameOk)
    case 'attributes': return derived.attrValid
    case 'core': return lifepath ? derived.coreValid : derived.skillsValid
    case 'detail': return lifepath ? derived.coreValid : !!derived.specialty
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
  getSummary: (state, derived) => (
    state.method === 'lifepath'
      ? `Life path · age ${derived.age} · ${derived.rank || (derived.nationality ? derived.nationality.name : '—')}`
      : `${derived.archetype ? derived.archetype.name : '—'} · ${derived.nationality ? derived.nationality.name : '—'}`
  ),
}
