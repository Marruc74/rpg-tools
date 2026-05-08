import { GRID_PX, MIN_W, MIN_H, PAGE_W, PAGE_H, snap, clamp } from '../lib/journalTemplate.js'

export default function BoxInspector({
  box,
  template,
  activePageIndex,
  onAddBox,
  onChangeBox,
  onChangeTemplate,
  onDeleteBox,
  onToggleTwoSided,
}) {
  const isMultiPage = template.pages.length > 1
  const sideLabel = activePageIndex === 0 ? 'front' : 'back'

  return (
    <aside className="inspector">
      <button type="button" className="inspector__add" onClick={onAddBox}>
        + Add box{isMultiPage ? ` to ${sideLabel}` : ''}
      </button>

      {box ? (
        <BoxPanel box={box} onChangeBox={onChangeBox} onDeleteBox={onDeleteBox} />
      ) : (
        <SheetPanel
          template={template}
          onChangeTemplate={onChangeTemplate}
          onToggleTwoSided={onToggleTwoSided}
        />
      )}
    </aside>
  )
}

function SheetPanel({ template, onChangeTemplate, onToggleTwoSided }) {
  return (
    <>
      <h2>Sheet</h2>
      <label className="field">
        <span>Sheet title</span>
        <input
          type="text"
          value={template.title}
          onChange={(e) => onChangeTemplate({ title: e.target.value })}
          placeholder="Session Notes"
        />
      </label>
      <label className="field">
        <span>Game</span>
        <input
          type="text"
          value={template.game ?? ''}
          onChange={(e) => onChangeTemplate({ game: e.target.value })}
          placeholder="e.g. Curse of Strahd"
        />
      </label>
      <label className="inspector__checkbox">
        <input
          type="checkbox"
          checked={template.pages.length > 1}
          onChange={(e) => onToggleTwoSided(e.target.checked)}
        />
        <span>Two-sided sheet</span>
      </label>
      <p className="hint">
        Click a box to edit its title and size. Add box drops a new one into
        empty space on the active side.
      </p>
    </>
  )
}

function BoxPanel({ box, onChangeBox, onDeleteBox }) {
  const update = (patch) => onChangeBox(box.id, patch)
  const setNumber = (key, value, min, max) => {
    const n = Number(value)
    if (Number.isNaN(n)) return
    update({ [key]: clamp(snap(n), min, max) })
  }

  return (
    <>
      <h2>Box</h2>
      <label className="field">
        <span>Title</span>
        <input
          type="text"
          value={box.title}
          onChange={(e) => update({ title: e.target.value })}
        />
      </label>

      <div className="inspector__grid">
        <label className="field">
          <span>X</span>
          <input
            type="number"
            step={GRID_PX}
            value={box.x}
            onChange={(e) => setNumber('x', e.target.value, 0, PAGE_W - box.w)}
          />
        </label>
        <label className="field">
          <span>Y</span>
          <input
            type="number"
            step={GRID_PX}
            value={box.y}
            onChange={(e) => setNumber('y', e.target.value, 0, PAGE_H - box.h)}
          />
        </label>
        <label className="field">
          <span>Width</span>
          <input
            type="number"
            step={GRID_PX}
            value={box.w}
            onChange={(e) => setNumber('w', e.target.value, MIN_W, PAGE_W - box.x)}
          />
        </label>
        <label className="field">
          <span>Height</span>
          <input
            type="number"
            step={GRID_PX}
            value={box.h}
            onChange={(e) => setNumber('h', e.target.value, MIN_H, PAGE_H - box.y)}
          />
        </label>
      </div>

      <p className="hint">
        Coordinates are in pixels on the virtual A4 (840 × 1188). Snap is{' '}
        {GRID_PX} px.
      </p>

      <button
        type="button"
        className="inspector__delete"
        onClick={() => {
          if (confirm(`Delete box "${box.title}"?`)) onDeleteBox(box.id)
        }}
      >
        Delete box
      </button>
    </>
  )
}
