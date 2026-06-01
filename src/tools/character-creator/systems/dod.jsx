// Drakar och Demoner game-system descriptor. Wraps the existing DoD library and
// step components into the generic shape the CharacterCreatorPage host expects.
import {
  CHARACTER_KEY, emptyState, migrateState, deriveCharacter,
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

export default {
  id: 'dod',
  name: 'Drakar och Demoner',
  short: 'Drakar och Demoner',
  title: 'Rollperson',
  subtitle: 'Drakar och Demoner — skapa en rollperson med bakgrundspoäng',
  resetConfirm: 'Börja om från början? All data om rollpersonen försvinner.',
  storageKey: CHARACTER_KEY,
  emptyState, migrateState, deriveCharacter,
  steps: STEPS,
  Budgets: DodBudgets,
  stepDone,
  getName: (state) => state.namn,
  getSummary: (state, derived) => `${derived.race ? derived.race.namn : '—'} · ${derived.prof ? derived.prof.namn : '—'}`,
}
