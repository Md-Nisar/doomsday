import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { CATEGORIES } from '../src/data/categories'
import { SEARCH_PATH } from '../src/data/navigation'
import {
  getCast,
  getCharacters,
  getNews,
  getRumors,
  getTheories,
  getTimeline,
  getTrailers,
} from '../src/lib/content'
import { seoConfig } from '../src/config/seo'

/**
 * Generates `public/sitemap.xml` from the same content access layer the app
 * reads through — so the sitemap can never list a route with no real page
 * behind it, or drift out of sync with what `src/data/*` actually holds.
 * Run as part of `npm run build`, before Vite copies `public/` into `dist/`.
 */

const siteUrl = `https://${seoConfig.domain}`

async function collectPaths(): Promise<string[]> {
  const paths: string[] = ['/']

  const news = await getNews()
  if (news.length > 0) {
    paths.push(CATEGORIES.news.path)
    for (const article of news) paths.push(`${CATEGORIES.news.path}/${article.slug}`)
  }

  const trailers = await getTrailers()
  if (trailers.length > 0) {
    paths.push(CATEGORIES.trailers.path)
    for (const trailer of trailers) paths.push(`${CATEGORIES.trailers.path}/${trailer.slug}`)
  }

  const cast = await getCast()
  if (cast.length > 0) {
    paths.push(CATEGORIES.cast.path)
    for (const person of cast) paths.push(`${CATEGORIES.cast.path}/${person.slug}`)
  }

  const characters = await getCharacters()
  if (characters.length > 0) {
    paths.push(CATEGORIES.characters.path)
    for (const character of characters) paths.push(`${CATEGORIES.characters.path}/${character.slug}`)
  }

  const theories = await getTheories()
  if (theories.length > 0) {
    paths.push(CATEGORIES.theories.path)
    for (const theory of theories) paths.push(`${CATEGORIES.theories.path}/${theory.slug}`)
  }

  const rumors = await getRumors()
  if (rumors.length > 0) {
    paths.push(CATEGORIES.rumors.path)
    for (const rumor of rumors) paths.push(`${CATEGORIES.rumors.path}/${rumor.slug}`)
  }

  const timeline = await getTimeline()
  if (timeline.length > 0) {
    paths.push(CATEGORIES.timeline.path)
  }

  // The bare search landing page only — `?q=` result pages are noindex and
  // deliberately never listed.
  paths.push(SEARCH_PATH)

  return paths
}

const paths = await collectPaths()

const body = paths
  .map((path) => `  <url>\n    <loc>${siteUrl}${path}</loc>\n  </url>`)
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`

const outFile = fileURLToPath(new URL('../public/sitemap.xml', import.meta.url))
writeFileSync(outFile, xml)

console.log(`Generated public/sitemap.xml with ${paths.length} URL(s).`)
