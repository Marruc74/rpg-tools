import BoxContent from './BoxContent.jsx'
import { getTemplatePageDims } from '../lib/journalTemplate.js'

const SCALE = 0.5

// Visible scaled rendering of every page. Same markup as PrintArea so
// what you see here is the PDF.
export default function PrintPreview({ template, onClose, onPrint }) {
  if (!template) return null
  const dims = getTemplatePageDims(template)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="print-preview" onClick={(e) => e.stopPropagation()}>
        <header className="print-preview__header">
          <strong>Print preview</strong>
          <span className="hint">
            {dims.pageSize.toUpperCase()} {dims.orientation} · {template.pages.length} page
            {template.pages.length === 1 ? '' : 's'}
          </span>
          <div className="print-preview__actions">
            <button onClick={onPrint}>Print PDF</button>
            <button className="link" onClick={onClose}>Close</button>
          </div>
        </header>
        <div className="print-preview__body">
          {template.pages.map((page, i) => (
            <div key={page.id} className="print-preview__page-wrap">
              <div className="print-preview__page-label">
                {template.pages.length === 2
                  ? i === 0 ? 'Front' : 'Back'
                  : `Page ${i + 1}`}
              </div>
              <div
                className="print-preview__scale"
                style={{ width: dims.w * SCALE, height: dims.h * SCALE }}
              >
                <div
                  className="print-page"
                  data-theme={template.theme ?? 'minimalist'}
                  style={{
                    width: dims.w,
                    height: dims.h,
                    position: 'relative',
                    background: '#fff',
                    transform: `scale(${SCALE})`,
                    transformOrigin: 'top left',
                  }}
                >
                  {i === 0 && (template.title || template.game) && (
                    <div className="page-titleband">
                      {template.title && (
                        <div className="page-titleband__title">{template.title}</div>
                      )}
                      {template.game && (
                        <div className="page-titleband__game">{template.game}</div>
                      )}
                    </div>
                  )}
                  {page.boxes.map((box) => {
                    const s = box.style ?? {}
                    return (
                      <div
                        key={box.id}
                        className="print-box"
                        data-border={s.border ?? 'normal'}
                        data-radius={s.radius ?? 'rounded'}
                        data-fill={s.fill ?? 'white'}
                        style={{
                          left: box.x,
                          top: box.y,
                          width: box.w,
                          height: box.h,
                        }}
                      >
                        <div className="print-box__title">{box.title}</div>
                        <BoxContent items={box.content ?? []} />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
