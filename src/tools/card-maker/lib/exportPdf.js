import jsPDF from 'jspdf'
import { nodeToCanvas } from './exportPng.js'
import { getCardSize } from './cardSizes.js'

// Page sizes in mm (portrait shape; layout swaps to landscape if cards are landscape).
export const PAGE_SIZES = {
  a4:     { w: 210, h: 297, label: 'A4' },
  letter: { w: 216, h: 279, label: 'Letter' },
  legal:  { w: 216, h: 356, label: 'Legal' },
}

const MARGIN_MIN = 8 // mm — minimum margin around grid

function computeLayout(cardSize, pageSizeId = 'a4', scale = 1, gapX = 0, gapY = 0) {
  const page = PAGE_SIZES[pageSizeId] ?? PAGE_SIZES.a4
  const cardW = cardSize.w * scale
  const cardH = cardSize.h * scale

  const isLandscape = cardSize.orientation === 'landscape'
  const pageW = isLandscape ? page.h : page.w
  const pageH = isLandscape ? page.w : page.h

  // N cards plus (N-1) gaps must fit in the available space.
  const availW = pageW - 2 * MARGIN_MIN
  const availH = pageH - 2 * MARGIN_MIN
  const cols = Math.max(1, Math.floor((availW + gapX) / (cardW + gapX)))
  const rows = Math.max(1, Math.floor((availH + gapY) / (cardH + gapY)))

  const gridW = cols * cardW + (cols - 1) * gapX
  const gridH = rows * cardH + (rows - 1) * gapY
  const marginX = (pageW - gridW) / 2
  const marginY = (pageH - gridH) / 2

  return {
    pageW,
    pageH,
    cols,
    rows,
    perPage: cols * rows,
    gridW,
    gridH,
    marginX,
    marginY,
    orientation: isLandscape ? 'landscape' : 'portrait',
    cardW,
    cardH,
    gapX,
    gapY,
    cellW: cardW + gapX, // step from one card's left edge to the next
    cellH: cardH + gapY,
  }
}

function findFace(cardId, side) {
  return document.querySelector(`[data-export-id="${cardId}"][data-export-side="${side}"]`)
}

function drawCutMarks(pdf, layout) {
  pdf.setLineWidth(0.1)
  pdf.setDrawColor(180)
  const tick = 3

  // Tick at every card edge (left + right of each column, top + bottom of
  // each row). For gap=0 the inner pairs coincide and behaviour matches the
  // original single-line-per-grid layout.
  const xs = []
  for (let c = 0; c < layout.cols; c++) {
    const left = layout.marginX + c * layout.cellW
    xs.push(left, left + layout.cardW)
  }
  const ys = []
  for (let r = 0; r < layout.rows; r++) {
    const top = layout.marginY + r * layout.cellH
    ys.push(top, top + layout.cardH)
  }

  for (const x of xs) {
    pdf.line(x, layout.marginY - tick, x, layout.marginY)
    pdf.line(x, layout.marginY + layout.gridH, x, layout.marginY + layout.gridH + tick)
  }
  for (const y of ys) {
    pdf.line(layout.marginX - tick, y, layout.marginX, y)
    pdf.line(layout.marginX + layout.gridW, y, layout.marginX + layout.gridW + tick, y)
  }
}

// Lay out a single sheet's worth of cards. The caller owns page breaks so
// front/back sheets can be interleaved. onFace() is invoked once per card so
// the UI can report progress.
async function placePage(pdf, slice, layout, side, mirror, offsetX = 0, offsetY = 0, onFace) {
  drawCutMarks(pdf, layout)

  for (let i = 0; i < slice.length; i++) {
    const card = slice[i]
    const node = findFace(card.id, side)
    if (node) {
      const canvas = await nodeToCanvas(node)
      const dataUrl = canvas.toDataURL('image/png')

      // Mirror back columns so duplex printing aligns front/back.
      const col = mirror ? layout.cols - 1 - (i % layout.cols) : i % layout.cols
      const row = Math.floor(i / layout.cols)
      const x = layout.marginX + col * layout.cellW + offsetX
      const y = layout.marginY + row * layout.cellH + offsetY

      pdf.addImage(dataUrl, 'PNG', x, y, layout.cardW, layout.cardH)
    }
    onFace?.()
  }
}

// options: {
//   sides?: 'both'|'front'|'back',
//   pageSize?: 'a4'|'letter'|'legal',
//   scale?: number,
//   gap?: number,          // mm of whitespace between cards (both axes)
//   backOffsetX?: number,  // mm; positive = right, applied to backs only
//   backOffsetY?: number,  // mm; positive = down,  applied to backs only
// }
export async function exportLibraryPdf(cards, sizeId, options = {}) {
  const {
    sides = 'both',
    pageSize = 'a4',
    scale = 1,
    gap = 0,
    backOffsetX = 0,
    backOffsetY = 0,
    onProgress,
  } = options
  if (cards.length === 0) {
    alert('No cards to export.')
    return
  }
  const cardSize = getCardSize(sizeId)
  const layout = computeLayout(cardSize, pageSize, scale, gap, gap)

  if (layout.cols === 0 || layout.rows === 0) {
    alert('Card is too large for this page size at the chosen scale.')
    return
  }

  const pdf = new jsPDF({
    unit: 'mm',
    format: [layout.pageW, layout.pageH],
    orientation: layout.orientation,
  })

  // First page already exists from the jsPDF constructor; every page after
  // that needs an explicit addPage().
  let firstSheet = true
  const newSheet = () => {
    if (firstSheet) firstSheet = false
    else pdf.addPage([layout.pageW, layout.pageH], layout.orientation)
  }

  const pageCount = Math.ceil(cards.length / layout.perPage)
  const doFront = sides === 'front' || sides === 'both'
  const doBack = sides === 'back' || sides === 'both'

  const total = cards.length * ((doFront ? 1 : 0) + (doBack ? 1 : 0))
  let done = 0
  const onFace = () => onProgress?.(++done, total)
  onProgress?.(0, total)

  // Interleave per sheet: front of sheet N, then back of sheet N. This is the
  // natural order for duplex printing and for manual flip-and-reprint.
  for (let page = 0; page < pageCount; page++) {
    const slice = cards.slice(page * layout.perPage, (page + 1) * layout.perPage)

    if (doFront) {
      newSheet()
      await placePage(pdf, slice, layout, 'front', false, 0, 0, onFace)
    }
    if (doBack) {
      newSheet()
      await placePage(pdf, slice, layout, 'back', sides === 'both', backOffsetX, backOffsetY, onFace)
    }
  }

  const suffix = sides === 'both' ? '' : `-${sides}`
  pdf.save(`cardmaker-library${suffix}.pdf`)
}

// Exposed for the PDF preview UI. Pure layout math, no side effects.
export function computePdfLayout(cardSize, pageSizeId, scale, gap = 0) {
  return computeLayout(cardSize, pageSizeId, scale, gap, gap)
}
