// Physical card sizes in mm. The preview renders at 4 px/mm.
export const CARD_SIZES = [
  { id: 'poker',     label: 'Poker (63 × 88 mm)',         w: 63, h: 88,  orientation: 'portrait' },
  { id: 'bridge',    label: 'Bridge (56 × 87 mm)',        w: 56, h: 87,  orientation: 'portrait' },
  { id: 'mini',      label: 'Mini (45 × 68 mm)',          w: 45, h: 68,  orientation: 'portrait' },
  { id: 'tarot',     label: 'Tarot (70 × 120 mm)',        w: 70, h: 120, orientation: 'portrait' },
  { id: 'landscape', label: 'Poker landscape (88 × 63)',  w: 88, h: 63,  orientation: 'landscape' },
]

export const DEFAULT_SIZE_ID = 'poker'

const PX_PER_MM = 4

export function getCardSize(id) {
  return CARD_SIZES.find((s) => s.id === id) ?? CARD_SIZES[0]
}

export function getCardSizePx(id) {
  const s = getCardSize(id)
  return { w: s.w * PX_PER_MM, h: s.h * PX_PER_MM, orientation: s.orientation }
}
