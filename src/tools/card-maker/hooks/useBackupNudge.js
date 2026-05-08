import { get, set } from 'idb-keyval'
import { useCallback, useEffect, useState } from 'react'

const LAST_EXPORT_KEY = 'cardmaker:lastExport'
const SNOOZED_UNTIL_KEY = 'cardmaker:exportSnoozedUntil'

const STALE_AFTER_MS = 14 * 24 * 60 * 60 * 1000
const SNOOZE_FOR_MS = 7 * 24 * 60 * 60 * 1000

// Tracks when the library was last exported as JSON. Stale + not snoozed
// drives a banner suggesting the user back up. Snoozing buys 7 days; a
// fresh export resets the clock indefinitely.
export function useBackupNudge() {
  const [lastExport, setLastExport] = useState(null)
  const [snoozedUntil, setSnoozedUntil] = useState(0)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([get(LAST_EXPORT_KEY), get(SNOOZED_UNTIL_KEY)])
      .then(([le, su]) => {
        if (cancelled) return
        setLastExport(typeof le === 'number' ? le : null)
        setSnoozedUntil(typeof su === 'number' ? su : 0)
        setHydrated(true)
      })
      .catch(() => setHydrated(true))
    return () => {
      cancelled = true
    }
  }, [])

  const markExported = useCallback(() => {
    const now = Date.now()
    setLastExport(now)
    setSnoozedUntil(0)
    set(LAST_EXPORT_KEY, now).catch(() => {})
    set(SNOOZED_UNTIL_KEY, 0).catch(() => {})
  }, [])

  const snooze = useCallback(() => {
    const until = Date.now() + SNOOZE_FOR_MS
    setSnoozedUntil(until)
    set(SNOOZED_UNTIL_KEY, until).catch(() => {})
  }, [])

  const now = Date.now()
  const isStale =
    hydrated &&
    now > snoozedUntil &&
    (lastExport === null || now - lastExport > STALE_AFTER_MS)

  return { isStale, lastExport, markExported, snooze }
}
