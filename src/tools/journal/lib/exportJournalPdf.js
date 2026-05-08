import jsPDF from 'jspdf'
import { toCanvas } from 'html-to-image'

const PAGE_W_MM = 210
const PAGE_H_MM = 297

function safeFilename(name) {
  return (name || 'session').replace(/[^a-z0-9-_ ]/gi, '_').trim() || 'session'
}

// Renders the off-screen print area into one or more A4 pages. The
// rendered node uses A4-width pixel sizing so the canvas can be sliced
// vertically into pages without distortion.
export async function exportEntryPdf(entry) {
  const node = document.querySelector(`[data-print-id="${entry.id}"]`)
  if (!node) {
    alert('Could not find the print area for this entry.')
    return
  }

  const canvas = await toCanvas(node, { pixelRatio: 2, cacheBust: true })

  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })

  const pxPerMm = canvas.width / PAGE_W_MM
  const pageHpx = Math.floor(PAGE_H_MM * pxPerMm)

  let y = 0
  let pageIndex = 0
  while (y < canvas.height) {
    const sliceHeight = Math.min(pageHpx, canvas.height - y)
    const slice = document.createElement('canvas')
    slice.width = canvas.width
    slice.height = sliceHeight
    const ctx = slice.getContext('2d')
    ctx.drawImage(
      canvas,
      0,
      y,
      slice.width,
      sliceHeight,
      0,
      0,
      slice.width,
      sliceHeight,
    )
    const dataUrl = slice.toDataURL('image/png')
    if (pageIndex > 0) pdf.addPage()
    pdf.addImage(dataUrl, 'PNG', 0, 0, PAGE_W_MM, sliceHeight / pxPerMm)
    y += pageHpx
    pageIndex++
  }

  pdf.save(`${safeFilename(entry.title)}.pdf`)
}
