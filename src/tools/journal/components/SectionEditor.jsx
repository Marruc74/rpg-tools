import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getSectionType } from '../lib/sectionTypes.js'

export default function SectionEditor({ section, onChange, onRemove, onMoveUp, onMoveDown, canMoveUp, canMoveDown }) {
  const [mode, setMode] = useState('edit')
  const type = getSectionType(section.type)
  const placeholder = type?.placeholder ?? 'Notes…'

  const update = (patch) => onChange({ ...section, ...patch })

  return (
    <section className="section-editor">
      <header className="section-editor__header">
        <input
          className="section-editor__label"
          value={section.label}
          onChange={(e) => update({ label: e.target.value })}
          placeholder="Section label"
        />
        <div className="section-editor__tabs">
          <button
            type="button"
            className={mode === 'edit' ? 'is-active' : ''}
            onClick={() => setMode('edit')}
          >
            Edit
          </button>
          <button
            type="button"
            className={mode === 'split' ? 'is-active' : ''}
            onClick={() => setMode('split')}
          >
            Split
          </button>
        </div>
        <div className="section-editor__actions">
          <button
            type="button"
            className="icon-button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            title="Move up"
            aria-label="Move section up"
          >
            ↑
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            title="Move down"
            aria-label="Move section down"
          >
            ↓
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={onRemove}
            title="Remove section"
            aria-label="Remove section"
          >
            ×
          </button>
        </div>
      </header>
      <div className={`section-editor__body section-editor__body--${mode}`}>
        <textarea
          rows={5}
          value={section.content}
          onChange={(e) => update({ content: e.target.value })}
          placeholder={placeholder}
        />
        {mode === 'split' && (
          <div className="section-editor__preview">
            {section.content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.content}</ReactMarkdown>
            ) : (
              <p className="hint">Preview appears here.</p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
