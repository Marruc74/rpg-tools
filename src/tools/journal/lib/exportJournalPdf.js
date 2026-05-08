import jsPDF from 'jspdf'
import { toCanvas } from 'html-to-image'
import { PRINT_ROOT_ID } from '../components/PrintArea.jsx'

const PAGE_W_MM = 210
const PAGE_H_MM = 297

function safeFilename(name) {
  return (name || 'journal').replace(/[^a-z0-9-_ ]/gi, '_').trim() || 'journal'
}

// Rasterizes each `[data-print-page]` node inside the print root and
// emits one PDF page per source page. Each source page is exactly A4,
// so no per-page slicing is needed.
export async function exportTemplatePdf(templateName = 'journal') {
  const root = document.querySelector(`[data-print-root="${PRINT_ROOT_ID}"]`)
  if (!root) {
    alert('Could not find the print area.')
    return
  }
  const pageNodes = root.querySelectorAll('[data-print-page]')
  if (pageNodes.length === 0) {
    alert('No pages to print.')
    return
  }

  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })

  for (let i = 0; i < pageNodes.length; i++) {
    const canvas = await toCanvas(pageNodes[i], { pixelRatio: 2, cacheBust: true })
    const dataUrl = canvas.toDataURL('image/png')
    if (i > 0) pdf.addPage()
    pdf.addImage(dataUrl, 'PNG', 0, 0, PAGE_W_MM, PAGE_H_MM)
  }

  pdf.save(`${safeFilename(templateName)}.pdf`)
}
