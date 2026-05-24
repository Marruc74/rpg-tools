import { useCallback } from 'react'
import CardFace from './CardFace.jsx'
import { emptySide } from '../lib/newCard.js'
import { BACK_MODES } from '../lib/library.js'

// Renders every card's front and back at full size, off-screen, so the PDF
// exporter can rasterize them by data attribute. Also serves as the
// authoritative place to detect content overflow per card, since it
// renders cards at their final pixel dimensions.
export default function HiddenExportArea({
  cards,
  gameName,
  sizeId,
  backMode,
  sharedBacks,
  onOverflowChange,
}) {
  const makeReporter = useCallback(
    (cardId, side) => (overflows) => {
      onOverflowChange?.(cardId, side, overflows)
    },
    [onOverflowChange],
  )

  const isShared = backMode === BACK_MODES.SHARED

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
              onOverflowChange={makeReporter(card.id, 'front')}
            />
          </div>
          <div data-export-id={card.id} data-export-side="back">
            <CardFace
              side={
                isShared
                  ? (sharedBacks?.[card.category] ?? emptySide())
                  : card.back
              }
              category={card.category}
              style={card.style}
              gameName={gameName}
              sizeId={sizeId}
              hideImage={!isShared}
              hideTitle={!isShared}
              onOverflowChange={makeReporter(card.id, 'back')}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
