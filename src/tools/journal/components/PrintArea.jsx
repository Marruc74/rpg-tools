import { forwardRef } from 'react'

function LinedSpace({ lines }) {
  return (
    <div className="journal-print__lines" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="journal-print__line" />
      ))}
    </div>
  )
}

function Subsection({ sub }) {
  const hasLabel = sub.label && sub.label.trim().length > 0
  // Inline form-field: a single labeled writing line, label sits on the left.
  if (sub.lines === 1 && hasLabel) {
    return (
      <div className="journal-print__inline">
        <span className="journal-print__inline-label">{sub.label}</span>
        <span className="journal-print__inline-rule" />
      </div>
    )
  }
  // Block: optional small label heading, then ruled lines.
  return (
    <div className="journal-print__block">
      {hasLabel && (
        <div className="journal-print__sub-label">{sub.label}</div>
      )}
      <LinedSpace lines={sub.lines} />
    </div>
  )
}

const PRINT_ID = 'journal-template-sheet'

// A4-width rendering of the journal template. Used by both the
// off-screen rasterization source for PDF export and the on-screen
// scaled-down preview. Caller controls visibility.
const Sheet = forwardRef(function Sheet({ template }, ref) {
  if (!template) return null
  return (
    <div className="journal-print" ref={ref}>
      {template.sections.map((section) => (
        <section key={section.id} className="journal-print__section">
          {section.label && <h2>{section.label}</h2>}
          {section.subsections.map((sub) => (
            <Subsection key={sub.id} sub={sub} />
          ))}
        </section>
      ))}
    </div>
  )
})

export { Sheet, PRINT_ID }

// Off-screen wrapper used as the rasterization source for PDF export.
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
