import { getTemplatePageDims } from '../lib/journalTemplate.js'
import BoxContent from './BoxContent.jsx'

const PRINT_ROOT_ID = 'journal-template-sheet'
export { PRINT_ROOT_ID }

export default function PrintArea({ template }) {
  if (!template) return null
  const { w, h } = getTemplatePageDims(template)
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
          style={{ width: w, height: h, position: 'relative', background: '#fff' }}
        >
          {i === 0 && (template.title || template.game) && (
            <div className="page-titleband">
              {template.title && <div className="page-titleband__title">{template.title}</div>}
              {template.game && <div className="page-titleband__game">{template.game}</div>}
            </div>
          )}
          {page.boxes.map((box) => (
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
              <BoxContent items={box.content ?? []} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
