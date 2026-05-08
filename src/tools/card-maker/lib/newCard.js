import { v4 as uuid } from 'uuid'

export const DEFAULT_STYLE = {
  borderColor: '#8a6a2c',
  borderWidth: 2,
  background: '#fdfaf3',
  textColor: '#1d1a16',
  titleColor: '#1d1a16',
}

export const BORDER_WIDTHS = [
  { value: 1, label: 'Thin (1 px)' },
  { value: 2, label: 'Normal (2 px)' },
  { value: 3, label: 'Medium (3 px)' },
  { value: 5, label: 'Thick (5 px)' },
]

export function emptySide() {
  return { title: '', image: null, body: '', stats: [] }
}

export function newCard(overrides = {}) {
  return {
    id: uuid(),
    name: 'Untitled card',
    category: 'Item',
    style: { ...DEFAULT_STYLE },
    front: emptySide(),
    back: emptySide(),
    ...overrides,
  }
}
