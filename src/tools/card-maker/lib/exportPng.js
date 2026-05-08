import { toCanvas } from 'html-to-image'

const SCALE = 3

export async function nodeToCanvas(node) {
  return toCanvas(node, {
    pixelRatio: SCALE,
    cacheBust: true,
  })
}

export function downloadCanvas(canvas, filename) {
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  })
}

function safeFilename(name) {
  return (name || 'card').replace(/[^a-z0-9-_ ]/gi, '_').trim() || 'card'
}

export async function exportCardPngs(card, frontEl, backEl) {
  const base = safeFilename(card.name)
  const front = await nodeToCanvas(frontEl)
  downloadCanvas(front, `${base}-front.png`)
  const back = await nodeToCanvas(backEl)
  downloadCanvas(back, `${base}-back.png`)
}
