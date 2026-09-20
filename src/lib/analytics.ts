import { GA_MEASUREMENT_ID, isAnalyticsEnabled } from '../config/analytics'

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

let scriptInjected = false

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push(args)
}

/**
 * Loads gtag.js and configures GA4. Idempotent and safe to call from
 * multiple mounts (StrictMode double-invokes effects); a no-op outside
 * production (see `isAnalyticsEnabled`). Wrapped so a blocked/failed script
 * load (ad blockers, offline) can never throw into the app — analytics
 * failing must never break rendering or routing.
 *
 * `send_page_view: false`: this is a React Router SPA, not a
 * multi-page site, so gtag's own automatic initial pageview would fire
 * once and then never again on client-side navigation. `trackPageview`
 * below is the single source of every page_view instead, initial load
 * included, so there's exactly one pageview per route rather than a
 * mismatched extra one from gtag's default behavior.
 */
export function initAnalytics() {
  if (scriptInjected || !isAnalyticsEnabled()) return
  scriptInjected = true

  try {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    document.head.appendChild(script)

    gtag('js', new Date())
    gtag('config', GA_MEASUREMENT_ID, { send_page_view: false })
  } catch {
    // Analytics must never be able to break the app.
  }
}

/** Fires a GA4 page_view for one route. Call on the initial route and every client-side navigation. */
export function trackPageview(path: string, title?: string) {
  if (!isAnalyticsEnabled()) return

  try {
    gtag('event', 'page_view', {
      page_location: window.location.href,
      page_path: path,
      page_title: title,
    })
  } catch {
    // Analytics must never be able to break the app.
  }
}
