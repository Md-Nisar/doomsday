import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { initAnalytics, trackPageview } from '../../lib/analytics'

/**
 * Mounted once inside `<BrowserRouter>` in `App.tsx`, alongside every
 * route rather than inside `Layout`, so it observes every navigation
 * regardless of which lazy route is showing. Renders nothing.
 *
 * Loads gtag.js on first mount (a no-op outside production — see
 * `isAnalyticsEnabled`), then fires one GA4 page_view per route,
 * including the first: React Router never triggers a full page load, so
 * gtag's own automatic pageview (tied to `window`'s load event) would
 * only ever fire once and never again on client-side navigation.
 */
export function Analytics() {
  const location = useLocation()

  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    trackPageview(`${location.pathname}${location.search}`, document.title)
  }, [location.pathname, location.search])

  return null
}
