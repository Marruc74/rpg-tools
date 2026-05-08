import { useEffect, useState } from 'react'

const identity = (x) => x

export function useLocalStorage(key, initialValue, migrate = identity) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      const parsed = raw !== null ? JSON.parse(raw) : initialValue
      return migrate(parsed)
    } catch {
      return migrate(initialValue)
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      if (err && err.name === 'QuotaExceededError') {
        alert(
          'Storage quota exceeded. Try using smaller images or export your library to JSON and remove old cards.',
        )
      } else {
        console.error('Failed to save to localStorage', err)
      }
    }
  }, [key, value])

  return [value, setValue]
}
