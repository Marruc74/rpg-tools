import { useEffect, useState } from 'react'
import Box from './Box.jsx'

function intersect(box, m) {
  return (
    box.x < m.x + m.w &&
    box.x + box.w > m.x &&
    box.y < m.y + m.h &&
    box.y + box.h > m.y
  )
}

export default function TemplateCanvas({
  template,
  pageDims,
  activePageIndex,
  onChangeActivePage,
  selectedBoxIds,
  onSelectBox,
  onSelectMany,
  onChangeBox,
  onMoveStart,
  onMoveDelta,
  onMoveEnd,
  guides,
}) {
  const PAGE_W = pageDims.w
  const PAGE_H = pageDims.h
  const [scale, setScale] = useState(0.55)
  const [containerEl, setContainerEl] = useState(null)
  const [marquee, setMarquee] = useState(null)

  useEffect(() => {
    if (!containerEl) return
    const measure = () => {
      const w = containerEl.clientWidth - 32
      const next = Math.max(0.25, Math.min(0.9, w / PAGE_W))
      setScale(next)
    }
    measure()
    const obs = new ResizeObserver(measure)
    obs.observe(containerEl)
    return () => obs.disconnect()
  }, [containerEl, PAGE_W])

  const activePage = template.pages[activePageIndex] ?? template.pages[0]
  const boxes = activePage?.boxes ?? []
  const isMultiPage = template.pages.length > 1

  // Marquee select. pointerdown on the page background (not a box)
  // either clears selection (if no drag) or selects the boxes that
  // intersect the rectangle (if dragged). Pointer coords are converted
  // from screen pixels into page logical pixels using the current
  // transform scale.
  const beginMarquee = (e) => {
    if (e.target !== e.currentTarget) return
    if (e.button !== undefined && e.button !== 0) return
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    const x0 = (e.clientX - rect.left) / scale
    const y0 = (e.clientY - rect.top) / scale
    const additive = e.ctrlKey || e.metaKey
    let dragged = false

    const onMove = (ev) => {
      const x = (ev.clientX - rect.left) / scale
      const y = (ev.clientY - rect.top) / scale
      if (Math.abs(x - x0) > 2 || Math.abs(y - y0) > 2) dragged = true
      setMarquee({
        x: Math.max(0, Math.min(x0, x)),
        y: Math.max(0, Math.min(y0, y)),
        w: Math.abs(x - x0),
        h: Math.abs(y - y0),
      })
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      setMarquee((cur) => {
        if (dragged && cur) {
          const ids = boxes.filter((b) => intersect(b, cur)).map((b) => b.id)
          onSelectMany(ids, additive)
        } else if (!additive) {
          onSelectBox(null)
        }
        return null
      })
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  return (
    <section className="canvas-area">
      <header className="canvas-area__header">
        <div className="canvas-area__header-left">
          <h2>{template.title || 'Untitled sheet'}</h2>
          {isMultiPage && (
            <div className="canvas-area__tabs">
              {template.pages.map((_, i) => {
                const label =
                  template.pages.length === 2
                    ? i === 0 ? 'Front' : 'Back'
                    : `Page ${i + 1}`
                return (
                  <button
                    key={i}
                    className={i === activePageIndex ? 'is-active' : ''}
                    onClick={() => onChangeActivePage(i)}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          )}
        </div>
        <span className="hint">
          Drag boxes to move; corners and edges resize. Drag empty area to box-select.
          Ctrl-click adds to selection. Delete removes; Ctrl+D duplicates.
        </span>
      </header>
      <div className="canvas-area__viewport" ref={setContainerEl}>
        <div
          className="canvas-area__page"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: PAGE_W,
            height: PAGE_H,
          }}
          onPointerDown={beginMarquee}
        >
          {activePageIndex === 0 && (template.title || template.game) && (
            <div className="page-titleband">
              {template.title && <div className="page-titleband__title">{template.title}</div>}
              {template.game && <div className="page-titleband__game">{template.game}</div>}
            </div>
          )}
          {boxes.map((box) => (
            <Box
              key={box.id}
              box={box}
              scale={scale}
              pageW={PAGE_W}
              pageH={PAGE_H}
              isSelected={selectedBoxIds.has(box.id)}
              onSelect={(additive) => onSelectBox(box.id, additive)}
              onChange={(patch) => onChangeBox(box.id, patch)}
              onMoveStart={onMoveStart}
              onMoveDelta={onMoveDelta}
              onMoveEnd={onMoveEnd}
            />
          ))}
          {marquee && (
            <div
              className="canvas-marquee"
              style={{
                left: marquee.x,
                top: marquee.y,
                width: marquee.w,
                height: marquee.h,
              }}
            />
          )}
          {guides?.vertical.map((x) => (
            <div key={`gv-${x}`} className="canvas-guide canvas-guide--v" style={{ left: x }} />
          ))}
          {guides?.horizontal.map((y) => (
            <div key={`gh-${y}`} className="canvas-guide canvas-guide--h" style={{ top: y }} />
          ))}
        </div>
      </div>
    </section>
  )
}
