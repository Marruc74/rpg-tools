import {
  GRID_PX,
  MIN_W,
  MIN_H,
  PAGE_W,
  PAGE_H,
  MAX_TRACKER_COUNT,
  snap,
  clamp,
  newTracker,
} from '../lib/journalTemplate.js'

export default function BoxInspector({
  box,
  template,
  activePageIndex,
  onAddBox,
  onChangeBox,
  onChangeTemplate,
  onDeleteBox,
  onDuplicateBox,
  onBringToFront,
  onSendToBack,
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
        <BoxPanel
          box={box}
          onChangeBox={onChangeBox}
          onDeleteBox={onDeleteBox}
          onDuplicateBox={onDuplicateBox}
          onBringToFront={onBringToFront}
          onSendToBack={onSendToBack}
        />
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

function BoxPanel({ box, onChangeBox, onDeleteBox, onDuplicateBox, onBringToFront, onSendToBack }) {
  const update = (patch) => onChangeBox(box.id, patch)
  const setNumber = (key, value, min, max) => {
    const n = Number(value)
    if (Number.isNaN(n)) return
    update({ [key]: clamp(snap(n), min, max) })
  }

  const trackers = box.trackers ?? []

  const updateTracker = (id, patch) =>
    update({
      trackers: trackers.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })

  const removeTracker = (id) =>
    update({ trackers: trackers.filter((t) => t.id !== id) })

  const addTracker = () =>
    update({ trackers: [...trackers, newTracker({ label: '', count: 10 })] })

  return (
    <>
      <h2>Box</h2>
      <div className="inspector__box-actions">
        <button type="button" onClick={() => onDuplicateBox(box.id)} title="Duplicate (Ctrl+D)">
          ⧉ Duplicate
        </button>
        <button type="button" onClick={() => onBringToFront(box.id)} title="Bring to front">
          ↑ Front
        </button>
        <button type="button" onClick={() => onSendToBack(box.id)} title="Send to back">
          ↓ Back
        </button>
      </div>
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

      <div className="inspector__trackers">
        <div className="inspector__trackers-head">
          <span>Trackers</span>
          <button type="button" className="link" onClick={addTracker}>
            + Add tracker
          </button>
        </div>
        {trackers.length === 0 && (
          <p className="hint">
            No trackers. Add one to put a row of empty checkboxes inside this
            box (e.g. HP, Arrows, Rations).
          </p>
        )}
        {trackers.map((t) => (
          <div key={t.id} className="tracker-row">
            <input
              type="text"
              value={t.label}
              onChange={(e) => updateTracker(t.id, { label: e.target.value })}
              placeholder="Label (e.g. HP)"
              className="tracker-row__label"
            />
            <input
              type="number"
              min="1"
              max={MAX_TRACKER_COUNT}
              value={t.count}
              onChange={(e) =>
                updateTracker(t.id, {
                  count: clamp(Number(e.target.value) || 1, 1, MAX_TRACKER_COUNT),
                })
              }
              className="tracker-row__count"
            />
            <button
              type="button"
              className="icon-button"
              onClick={() => removeTracker(t.id)}
              title="Remove tracker"
              aria-label="Remove tracker"
            >
              ×
            </button>
          </div>
        ))}
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
