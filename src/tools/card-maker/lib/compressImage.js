/**
 * Read an uploaded image file and return a compact data URL suitable for
 * localStorage. Resizes to fit within `maxWidth` x `maxHeight` (preserving
 * aspect ratio). PNG inputs stay as PNG so transparency is preserved; other
 * inputs are re-encoded as JPEG with the given quality.
 */
export function compressImage(file, opts = {}) {
  const { maxWidth = 800, maxHeight = 1200, quality = 0.85 } = opts
  const isPng = file.type === 'image/png'
  const outputType = isPng ? 'image/png' : 'image/jpeg'

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error)
    reader.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const scale = Math.min(
          1,
          maxWidth / img.width,
          maxHeight / img.height,
        )
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)

        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')

        // Improve resampling quality.
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, w, h)

        const dataUrl = canvas.toDataURL(outputType, quality)

        // If somehow the encoded data URL ended up larger than the source
        // (small images often do), keep the original.
        if (dataUrl.length > reader.result.length) {
          resolve(reader.result)
        } else {
          resolve(dataUrl)
        }
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
