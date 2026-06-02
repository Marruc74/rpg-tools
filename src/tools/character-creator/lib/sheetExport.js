import { useState } from 'react'
import { toPng } from 'html-to-image'
import jsPDF from 'jspdf'

// Shared export for every character sheet. Captures the sheet DOM node as a PNG
// (via html-to-image) and either downloads it directly or lays it into a
// paginated A4 PDF. Used by all four systems' sheet views so the behaviour stays
// consistent and the per-sheet boilerplate disappears.
const safe = (s) => ((s || 'character').replace(/[^\w\-åäöÅÄÖ ]/g, '').trim() || 'character')

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export function useSheetExport(ref, baseName) {
  const [busy, setBusy] = useState(false)
  const name = () => safe(typeof baseName === 'function' ? baseName() : baseName)

  const render = () => toPng(ref.current, { pixelRatio: 2, backgroundColor: '#fdfaf2' })

  const exportPng = async () => {
    if (!ref.current || busy) return
    setBusy(true)
    try {
      const url = await render()
      const a = document.createElement('a')
      a.href = url
      a.download = `${name()}.png`
      a.click()
    } catch (err) {
      alert('Could not export image: ' + (err?.message || err))
    } finally {
      setBusy(false)
    }
  }

  const exportPdf = async () => {
    if (!ref.current || busy) return
    setBusy(true)
    try {
      const url = await render()
      const img = await loadImage(url)
      const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      const margin = 8
      const usableW = pageW - margin * 2
      const usableH = pageH - margin * 2
      const imgH = (img.height / img.width) * usableW // scaled height at full page width
      const pages = Math.max(1, Math.ceil(imgH / usableH))
      for (let i = 0; i < pages; i++) {
        if (i > 0) pdf.addPage()
        // Same tall image, shifted up one usable-page-height per page; jsPDF clips to the page.
        pdf.addImage(url, 'PNG', margin, margin - i * usableH, usableW, imgH)
      }
      pdf.save(`${name()}.pdf`)
    } catch (err) {
      alert('Could not export PDF: ' + (err?.message || err))
    } finally {
      setBusy(false)
    }
  }

  return { busy, exportPng, exportPdf }
}
