function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function RollHistory({ history, onClear }) {
  return (
    <section className="tables-history">
      <header className="tables-history__head">
        <h2>Recent rolls</h2>
        {history.length > 0 && (
          <button className="link" onClick={onClear}>Clear</button>
        )}
      </header>
      {history.length === 0 ? (
        <p className="hint">Roll a table to see results here.</p>
      ) : (
        <ul className="tables-history__list">
          {history.map((h) => (
            <li key={h.id}>
              <div className="tables-history__row">
                <span className="tables-history__source">{h.tableName}</span>
                <span className="tables-history__time">{formatTime(h.at)}</span>
              </div>
              <div className="tables-history__text">{h.text}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
