import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { compressImage } from '../lib/compressImage.js'

export default function SideEditor({ side, onChange, hideImage = false, hideTitle = false }) {
  const update = (patch) => onChange({ ...side, ...patch })
  const [bodyMode, setBodyMode] = useState('edit')

  const handleImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await compressImage(file)
      update({ image: dataUrl })
    } catch (err) {
      alert(`Could not load image: ${err.message ?? err}`)
    }
    e.target.value = ''
  }

  const updateStat = (i, patch) => {
    const next = side.stats.slice()
    next[i] = { ...next[i], ...patch }
    update({ stats: next })
  }

  const addStat = () => update({ stats: [...side.stats, { label: '', value: '' }] })
  const removeStat = (i) => update({ stats: side.stats.filter((_, idx) => idx !== i) })

  return (
    <div className="side-editor">
      {!hideTitle && (
        <label className="field">
          <span>Title</span>
          <input
            type="text"
            value={side.title}
            onChange={(e) => update({ title: e.target.value })}
          />
        </label>
      )}

      {!hideImage && (
        <div className="field">
          <span>Image</span>
          <div className="image-row">
            <input type="file" accept="image/*" onChange={handleImage} />
            {side.image && (
              <button type="button" className="link" onClick={() => update({ image: null })}>
                Remove image
              </button>
            )}
          </div>
        </div>
      )}

      <div className="field">
        <div className="body-field__header">
          <span>Body</span>
          <div className="body-field__tabs">
            <button
              type="button"
              className={bodyMode === 'edit' ? 'is-active' : ''}
              onClick={() => setBodyMode('edit')}
            >
              Edit
            </button>
            <button
              type="button"
              className={bodyMode === 'split' ? 'is-active' : ''}
              onClick={() => setBodyMode('split')}
            >
              Split
            </button>
          </div>
        </div>
        <div className={`body-field body-field--${bodyMode}`}>
          <textarea
            rows={hideImage ? 9 : 5}
            value={side.body}
            onChange={(e) => update({ body: e.target.value })}
            placeholder={'Description, lore, rule text…\n\n**bold**, *italic*, `code`, lists, > quotes'}
          />
          {bodyMode === 'split' && (
            <div className="body-field__preview">
              {side.body ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{side.body}</ReactMarkdown>
              ) : (
                <p className="hint">Preview appears here.</p>
              )}
            </div>
          )}
        </div>
        <span className="hint">
          Markdown supported: <code>**bold**</code> <code>*italic*</code> <code>- list</code>{' '}
          <code>### heading</code> <code>&gt; quote</code> <code>`code`</code>
        </span>
      </div>

      <div className="field">
        <span>Stats</span>
        {side.stats.length === 0 && (
          <p className="hint">No stats. Add rows like Damage / 1d8.</p>
        )}
        {side.stats.map((stat, i) => (
          <div key={i} className="stat-row">
            <input
              type="text"
              placeholder="Label"
              value={stat.label}
              onChange={(e) => updateStat(i, { label: e.target.value })}
            />
            <input
              type="text"
              placeholder="Value"
              value={stat.value}
              onChange={(e) => updateStat(i, { value: e.target.value })}
            />
            <button type="button" className="icon-button" onClick={() => removeStat(i)} title="Remove">
              ×
            </button>
          </div>
        ))}
        <button type="button" className="link" onClick={addStat}>+ Add stat</button>
      </div>
    </div>
  )
}
