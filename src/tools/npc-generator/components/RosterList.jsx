import { useState } from 'react'

function buildPreview(fields) {
  return [fields.profession, fields.appearance, fields.quirk]
    .filter(Boolean)
    .join(' · ')
}

function RosterRow({ item, onRename, onDelete, onLoad }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(item.name)

  const commit = () => {
    setEditing(false)
    if (draft !== item.name) onRename(item.id, draft)
  }

  return (
    <li className="npc-roster__item">
      <button
        type="button"
        className="npc-roster__item-load"
        onClick={() => onLoad(item.fields)}
        title="Load this NPC into the result panel"
      >
        <div className="npc-roster__item-preview">
          {buildPreview(item.fields) || <em>No details</em>}
        </div>
      </button>
      {editing ? (
        <input
          autoFocus
          className="npc-roster__item-name-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur()
            if (e.key === 'Escape') {
              setDraft(item.name)
              setEditing(false)
            }
          }}
        />
      ) : (
        <button
          type="button"
          className="npc-roster__item-name"
          onClick={() => {
            setDraft(item.name)
            setEditing(true)
          }}
          title="Click to rename"
        >
          {item.name}
        </button>
      )}
      <button
        type="button"
        className="npc-roster__item-delete icon-button"
        onClick={() => {
          if (confirm(`Delete ${item.name}?`)) onDelete(item.id)
        }}
        title="Delete"
        aria-label={`Delete ${item.name}`}
      >
        ×
      </button>
    </li>
  )
}

export default function RosterList({ roster, onRename, onDelete, onLoad }) {
  return (
    <div className="npc-roster">
      <div className="npc-roster__header">
        <h2>Roster</h2>
      </div>
      {roster.length === 0 ? (
        <p className="hint npc-roster__empty">
          No saved NPCs yet. Roll one and click <strong>Save to roster</strong>.
        </p>
      ) : (
        <ul className="npc-roster__list">
          {roster.map((item) => (
            <RosterRow
              key={item.id}
              item={item}
              onRename={onRename}
              onDelete={onDelete}
              onLoad={onLoad}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
