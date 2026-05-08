import { PAGE_W, PAGE_H } from '../lib/journalTemplate.js'

const PRINT_ROOT_ID = 'journal-template-sheet'
export { PRINT_ROOT_ID }

// Off-screen, full-size A4 rendering of every page in the active
// template. The PDF exporter walks the children by data attribute and
// rasterizes each in turn.
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
      data-print-root={PRINT_ROOT_ID}
    >
      {template.pages.map((page, i) => (
        <div
          key={page.id}
          className="print-page"
          data-print-page={i}
          style={{ width: PAGE_W, height: PAGE_H, position: 'relative', background: '#fff' }}
        >
          {i === 0 && (template.title || template.game) && (
            <div className="page-titleband">
              {template.title && <div className="page-titleband__title">{template.title}</div>}
              {template.game && <div className="page-titleband__game">{template.game}</div>}
            </div>
          )}
          {page.boxes.map((box) => {
            const trackers = box.trackers ?? []
            return (
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
                {trackers.length > 0 && (
                  <div className="box-trackers">
                    {trackers.map((t) => (
                      <div key={t.id} className="box-tracker">
                        {t.label && (
                          <span className="box-tracker__label">{t.label}</span>
                        )}
                        <div className="box-tracker__checks">
                          {Array.from({ length: t.count }).map((_, i) => (
                            <span key={i} className="box-tracker__check" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
