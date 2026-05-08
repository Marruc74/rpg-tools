import { useEffect, useState } from 'react'
import Box from './Box.jsx'
import { PAGE_W, PAGE_H } from '../lib/journalTemplate.js'

const PAGE_HEIGHT_PX = PAGE_H

export default function TemplateCanvas({
  template,
  selectedBoxId,
  onSelectBox,
  onChangeBox,
  onDeleteBox,
}) {
  // Auto-scale to fit the viewport's width.
  const [scale, setScale] = useState(0.55)
  const [containerEl, setContainerEl] = useState(null)

  useEffect(() => {
    if (!containerEl) return
    const measure = () => {
      const w = containerEl.clientWidth - 32 // padding
      const next = Math.max(0.25, Math.min(0.9, w / PAGE_W))
      setScale(next)
    }
    measure()
    const obs = new ResizeObserver(measure)
    obs.observe(containerEl)
    return () => obs.disconnect()
  }, [containerEl])

  // Delete key removes the selected box.
  useEffect(() => {
    const onKey = (e) => {
      if (!selectedBoxId) return
      const t = e.target
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        onDeleteBox(selectedBoxId)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedBoxId, onDeleteBox])

  const pageCount = Math.max(1, Math.ceil(PAGE_HEIGHT_PX / PAGE_HEIGHT_PX)) // single A4 for now

  return (
    <section className="canvas-area">
      <header className="canvas-area__header">
        <h2>{template.title}</h2>
        <span className="hint">Drag boxes to move; corners and edges resize. Click empty area to deselect; Delete removes.</span>
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
          onPointerDown={(e) => {
            // Click on the page background (not a box) deselects.
            if (e.target === e.currentTarget) onSelectBox(null)
          }}
        >
          {template.boxes.map((box) => (
            <Box
              key={box.id}
              box={box}
              scale={scale}
              isSelected={box.id === selectedBoxId}
              onSelect={() => onSelectBox(box.id)}
              onChange={(patch) => onChangeBox(box.id, patch)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
