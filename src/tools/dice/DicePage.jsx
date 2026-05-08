import { useState } from 'react'
import './dicePage.css'
import { useIndexedDBState } from '../../shared/hooks/useIndexedDBState.js'
import {
  DICE_KEY,
  emptyLibrary,
  migrateLibrary,
  newPreset,
  addHistoryEntry,
} from './lib/diceLibrary.js'
import { rollExpression, validateExpression } from './lib/diceParser.js'
import QuickRollPad from './components/QuickRollPad.jsx'
import ExpressionInput from './components/ExpressionInput.jsx'
import PresetList from './components/PresetList.jsx'
import RollHistory from './components/RollHistory.jsx'

export default function DicePage() {
  const [library, setLibrary, isReady] = useIndexedDBState(
    DICE_KEY,
    emptyLibrary(),
    migrateLibrary,
  )
  const [error, setError] = useState(null)

  const performRoll = (expression, label) => {
    try {
      const result = rollExpression(expression)
      const entry = { expression, label, ...result }
      setLibrary(addHistoryEntry(library, entry))
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleClearHistory = () => {
    if (!confirm('Clear roll history?')) return
    setLibrary({ ...library, history: [] })
  }

  const handleAddPreset = (preset) =>
    setLibrary({ ...library, presets: [...library.presets, newPreset(preset)] })

  const handleUpdatePreset = (id, patch) =>
    setLibrary({
      ...library,
      presets: library.presets.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })

  const handleRemovePreset = (id) =>
    setLibrary({
      ...library,
      presets: library.presets.filter((p) => p.id !== id),
    })

  if (!isReady) {
    return (
      <div className="dice">
        <header className="dice__header"><h1>Dice</h1></header>
        <main className="dice__main"><p className="hint">Loading…</p></main>
      </div>
    )
  }

  return (
    <div className="dice">
      <header className="dice__header">
        <h1>Dice</h1>
      </header>

      <main className="dice__main">
        <section className="dice__roller">
          <QuickRollPad onRoll={(expr) => performRoll(expr, expr)} />
          <ExpressionInput
            onRoll={(expr) => performRoll(expr, expr)}
            onSavePreset={(expr) => handleAddPreset({ name: expr, expression: expr })}
            error={error}
          />
        </section>

        <PresetList
          presets={library.presets}
          onRoll={(p) => performRoll(p.expression, p.name)}
          onUpdate={handleUpdatePreset}
          onRemove={handleRemovePreset}
          onAdd={() => handleAddPreset({ name: 'New roll', expression: '1d20' })}
        />

        <RollHistory history={library.history} onClear={handleClearHistory} />
      </main>
    </div>
  )
}
