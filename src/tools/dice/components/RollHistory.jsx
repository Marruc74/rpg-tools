function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function Breakdown({ breakdown }) {
  return (
    <span className="roll__breakdown">
      {breakdown.map((b, i) => {
        if (b.kind === 'mod') {
          return (
            <span key={i} className="roll__mod"> {b.label}</span>
          )
        }
        return (
          <span key={i} className="roll__dice-group">
            {' '}{b.label}: [
            {b.rolls.map((r, j) => {
              const isDropped = b.dropped.includes(r) && b.dropped.indexOf(r) === j - b.kept.length // approximate
              const dropped = b.dropped.length > 0 && b.kept.length < b.rolls.length && !b.kept.includes(r)
              return (
                <span
                  key={j}
                  className={`roll__die${dropped ? ' is-dropped' : ''}${
                    r === 1 ? ' is-min' : r === b.sides ? ' is-max' : ''
                  }`}
                  title={dropped ? 'dropped' : ''}
                >
                  {j > 0 ? ', ' : ''}{r}
                </span>
              )
            })}
            ]
          </span>
        )
      })}
    </span>
  )
}

export default function RollHistory({ history, onClear }) {
  return (
    <section className="history">
      <header className="history__header">
        <h2>Recent rolls</h2>
        {history.length > 0 && (
          <button className="link" onClick={onClear}>Clear</button>
        )}
      </header>
      {history.length === 0 ? (
        <p className="hint">Roll something to see it here.</p>
      ) : (
        <ul className="history__list">
          {history.map((h) => (
            <li key={h.id} className="roll">
              <div className="roll__head">
                <span className="roll__total">{h.total}</span>
                <span className="roll__label">{h.label || h.expression}</span>
                <span className="roll__time">{formatTime(h.at)}</span>
              </div>
              <div className="roll__detail">
                <Breakdown breakdown={h.breakdown} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
