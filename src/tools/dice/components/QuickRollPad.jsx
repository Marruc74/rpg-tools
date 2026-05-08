const QUICK_DICE = [4, 6, 8, 10, 12, 20, 100]

export default function QuickRollPad({ onRoll }) {
  return (
    <div className="quick-pad">
      <div className="quick-pad__title">Quick rolls</div>
      <div className="quick-pad__buttons">
        {QUICK_DICE.map((sides) => (
          <button
            key={sides}
            className="quick-die"
            onClick={() => onRoll(`1d${sides}`)}
            title={`Roll 1d${sides}`}
          >
            d{sides}
          </button>
        ))}
      </div>
    </div>
  )
}
