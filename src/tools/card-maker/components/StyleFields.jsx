import { BORDER_WIDTHS, DEFAULT_STYLE } from '../lib/newCard.js'

export default function StyleFields({ style, onChange, onReset }) {
  const value = style ?? DEFAULT_STYLE
  const update = (patch) => onChange({ ...value, ...patch })

  return (
    <div className="style-row">
      <label className="field field--inline">
        <span>Border color</span>
        <input
          type="color"
          value={value.borderColor}
          onChange={(e) => update({ borderColor: e.target.value })}
        />
      </label>
      <label className="field field--inline">
        <span>Border width</span>
        <select
          value={value.borderWidth}
          onChange={(e) => update({ borderWidth: Number(e.target.value) })}
        >
          {BORDER_WIDTHS.map((w) => (
            <option key={w.value} value={w.value}>
              {w.label}
            </option>
          ))}
        </select>
      </label>
      <label className="field field--inline">
        <span>Card color</span>
        <input
          type="color"
          value={value.background}
          onChange={(e) => update({ background: e.target.value })}
        />
      </label>
      <label className="field field--inline">
        <span>Text color</span>
        <input
          type="color"
          value={value.textColor ?? '#1d1a16'}
          onChange={(e) => update({ textColor: e.target.value })}
        />
      </label>
      <label className="field field--inline">
        <span>Title color</span>
        <input
          type="color"
          value={value.titleColor ?? value.textColor ?? '#1d1a16'}
          onChange={(e) => update({ titleColor: e.target.value })}
        />
      </label>
      <button
        type="button"
        className="link"
        onClick={() => (onReset ? onReset() : onChange({ ...DEFAULT_STYLE }))}
        title="Reset to defaults"
      >
        Reset
      </button>
    </div>
  )
}
