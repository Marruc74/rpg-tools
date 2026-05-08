import jsPDF from 'jspdf'
import { toCanvas } from 'html-to-image'
import { PRINT_ROOT_ID } from '../components/PrintArea.jsx'
import { getTemplatePageDims } from './journalTemplate.js'

function safeFilename(name) {
  return (name || 'journal').replace(/[^a-z0-9-_ ]/gi, '_').trim() || 'journal'
}

// Rasterizes each `[data-print-page]` node inside the print root and
// emits one PDF page per source page using the template's chosen page
// size and orientation.
export async function exportTemplatePdf(template) {
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

  const dims = getTemplatePageDims(template)
  const pdf = new jsPDF({
    unit: 'mm',
    format: dims.pageSize,
    orientation: dims.orientation,
  })

  for (let i = 0; i < pageNodes.length; i++) {
    const canvas = await toCanvas(pageNodes[i], { pixelRatio: 2, cacheBust: true })
    const dataUrl = canvas.toDataURL('image/png')
    if (i > 0) pdf.addPage()
    pdf.addImage(dataUrl, 'PNG', 0, 0, dims.w_mm, dims.h_mm)
  }

  pdf.save(`${safeFilename(template.name)}.pdf`)
}
