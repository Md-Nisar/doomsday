import { useEffect } from 'react'
import { buildTitle, getCanonicalUrl, getRobotsContent } from '../lib/seo'
import type { RobotsPolicy } from '../types/seo'

interface DocumentSeoOptions {
  /** Omit for the homepage — falls back to the site default title. */
  title?: string
  description?: string
  /** Path used to build the canonical URL, e.g. `/news/some-slug`. */
  path?: string
  robots?: Partial<RobotsPolicy>
}

function setMeta(selector: string, attribute: string, value: string, tag = 'meta') {
  let el = document.querySelector<HTMLElement>(selector)
  if (!el) {
    el = document.createElement(tag)
    document.head.appendChild(el)
  }
  el.setAttribute(attribute, value)
}

/**
 * Keeps `document.title`, the meta description, canonical link, and robots
 * directive in sync with `src/lib/seo.ts` at runtime. `index.html` carries
 * the same values statically for crawlers/scrapers that never run this JS —
 * this exists so a future router's page components have one call to make
 * rather than hand-rolling `document.head` writes per page.
 */
export function useDocumentSeo({ title, description, path = '/', robots }: DocumentSeoOptions = {}) {
  useEffect(() => {
    document.title = buildTitle(title)

    if (description) {
      setMeta('meta[name="description"]', 'content', description)
      setMeta('meta[property="og:description"]', 'content', description)
      setMeta('meta[name="twitter:description"]', 'content', description)
    }

    const canonicalUrl = getCanonicalUrl(path)
    setMeta('link[rel="canonical"]', 'href', canonicalUrl, 'link')
    setMeta('meta[property="og:url"]', 'content', canonicalUrl)

    setMeta('meta[name="robots"]', 'content', getRobotsContent(robots))
  }, [title, description, path, robots])
}
