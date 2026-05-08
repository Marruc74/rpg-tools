import CardFace from './CardFace.jsx'

// Renders every card's front and back at full size, off-screen, so the PDF
// exporter can html2canvas them by data attribute.
export default function HiddenExportArea({ cards, gameName, sizeId }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: '-99999px',
        top: 0,
        pointerEvents: 'none',
      }}
    >
      {cards.map((card) => (
        <div key={card.id}>
          <div data-export-id={card.id} data-export-side="front">
            <CardFace
              side={card.front}
              category={card.category}
              style={card.style}
              gameName={gameName}
              sizeId={sizeId}
            />
          </div>
          <div data-export-id={card.id} data-export-side="back">
            <CardFace
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
      ))}
    </div>
  )
}
