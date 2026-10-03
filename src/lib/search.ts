import type { RelatedContentSection } from '../components/content'
import { CATEGORIES } from '../data/categories'
import type { ContentStatus, RumorStatus } from '../types/content'
import { formatContentDate } from '../utils/date'
import { formatDuration } from '../utils/duration'
import { getCast, getCharacters, getNews, getRumors, getTheories, getTimeline, getTrailers } from './content'
import {
  getCharacterConnections,
  getNewsConnections,
  getPersonConnections,
  getRumorConnections,
  getTimelineEventConnections,
  getTrailerConnections,
} from './relationships'

/**
 * Client-side search over the same content access layer every page reads
 * through (`content.ts`) — no search service, no extra dependency. The whole
 * dataset is a few dozen records, so the index is just those records
 * flattened into `SearchDocument`s once and scanned linearly per query.
 *
 * Matching is deterministic and word-prefix based (see `rankEntry`): "thor"
 * matches "Thor" and "Thorn" but not "author". Nothing here is semantic —
 * every hit is a literal text match against real content.
 */

export type SearchEntityType = 'character' | 'person' | 'news' | 'trailer' | 'rumor' | 'timeline' | 'theory'

/** Display order of the result groups. */
export const SEARCH_GROUPS: ReadonlyArray<{ type: SearchEntityType; label: string; singular: string }> = [
  { type: 'character', label: 'Characters', singular: 'Character' },
  { type: 'person', label: 'Cast', singular: 'Cast' },
  { type: 'news', label: 'News', singular: 'News' },
  { type: 'trailer', label: 'Trailers', singular: 'Trailer' },
  { type: 'rumor', label: 'Rumors', singular: 'Rumor' },
  { type: 'timeline', label: 'Timeline', singular: 'Timeline' },
  { type: 'theory', label: 'Theories', singular: 'Theory' },
]

const GROUP_ORDER = new Map(SEARCH_GROUPS.map((group, index) => [group.type, index]))

/** What the UI needs to render one hit — never the full content record. */
export interface SearchDocument {
  type: SearchEntityType
  slug: string
  title: string
  /** Secondary name-like line: the actor, the role, the trailer type, the event type. */
  subtitle?: string
  description: string
  href: string
  /** Set for entities graded on `ContentStatus` (characters, news, timeline). */
  status?: ContentStatus
  /** Set for rumors only — kept separate so a rumor can never be shown with a `ContentStatus`. */
  rumorStatus?: RumorStatus
  /** Pre-formatted short metadata line (date, duration, source count, …). */
  meta?: string
}

interface SearchEntry {
  doc: SearchDocument
  /** Everything below is `normalizeText`-ed once at index time. */
  title: string
  subtitle: string
  keywords: string[]
  description: string
  body: string
}

export type SearchIndex = SearchEntry[]

export interface SearchGroup {
  type: SearchEntityType
  label: string
  results: SearchDocument[]
}

export interface SearchResponse {
  total: number
  groups: SearchGroup[]
  /** The single best match overall — what the "connected" panel is anchored on. */
  top?: SearchDocument
}

const MAX_QUERY_LENGTH = 100

/** Trims, collapses whitespace and caps length — the form kept in the URL and input. */
export function cleanQuery(raw: string | null | undefined): string {
  return (raw ?? '').replace(/\s+/g, ' ').trim().slice(0, MAX_QUERY_LENGTH)
}

/**
 * The form both the query and the indexed text are reduced to before any
 * comparison: lower-cased, diacritics and punctuation dropped, whitespace
 * collapsed. "Spider-Man", "spider man" and " SPIDER  MAN " all become the
 * same string.
 */
export function normalizeText(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

const titleCase = (value: string) => value.charAt(0) + value.slice(1).toLowerCase()

const TRAILER_TYPE_LABEL: Record<string, string> = {
  teaser: 'Teaser',
  trailer: 'Trailer',
  special_look: 'Special Look',
  tv_spot: 'TV Spot',
  clip: 'Clip',
  clock: 'Doomsday Clock',
  other: 'Promotional footage',
}

const TIMELINE_TYPE_LABEL: Record<string, string> = {
  production: 'Production',
  marketing: 'Marketing',
  release: 'Release',
  casting: 'Casting',
  other: 'Other',
}

const STATUS_WORD: Record<ContentStatus, string> = { confirmed: 'confirmed', rumor: 'rumor', theory: 'theory' }

function makeEntry(
  doc: SearchDocument,
  fields: { keywords?: string[]; body?: string[] },
): SearchEntry {
  return {
    doc,
    title: normalizeText(doc.title),
    subtitle: normalizeText(doc.subtitle ?? ''),
    keywords: (fields.keywords ?? []).map(normalizeText).filter(Boolean),
    description: normalizeText(doc.description),
    body: normalizeText((fields.body ?? []).join(' ')),
  }
}

let indexPromise: Promise<SearchIndex> | null = null

/** Built once per page load from the content layer; content is static, so nothing to invalidate. */
export function getSearchIndex(): Promise<SearchIndex> {
  if (!indexPromise) indexPromise = buildIndex()
  return indexPromise
}

async function buildIndex(): Promise<SearchIndex> {
  const [characters, cast, news, trailers, rumors, timeline, theories] = await Promise.all([
    getCharacters(),
    getCast(),
    getNews(),
    getTrailers(),
    getRumors(),
    getTimeline(),
    getTheories(),
  ])

  const characterName = new Map(characters.map((character) => [character.slug, character.name]))
  const namesOf = (slugs: string[] | undefined) =>
    (slugs ?? []).map((slug) => characterName.get(slug)).filter((name): name is string => Boolean(name))
  const newsBySlug = new Map(news.map((article) => [article.slug, article]))

  const entries: SearchIndex = []

  for (const character of characters) {
    entries.push(
      makeEntry(
        {
          type: 'character',
          slug: character.slug,
          title: character.name,
          subtitle: character.actor,
          description: character.description,
          href: `${CATEGORIES.characters.path}/${character.slug}`,
          status: character.status,
          meta: character.actor ? `Played by ${character.actor}` : undefined,
        },
        { keywords: ['character', STATUS_WORD[character.status]] },
      ),
    )
  }

  for (const person of cast) {
    entries.push(
      makeEntry(
        {
          type: 'person',
          slug: person.slug,
          title: person.name,
          subtitle: person.role,
          description: person.description,
          href: `${CATEGORIES.cast.path}/${person.slug}`,
          meta: person.source ? `Source: ${person.source.name}` : undefined,
        },
        { keywords: ['cast'] },
      ),
    )
  }

  for (const article of news) {
    entries.push(
      makeEntry(
        {
          type: 'news',
          slug: article.slug,
          title: article.title,
          description: article.excerpt,
          href: `${CATEGORIES.news.path}/${article.slug}`,
          status: article.status,
          meta: formatContentDate(article.publishedAt),
        },
        {
          keywords: ['news', STATUS_WORD[article.status], ...article.tags, ...namesOf(article.relatedCharacterSlugs)],
          body: [article.content],
        },
      ),
    )
  }

  for (const trailer of trailers) {
    const typeLabel = TRAILER_TYPE_LABEL[trailer.type] ?? 'Trailer'
    entries.push(
      makeEntry(
        {
          type: 'trailer',
          slug: trailer.slug,
          title: trailer.title,
          subtitle: typeLabel,
          description: trailer.description,
          href: `${CATEGORIES.trailers.path}/${trailer.slug}`,
          meta: trailer.duration
            ? `${formatContentDate(trailer.releaseDate)} · ${formatDuration(trailer.duration)}`
            : formatContentDate(trailer.releaseDate),
        },
        {
          keywords: ['trailer', ...namesOf(trailer.relatedCharacterSlugs)],
          body: (trailer.analysis?.observations ?? []).map((observation) => observation.text),
        },
      ),
    )
  }

  for (const rumor of rumors) {
    const sourceCount = `${rumor.sources.length} source${rumor.sources.length === 1 ? '' : 's'}`
    entries.push(
      makeEntry(
        {
          type: 'rumor',
          slug: rumor.slug,
          title: rumor.title,
          description: rumor.summary,
          href: `${CATEGORIES.rumors.path}/${rumor.slug}`,
          rumorStatus: rumor.status,
          meta: `${formatContentDate(rumor.lastUpdatedAt ?? rumor.firstReportedAt)} · ${sourceCount}`,
        },
        {
          keywords: ['rumor', titleCase(rumor.status), ...namesOf(rumor.relatedCharacterSlugs)],
          body: [rumor.claim, rumor.notes ?? ''],
        },
      ),
    )
  }

  for (const event of timeline) {
    const relatedNews = event.relatedNewsSlug ? newsBySlug.get(event.relatedNewsSlug) : undefined
    entries.push(
      makeEntry(
        {
          type: 'timeline',
          slug: event.id,
          title: event.title,
          subtitle: TIMELINE_TYPE_LABEL[event.type],
          description: event.description,
          href: CATEGORIES.timeline.path,
          status: event.status,
          meta: formatContentDate(event.date),
        },
        { keywords: ['timeline', STATUS_WORD[event.status], ...namesOf(relatedNews?.relatedCharacterSlugs)] },
      ),
    )
  }

  for (const theory of theories) {
    entries.push(
      makeEntry(
        {
          type: 'theory',
          slug: theory.slug,
          title: theory.title,
          description: theory.excerpt,
          href: `${CATEGORIES.theories.path}/${theory.slug}`,
          meta: `${formatContentDate(theory.publishedAt)} · Confidence: ${theory.confidence}`,
        },
        { keywords: ['theory', ...theory.tags], body: [theory.content] },
      ),
    )
  }

  return entries
}

// --- Matching ---------------------------------------------------------------

/**
 * Lower is better. Reads top-to-bottom as "how directly does the query
 * name this record": its title, then a name attached to it, then its
 * metadata, then free text.
 */
const TIER = {
  EXACT_TITLE: 1,
  TITLE_PREFIX: 2,
  TITLE_WORD: 3,
  NAME: 4,
  METADATA: 5,
  DESCRIPTION: 6,
  BODY: 7,
  ALL_TERMS: 8,
} as const

/** True when `needle` starts at the beginning of `text` or of any word in it. */
function hasWordPrefix(text: string, needle: string): boolean {
  return text.startsWith(needle) || text.includes(` ${needle}`)
}

function allTermsPresent(text: string, terms: string[]): boolean {
  return terms.every((term) => hasWordPrefix(text, term))
}

/** The best tier at which `entry` matches, or `null` for no match. */
function rankEntry(entry: SearchEntry, query: string, terms: string[]): number | null {
  if (entry.title === query) return TIER.EXACT_TITLE
  if (entry.title.startsWith(query)) return TIER.TITLE_PREFIX
  if (hasWordPrefix(entry.title, query) || allTermsPresent(entry.title, terms)) return TIER.TITLE_WORD

  const names = `${entry.title} ${entry.subtitle}`
  if (hasWordPrefix(entry.subtitle, query) || allTermsPresent(names, terms)) return TIER.NAME

  if (entry.keywords.some((keyword) => hasWordPrefix(keyword, query))) return TIER.METADATA
  if (hasWordPrefix(entry.description, query)) return TIER.DESCRIPTION
  if (hasWordPrefix(entry.body, query)) return TIER.BODY

  // Multi-word query whose words are each present, just not next to each other.
  if (terms.length > 1) {
    const everything = `${names} ${entry.keywords.join(' ')} ${entry.description} ${entry.body}`
    if (allTermsPresent(everything, terms)) return TIER.ALL_TERMS
  }
  return null
}

export function searchIndex(index: SearchIndex, rawQuery: string): SearchResponse {
  const query = normalizeText(rawQuery)
  if (!query) return { total: 0, groups: [] }
  const terms = query.split(' ')

  const hits: Array<{ doc: SearchDocument; tier: number }> = []
  for (const entry of index) {
    const tier = rankEntry(entry, query, terms)
    if (tier !== null) hits.push({ doc: entry.doc, tier })
  }

  // Deterministic: tier, then group order, then title.
  hits.sort(
    (a, b) =>
      a.tier - b.tier ||
      (GROUP_ORDER.get(a.doc.type) ?? 0) - (GROUP_ORDER.get(b.doc.type) ?? 0) ||
      a.doc.title.localeCompare(b.doc.title),
  )

  const groups: SearchGroup[] = []
  for (const { type, label } of SEARCH_GROUPS) {
    const results = hits.filter((hit) => hit.doc.type === type).map((hit) => hit.doc)
    if (results.length > 0) groups.push({ type, label, results })
  }

  return { total: hits.length, groups, top: hits[0]?.doc }
}

/** Which entity groups actually have content — drives landing copy so it can't go stale. */
export function getAvailableGroups(index: SearchIndex): Array<{ type: SearchEntityType; label: string; count: number }> {
  return SEARCH_GROUPS.map(({ type, label }) => ({
    type,
    label,
    count: index.filter((entry) => entry.doc.type === type).length,
  })).filter((group) => group.count > 0)
}

/** Real names from the index, never hard-coded: a few characters, then a few cast members. */
export function getSuggestions(index: SearchIndex, limit = 5): string[] {
  const titlesOf = (type: SearchEntityType) => index.filter((entry) => entry.doc.type === type).map((entry) => entry.doc.title)
  const characters = titlesOf('character').slice(0, 3)
  const cast = titlesOf('person').slice(0, limit - characters.length)
  return [...characters, ...cast].slice(0, limit)
}

// --- Knowledge-graph discovery ------------------------------------------------

const CONNECTED_LIMIT = 4

interface Linkable {
  slug: string
}

function section<T extends Linkable>(
  heading: string,
  items: T[],
  toItem: (item: T) => { href?: string; label: string; meta?: string },
): RelatedContentSection {
  return { heading, items: items.slice(0, CONNECTED_LIMIT).map(toItem) }
}

const character = (c: { slug: string; name: string; actor?: string }) => ({
  href: `${CATEGORIES.characters.path}/${c.slug}`,
  label: c.name,
  meta: c.actor,
})
const news = (n: { slug: string; title: string; publishedAt: string }) => ({
  href: `${CATEGORIES.news.path}/${n.slug}`,
  label: n.title,
  meta: formatContentDate(n.publishedAt),
})
const trailer = (t: { slug: string; title: string }) => ({
  href: `${CATEGORIES.trailers.path}/${t.slug}`,
  label: t.title,
})
/** The status stays in the label text so a rumor is never shown as settled. */
const rumor = (r: { slug: string; title: string; status: RumorStatus }) => ({
  href: `${CATEGORIES.rumors.path}/${r.slug}`,
  label: r.title,
  meta: `Rumor · ${titleCase(r.status)}`,
})
const timelineEvent = (e: { id: string; title: string; date: string }) => ({
  href: CATEGORIES.timeline.path,
  label: e.title,
  meta: formatContentDate(e.date),
})

/**
 * What the top hit is already connected to, via the existing relationship
 * layer (`relationships.ts`) — headings mirror the detail pages' own. Restrained
 * on purpose: a few links per section, no graph.
 */
export async function getConnectedSections(doc: SearchDocument): Promise<RelatedContentSection[]> {
  switch (doc.type) {
    case 'character': {
      const c = await getCharacterConnections(doc.slug)
      return [
        section('Portrayed by', c.actor ? [c.actor] : [], (p) => ({ href: `${CATEGORIES.cast.path}/${p.slug}`, label: p.name, meta: p.role })),
        section('Featured in', c.trailers, trailer),
        section('Related news', c.news, news),
        section('Timeline', c.timeline.map((e) => ({ ...e, slug: e.id })), timelineEvent),
        section('Related rumors', c.rumors, rumor),
      ]
    }
    case 'person': {
      const c = await getPersonConnections(doc.slug)
      return [
        section('Plays', c.character ? [c.character] : [], character),
        section('Featured in', c.trailers, trailer),
        section('Related news', c.news, news),
        section('Related rumors', c.rumors, rumor),
      ]
    }
    case 'news': {
      const c = await getNewsConnections(doc.slug)
      return [
        section('Related characters', c.characters, character),
        section('Trailer coverage', c.trailers, trailer),
        section('Timeline', c.timeline.map((e) => ({ ...e, slug: e.id })), timelineEvent),
        section('Related rumors', c.rumors, rumor),
      ]
    }
    case 'trailer': {
      const c = await getTrailerConnections(doc.slug)
      return [
        section('Characters spotted', c.characters, character),
        section('Related coverage', c.news ? [c.news] : [], news),
        section('Related rumors', c.rumors, rumor),
      ]
    }
    case 'rumor': {
      const c = await getRumorConnections(doc.slug)
      return [
        section('Related characters', c.characters, character),
        section('Related trailers', c.trailers, trailer),
        section('Related news', c.news, news),
      ]
    }
    case 'timeline': {
      const c = await getTimelineEventConnections(doc.slug)
      return [
        section('Related news', c.news ? [c.news] : [], news),
        section('Related characters', c.characters, character),
      ]
    }
    case 'theory':
      return []
  }
}
