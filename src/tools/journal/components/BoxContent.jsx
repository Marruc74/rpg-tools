// Renders the content array inside a box. Used by both the canvas
// (Box.jsx) and the print page (PrintArea.jsx) so the view matches
// the output exactly. Pointer-events disabled so dragging the box
// still works anywhere on its body.

function Tracker({ item }) {
  return (
    <div className="bc-tracker">
      {item.label && <span className="bc-tracker__label">{item.label}</span>}
      <div className="bc-tracker__checks">
        {Array.from({ length: item.count }).map((_, i) => (
          <span key={i} className="bc-tracker__check" />
        ))}
      </div>
    </div>
  )
}

function Lines({ item }) {
  return (
    <div className="bc-lines">
      {item.label && <div className="bc-lines__label">{item.label}</div>}
      <div className="bc-lines__rules">
        {Array.from({ length: item.count }).map((_, i) => (
          <div key={i} className="bc-lines__rule" />
        ))}
      </div>
    </div>
  )
}

function Numbered({ item }) {
  return (
    <div className="bc-numbered">
      {item.label && <div className="bc-numbered__label">{item.label}</div>}
      <div className="bc-numbered__rows">
        {Array.from({ length: item.count }).map((_, i) => (
          <div key={i} className="bc-numbered__row">
            <span className="bc-numbered__index">{i + 1}.</span>
            <span className="bc-numbered__rule" />
          </div>
        ))}
      </div>
    </div>
  )
}

function Grid({ item }) {
  return (
    <div className="bc-grid-wrap">
      {item.label && <div className="bc-grid__label">{item.label}</div>}
      <div
        className="bc-grid"
        style={{
          gridTemplateColumns: `repeat(${item.cols}, 1fr)`,
          gridTemplateRows: `repeat(${item.rows}, auto)`,
        }}
      >
        {Array.from({ length: item.cols * item.rows }).map((_, i) => (
          <div key={i} className="bc-grid__cell" />
        ))}
      </div>
    </div>
  )
}

export default function BoxContent({ items }) {
  if (!items || items.length === 0) return null
  return (
    <div className="box-content">
      {items.map((item) => {
        switch (item.kind) {
          case 'tracker':
            return <Tracker key={item.id} item={item} />
          case 'lines':
            return <Lines key={item.id} item={item} />
          case 'numbered':
            return <Numbered key={item.id} item={item} />
          case 'grid':
            return <Grid key={item.id} item={item} />
          default:
            return null
        }
      })}
    </div>
  )
}
