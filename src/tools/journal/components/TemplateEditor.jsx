import { useState } from 'react'
import { SECTION_TYPES } from '../lib/sectionTypes.js'
import { newSection, newSubsection } from '../lib/journalTemplate.js'

const LINE_OPTIONS = [1, 2, 3, 4, 5, 6, 8, 10]
const REPEAT_OPTIONS = [1, 2, 3, 4, 6, 8, 10, 12]

export default function TemplateEditor({ template, onChange }) {
  const [addType, setAddType] = useState('')

  const updateTitle = (title) => onChange({ ...template, title })

  const updateSections = (next) => onChange({ ...template, sections: next })

  const updateSection = (id, patch) =>
    updateSections(
      template.sections.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    )

  const removeSection = (id) =>
    updateSections(template.sections.filter((s) => s.id !== id))

  const moveSection = (idx, delta) => {
    const target = idx + delta
    if (target < 0 || target >= template.sections.length) return
    const next = template.sections.slice()
    const [moved] = next.splice(idx, 1)
    next.splice(target, 0, moved)
    updateSections(next)
  }

  const addSection = () => {
    if (!addType) return
    updateSections([...template.sections, newSection(addType)])
    setAddType('')
  }

  return (
    <section className="template-editor">
      <header className="template-editor__header">
        <h2>Template</h2>
        <p className="hint">
          Pick sections, set their width and repeat count, and arrange them.
          Nothing typed here is saved with the printed page — these labels
          become the headings on a blank form for handwriting.
        </p>
      </header>

      <label className="template-editor__title-field">
        <span>Sheet title</span>
        <input
          type="text"
          value={template.title ?? ''}
          onChange={(e) => updateTitle(e.target.value)}
          placeholder="Session Notes"
        />
      </label>

      <div className="template-editor__sections">
        {template.sections.length === 0 && (
          <p className="hint">No sections yet. Add one below.</p>
        )}
        {template.sections.map((section, idx) => (
          <SectionRow
            key={section.id}
            section={section}
            canMoveUp={idx > 0}
            canMoveDown={idx < template.sections.length - 1}
            onChange={(patch) => updateSection(section.id, patch)}
            onRemove={() => removeSection(section.id)}
            onMoveUp={() => moveSection(idx, -1)}
            onMoveDown={() => moveSection(idx, 1)}
          />
        ))}
      </div>

      <div className="template-editor__add">
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

function SectionRow({ section, canMoveUp, canMoveDown, onChange, onRemove, onMoveUp, onMoveDown }) {
  const updateSubsection = (id, patch) =>
    onChange({
      subsections: section.subsections.map((s) =>
        s.id === id ? { ...s, ...patch } : s,
      ),
    })

  const removeSubsection = (id) =>
    onChange({ subsections: section.subsections.filter((s) => s.id !== id) })

  const addSubsection = () =>
    onChange({ subsections: [...section.subsections, newSubsection({ lines: 2 })] })

  const moveSubsection = (idx, delta) => {
    const target = idx + delta
    if (target < 0 || target >= section.subsections.length) return
    const next = section.subsections.slice()
    const [moved] = next.splice(idx, 1)
    next.splice(target, 0, moved)
    onChange({ subsections: next })
  }

  return (
    <div className="section-row">
      <div className="section-row__head">
        <input
          className="section-row__label"
          value={section.label}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="Section heading"
        />
        <div className="section-row__actions">
          <button className="icon-button" onClick={onMoveUp} disabled={!canMoveUp} title="Move up" aria-label="Move section up">↑</button>
          <button className="icon-button" onClick={onMoveDown} disabled={!canMoveDown} title="Move down" aria-label="Move section down">↓</button>
          <button className="icon-button" onClick={onRemove} title="Remove section" aria-label="Remove section">×</button>
        </div>
      </div>

      <div className="section-row__meta">
        <label>
          <span>Width</span>
          <select
            value={section.span ?? 'full'}
            onChange={(e) => onChange({ span: e.target.value })}
          >
            <option value="full">Full</option>
            <option value="half">Half</option>
          </select>
        </label>
        <label>
          <span>Repeat</span>
          <select
            value={section.repeat ?? 1}
            onChange={(e) => onChange({ repeat: Number(e.target.value) })}
          >
            {REPEAT_OPTIONS.map((n) => (
              <option key={n} value={n}>{n}×</option>
            ))}
          </select>
        </label>
      </div>

      <div className="section-row__subs">
        {section.subsections.map((sub, i) => (
          <div key={sub.id} className="sub-row">
            <input
              className="sub-row__label"
              value={sub.label}
              onChange={(e) => updateSubsection(sub.id, { label: e.target.value })}
              placeholder="Sub-label (optional)"
            />
            <label className="sub-row__lines">
              <span>Lines</span>
              <select
                value={sub.lines}
                onChange={(e) => updateSubsection(sub.id, { lines: Number(e.target.value) })}
              >
                {LINE_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
            <button className="icon-button" onClick={() => moveSubsection(i, -1)} disabled={i === 0} title="Move up" aria-label="Move subsection up">↑</button>
            <button className="icon-button" onClick={() => moveSubsection(i, 1)} disabled={i === section.subsections.length - 1} title="Move down" aria-label="Move subsection down">↓</button>
            <button className="icon-button" onClick={() => removeSubsection(sub.id)} title="Remove subsection" aria-label="Remove subsection">×</button>
          </div>
        ))}
        <button type="button" className="link" onClick={addSubsection}>
          + Add subsection
        </button>
      </div>
    </div>
  )
}
