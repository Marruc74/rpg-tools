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

// Off-screen, fixed A4-sized layout used as the rasterization source for
// PDF export. The exporter looks it up by data-print-id.
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
    >
      <div className="journal-print" data-print-id={entry.id}>
        <header className="journal-print__header">
          <h1 className="journal-print__title">{entry.title || '(untitled session)'}</h1>
          {entry.date && (
            <div className="journal-print__date">{formatLongDate(entry.date)}</div>
          )}
        </header>
        {entry.sections.map((s) => (
          <section key={s.id} className="journal-print__section">
            <h2>{s.label}</h2>
            <div className="journal-print__content">
              {s.content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{s.content}</ReactMarkdown>
              ) : (
                <p className="journal-print__empty">—</p>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
