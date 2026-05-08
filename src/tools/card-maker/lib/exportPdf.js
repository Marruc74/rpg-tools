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

function computeLayout(cardSize, pageSizeId = 'a4', scale = 1) {
  const page = PAGE_SIZES[pageSizeId] ?? PAGE_SIZES.a4
  const cardW = cardSize.w * scale
  const cardH = cardSize.h * scale

  const isLandscape = cardSize.orientation === 'landscape'
  const pageW = isLandscape ? page.h : page.w
  const pageH = isLandscape ? page.w : page.h

  const cols = Math.max(1, Math.floor((pageW - 2 * MARGIN_MIN) / cardW))
  const rows = Math.max(1, Math.floor((pageH - 2 * MARGIN_MIN) / cardH))

  const gridW = cols * cardW
  const gridH = rows * cardH
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
  }
}

function findFace(cardId, side) {
  return document.querySelector(`[data-export-id="${cardId}"][data-export-side="${side}"]`)
}

function drawCutMarks(pdf, layout) {
  pdf.setLineWidth(0.1)
  pdf.setDrawColor(180)
  const tick = 3
  for (let c = 0; c <= layout.cols; c++) {
    const x = layout.marginX + c * layout.cardW
    pdf.line(x, layout.marginY - tick, x, layout.marginY)
    pdf.line(x, layout.marginY + layout.gridH, x, layout.marginY + layout.gridH + tick)
  }
  for (let r = 0; r <= layout.rows; r++) {
    const y = layout.marginY + r * layout.cardH
    pdf.line(layout.marginX - tick, y, layout.marginX, y)
    pdf.line(layout.marginX + layout.gridW, y, layout.marginX + layout.gridW + tick, y)
  }
}

async function placeFaces(pdf, cards, layout, side, mirror) {
  const pageCount = Math.ceil(cards.length / layout.perPage)
  for (let page = 0; page < pageCount; page++) {
    if (page > 0) pdf.addPage([layout.pageW, layout.pageH], layout.orientation)
    drawCutMarks(pdf, layout)

    const slice = cards.slice(page * layout.perPage, page * layout.perPage + layout.perPage)
    for (let i = 0; i < slice.length; i++) {
      const card = slice[i]
      const node = findFace(card.id, side)
      if (!node) continue

      const canvas = await nodeToCanvas(node)
      const dataUrl = canvas.toDataURL('image/png')

      // Mirror back columns so duplex printing aligns front/back.
      const col = mirror ? layout.cols - 1 - (i % layout.cols) : i % layout.cols
      const row = Math.floor(i / layout.cols)
      const x = layout.marginX + col * layout.cardW
      const y = layout.marginY + row * layout.cardH

      pdf.addImage(dataUrl, 'PNG', x, y, layout.cardW, layout.cardH)
    }
  }
}

// options: { sides?: 'both'|'front'|'back', pageSize?: 'a4'|'letter'|'legal', scale?: number }
export async function exportLibraryPdf(cards, sizeId, options = {}) {
  const { sides = 'both', pageSize = 'a4', scale = 1 } = options
  if (cards.length === 0) {
    alert('No cards to export.')
    return
  }
  const cardSize = getCardSize(sizeId)
  const layout = computeLayout(cardSize, pageSize, scale)

  if (layout.cols === 0 || layout.rows === 0) {
    alert('Card is too large for this page size at the chosen scale.')
    return
  }

  const pdf = new jsPDF({
    unit: 'mm',
    format: [layout.pageW, layout.pageH],
    orientation: layout.orientation,
  })

  if (sides === 'front' || sides === 'both') {
    await placeFaces(pdf, cards, layout, 'front', false)
  }
  if (sides === 'back' || sides === 'both') {
    if (sides === 'both') {
      pdf.addPage([layout.pageW, layout.pageH], layout.orientation)
    }
    await placeFaces(pdf, cards, layout, 'back', sides === 'both')
  }

  const suffix = sides === 'both' ? '' : `-${sides}`
  pdf.save(`cardmaker-library${suffix}.pdf`)
}

// Exposed for the PDF preview UI. Pure layout math, no side effects.
export function computePdfLayout(cardSize, pageSizeId, scale) {
  return computeLayout(cardSize, pageSizeId, scale)
}
