import { get, set } from 'idb-keyval'
import { useEffect, useState } from 'react'

const identity = (x) => x

// Async drop-in for useLocalStorage. Returns [value, setValue, isReady].
// Until isReady is true, value is the (migrated) initialValue and the caller
// should not allow user mutations — show a loading state instead.
export function useIndexedDBState(key, initialValue, migrate = identity) {
  const [value, setValue] = useState(() => migrate(initialValue))
  const [isReady, setIsReady] = useState(false)

  // Hydrate from IDB on mount. Falls back to a one-time migration of any
  // legacy localStorage payload at the same key.
  useEffect(() => {
    let cancelled = false

    ;(async () => {
      let stored
      try {
        stored = await get(key)
      } catch (err) {
        console.error('Failed to read from IndexedDB', err)
      }

      if (stored === undefined) {
        try {
          const raw = window.localStorage.getItem(key)
          if (raw !== null) {
            stored = JSON.parse(raw)
            await set(key, stored)
            window.localStorage.removeItem(key)
          }
        } catch (err) {
          console.warn('localStorage→IDB migration failed', err)
        }
      }

      if (cancelled) return
      setValue(migrate(stored ?? initialValue))
      setIsReady(true)
    })()

    return () => {
      cancelled = true
    }
    // initialValue and migrate are intentionally not deps — they are config
    // captured once at mount, like useLocalStorage's behavior.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  // Persist on every change after hydration.
  useEffect(() => {
    if (!isReady) return
    set(key, value).catch((err) => {
      console.error('Failed to save to IndexedDB', err)
      alert(
        'Failed to save changes to browser storage. Your most recent edits may not persist.',
      )
    })
  }, [key, value, isReady])

  return [value, setValue, isReady]
}
