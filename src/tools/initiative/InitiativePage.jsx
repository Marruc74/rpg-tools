import './initiativePage.css'
import { useIndexedDBState } from '../../shared/hooks/useIndexedDBState.js'
import {
  INIT_KEY,
  emptyState,
  migrateState,
  newCombatant,
  sortByInitiative,
} from './lib/initiativeLibrary.js'
import CombatantRow from './components/CombatantRow.jsx'
import AddCombatantForm from './components/AddCombatantForm.jsx'

export default function InitiativePage() {
  const [state, setState, isReady] = useIndexedDBState(
    INIT_KEY,
    emptyState(),
    migrateState,
  )

  const sorted = sortByInitiative(state.combatants)

  const handleAdd = (data) => {
    const c = newCombatant(data)
    setState({ ...state, combatants: [...state.combatants, c] })
  }

  const handleChange = (next) =>
    setState({
      ...state,
      combatants: state.combatants.map((c) => (c.id === next.id ? next : c)),
    })

  const handleRemove = (id) => {
    const remaining = state.combatants.filter((c) => c.id !== id)
    setState({
      ...state,
      combatants: remaining,
      currentId: state.currentId === id ? null : state.currentId,
    })
  }

  const advanceToNext = () => {
    if (sorted.length === 0) return
    const currentIdx = sorted.findIndex((c) => c.id === state.currentId)
    if (currentIdx === -1) {
      setState({ ...state, currentId: sorted[0].id })
      return
    }
    const next = currentIdx + 1
    if (next < sorted.length) {
      setState({ ...state, currentId: sorted[next].id })
    } else {
      setState({ ...state, currentId: sorted[0].id, round: state.round + 1 })
    }
  }

  const goPrev = () => {
    if (sorted.length === 0) return
    const currentIdx = sorted.findIndex((c) => c.id === state.currentId)
    if (currentIdx <= 0) {
      if (state.round > 1) {
        setState({ ...state, currentId: sorted[sorted.length - 1].id, round: state.round - 1 })
      }
      return
    }
    setState({ ...state, currentId: sorted[currentIdx - 1].id })
  }

  const handleReset = () => {
    if (!confirm('Clear combatants and reset to round 1?')) return
    setState(emptyState())
  }

  const handleStart = () => {
    if (sorted.length === 0) return
    setState({ ...state, currentId: sorted[0].id, round: 1 })
  }

  if (!isReady) {
    return (
      <div className="init">
        <header className="init__header"><h1>Initiative</h1></header>
        <main className="init__main"><p className="hint">Loading…</p></main>
      </div>
    )
  }

  return (
    <div className="init">
      <header className="init__header">
        <h1>Initiative</h1>
        <div className="init__round">Round <strong>{state.round}</strong></div>
        <div className="init__buttons">
          <button onClick={handleStart} disabled={sorted.length === 0}>
            ⏮ Start (round 1)
          </button>
          <button onClick={goPrev} disabled={sorted.length === 0} title="Previous turn">◀</button>
          <button onClick={advanceToNext} disabled={sorted.length === 0} className="primary">
            Next turn ▶
          </button>
          <button onClick={handleReset} className="danger" disabled={sorted.length === 0 && state.round === 1}>
            Reset
          </button>
        </div>
      </header>

      <main className="init__main">
        <ul className="combatants">
          {sorted.length === 0 && (
            <li className="combatants__empty">
              <p className="hint">Add combatants below — type a name and an initiative roll.</p>
            </li>
          )}
          {sorted.map((c) => (
            <CombatantRow
              key={c.id}
              combatant={c}
              isCurrent={c.id === state.currentId}
              onChange={handleChange}
              onRemove={handleRemove}
            />
          ))}
        </ul>

        <AddCombatantForm onAdd={handleAdd} />
      </main>
    </div>
  )
}
