import { toCanvas } from 'html-to-image'

const SCALE = 3

// Wait until every <img> inside the node has actually decoded. html-to-image
// snapshots synchronously, so capturing before images are ready is the main
// cause of intermittently blank/partial cards. onerror also resolves so a
// single broken image can never hang the whole export.
async function waitForImages(node) {
  const imgs = Array.from(node.querySelectorAll('img'))
  await Promise.all(
    imgs.map((img) => {
      if (img.complete && img.naturalWidth > 0) {
        return img.decode().catch(() => {})
      }
      return new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true })
        img.addEventListener('error', resolve, { once: true })
      })
    }),
  )
}

export async function nodeToCanvas(node) {
  // Fonts + images must be loaded before rasterizing. Both promises are
  // effectively free once resolved, so awaiting per-card is cheap.
  if (document.fonts?.ready) await document.fonts.ready
  await waitForImages(node)
  // No cacheBust: it forces a fresh network fetch of every image/font on
  // every capture, which made multi-card PDF export slow and unreliable.
  return toCanvas(node, {
    pixelRatio: SCALE,
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
