import { useEffect, useState } from 'react'

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}

// Reads the browser's storage estimate, which covers IndexedDB and other
// per-origin storage. Re-reads when the library prop reference changes,
// since save → estimate update is best-effort and slightly lagging.
export default function StorageIndicator({ library }) {
  const [usage, setUsage] = useState(0)
  const [quota, setQuota] = useState(0)
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    if (!navigator.storage?.estimate) {
      setSupported(false)
      return
    }
    let cancelled = false
    navigator.storage
      .estimate()
      .then((est) => {
        if (cancelled) return
        setUsage(est.usage ?? 0)
        setQuota(est.quota ?? 0)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [library])

  if (!supported) return null

  const pct = quota > 0 ? Math.min(100, (usage / quota) * 100) : 0
  const tone = pct > 85 ? 'danger' : pct > 65 ? 'warn' : 'ok'

  return (
    <div
      className={`storage-indicator storage-indicator--${tone}`}
      title="Browser storage usage (IndexedDB + other origin storage)"
    >
      <div className="storage-indicator__bar">
        <div className="storage-indicator__fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="storage-indicator__text">
        {formatBytes(usage)} / {formatBytes(quota)}
      </span>
    </div>
  )
}
