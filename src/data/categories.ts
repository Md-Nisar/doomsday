import type { ContentCategory } from '../types/content'

export interface CategoryDefinition {
  slug: ContentCategory
  label: string
  path: string
}

/**
 * Single source of truth for category labels and future routes, so
 * neither gets re-typed as a string literal in nav, cards, or page titles.
 */
export const CATEGORIES: Record<ContentCategory, CategoryDefinition> = {
  news: { slug: 'news', label: 'News', path: '/news' },
  trailers: { slug: 'trailers', label: 'Trailers', path: '/trailers' },
  cast: { slug: 'cast', label: 'Cast', path: '/cast' },
  characters: { slug: 'characters', label: 'Characters', path: '/characters' },
  theories: { slug: 'theories', label: 'Theories', path: '/theories' },
  rumors: { slug: 'rumors', label: 'Rumors', path: '/rumors' },
  timeline: { slug: 'timeline', label: 'Timeline', path: '/timeline' },
}
