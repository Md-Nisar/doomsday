import { GA_MEASUREMENT_ID, isAnalyticsEnabled } from '../config/analytics'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

let scriptInjected = false

/**
 * Loads gtag.js and configures GA4, following Google's own documented
 * bootstrap order exactly: initialize `window.dataLayer`, define
 * `window.gtag` as a global that pushes onto it, queue `js`/`config`
 * through that global, *then* inject the `<script async>` tag. gtag.js
 * itself expects `window.gtag`/`window.dataLayer` to already exist under
 * those exact global names when it loads — defining a same-named function
 * only in this module's local scope (the prior bug here) never wires it
 * up: `window.gtag` stayed `undefined` and no `collect` request was ever
 * sent, even though the script itself loaded with a 200.
 *
 * Idempotent via the `scriptInjected` module-level flag (not component
 * state), so React StrictMode's dev-only double-invoke of mount effects —
 * or any other repeated call — can never inject the tag twice. A no-op
 * outside production (see `isAnalyticsEnabled`). Wrapped so a blocked or
 * failed script load (ad blockers, offline) can never throw into the app —
 * analytics failing must never break rendering or routing.
 *
 * `send_page_view: false`: this is a React Router SPA, not a multi-page
 * site, so gtag's own automatic initial pageview would fire once and then
 * never again on client-side navigation. `trackPageview` below is the
 * single source of every page_view instead, initial load included, so
 * there's exactly one pageview per route rather than a mismatched extra
 * one from gtag's default behavior.
 */
export function initAnalytics() {
  if (scriptInjected || !isAnalyticsEnabled()) return
  scriptInjected = true

  try {
    window.dataLayer = window.dataLayer || []
    // Must push the real `arguments` object, not a rest-param array:
    // gtag.js only treats `Arguments` entries as gtag commands and silently
    // ignores plain arrays, so `(...args) => push(args)` loads the script
    // but never sends a single `collect` hit.
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }

    window.gtag('js', new Date())
    window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false })

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    document.head.appendChild(script)
  } catch {
    // Analytics must never be able to break the app.
  }
}

/** Fires a GA4 page_view for one route. Call on the initial route and every client-side navigation. */
export function trackPageview(path: string, title?: string) {
  if (!isAnalyticsEnabled() || typeof window.gtag !== 'function') return

  try {
    window.gtag('event', 'page_view', {
      page_location: window.location.href,
      page_path: path,
      page_title: title,
    })
  } catch {
    // Analytics must never be able to break the app.
  }
}
