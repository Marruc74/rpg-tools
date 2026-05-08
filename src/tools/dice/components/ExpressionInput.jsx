import { useState } from 'react'
import { validateExpression } from '../lib/diceParser.js'

export default function ExpressionInput({ onRoll, onSavePreset, error }) {
  const [value, setValue] = useState('1d20+5')

  const validation = value.trim() ? validateExpression(value) : null

  const submit = (e) => {
    e?.preventDefault()
    if (validation || !value.trim()) return
    onRoll(value.trim())
  }

  return (
    <form className="expr-input" onSubmit={submit}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="e.g. 2d6+3, 1d20kh1, 4d6dl1"
        className="expr-input__field"
        spellCheck={false}
      />
      <button type="submit" className="expr-input__roll" disabled={!!validation}>
        Roll
      </button>
      <button
        type="button"
        className="expr-input__save"
        onClick={() => value.trim() && !validation && onSavePreset(value.trim())}
        disabled={!!validation || !value.trim()}
        title="Save this expression as a preset"
      >
        + Save
      </button>
      {(validation || error) && (
        <span className="expr-input__error">{validation || error}</span>
      )}
    </form>
  )
}
