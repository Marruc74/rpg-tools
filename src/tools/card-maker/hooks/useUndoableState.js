import { useCallback, useEffect, useRef, useState } from 'react'
import { useIndexedDBState } from './useIndexedDBState.js'

// Bursts of edits within this window collapse into a single undo entry.
const COMMIT_DELAY_MS = 600
const MAX_HISTORY = 50

// Wraps useIndexedDBState with undo/redo. Only the live value is persisted;
// past/future stacks are session-only.
export function useUndoableState(key, initialValue, migrate) {
  const [present, setPresent, isReady] = useIndexedDBState(key, initialValue, migrate)
  const [past, setPast] = useState([])
  const [future, setFuture] = useState([])

  // Snapshot of the value as of the last committed-to-past point.
  // setValue restarts the commit timer on every call so a burst of edits
  // produces only one history entry — the pre-burst snapshot.
  const lastCommittedRef = useRef(present)
  const pendingTimerRef = useRef(null)

  // Once IDB hydration completes, the present jumps from the placeholder
  // initialValue to the real stored value. Re-anchor lastCommittedRef so
  // that first user edit doesn't push the placeholder into history.
  useEffect(() => {
    if (isReady) lastCommittedRef.current = present
    // Only re-anchor when the ready transition happens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady])

  const setValue = useCallback((next) => {
    setPresent((cur) => {
      const resolved = typeof next === 'function' ? next(cur) : next
      if (resolved === cur) return cur

      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current)
      pendingTimerRef.current = setTimeout(() => {
        setPast((p) => [...p, lastCommittedRef.current].slice(-MAX_HISTORY))
        setFuture([])
        lastCommittedRef.current = resolved
        pendingTimerRef.current = null
      }, COMMIT_DELAY_MS)

      return resolved
    })
  }, [setPresent])

  // Force any pending burst to commit immediately so undo/redo see a
  // consistent past stack.
  const flushPending = useCallback(() => {
    if (pendingTimerRef.current) {
      clearTimeout(pendingTimerRef.current)
      pendingTimerRef.current = null
      setPast((p) => [...p, lastCommittedRef.current].slice(-MAX_HISTORY))
      setFuture([])
    }
  }, [])

  const undo = useCallback(() => {
    flushPending()
    setPast((p) => {
      if (p.length === 0) return p
      const prev = p[p.length - 1]
      setFuture((f) => [...f, lastCommittedRef.current].slice(-MAX_HISTORY))
      setPresent(prev)
      lastCommittedRef.current = prev
      return p.slice(0, -1)
    })
  }, [flushPending, setPresent])

  const redo = useCallback(() => {
    flushPending()
    setFuture((f) => {
      if (f.length === 0) return f
      const next = f[f.length - 1]
      setPast((p) => [...p, lastCommittedRef.current].slice(-MAX_HISTORY))
      setPresent(next)
      lastCommittedRef.current = next
      return f.slice(0, -1)
    })
  }, [flushPending, setPresent])

  // Clean up the timer on unmount.
  useEffect(() => {
    return () => {
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current)
    }
  }, [])

  return [
    present,
    setValue,
    {
      undo,
      redo,
      canUndo: past.length > 0,
      canRedo: future.length > 0,
      isReady,
    },
  ]
}
