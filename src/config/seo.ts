import type { SeoConfig } from '../types/seo'
import { siteConfig } from './site'

/**
 * Single source of truth for SEO defaults. `index.html`'s static `<head>`
 * tags exist for crawlers/social scrapers that don't execute JS and must be
 * kept in sync with these values by hand (see README) — everything else
 * (document title/meta updates, canonical URLs, JSON-LD) reads from here.
 */
export const seoConfig: SeoConfig = {
  siteName: siteConfig.siteName,
  domain: siteConfig.domain,
  titleTemplate: `%s — ${siteConfig.siteName}`,
  defaultTitle: 'Avengers: Doomsday — Countdown & Intelligence',
  defaultDescription: siteConfig.description,
  defaultImage: undefined,
  locale: 'en_US',
  twitterHandle: siteConfig.social.twitter,
  robots: { index: true, follow: true },
}
