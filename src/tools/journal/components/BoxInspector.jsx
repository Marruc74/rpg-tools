import { useState } from 'react'
import {
  GRID_PX,
  MIN_W,
  MIN_H,
  MAX_TRACKER_COUNT,
  MAX_GRID_DIM,
  CONTENT_KINDS,
  snap,
  clamp,
  newContentItem,
} from '../lib/journalTemplate.js'
import { BOX_PRESETS } from '../lib/presets.js'

export default function BoxInspector({
  box,
  selectionCount,
  template,
  pageDims,
  activePageIndex,
  onAddBox,
  onAddPreset,
  onChangeBox,
  onChangeTemplate,
  onDeleteBox,
  onDuplicateBox,
  onBringToFront,
  onSendToBack,
  onAddPage,
  onRemovePage,
  onDeleteSelected,
  onDuplicateSelected,
}) {
  const isMultiPage = template.pages.length > 1
  const pageLabel =
    template.pages.length === 2
      ? activePageIndex === 0 ? 'front' : 'back'
      : `page ${activePageIndex + 1}`

  const renderPanel = () => {
    if (selectionCount > 1) {
      return (
        <MultiPanel
          count={selectionCount}
          onDeleteSelected={onDeleteSelected}
          onDuplicateSelected={onDuplicateSelected}
        />
      )
    }
    if (box) {
      return (
        <BoxPanel
          box={box}
          pageDims={pageDims}
          onChangeBox={onChangeBox}
          onDeleteBox={onDeleteBox}
          onDuplicateBox={onDuplicateBox}
          onBringToFront={onBringToFront}
          onSendToBack={onSendToBack}
        />
      )
    }
    return (
      <SheetPanel
        template={template}
        activePageIndex={activePageIndex}
        onChangeTemplate={onChangeTemplate}
        onAddPage={onAddPage}
        onRemovePage={onRemovePage}
      />
    )
  }

  return (
    <aside className="inspector">
      <button type="button" className="inspector__add" onClick={onAddBox}>
        + Add box{isMultiPage ? ` to ${pageLabel}` : ''}
      </button>
      <PresetPicker onPick={onAddPreset} />
      {renderPanel()}
    </aside>
  )
}

function PresetPicker({ onPick }) {
  const [value, setValue] = useState('')
  return (
    <div className="inspector__preset">
      <select value={value} onChange={(e) => setValue(e.target.value)}>
        <option value="">+ Add preset…</option>
        {BOX_PRESETS.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <button
        type="button"
        disabled={!value}
        onClick={() => {
          onPick(value)
          setValue('')
        }}
      >
        Add
      </button>
    </div>
  )
}

function ContentEditor({ items, onUpdate, onRemove, onMove, onAdd }) {
  const [addKind, setAddKind] = useState('')
  return (
    <div className="inspector__content">
      <div className="inspector__content-head">
        <span>Content</span>
      </div>
      {items.length === 0 && (
        <p className="hint">
          No content. Add a tracker (checkboxes), lined writing space,
          numbered list, or grid using the menu below.
        </p>
      )}
      {items.map((item, idx) => (
        <ContentRow
          key={item.id}
          item={item}
          canMoveUp={idx > 0}
          canMoveDown={idx < items.length - 1}
          onChange={(patch) => onUpdate(item.id, patch)}
          onRemove={() => onRemove(item.id)}
          onMoveUp={() => onMove(idx, -1)}
          onMoveDown={() => onMove(idx, 1)}
        />
      ))}
      <div className="inspector__content-add">
        <select value={addKind} onChange={(e) => setAddKind(e.target.value)}>
          <option value="">+ Add content…</option>
          {CONTENT_KINDS.map((k) => (
            <option key={k.id} value={k.id}>{k.label}</option>
          ))}
        </select>
        <button
          type="button"
          disabled={!addKind}
          onClick={() => {
            onAdd(addKind)
            setAddKind('')
          }}
        >
          Add
        </button>
      </div>
    </div>
  )
}

function ContentRow({ item, canMoveUp, canMoveDown, onChange, onRemove, onMoveUp, onMoveDown }) {
  const KIND_LABEL = {
    tracker: 'Tracker',
    lines: 'Lines',
    numbered: 'Numbered',
    grid: 'Grid',
  }
  return (
    <div className="content-row">
      <div className="content-row__head">
        <span className="content-row__kind">{KIND_LABEL[item.kind]}</span>
        <button className="icon-button" onClick={onMoveUp} disabled={!canMoveUp} title="Move up" aria-label="Move up">↑</button>
        <button className="icon-button" onClick={onMoveDown} disabled={!canMoveDown} title="Move down" aria-label="Move down">↓</button>
        <button className="icon-button" onClick={onRemove} title="Remove" aria-label="Remove">×</button>
      </div>
      <div className="content-row__body">
        <input
          type="text"
          value={item.label}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="Label (optional)"
          className="content-row__label"
        />
        {item.kind === 'grid' ? (
          <div className="content-row__grid">
            <label>
              <span>Cols</span>
              <input
                type="number"
                min="1"
                max={MAX_GRID_DIM}
                value={item.cols}
                onChange={(e) => onChange({ cols: clamp(Number(e.target.value) || 1, 1, MAX_GRID_DIM) })}
              />
            </label>
            <label>
              <span>Rows</span>
              <input
                type="number"
                min="1"
                max={MAX_GRID_DIM}
                value={item.rows}
                onChange={(e) => onChange({ rows: clamp(Number(e.target.value) || 1, 1, MAX_GRID_DIM) })}
              />
            </label>
          </div>
        ) : (
          <label className="content-row__count">
            <span>Count</span>
            <input
              type="number"
              min="1"
              max={item.kind === 'tracker' ? MAX_TRACKER_COUNT : 30}
              value={item.count}
              onChange={(e) =>
                onChange({
                  count: clamp(
                    Number(e.target.value) || 1,
                    1,
                    item.kind === 'tracker' ? MAX_TRACKER_COUNT : 30,
                  ),
                })
              }
            />
          </label>
        )}
      </div>
    </div>
  )
}

function MultiPanel({ count, onDeleteSelected, onDuplicateSelected }) {
  return (
    <>
      <h2>{count} boxes selected</h2>
      <p className="hint">
        Drag to move them all together. Arrow keys nudge by 8 px (Shift = 32 px).
      </p>
      <div className="inspector__box-actions">
        <button type="button" onClick={onDuplicateSelected} title="Duplicate all (Ctrl+D)">
          ⧉ Duplicate all
        </button>
        <button type="button" onClick={onDeleteSelected} title="Delete all">
          × Delete all
        </button>
      </div>
    </>
  )
}

function SheetPanel({ template, activePageIndex, onChangeTemplate, onAddPage, onRemovePage }) {
  const pageCount = template.pages.length
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

      <div className="inspector__grid">
        <label className="field">
          <span>Page size</span>
          <select
            value={template.pageSize}
            onChange={(e) => onChangeTemplate({ pageSize: e.target.value })}
          >
            <option value="a4">A4</option>
            <option value="letter">Letter</option>
            <option value="legal">Legal</option>
          </select>
        </label>
        <label className="field">
          <span>Orientation</span>
          <select
            value={template.orientation}
            onChange={(e) => onChangeTemplate({ orientation: e.target.value })}
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </label>
      </div>

      <div className="inspector__pages">
        <div className="inspector__pages-head">
          <span>Pages ({pageCount})</span>
          {pageCount < 8 && (
            <button type="button" className="link" onClick={onAddPage}>
              + Add page
            </button>
          )}
        </div>
        {pageCount > 1 && (
          <button
            type="button"
            className="inspector__remove-page"
            onClick={() => onRemovePage(activePageIndex)}
            title={`Remove page ${activePageIndex + 1}`}
          >
            × Remove this page (page {activePageIndex + 1})
          </button>
        )}
      </div>

      <p className="hint">
        Click a box to edit its title and size. Add box drops a new one into
        empty space on the active page.
      </p>
    </>
  )
}

function BoxPanel({ box, pageDims, onChangeBox, onDeleteBox, onDuplicateBox, onBringToFront, onSendToBack }) {
  const PAGE_W = pageDims.w
  const PAGE_H = pageDims.h
  const update = (patch) => onChangeBox(box.id, patch)
  const setNumber = (key, value, min, max) => {
    const n = Number(value)
    if (Number.isNaN(n)) return
    update({ [key]: clamp(snap(n), min, max) })
  }

  const content = box.content ?? []

  const updateItem = (id, patch) =>
    update({
      content: content.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })

  const removeItem = (id) =>
    update({ content: content.filter((c) => c.id !== id) })

  const addItem = (kind) => {
    const item = newContentItem(kind)
    if (!item) return
    update({ content: [...content, item] })
  }

  const moveItem = (idx, delta) => {
    const target = idx + delta
    if (target < 0 || target >= content.length) return
    const next = content.slice()
    const [moved] = next.splice(idx, 1)
    next.splice(target, 0, moved)
    update({ content: next })
  }

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

      <ContentEditor
        items={content}
        onUpdate={updateItem}
        onRemove={removeItem}
        onMove={moveItem}
        onAdd={addItem}
      />

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
