import { PAGE_W, PAGE_H } from '../lib/journalTemplate.js'

const PRINT_ID = 'journal-template-sheet'
export { PRINT_ID }

// Off-screen, full-size A4 rendering of the active template. Used as
// the rasterization source for PDF export. The canvas preview uses the
// same .page-titleband and .print-box class names so both views look
// identical.
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
          <div className="page-titleband">
            {template.title && <div className="page-titleband__title">{template.title}</div>}
            {template.game && <div className="page-titleband__game">{template.game}</div>}
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
