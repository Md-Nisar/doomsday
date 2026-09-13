/**
 * SEO-specific types, kept separate from `content.ts` so entity models
 * don't carry SEO concerns by default — only entities with a future detail
 * page (news, trailers, cast, characters, theories, rumors) opt in via an
 * optional `seo` field.
 */

import type { MediaAsset } from './content'

export interface RobotsPolicy {
  index: boolean
  follow: boolean
}

export interface SeoConfig {
  siteName: string
  domain: string
  /** `%s` is replaced with the page title; used for every page but the homepage. */
  titleTemplate: string
  defaultTitle: string
  defaultDescription: string
  /** Absolute URL. Left unset until a real (non-Marvel-artwork) share image exists. */
  defaultImage?: string
  locale: string
  twitterHandle?: string
  robots: RobotsPolicy
}

/**
 * Per-content overrides. All fields are optional — when absent, the content
 * access layer's SEO resolvers (`src/lib/seo.ts`) derive sensible defaults
 * from the entity's own fields (title, excerpt/description, slug, image)
 * instead of requiring every article/profile to restate them.
 */
export interface SeoOverrides {
  title?: string
  description?: string
  canonicalPath?: string
  image?: MediaAsset
}

export interface ResolvedSeo {
  title: string
  description: string
  canonicalPath: string
  image?: MediaAsset
}
