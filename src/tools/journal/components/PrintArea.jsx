import { forwardRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function formatLongDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

const DEFAULT_LINE_COUNT = 4

function LinedSpace({ lines = DEFAULT_LINE_COUNT }) {
  return (
    <div className="journal-print__lines" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="journal-print__line" />
      ))}
    </div>
  )
}

// A4-width rendering of the journal sheet. Used both as the off-screen
// rasterization source for PDF export *and* as the source for the
// on-screen scaled-down preview. The caller controls visibility and
// applies any data attributes needed for selection.
const Sheet = forwardRef(function Sheet({ entry }, ref) {
  if (!entry) return null
  return (
    <div className="journal-print" ref={ref}>
      <header className="journal-print__header">
        <h1 className="journal-print__title">{entry.title || '(untitled session)'}</h1>
        {entry.date && (
          <div className="journal-print__date">{formatLongDate(entry.date)}</div>
        )}
      </header>
      {entry.sections.map((s) => {
        const hasContent = s.content && s.content.trim().length > 0
        return (
          <section key={s.id} className="journal-print__section">
            <h2>{s.label}</h2>
            <div className="journal-print__content">
              {hasContent ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{s.content}</ReactMarkdown>
              ) : (
                <LinedSpace lines={s.lines ?? DEFAULT_LINE_COUNT} />
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
})

export { Sheet }

// Off-screen wrapper used as the rasterization source for PDF export.
// The exporter looks up the wrapper by data-print-id.
export default function PrintArea({ entry }) {
  if (!entry) return null
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: '-99999px',
        top: 0,
        pointerEvents: 'none',
      }}
      data-print-id={entry.id}
    >
      <Sheet entry={entry} />
    </div>
  )
}
