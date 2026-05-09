import { get, set } from 'idb-keyval'
import {
  LIBRARY_KEY,
  migrateLibrary,
} from '../../card-maker/lib/library.js'
import { newCard, emptySide } from '../../card-maker/lib/newCard.js'
import { composeCardBody } from './npcLibrary.js'

// Direct one-shot writer to the Card-Maker IDB key. We avoid mounting a
// parallel useIndexedDBState here because Card-Maker uses useUndoableState,
// which keeps its own in-memory copy and would clobber any concurrent
// writes from another component on next save. The call site navigates to
// /card-maker right after this resolves, where Card-Maker re-hydrates from
// IDB on mount. (Same cross-tab clobber posture as the rest of the app.)
export async function sendNpcToCardMaker(fields) {
  const raw = await get(LIBRARY_KEY)
  const library = migrateLibrary(raw)

  const collections = library.collections ?? []
  if (collections.length === 0) {
    throw new Error('Card-Maker has no collections to add to.')
  }
  const active =
    collections.find((c) => c.id === library.activeCollectionId) ??
    collections[0]

  const category = active.categories?.includes('NPC')
    ? 'NPC'
    : active.categories?.[0] ?? 'NPC'

  const card = newCard({
    name: fields.name?.trim() || 'Unnamed NPC',
    category,
    style: { ...active.style },
    front: {
      ...emptySide(),
      title: fields.name?.trim() || '',
      body: composeCardBody(fields),
    },
    back: emptySide(),
  })

  const nextLibrary = {
    ...library,
    activeCollectionId: active.id,
    collections: collections.map((c) =>
      c.id === active.id ? { ...c, cards: [card, ...c.cards] } : c,
    ),
  }

  await set(LIBRARY_KEY, nextLibrary)
  return card.id
}
