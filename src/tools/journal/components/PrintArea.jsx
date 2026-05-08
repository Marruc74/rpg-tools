import { forwardRef } from 'react'

function LinedSpace({ lines }) {
  return (
    <div className="js-lines" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="js-line" />
      ))}
    </div>
  )
}

function Subsection({ sub }) {
  const hasLabel = sub.label && sub.label.trim().length > 0
  if (sub.lines === 1 && hasLabel) {
    return (
      <div className="js-inline">
        <span className="js-inline-label">{sub.label}</span>
        <span className="js-inline-rule" />
      </div>
    )
  }
  return (
    <div className="js-block">
      {hasLabel && <div className="js-sub-label">{sub.label}</div>}
      <LinedSpace lines={sub.lines} />
    </div>
  )
}

function SubsectionGroup({ subsections }) {
  return (
    <>
      {subsections.map((sub) => (
        <Subsection key={sub.id} sub={sub} />
      ))}
    </>
  )
}

function SectionBox({ section }) {
  const cls = `js-section js-section--${section.span === 'half' ? 'half' : 'full'}`
  if (section.repeat > 1) {
    return (
      <div className={cls}>
        {section.label && <div className="js-section__label">{section.label}</div>}
        <div className="js-section__cards">
          {Array.from({ length: section.repeat }).map((_, i) => (
            <div key={i} className="js-card">
              <SubsectionGroup subsections={section.subsections} />
            </div>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className={cls}>
      {section.label && <div className="js-section__label">{section.label}</div>}
      <div className="js-section__body">
        <SubsectionGroup subsections={section.subsections} />
      </div>
    </div>
  )
}

const PRINT_ID = 'journal-template-sheet'

const Sheet = forwardRef(function Sheet({ template }, ref) {
  if (!template) return null
  return (
    <div className="journal-print" ref={ref}>
      {template.title && (
        <h1 className="journal-print__title">{template.title}</h1>
      )}
      <div className="journal-print__grid">
        {template.sections.map((section) => (
          <SectionBox key={section.id} section={section} />
        ))}
      </div>
    </div>
  )
})

export { Sheet, PRINT_ID }

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
      <Sheet template={template} />
    </div>
  )
}
