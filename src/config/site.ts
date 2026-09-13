import type { SiteConfig } from '../types/site'

/**
 * Release date has shifted publicly before; update this single value if the
 * studio announces a new date rather than touching any UI code.
 *
 * `domain` is the sole source of truth for every production URL (canonical,
 * `og:url`, sitemap/robots, JSON-LD `url` fields — see `src/lib/seo.ts`).
 * Currently `avengers-doomsday.in` (primary/canonical). `doomsdays.in` is a
 * secondary domain the project also owns but does not currently serve from
 * — see README's "Deployment" section before changing this value or
 * re-pointing `public/CNAME`.
 */
export const siteConfig: SiteConfig = {
  siteName: 'Avengers: Doomsday',
  domain: 'avengers-doomsday.in',
  description:
    'An unofficial fan project tracking Avengers: Doomsday — a live countdown plus news, trailers, cast, characters, theories, rumors, and a timeline as they become real.',
  releaseDate: '2026-12-18T00:00:00-05:00',
  disclaimer:
    'This is an unofficial fan project and is not affiliated with, endorsed by, or sponsored by Marvel Studios, Marvel, or Disney. All movie titles, character names, and associated media are trademarks of their respective owners.',
  social: {
    twitter: undefined,
    instagram: undefined,
    ogImage: undefined,
  },
}
