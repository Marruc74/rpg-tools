// Paranoia (the Fifth Edition) game-system descriptor.
import {
  PARANOIA_KEY, emptyState, migrateState, deriveCharacter, rollRandomCharacter,
} from '../lib/paranoiaLibrary.js'
import { clearanceByLetter } from '../lib/paranoiaData.js'
import IdentityStep from '../components/paranoia/IdentityStep.jsx'
import AttributesStep from '../components/paranoia/AttributesStep.jsx'
import ServiceGroupStep from '../components/paranoia/ServiceGroupStep.jsx'
import SkillsStep from '../components/paranoia/SkillsStep.jsx'
import SecretsStep from '../components/paranoia/SecretsStep.jsx'
import ParanoiaSheetView from '../components/paranoia/ParanoiaSheetView.jsx'

const STEPS = [
  { id: 'identity', label: 'Designation', Comp: IdentityStep },
  { id: 'attributes', label: 'Attributes', Comp: AttributesStep },
  { id: 'service', label: 'Service Group', Comp: ServiceGroupStep },
  { id: 'skills', label: 'Skills', Comp: SkillsStep },
  { id: 'secrets', label: 'Secret Stuff', Comp: SecretsStep },
  { id: 'sheet', label: 'Dossier', Comp: ParanoiaSheetView },
]

function ParanoiaBudgets({ derived }) {
  return (
    <>
      <div className={`cc-krav ${derived.valid ? 'is-ok' : 'is-fail'}`}>
        {derived.valid ? 'Cleared for duty ✓' : 'Clone not yet cleared'}
      </div>
      <div className={`cc-xp ${derived.pointsOk ? '' : 'is-over'}`}>
        <span>Attribute points</span>
        <strong>{derived.isPoints ? `${derived.attrPointsUsed}/${derived.attrPointsTotal}` : (derived.pointsOk ? 'rolled' : '—')}</strong>
      </div>
      <div className={`cc-xp ${derived.skillsSpent && derived.noRankOver5 ? '' : 'is-over'}`}>
        <span>Skill points</span>
        <strong>{derived.skillPointsUsed}/{derived.skillPointsTotal}</strong>
      </div>
      <div className={`cc-krav ${derived.sgComplete ? 'is-ok' : 'is-fail'}`}>
        Service training: {derived.sgRollsDone}/{derived.sgRollsTotal} rolls
      </div>
    </>
  )
}

function stepDone(id, state, derived) {
  switch (id) {
    case 'identity': return derived.nameOk
    case 'attributes': return derived.pointsOk && derived.powerOk
    case 'service': return derived.sgComplete
    case 'skills': return derived.skillsSpent && derived.noRankOver5
    case 'secrets': return true // optional by design (the GM assigns these anyway)
    default: return false
  }
}

export default {
  id: 'paranoia',
  name: 'Paranoia (the Fifth Edition)',
  short: 'Paranoia',
  title: 'Troubleshooter',
  subtitle: 'Paranoia, the Fifth Edition — roll or allocate, stay happy, trust no one',
  resetConfirm: 'Terminate this clone and start a fresh one? All data will be lost (this is normal).',
  storageKey: PARANOIA_KEY,
  emptyState, migrateState, deriveCharacter, rollRandom: rollRandomCharacter,
  steps: STEPS,
  Budgets: ParanoiaBudgets,
  stepDone,
  getName: (state) => state.firstName,
  getSummary: (state, derived) => {
    const clr = clearanceByLetter(state.clearance).name
    const sg = derived.serviceGroup ? derived.serviceGroup.name : '—'
    return `${clr} · ${sg}${state.society ? ` · ${state.society}` : ''}`
  },
}
