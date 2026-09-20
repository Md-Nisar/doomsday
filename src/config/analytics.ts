import { siteConfig } from './site'

/**
 * Single source of truth for the GA4 Measurement ID — nothing else in the
 * app should ever hardcode one. Change or blank this one value to
 * repoint/disable production analytics; setting it to an empty string
 * disables analytics entirely regardless of hostname (see
 * `isAnalyticsEnabled`).
 *
 * A GA4 Measurement ID is a public client-side identifier, not a secret —
 * it's meant to ship in frontend source and is visible in every GA4 site's
 * page source, so committing it here is safe. Never put an API secret,
 * service-account key, or other credential in this file.
 */
export const GA_MEASUREMENT_ID = 'G-KWEG3184Z9'

/**
 * Analytics is production-only: it must run on `siteConfig.domain` (the
 * live custom domain) and nowhere else — not `localhost`/`vite dev`, not
 * `vite preview`, not the raw `*.github.io` project URL, not a future
 * staging host. Gating on the exact production hostname (rather than e.g.
 * `import.meta.env.PROD`) means a production *build* previewed or tested
 * anywhere other than the real domain still can't emit real GA4 data.
 */
export function isAnalyticsEnabled(): boolean {
  return Boolean(GA_MEASUREMENT_ID) && typeof window !== 'undefined' && window.location.hostname === siteConfig.domain
}
