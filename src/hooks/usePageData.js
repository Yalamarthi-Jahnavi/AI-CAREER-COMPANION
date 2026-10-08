import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * usePageData — Universal data-fetching hook for all pages.
 *
 * Pattern:
 *   const { data, loading, error, refetch } = usePageData(fetchFn, deps)
 *
 * In Stage 2: swap the stub `fetchFn` for a real API call.
 * The hook contract stays the same — no page rewrites needed.
 *
 * @param {Function} fetchFn  - Async function that returns data
 * @param {Array}    deps     - Dependency array to trigger refetch
 * @param {Object}   options  - { immediate, initialData, onSuccess, onError }
 */
export function usePageData(fetchFn, deps = [], options = {}) {
  const {
    immediate = true,
    initialData = null,
    onSuccess,
    onError,
  } = options

  const [data,    setData]    = useState(initialData)
  const [loading, setLoading] = useState(immediate)
  const [error,   setError]   = useState(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    return () => { mountedRef.current = false }
  }, [])

  const execute = useCallback(async () => {
    if (!fetchFn) return
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFn()
      if (mountedRef.current) {
        setData(result)
        onSuccess?.(result)
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err?.message || 'Something went wrong')
        onError?.(err)
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    if (immediate) execute()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute])

  return { data, loading, error, refetch: execute, setData }
}

/**
 * useDebouncedValue — Debounce a rapidly-changing value (e.g., search input).
 * @param {*}      value - Value to debounce
 * @param {number} delay - Delay in ms (default 300)
 */
export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

/**
 * useLocalStorage — Persist state in localStorage.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.error(err)
    }
  }

  return [storedValue, setValue]
}

/**
 * useClickOutside — Detect clicks outside a referenced element.
 */
export function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return
      handler(event)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

/**
 * useKeyPress — Detect specific key combos.
 */
export function useKeyPress(targetKey, handler, options = {}) {
  const { ctrl = false, meta = false } = options
  useEffect(() => {
    const downHandler = (e) => {
      const modKey = ctrl ? e.ctrlKey : meta ? e.metaKey : true
      if (e.key === targetKey && modKey) {
        e.preventDefault()
        handler(e)
      }
    }
    window.addEventListener('keydown', downHandler)
    return () => window.removeEventListener('keydown', downHandler)
  }, [targetKey, handler, ctrl, meta])
}

/**
 * useCountUp — Animate numbers counting up.
 */
export function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime = null
    const startValue = 0
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * (target - startValue) + startValue))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])

  return count
}
