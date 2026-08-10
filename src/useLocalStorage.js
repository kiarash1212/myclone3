import { useEffect, useState } from 'react'

/**
 * Behaves like useState, but reads its initial value from localStorage
 * and writes back to it whenever the value changes.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch (error) {
      console.error(`Could not read localStorage key "${key}":`, error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Could not write localStorage key "${key}":`, error)
    }
  }, [key, value])

  return [value, setValue]
}
