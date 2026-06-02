// Registry of the character-creator's game systems. The CharacterCreatorPage
// host drives whichever descriptor is selected. Each system owns its own
// IndexedDB key, so switching systems preserves each character independently.
import dod from './dod.jsx'
import wfrp from './wfrp.jsx'
import paranoia from './paranoia.jsx'
import t2k from './t2k.jsx'

export const SYSTEMS = [dod, wfrp, paranoia, t2k]
export const systemById = (id) => SYSTEMS.find((s) => s.id === id) || SYSTEMS[0]
