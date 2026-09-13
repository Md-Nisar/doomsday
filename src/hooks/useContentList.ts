import { useEffect, useState } from 'react'

/**
 * Loads a full collection through the content access layer. `loader` should
 * be a stable reference (e.g. `getNews`) — the effect re-runs whenever it
 * changes, so an inline arrow would refetch every render.
 */
export function useContentList<T>(loader: () => Promise<T[]>): { items: T[]; loading: boolean } {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [prevLoader, setPrevLoader] = useState(() => loader)

  if (loader !== prevLoader) {
    setPrevLoader(() => loader)
    setLoading(true)
  }

  useEffect(() => {
    let active = true
    loader().then((data) => {
      if (active) {
        setItems(data)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [loader])

  return { items, loading }
}
