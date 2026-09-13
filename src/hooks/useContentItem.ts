import { useEffect, useState } from 'react'

/**
 * Loads a single entity through the content access layer. `loader` must be
 * memoized by the caller (e.g. `useCallback(() => getNewsBySlug(slug), [slug])`)
 * so the effect re-runs only when the identity it depends on actually changes.
 */
export function useContentItem<T>(
  loader: () => Promise<T | undefined>,
): { item: T | undefined; loading: boolean } {
  const [item, setItem] = useState<T | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [prevLoader, setPrevLoader] = useState(() => loader)

  if (loader !== prevLoader) {
    setPrevLoader(() => loader)
    setItem(undefined)
    setLoading(true)
  }

  useEffect(() => {
    let active = true
    loader().then((data) => {
      if (active) {
        setItem(data)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [loader])

  return { item, loading }
}
