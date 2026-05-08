import {
  PAGE_W,
  PAGE_H,
  MIN_W,
  MIN_H,
  snap,
  clamp,
} from '../lib/journalTemplate.js'

const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']

export default function Box({ box, scale, isSelected, onSelect, onChange }) {
  const beginDrag = (mode, handle) => (e) => {
    if (e.button !== undefined && e.button !== 0) return
    e.stopPropagation()
    e.preventDefault()
    onSelect()

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

      if (mode === 'move') {
        const x = clamp(snap(start.x + dx), 0, PAGE_W - start.w)
        const y = clamp(snap(start.y + dy), 0, PAGE_H - start.h)
        onChange({ x, y })
        return
      }

      // resize — derive new x/y/w/h from which edges the handle grabs
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

  return (
    <div
      className={`canvas-box${isSelected ? ' is-selected' : ''}`}
      style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
      onPointerDown={beginDrag('move', null)}
    >
      <div className="canvas-box__title">{box.title || '(untitled)'}</div>
      {isSelected &&
        HANDLES.map((h) => (
          <div
            key={h}
            className={`canvas-box__handle canvas-box__handle--${h}`}
            onPointerDown={beginDrag('resize', h)}
          />
        ))}
    </div>
  )
}
