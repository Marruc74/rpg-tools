import { useMemo, useState } from 'react'
import './characterCreator.css'
import { useIndexedDBState } from '../../shared/hooks/useIndexedDBState.js'
import {
  CHARACTER_KEY, emptyState, migrateState, deriveCharacter,
} from './lib/characterLibrary.js'
import { START_BP } from './lib/dodData.js'
import RaceStep from './components/RaceStep.jsx'
import ProfessionStep from './components/ProfessionStep.jsx'
import AttributesStep from './components/AttributesStep.jsx'
import SkillsStep from './components/SkillsStep.jsx'
import BackgroundStep from './components/BackgroundStep.jsx'
import EquipmentStep from './components/EquipmentStep.jsx'
import SheetView from './components/SheetView.jsx'

const STEPS = [
  { id: 'ras', namn: 'Ras', Comp: RaceStep },
  { id: 'yrke', namn: 'Yrke', Comp: ProfessionStep },
  { id: 'grund', namn: 'Grundegenskaper', Comp: AttributesStep },
  { id: 'fardigheter', namn: 'Färdigheter', Comp: SkillsStep },
  { id: 'bakgrund', namn: 'Bakgrund', Comp: BackgroundStep },
  { id: 'utrustning', namn: 'Utrustning', Comp: EquipmentStep },
  { id: 'rollformular', namn: 'Rollformulär', Comp: SheetView },
]

function Meter({ label, used, total, over }) {
  const pct = total > 0 ? Math.min(100, (used / total) * 100) : 0
  return (
    <div className={`cc-meter ${over ? 'cc-meter--over' : ''}`}>
      <div className="cc-meter__top">
        <span>{label}</span>
        <span className="cc-meter__num">{total - used} kvar</span>
      </div>
      <div className="cc-meter__track">
        <div className="cc-meter__fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="cc-meter__sub">{used} / {total} spenderade</div>
    </div>
  )
}

export default function CharacterCreatorPage() {
  const [state, setState, ready] = useIndexedDBState(
    CHARACTER_KEY, emptyState(), migrateState,
  )
  const [stepIdx, setStepIdx] = useState(0)

  const derived = useMemo(() => deriveCharacter(state), [state])

  if (!ready) {
    return (
      <div className="cc">
        <header className="cc__header"><h1>Rollperson</h1></header>
        <main className="cc__main"><p className="hint">Laddar…</p></main>
      </div>
    )
  }

  const update = (patch) => setState((s) => ({ ...s, ...patch }))
  const Active = STEPS[stepIdx].Comp

  const handleReset = () => {
    if (!confirm('Börja om från början? All data om rollpersonen försvinner.')) return
    setState(emptyState())
    setStepIdx(0)
  }

  const stepDone = (id) => {
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

  return (
    <div className="cc">
      <header className="cc__header">
        <div>
          <h1>Rollperson</h1>
          <p className="cc__sub">Drakar och Demoner — skapa en rollperson med bakgrundspoäng</p>
        </div>
        <button className="cc-btn cc-btn--ghost" onClick={handleReset}>Börja om</button>
      </header>

      <main className="cc__main">
        <aside className="cc__side">
          <nav className="cc-steps">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                className={`cc-steps__item ${i === stepIdx ? 'is-active' : ''} ${stepDone(s.id) ? 'is-done' : ''}`}
                onClick={() => setStepIdx(i)}
              >
                <span className="cc-steps__no">{i + 1}</span>
                <span className="cc-steps__label">{s.namn}</span>
                {stepDone(s.id) && <span className="cc-steps__check">✓</span>}
              </button>
            ))}
          </nav>

          <div className="cc-budgets">
            <Meter label="Bakgrundspoäng (BP)" used={derived.bpSpent} total={derived.tier.bp} over={derived.bpRemaining < 0} />
            <Meter label="Erfarenhetspoäng (EP)" used={derived.epSpent} total={derived.epPool} over={derived.epRemaining < 0} />
            {derived.prof && (
              <div className={`cc-krav ${derived.kravFail.length ? 'is-fail' : 'is-ok'}`}>
                {derived.kravFail.length === 0
                  ? `Krav för ${derived.prof.namn} uppfyllda`
                  : `Krav saknas: ${derived.kravFail.map((k) => `${k.attr} ${k.has}/${k.min}`).join(', ')}`}
              </div>
            )}
          </div>
        </aside>

        <section className="cc__pane">
          <Active state={state} update={update} setState={setState} derived={derived} />
          <div className="cc__nav">
            <button className="cc-btn cc-btn--ghost" disabled={stepIdx === 0} onClick={() => setStepIdx((i) => i - 1)}>
              ← Föregående
            </button>
            <button className="cc-btn" disabled={stepIdx === STEPS.length - 1} onClick={() => setStepIdx((i) => i + 1)}>
              Nästa →
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
