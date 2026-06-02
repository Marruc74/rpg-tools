import { useMemo, useState } from 'react'

// A simple party view: lists the saved roster as a team, plus an optional
// group stat the system computes (e.g. T2K unit morale = highest Command).
export default function PartyPanel({ roster, system }) {
  const [open, setOpen] = useState(false)
  const groupStat = useMemo(() => {
    if (!open || !system.groupStat || roster.length === 0) return null
    try {
      return system.groupStat(roster.map((r) => r.state), system.deriveCharacter)
    } catch {
      return null
    }
  }, [open, roster, system])

  return (
    <div className="cc-party">
      <button
        type="button"
        className={`cc-btn cc-btn--sm cc-btn--ghost ${open ? 'is-on' : ''}`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        👥 Party ({roster.length}) {open ? '▴' : '▾'}
      </button>
      {open && (
        roster.length === 0 ? (
          <p className="cc-party__empty">No saved characters yet — save some to form a party.</p>
        ) : (
          <div className="cc-party__body">
            <ul className="cc-party__list">
              {roster.map((r) => (
                <li key={r.id} className="cc-party__member">
                  <span className="cc-party__name">{r.name || 'Unnamed'}</span>
                  <span className="cc-party__summary">{r.summary}</span>
                </li>
              ))}
            </ul>
            {groupStat && <p className="cc-party__stat">{groupStat}</p>}
          </div>
        )
      )}
    </div>
  )
}
