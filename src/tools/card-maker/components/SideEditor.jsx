import { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { compressImage } from '../lib/compressImage.js'
import { IMAGE_FIT_OPTIONS } from '../lib/newCard.js'

function clamp01(v) {
  return Math.max(0, Math.min(1, v))
}

function FocusPicker({ src, focus, onChange, disabled = false }) {
  const ref = useRef(null)
  const [dragging, setDragging] = useState(false)

  const setFromEvent = (e) => {
    if (disabled) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = clamp01((e.clientX - rect.left) / rect.width)
    const y = clamp01((e.clientY - rect.top) / rect.height)
    onChange({ x, y })
  }

  return (
    <div className={`focus-picker${disabled ? ' is-disabled' : ''}`}>
      <div
        ref={ref}
        className="focus-picker__image"
        onPointerDown={(e) => {
          if (disabled) return
          e.currentTarget.setPointerCapture(e.pointerId)
          setDragging(true)
          setFromEvent(e)
        }}
        onPointerMove={(e) => {
          if (dragging) setFromEvent(e)
        }}
        onPointerUp={(e) => {
          if (disabled) return
          e.currentTarget.releasePointerCapture(e.pointerId)
          setDragging(false)
        }}
        style={{ backgroundImage: `url(${src})` }}
      >
        <div
          className="focus-picker__dot"
          style={{ left: `${focus.x * 100}%`, top: `${focus.y * 100}%` }}
        />
      </div>
      <span className="hint">
        {disabled
          ? 'Focal point only applies when the image keeps its aspect ratio.'
          : 'Click or drag to set the focal point — what stays centered when the image is cropped to fit the card.'}
      </span>
    </div>
  )
}

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
              <button type="button" className="link" onClick={() => update({ image: null, focus: undefined })}>
                Remove image
              </button>
            )}
          </div>
          {side.image && (
            <>
              <label className="field field--inline">
                <span>Fit</span>
                <select
                  value={side.imageFit ?? 'cover'}
                  onChange={(e) => update({ imageFit: e.target.value })}
                >
                  {IMAGE_FIT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </label>
              <FocusPicker
                src={side.image}
                focus={side.focus ?? { x: 0.5, y: 0.5 }}
                onChange={(focus) => update({ focus })}
                disabled={(side.imageFit ?? 'cover') === 'fill'}
              />
            </>
          )}
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
