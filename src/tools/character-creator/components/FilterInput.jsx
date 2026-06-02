// Small reusable search box for the creator's long pick-lists. Controlled.
export default function FilterInput({ value, onChange, placeholder = 'Filter…' }) {
  return (
    <div className="cc-filter">
      <input
        type="search"
        className="cc-filter__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {value && <button type="button" className="cc-filter__clear" onClick={() => onChange('')} title="Clear">×</button>}
    </div>
  )
}

// Case-insensitive substring match helper shared by callers.
export const matches = (text, q) => !q || (text || '').toLowerCase().includes(q.trim().toLowerCase())
