// A small budget meter shared by the game-system sidebars (BP/EP for DoD,
// skill advances for WFRP). `unit` labels what's being counted.
export default function Meter({ label, used, total, over, unit = 'kvar' }) {
  const pct = total > 0 ? Math.min(100, (used / total) * 100) : 0
  return (
    <div className={`cc-meter ${over ? 'cc-meter--over' : ''}`}>
      <div className="cc-meter__top">
        <span>{label}</span>
        <span className="cc-meter__num">{total - used} {unit}</span>
      </div>
      <div className="cc-meter__track">
        <div className="cc-meter__fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="cc-meter__sub">{used} / {total}</div>
    </div>
  )
}
