import { useLayoutEffect, useRef, useState } from 'react'
import { Sheet } from './PrintArea.jsx'

const SCALE = 0.55
const PAGE_HEIGHT_PX = 1188 // A4 height at 4 px/mm = 297 * 4

export default function SheetPreview({ template }) {
  const sheetRef = useRef(null)
  const [pageCount, setPageCount] = useState(1)

  useLayoutEffect(() => {
    const el = sheetRef.current
    if (!el) return
    const h = el.scrollHeight
    setPageCount(Math.max(1, Math.ceil(h / PAGE_HEIGHT_PX)))
  })

  const breakLines = Math.max(0, pageCount - 1)
  const tooLong = pageCount > 2

  return (
    <section className="sheet-preview">
      <header className="sheet-preview__header">
        <h2>Preview</h2>
        <div
          className={`sheet-preview__pages${tooLong ? ' is-warning' : ''}`}
          title={tooLong ? 'This sheet exceeds the 1–2 page print target.' : undefined}
        >
          {pageCount} page{pageCount === 1 ? '' : 's'}
          {tooLong && ' ⚠'}
        </div>
      </header>
      <div className="sheet-preview__viewport">
        <div
          className="sheet-preview__scale"
          style={{ transform: `scale(${SCALE})`, transformOrigin: 'top left' }}
        >
          <Sheet template={template} ref={sheetRef} />
          {Array.from({ length: breakLines }).map((_, i) => (
            <div
              key={i}
              className="sheet-preview__page-break"
              style={{ top: PAGE_HEIGHT_PX * (i + 1) }}
            >
              <span>page {i + 2}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
