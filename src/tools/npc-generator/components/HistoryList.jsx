function formatTime(ms) {
  try {
    return new Date(ms).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

function buildSummary(fields) {
  return [fields.name, fields.profession, fields.appearance, fields.quirk]
    .filter(Boolean)
    .join(' · ')
}

export default function HistoryList({ history, onLoad, onClear }) {
  return (
    <div className="npc-history">
      <div className="npc-history__head">
        <h2>Recent rolls</h2>
        {history.length > 0 && (
          <button type="button" className="link" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <p className="hint">No rolls yet.</p>
      ) : (
        <ul className="npc-history__list">
          {history.map((entry) => (
            <li key={entry.id} className="npc-history__item">
              <button
                type="button"
                className="npc-history__row"
                onClick={() => onLoad(entry.fields)}
                title="Load this roll into the result panel"
              >
                <div className="npc-history__row-time">{formatTime(entry.at)}</div>
                <div className="npc-history__row-text">
                  {buildSummary(entry.fields) || <em>(empty roll)</em>}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
