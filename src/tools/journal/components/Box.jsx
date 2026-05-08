import {
  MIN_W,
  MIN_H,
  snap,
  clamp,
} from '../lib/journalTemplate.js'
import BoxContent from './BoxContent.jsx'

const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']

// Box now distinguishes two drag modes:
//   - move: delegated to the parent (so multiple selected boxes move
//     together). Box reports gesture deltas via onMoveStart /
//     onMoveDelta / onMoveEnd.
//   - resize: stays per-box, since resize is single-box only.
export default function Box({
  box,
  scale,
  pageW,
  pageH,
  isSelected,
  onSelect,
  onChange,
  onMoveStart,
  onMoveDelta,
  onMoveEnd,
}) {
  const PAGE_W = pageW
  const PAGE_H = pageH
  const beginMove = (e) => {
    if (e.button !== undefined && e.button !== 0) return
    e.stopPropagation()
    e.preventDefault()

    const startMouseX = e.clientX
    const startMouseY = e.clientY
    const additive = e.ctrlKey || e.metaKey
    let dragging = false

    const onMove = (ev) => {
      const dx = (ev.clientX - startMouseX) / scale
      const dy = (ev.clientY - startMouseY) / scale
      const moved = Math.abs(dx) > 2 || Math.abs(dy) > 2
      if (!dragging && moved) {
        dragging = true
        onMoveStart(box.id, additive)
      }
      if (dragging) {
        onMoveDelta(dx, dy)
      }
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      if (dragging) {
        onMoveEnd()
      } else {
        onSelect(additive)
      }
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const beginResize = (handle) => (e) => {
    if (e.button !== undefined && e.button !== 0) return
    e.stopPropagation()
    e.preventDefault()
    onSelect(false, false)

    const start = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      x: box.x,
      y: box.y,
      w: box.w,
      h: box.h,
    }

    const onMove = (ev) => {
      const dx = (ev.clientX - start.mouseX) / scale
      const dy = (ev.clientY - start.mouseY) / scale
      let { x, y, w, h } = start
      if (handle.includes('e')) {
        w = clamp(snap(start.w + dx), MIN_W, PAGE_W - start.x)
      }
      if (handle.includes('w')) {
        const newW = clamp(snap(start.w - dx), MIN_W, start.x + start.w)
        w = newW
        x = start.x + (start.w - newW)
      }
      if (handle.includes('s')) {
        h = clamp(snap(start.h + dy), MIN_H, PAGE_H - start.y)
      }
      if (handle.includes('n')) {
        const newH = clamp(snap(start.h - dy), MIN_H, start.y + start.h)
        h = newH
        y = start.y + (start.h - newH)
      }
      onChange({ x, y, w, h })
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const content = box.content ?? []
  const s = box.style ?? {}

  return (
    <div
      className={`canvas-box${isSelected ? ' is-selected' : ''}`}
      data-border={s.border ?? 'normal'}
      data-radius={s.radius ?? 'rounded'}
      data-fill={s.fill ?? 'white'}
      style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
      onPointerDown={beginMove}
    >
      <div className="canvas-box__title">{box.title || '(untitled)'}</div>
      <BoxContent items={content} />
      {isSelected &&
        HANDLES.map((h) => (
          <div
            key={h}
            className={`canvas-box__handle canvas-box__handle--${h}`}
            onPointerDown={beginResize(h)}
          />
        ))}
    </div>
  )
}
