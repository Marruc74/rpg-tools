// Drakar och Demoner game-system descriptor. Wraps the existing DoD library and
// step components into the generic shape the CharacterCreatorPage host expects.
import {
  CHARACTER_KEY, emptyState, migrateState, deriveCharacter, rollRandomCharacter,
} from '../lib/characterLibrary.js'
import Meter from '../components/Meter.jsx'
import RaceStep from '../components/RaceStep.jsx'
import ProfessionStep from '../components/ProfessionStep.jsx'
import AttributesStep from '../components/AttributesStep.jsx'
import SkillsStep from '../components/SkillsStep.jsx'
import BackgroundStep from '../components/BackgroundStep.jsx'
import EquipmentStep from '../components/EquipmentStep.jsx'
import SheetView from '../components/SheetView.jsx'

const STEPS = [
  { id: 'ras', label: 'Ras', Comp: RaceStep },
  { id: 'yrke', label: 'Yrke', Comp: ProfessionStep },
  { id: 'grund', label: 'Grundegenskaper', Comp: AttributesStep },
  { id: 'fardigheter', label: 'Färdigheter', Comp: SkillsStep },
  { id: 'bakgrund', label: 'Bakgrund', Comp: BackgroundStep },
  { id: 'utrustning', label: 'Utrustning', Comp: EquipmentStep },
  { id: 'rollformular', label: 'Rollformulär', Comp: SheetView },
]

function DodBudgets({ derived }) {
  return (
    <>
      <Meter label="Bakgrundspoäng (BP)" used={derived.bpSpent} total={derived.tier.bp} over={derived.bpRemaining < 0} unit="kvar" />
      <Meter label="Erfarenhetspoäng (EP)" used={derived.epSpent} total={derived.epPool} over={derived.epRemaining < 0} unit="kvar" />
      {derived.prof && (
        <div className={`cc-krav ${derived.kravFail.length ? 'is-fail' : 'is-ok'}`}>
          {derived.kravFail.length === 0
            ? `Krav för ${derived.prof.namn} uppfyllda`
            : `Krav saknas: ${derived.kravFail.map((k) => `${k.attr} ${k.has}/${k.min}`).join(', ')}`}
        </div>
      )}
    </>
  )
}

function stepDone(id, state, derived) {
  switch (id) {
    case 'ras': return !!state.raceId
    case 'yrke': return !!state.yrkeId
    case 'grund': return derived.bpRemaining >= 0 && derived.kravFail.length === 0 && !!state.raceId
    case 'fardigheter': return derived.yrkesChosen > 0
    case 'bakgrund': return !!state.socialRoll && !!state.kapitalRoll
    case 'utrustning': return (state.inventory || []).length > 0
    default: return false
  }
}

// Which state fields each step owns — editing a step resets all later steps'
// fields (see cascadeReset in CharacterCreatorPage). Identity fields (namn,
// spelare, kon) belong to no step and are never auto-reset.
const STEP_FIELDS = {
  ras: ['raceId', 'tier'],
  yrke: ['yrkeId'],
  grund: ['base', 'stoMod'],
  fardigheter: ['yrkesSkills', 'fvBoost', 'spells', 'specialiseringar'],
  bakgrund: [
    'alderId', 'alderAr', 'socialBP', 'socialRoll', 'kapitalBP', 'kapitalRoll',
    'svardshandBP', 'svardshandRoll', 'synBP', 'synRoll', 'horselBP', 'horselRoll',
    'formagor', 'vildMagi', 'familjar', 'utseende', 'bakgrund',
  ],
  utrustning: ['inventory'],
  rollformular: [],
}
// Free-text fields: reset with their step, but typing in them never cascades.
const NO_CASCADE = ['alderAr', 'familjar', 'utseende', 'bakgrund']

export default {
  id: 'dod',
  name: 'Drakar och Demoner',
  short: 'Drakar och Demoner',
  title: 'Rollperson',
  subtitle: 'Drakar och Demoner — skapa en rollperson med bakgrundspoäng',
  resetConfirm: 'Börja om från början? All data om rollpersonen försvinner.',
  storageKey: CHARACTER_KEY,
  emptyState, migrateState, deriveCharacter, rollRandom: rollRandomCharacter,
  steps: STEPS,
  stepFields: STEP_FIELDS,
  noCascadeFields: NO_CASCADE,
  Budgets: DodBudgets,
  stepDone,
  getName: (state) => state.namn,
  getSummary: (state, derived) => `${derived.race ? derived.race.namn : '—'} · ${derived.prof ? derived.prof.namn : '—'}`,
}
