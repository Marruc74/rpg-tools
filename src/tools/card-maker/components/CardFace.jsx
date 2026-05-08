import { forwardRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getCardSizePx } from '../lib/cardSizes.js'

const CardFace = forwardRef(function CardFace(
  {
    side,
    category,
    style,
    gameName,
    sizeId,
    hideImage = false,
    hideTitle = false,
  },
  ref,
) {
  const dim = getCardSizePx(sizeId)
  const stats = (side.stats || []).filter(
    (s) => (s.label && s.label.trim()) || (s.value && s.value.trim()),
  )

  const inlineStyle = {
    '--card-w': `${dim.w}px`,
    '--card-h': `${dim.h}px`,
    ...(style && {
      borderColor: style.borderColor,
      borderWidth: `${style.borderWidth}px`,
      borderStyle: 'solid',
      backgroundColor: style.background,
      color: style.textColor,
    }),
  }

  return (
    <div
      className="card-face"
      data-category={category}
      data-orientation={dim.orientation}
      ref={ref}
      style={inlineStyle}
    >
      {!hideTitle && (
        side.title ? (
          <h2
            className="card-face__title"
            style={style?.titleColor ? { color: style.titleColor } : undefined}
          >
            {side.title}
          </h2>
        ) : (
          <h2 className="card-face__title" style={{ color: '#aaa' }}>
            (untitled)
          </h2>
        )
      )}

      {!hideImage && (
        side.image ? (
          <img className="card-face__image" src={side.image} alt="" />
        ) : (
          <div className="card-face__image-placeholder">no image</div>
        )
      )}

      {side.body && (
        <div className="card-face__body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{side.body}</ReactMarkdown>
        </div>
      )}

      {stats.length > 0 && (
        <dl className="card-face__stats">
          {stats.map((stat, i) => (
            <div key={i} style={{ display: 'contents' }}>
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {gameName && <div className="card-face__game">{gameName}</div>}
      {category && <div className="card-face__category">{category}</div>}
    </div>
  )
})

export default CardFace
