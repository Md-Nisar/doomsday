import { seoConfig } from '../config/seo'
import type {
  Character,
  NewsArticle,
  Person,
  Rumor,
  Theory,
  Trailer,
} from '../types/content'
import type { RobotsPolicy, ResolvedSeo, SeoOverrides } from '../types/seo'

/**
 * The reusable SEO seam: canonical/title/robots helpers plus per-content
 * default resolution and JSON-LD builders. Nothing here is wired to a
 * router (none exists yet) — future route components call these directly.
 */

export function getSiteUrl(): string {
  return `https://${seoConfig.domain}`
}

/** Joins `path` onto the site origin. Accepts with or without a leading slash. */
export function getCanonicalUrl(path = '/'): string {
  if (path === '/' || path === '') return `${getSiteUrl()}/`
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${getSiteUrl()}${normalized}`
}

/** Applies the site title template; omit `pageTitle` for the homepage. */
export function buildTitle(pageTitle?: string): string {
  if (!pageTitle) return seoConfig.defaultTitle
  return seoConfig.titleTemplate.replace('%s', pageTitle)
}

export function getRobotsContent(overrides?: Partial<RobotsPolicy>): string {
  const policy = { ...seoConfig.robots, ...overrides }
  return [policy.index ? 'index' : 'noindex', policy.follow ? 'follow' : 'nofollow'].join(', ')
}

function resolveSeo(
  overrides: SeoOverrides | undefined,
  fallback: ResolvedSeo,
): ResolvedSeo {
  return {
    title: overrides?.title ?? fallback.title,
    description: overrides?.description ?? fallback.description,
    canonicalPath: overrides?.canonicalPath ?? fallback.canonicalPath,
    image: overrides?.image ?? fallback.image,
  }
}

export function getNewsArticleSeo(article: NewsArticle): ResolvedSeo {
  return resolveSeo(article.seo, {
    title: article.title,
    description: article.excerpt,
    canonicalPath: `/news/${article.slug}`,
    image: article.featuredImage,
  })
}

export function getTrailerSeo(trailer: Trailer): ResolvedSeo {
  return resolveSeo(trailer.seo, {
    title: trailer.title,
    description: trailer.description,
    canonicalPath: `/trailers/${trailer.slug}`,
    image: trailer.thumbnail,
  })
}

export function getCastSeo(person: Person): ResolvedSeo {
  return resolveSeo(person.seo, {
    title: person.name,
    description: person.description,
    canonicalPath: `/cast/${person.slug}`,
    image: person.image,
  })
}

export function getCharacterSeo(character: Character): ResolvedSeo {
  return resolveSeo(character.seo, {
    title: character.name,
    description: character.description,
    canonicalPath: `/characters/${character.slug}`,
    image: character.image,
  })
}

export function getTheorySeo(theory: Theory): ResolvedSeo {
  return resolveSeo(theory.seo, {
    title: theory.title,
    description: theory.excerpt,
    canonicalPath: `/theories/${theory.slug}`,
  })
}

/**
 * "Rumor: ... — What We Know" rather than the claim phrased as a headline —
 * the title must never imply the claim is settled (see README's "Rumor
 * Intelligence" section on avoiding sensationalized SEO titles).
 */
export function getRumorSeo(rumor: Rumor): ResolvedSeo {
  return resolveSeo(rumor.seo, {
    title: `Rumor: ${rumor.title} — What We Know`,
    description: rumor.summary,
    canonicalPath: `/rumors/${rumor.slug}`,
  })
}

// --- JSON-LD (schema.org) builders -----------------------------------------
// Only ever fed real data. None of these are called with placeholder content.

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seoConfig.siteName,
    url: getSiteUrl(),
    description: seoConfig.defaultDescription,
  }
}

export function buildWebPageJsonLd(options: { path: string; title?: string; description?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: buildTitle(options.title),
    description: options.description ?? seoConfig.defaultDescription,
    url: getCanonicalUrl(options.path),
    isPartOf: {
      '@type': 'WebSite',
      name: seoConfig.siteName,
      url: getSiteUrl(),
    },
  }
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.path),
    })),
  }
}

export function buildArticleJsonLd(article: NewsArticle) {
  const seo = getNewsArticleSeo(article)
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: seo.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    url: getCanonicalUrl(seo.canonicalPath),
    ...(article.author ? { author: { '@type': 'Person', name: article.author.name } } : {}),
    ...(article.source ? { isBasedOn: article.source.url } : {}),
    ...(seo.image ? { image: seo.image.url } : {}),
  }
}

export function buildPersonJsonLd(person: Person) {
  const seo = getCastSeo(person)
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    description: person.description,
    url: getCanonicalUrl(seo.canonicalPath),
    ...(seo.image ? { image: seo.image.url } : {}),
  }
}

/**
 * Only call this when `trailer.videoUrl` is set (a `verificationStatus:
 * 'verified'` trailer) — an unverified trailer has no confirmed video to
 * describe, and `VideoObject` requires a real `contentUrl`.
 */
export function buildVideoObjectJsonLd(trailer: Trailer & { videoUrl: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: trailer.title,
    description: trailer.description,
    uploadDate: trailer.releaseDate,
    contentUrl: trailer.videoUrl,
    ...(trailer.duration ? { duration: `PT${trailer.duration}S` } : {}),
    ...(trailer.thumbnail ? { thumbnailUrl: trailer.thumbnail.url } : {}),
  }
}
