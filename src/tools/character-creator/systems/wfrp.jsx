// Warhammer Fantasy Roleplay 4e game-system descriptor.
import {
  WFRP_KEY, emptyState, migrateState, deriveCharacter, rollRandomCharacter,
} from '../lib/wfrpLibrary.js'
import { CAREER_SKILL_ADVANCES } from '../lib/wfrpData.js'
import Meter from '../components/Meter.jsx'
import SpeciesStep from '../components/wfrp/SpeciesStep.jsx'
import CareerStep from '../components/wfrp/CareerStep.jsx'
import CharacteristicsStep from '../components/wfrp/CharacteristicsStep.jsx'
import SkillsTalentsStep from '../components/wfrp/SkillsTalentsStep.jsx'
import TrappingsStep from '../components/wfrp/TrappingsStep.jsx'
import DetailStep from '../components/wfrp/DetailStep.jsx'
import AdvancementStep from '../components/wfrp/AdvancementStep.jsx'
import WfrpSheetView from '../components/wfrp/WfrpSheetView.jsx'

const STEPS = [
  { id: 'species', label: 'Species', Comp: SpeciesStep },
  { id: 'career', label: 'Class & Career', Comp: CareerStep },
  { id: 'characteristics', label: 'Characteristics', Comp: CharacteristicsStep },
  { id: 'skills', label: 'Skills & Talents', Comp: SkillsTalentsStep },
  { id: 'trappings', label: 'Trappings', Comp: TrappingsStep },
  { id: 'detail', label: 'Detail', Comp: DetailStep },
  { id: 'advancement', label: 'Advancement', Comp: AdvancementStep, optional: true },
  { id: 'sheet', label: 'Character Sheet', Comp: WfrpSheetView },
]

function WfrpBudgets({ derived }) {
  return (
    <>
      <div className={`cc-xp ${derived.xpAvailable < 0 ? 'is-over' : ''}`}>
        <span>XP available</span>
        <strong>{derived.xpAvailable}</strong>
      </div>
      <div className="cc-xp cc-xp--sub">
        <span>Starting {derived.xpStarting} · spent {derived.xpSpentAdv}</span>
      </div>
      {derived.species && (
        <div className={`cc-krav ${derived.speciesAdvValid ? 'is-ok' : 'is-fail'}`}>
          Species advances +5: {derived.speciesAt5}/3 · +3: {derived.speciesAt3}/3
        </div>
      )}
      {derived.career && (
        <Meter
          label="Career advances"
          used={derived.careerAdvSpent}
          total={CAREER_SKILL_ADVANCES}
          over={derived.careerAdvSpent > CAREER_SKILL_ADVANCES || derived.careerOverCap.length > 0}
          unit="left"
        />
      )}
      {derived.extraAllowed > 0 && (
        <div className={`cc-krav ${derived.extraSpent === derived.extraAllowed ? 'is-ok' : 'is-fail'}`}>
          Fate/Resilience points: {derived.extraSpent}/{derived.extraAllowed}
        </div>
      )}
    </>
  )
}

function stepDone(id, state, derived) {
  switch (id) {
    case 'species': return !!state.speciesId
    case 'career': return !!state.careerId
    case 'characteristics': return derived.charsComplete
    case 'skills':
      return derived.speciesAdvValid
        && derived.careerAdvSpent === derived.CAREER_SKILL_ADVANCES
        && derived.careerOverCap.length === 0
        && !!state.careerTalent
    case 'trappings': return !!state.moneyRoll && derived.extraSpent === derived.extraAllowed
    case 'detail': return !!state.motivation
    // Optional step: only ✓ once XP has actually been spent or added (a fresh
    // or cascade-reset advancement state shows no checkmark).
    case 'advancement':
      return (derived.xpSpentAdv > 0 || (Number(state.xpAdded) || 0) > 0) && derived.xpAvailable >= 0
    default: return false
  }
}

// Which state fields each step owns — editing a step resets all later steps'
// fields (see cascadeReset in CharacterCreatorPage). `name`/`player` belong to
// no step and are never auto-reset. Note: the Advancement step may change
// careerId (career change in play) — cascades only trigger from the step the
// user is on, so that does not wipe the character.
const STEP_FIELDS = {
  species: ['speciesId', 'speciesRandom'],
  career: ['careerId', 'careerMethod'],
  characteristics: ['charBase', 'charRolls'],
  skills: ['speciesSkillAdv', 'careerSkillAdv', 'speciesTalentChoices', 'speciesRandomTalents', 'careerTalent'],
  trappings: ['fateExtra', 'resilienceExtra', 'moneyRoll', 'extraTrappings'],
  detail: ['motivation', 'shortAmbition', 'longAmbition', 'age', 'height', 'hair', 'eyes', 'background'],
  advancement: ['xpAdded', 'advChar', 'advSkill', 'boughtTalents', 'extraSkills', 'careerLevel', 'careerChangeXp'],
  sheet: [],
}
// Free-text fields: reset with their step, but typing in them never cascades.
const NO_CASCADE = ['extraTrappings', 'motivation', 'shortAmbition', 'longAmbition', 'age', 'height', 'hair', 'eyes', 'background']

export default {
  id: 'wfrp',
  name: 'Warhammer Fantasy Roleplay 4e',
  short: 'Warhammer 4e',
  title: 'Character',
  subtitle: 'Warhammer Fantasy Roleplay 4e — roll or choose, with starting XP',
  resetConfirm: 'Start over? All data about this character will be lost.',
  storageKey: WFRP_KEY,
  emptyState, migrateState, deriveCharacter, rollRandom: rollRandomCharacter,
  steps: STEPS,
  stepFields: STEP_FIELDS,
  noCascadeFields: NO_CASCADE,
  Budgets: WfrpBudgets,
  stepDone,
  getName: (state) => state.name,
  getSummary: (state, derived) => `${derived.species ? derived.species.name : '—'} · ${derived.career ? derived.career.name : '—'}`,
}
