import { get, set } from 'idb-keyval'
import { useCallback, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'

const KEY = 'cardmaker:snapshots'
export const MAX_SNAPSHOTS = 10

// Manual library snapshots persisted in IndexedDB. Independent of the
// undo stack: undo is session-only and silent; snapshots are durable
// and named.
export function useSnapshots() {
  const [snapshots, setSnapshots] = useState([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let cancelled = false
    get(KEY)
      .then((stored) => {
        if (cancelled) return
        setSnapshots(Array.isArray(stored) ? stored : [])
        setHydrated(true)
      })
      .catch(() => setHydrated(true))
    return () => {
      cancelled = true
    }
  }, [])

  const persist = useCallback(async (next) => {
    setSnapshots(next)
    try {
      await set(KEY, next)
    } catch (err) {
      console.error('Failed to persist snapshots', err)
    }
  }, [])

  const save = useCallback(
    async (name, library) => {
      if (snapshots.length >= MAX_SNAPSHOTS) {
        throw new Error(
          `Snapshot limit reached (${MAX_SNAPSHOTS}). Delete one first.`,
        )
      }
      const next = [
        ...snapshots,
        {
          id: uuid(),
          name: name || `Snapshot ${snapshots.length + 1}`,
          createdAt: Date.now(),
          library: structuredClone(library),
        },
      ]
      await persist(next)
    },
    [snapshots, persist],
  )

  const remove = useCallback(
    async (id) => {
      await persist(snapshots.filter((s) => s.id !== id))
    },
    [snapshots, persist],
  )

  const restore = useCallback(
    (id) => {
      const snap = snapshots.find((s) => s.id === id)
      return snap ? structuredClone(snap.library) : null
    },
    [snapshots],
  )

  return { snapshots, hydrated, save, remove, restore }
}
