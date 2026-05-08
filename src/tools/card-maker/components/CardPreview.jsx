import CardFace from './CardFace.jsx'

export default function CardPreview({ card, gameName, sizeId, frontRef, backRef }) {
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
          <div className="card-preview__label">Back</div>
          <CardFace
            ref={backRef}
            side={card.back}
            category={card.category}
            style={card.style}
            gameName={gameName}
            sizeId={sizeId}
            hideImage
            hideTitle
          />
        </div>
      </div>
    </section>
  )
}
