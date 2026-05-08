import { useState } from 'react'
import SectionEditor from './SectionEditor.jsx'
import { SECTION_TYPES, getSectionType } from '../lib/sectionTypes.js'
import { newSection } from '../lib/journalLibrary.js'

export default function EntryEditor({ entry, onChange }) {
  const [addType, setAddType] = useState('')

  const updateField = (patch) => onChange({ ...entry, ...patch })

  const updateSection = (id, next) => {
    onChange({
      ...entry,
      sections: entry.sections.map((s) => (s.id === id ? next : s)),
    })
  }

  const removeSection = (id) => {
    onChange({
      ...entry,
      sections: entry.sections.filter((s) => s.id !== id),
    })
  }

  const moveSection = (idx, delta) => {
    const target = idx + delta
    if (target < 0 || target >= entry.sections.length) return
    const next = entry.sections.slice()
    const [moved] = next.splice(idx, 1)
    next.splice(target, 0, moved)
    onChange({ ...entry, sections: next })
  }

  const addSection = () => {
    if (!addType) return
    onChange({ ...entry, sections: [...entry.sections, newSection(addType)] })
    setAddType('')
  }

  return (
    <section className="entry-editor">
      <div className="entry-editor__header">
        <label className="field field--grow">
          <span>Session title</span>
          <input
            type="text"
            value={entry.title}
            onChange={(e) => updateField({ title: e.target.value })}
            placeholder="Session title"
          />
        </label>
        <label className="field">
          <span>Date played</span>
          <input
            type="date"
            value={entry.date || ''}
            onChange={(e) => updateField({ date: e.target.value })}
          />
        </label>
      </div>

      <div className="entry-editor__sections">
        {entry.sections.length === 0 && (
          <p className="hint">No sections yet. Add one below.</p>
        )}
        {entry.sections.map((section, idx) => (
          <SectionEditor
            key={section.id}
            section={section}
            onChange={(next) => updateSection(section.id, next)}
            onRemove={() => removeSection(section.id)}
            onMoveUp={() => moveSection(idx, -1)}
            onMoveDown={() => moveSection(idx, 1)}
            canMoveUp={idx > 0}
            canMoveDown={idx < entry.sections.length - 1}
          />
        ))}
      </div>

      <div className="entry-editor__add">
        <select value={addType} onChange={(e) => setAddType(e.target.value)}>
          <option value="">Add section…</option>
          {SECTION_TYPES.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
        <button type="button" onClick={addSection} disabled={!addType}>
          Add
        </button>
      </div>
    </section>
  )
}
