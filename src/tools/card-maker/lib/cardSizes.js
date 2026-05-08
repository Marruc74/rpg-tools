// Physical card sizes in mm. The preview renders at 4 px/mm.
export const CARD_SIZES = [
  { id: 'poker',     label: 'Poker (63 × 88 mm)',         w: 63, h: 88,  orientation: 'portrait' },
  { id: 'bridge',    label: 'Bridge (56 × 87 mm)',        w: 56, h: 87,  orientation: 'portrait' },
  { id: 'mini',      label: 'Mini (45 × 68 mm)',          w: 45, h: 68,  orientation: 'portrait' },
  { id: 'tarot',     label: 'Tarot (70 × 120 mm)',        w: 70, h: 120, orientation: 'portrait' },
  { id: 'landscape', label: 'Poker landscape (88 × 63)',  w: 88, h: 63,  orientation: 'landscape' },
]

export const DEFAULT_SIZE_ID = 'poker'
export const CUSTOM_SIZE_LABEL = 'Custom…'

const PX_PER_MM = 4

// Accepts either a known size id (string) or a custom shape
// `{ w, h, orientation? }` stored on the collection. Returns a normalized
// `{ w, h, orientation, label? }`.
export function getCardSize(value) {
  if (value && typeof value === 'object') {
    const w = Number(value.w) || CARD_SIZES[0].w
    const h = Number(value.h) || CARD_SIZES[0].h
    return {
      w,
      h,
      orientation: value.orientation || (w > h ? 'landscape' : 'portrait'),
      custom: true,
    }
  }
  return CARD_SIZES.find((s) => s.id === value) ?? CARD_SIZES[0]
}

export function getCardSizePx(value) {
  const s = getCardSize(value)
  return { w: s.w * PX_PER_MM, h: s.h * PX_PER_MM, orientation: s.orientation }
}

export function isCustomSize(value) {
  return !!(value && typeof value === 'object')
}
