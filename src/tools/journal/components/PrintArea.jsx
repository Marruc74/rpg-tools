import { PAGE_W, PAGE_H } from '../lib/journalTemplate.js'

const PRINT_ID = 'journal-template-sheet'
export { PRINT_ID }

// Off-screen, full-size A4 rendering of the active template. Used as
// the rasterization source for PDF export.
export default function PrintArea({ template }) {
  if (!template) return null
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: '-99999px',
        top: 0,
        pointerEvents: 'none',
      }}
      data-print-id={PRINT_ID}
    >
      <div
        className="print-page"
        style={{ width: PAGE_W, height: PAGE_H, position: 'relative', background: '#fff' }}
      >
        {(template.title || template.game) && (
          <div className="print-page__head">
            {template.title && <h1 className="print-page__title">{template.title}</h1>}
            {template.game && <div className="print-page__game">{template.game}</div>}
          </div>
        )}
        {template.boxes.map((box) => (
          <div
            key={box.id}
            className="print-box"
            style={{
              left: box.x,
              top: box.y,
              width: box.w,
              height: box.h,
            }}
          >
            <div className="print-box__title">{box.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
