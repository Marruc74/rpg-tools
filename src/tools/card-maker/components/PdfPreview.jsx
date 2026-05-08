import CardFace from './CardFace.jsx'
import { computePdfLayout } from '../lib/exportPdf.js'
import { getCardSize, getCardSizePx } from '../lib/cardSizes.js'

const PREVIEW_SCALE = 0.4
const PX_PER_MM = 4

// Renders a small visual mock of how the PDF will be laid out. Uses the
// same layout math as the real exporter; only the pixel scaling for screen
// display is added on top.
export default function PdfPreview({ cards, sizeId, options, onClose }) {
  const { sides = 'both', pageSize = 'a4', scale = 1 } = options
  const cardSize = getCardSize(sizeId)
  const layout = computePdfLayout(cardSize, pageSize, scale)
  const dim = getCardSizePx(sizeId)

  const px = PREVIEW_SCALE * PX_PER_MM
  const pageWpx = layout.pageW * px
  const pageHpx = layout.pageH * px

  const sideKeys =
    sides === 'both' ? ['front', 'back']
      : sides === 'back' ? ['back']
      : ['front']

  // Build a flat list of pages: { side, cards[], mirror }
  const pages = []
  for (const side of sideKeys) {
    const mirror = side === 'back' && sides === 'both'
    for (let i = 0; i < cards.length; i += layout.perPage) {
      pages.push({
        side,
        mirror,
        slice: cards.slice(i, i + layout.perPage),
      })
    }
  }

  if (pages.length === 0) {
    return (
      <div className="pdf-preview">
        <PdfPreviewHeader layout={layout} options={options} onClose={onClose} />
        <p className="hint">Add a card to see the layout.</p>
      </div>
    )
  }

  return (
    <div className="pdf-preview">
      <PdfPreviewHeader layout={layout} options={options} onClose={onClose} />
      <div className="pdf-preview__pages">
        {pages.map((page, pIdx) => (
          <div
            key={pIdx}
            className="pdf-preview__page"
            style={{ width: pageWpx, height: pageHpx }}
          >
            {page.slice.map((card, i) => {
              const col = page.mirror
                ? layout.cols - 1 - (i % layout.cols)
                : i % layout.cols
              const row = Math.floor(i / layout.cols)
              const left = (layout.marginX + col * layout.cardW) * px
              const top = (layout.marginY + row * layout.cardH) * px
              const cellW = layout.cardW * px
              const cellH = layout.cardH * px
              // The CardFace renders at its natural pixel dim (dim.w/dim.h).
              // We need it to fit the cell (which already has userScale baked in).
              const innerScale = cellW / dim.w
              return (
                <div
                  key={card.id}
                  className="pdf-preview__cell"
                  style={{ left, top, width: cellW, height: cellH }}
                >
                  <div
                    style={{
                      transform: `scale(${innerScale})`,
                      transformOrigin: 'top left',
                      width: dim.w,
                      height: dim.h,
                    }}
                  >
                    <CardFace
                      side={page.side === 'front' ? card.front : card.back}
                      category={card.category}
                      style={card.style}
                      sizeId={sizeId}
                      hideImage={page.side === 'back'}
                      hideTitle={page.side === 'back'}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function PdfPreviewHeader({ layout, options, onClose }) {
  return (
    <div className="pdf-preview__header">
      <strong>PDF preview</strong>
      <span className="hint">
        {layout.cols} × {layout.rows} per page · {options.pageSize.toUpperCase()} ·{' '}
        {Math.round(options.scale * 100)}% · {options.sides}
      </span>
      <button type="button" className="link" onClick={onClose}>Close</button>
    </div>
  )
}
