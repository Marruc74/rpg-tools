import { useRef, useState } from 'react'

// Generic saved-character bar shown in the creator's sub-bar. Works for any
// game system: the host passes already-computed name/summary strings per entry.
function RosterRow({ item, isLoaded, onLoad, onRename, onDelete, onExport }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(item.name)

  const commit = () => {
    setEditing(false)
    if (draft.trim() && draft !== item.name) onRename(item.id, draft.trim())
  }

  return (
    <li className={`cc-roster__item ${isLoaded ? 'is-loaded' : ''}`}>
      <button type="button" className="cc-roster__load" onClick={() => onLoad(item.id)} title="Load this character">
        <span className="cc-roster__name">{item.name || 'Unnamed'}</span>
        <span className="cc-roster__summary">{item.summary}</span>
      </button>
      {editing ? (
        <input
          autoFocus className="cc-roster__rename" value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur()
            if (e.key === 'Escape') { setDraft(item.name); setEditing(false) }
          }}
        />
      ) : (
        <button type="button" className="cc-roster__edit" title="Rename" onClick={() => { setDraft(item.name); setEditing(true) }}>✎</button>
      )}
      <button type="button" className="cc-roster__edit" title="Export to JSON" onClick={() => onExport(item.id)}>⬇</button>
      <button
        type="button" className="cc-x" title="Delete"
        onClick={() => { if (confirm(`Delete ${item.name || 'this character'}?`)) onDelete(item.id) }}
      >×</button>
    </li>
  )
}

export default function RosterBar({
  roster, loadedId, dirty,
  onSave, onSaveCopy, onNew, onLoad, onRename, onDelete,
  onExport, onExportItem, onImport,
}) {
  const [open, setOpen] = useState(false)
  const fileRef = useRef(null)

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-importing the same file
    if (!file) return
    try {
      const data = JSON.parse(await file.text())
      onImport(data)
    } catch {
      alert('Could not read that file — is it valid character JSON?')
    }
  }

  return (
    <div className="cc-roster">
      <div className="cc-roster__actions">
        <button className="cc-btn cc-btn--sm" onClick={onSave} title="Save the current character">
          💾 {loadedId ? 'Save' : 'Save to roster'}
        </button>
        {loadedId && (
          <button className="cc-btn cc-btn--sm cc-btn--ghost" onClick={onSaveCopy} title="Save as a new copy">Save copy</button>
        )}
        <button className="cc-btn cc-btn--sm cc-btn--ghost" onClick={onNew} title="Start a new character">＋ New</button>
        <button className="cc-btn cc-btn--sm cc-btn--ghost" onClick={onExport} title="Export the current character to a JSON file">⬇ Export</button>
        <button className="cc-btn cc-btn--sm cc-btn--ghost" onClick={() => fileRef.current?.click()} title="Import a character from a JSON file">⬆ Import</button>
        <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={onFile} />
        <button
          className={`cc-btn cc-btn--sm cc-btn--ghost ${open ? 'is-on' : ''}`}
          onClick={() => setOpen((o) => !o)}
        >
          Saved ({roster.length}) {open ? '▴' : '▾'}
        </button>
        {dirty && loadedId && <span className="cc-roster__dirty" title="Unsaved changes">●</span>}
      </div>

      {open && (
        roster.length === 0 ? (
          <p className="cc-roster__empty">No saved characters yet. Click <strong>Save to roster</strong>.</p>
        ) : (
          <ul className="cc-roster__list">
            {roster.map((item) => (
              <RosterRow
                key={item.id}
                item={item}
                isLoaded={item.id === loadedId}
                onLoad={(id) => { onLoad(id); setOpen(false) }}
                onRename={onRename}
                onDelete={onDelete}
                onExport={onExportItem}
              />
            ))}
          </ul>
        )
      )}
    </div>
  )
}
