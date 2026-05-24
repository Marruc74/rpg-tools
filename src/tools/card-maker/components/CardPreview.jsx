import CardFace from './CardFace.jsx'
import { emptySide } from '../lib/newCard.js'
import { BACK_MODES } from '../lib/library.js'

export default function CardPreview({
  card,
  gameName,
  sizeId,
  backMode,
  sharedBacks,
  frontRef,
  backRef,
}) {
  const isShared = backMode === BACK_MODES.SHARED
  const backSide = isShared
    ? (sharedBacks?.[card.category] ?? emptySide())
    : card.back

  return (
    <section className="card-preview">
      <h2>Preview</h2>
      <div className="card-preview__pair">
        <div>
          <div className="card-preview__label">Front</div>
          <CardFace
            ref={frontRef}
            side={card.front}
            category={card.category}
            style={card.style}
            gameName={gameName}
            sizeId={sizeId}
          />
        </div>
        <div>
          <div className="card-preview__label">
            Back{isShared ? ` (shared · ${card.category || 'no category'})` : ''}
          </div>
          <CardFace
            ref={backRef}
            side={backSide}
            category={card.category}
            style={card.style}
            gameName={gameName}
            sizeId={sizeId}
            hideImage={!isShared}
            hideTitle={!isShared}
          />
        </div>
      </div>
    </section>
  )
}
