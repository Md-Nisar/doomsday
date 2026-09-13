import type { Character, EntityReference, NewsArticle, Person, Rumor, TimelineEvent, Trailer } from '../types/content'
import { getCast, getCharacters, getNews, getRumors, getTimeline, getTrailers } from './content'

/**
 * The knowledge graph's relationship layer. Sits alongside `content.ts` (UI
 * still never imports `src/data/*` directly): `content.ts` answers "give me
 * this entity/collection", this file answers "what is this entity connected
 * to". Every relationship here is computed from data that's already real —
 * nothing is invented to make the graph look richer than the underlying
 * content actually is.
 *
 * Small, deliberate relationship vocabulary — only the types the current
 * content actually needs. `RUMORED_ABOUT` and `SUPPORTED_BY` back the Rumor
 * Intelligence layer (Phase 11): a rumor names the characters its claim
 * concerns, and the trailers whose released footage bears on it. `INSPIRES`
 * remains reserved for a future Theory↔Rumor edge with no real data to
 * attach it to yet.
 */
export type RelationshipType =
  | 'CASTS_AS'
  | 'APPEARS_IN'
  | 'MENTIONED_IN'
  | 'REFERENCES'
  | 'REPORTED_BY'
  | 'RUMORED_ABOUT'
  | 'SUPPORTED_BY'

/** UI-facing label for each relationship type, used as `RelatedContent` section headings. */
export const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  CASTS_AS: 'Portrayed by',
  APPEARS_IN: 'Featured in',
  MENTIONED_IN: 'Related news',
  REFERENCES: 'Timeline',
  REPORTED_BY: 'Source',
  RUMORED_ABOUT: 'Related rumors',
  SUPPORTED_BY: 'Related trailer evidence',
}

interface GraphIndexes {
  newsBySlug: Map<string, NewsArticle>
  castBySlug: Map<string, Person>
  charactersBySlug: Map<string, Character>
  trailersBySlug: Map<string, Trailer>
  timelineById: Map<string, TimelineEvent>
  rumorsBySlug: Map<string, Rumor>
  /** Reverse of `NewsArticle.relatedCharacterSlugs` — MENTIONED_IN. */
  newsByCharacterSlug: Map<string, NewsArticle[]>
  /** Reverse of `Trailer.relatedCharacterSlugs` — APPEARS_IN. */
  trailersByCharacterSlug: Map<string, Trailer[]>
  /** Reverse of `Character.actorSlug` — CASTS_AS. */
  characterByActorSlug: Map<string, Character>
  /** Reverse of `TimelineEvent.relatedNewsSlug` / `Trailer.relatedNewsSlug` — REFERENCES. */
  timelineByNewsSlug: Map<string, TimelineEvent[]>
  /** Reverse of `Trailer.relatedNewsSlug` — REPORTED_BY, from the news side. */
  trailersByNewsSlug: Map<string, Trailer[]>
  /** Reverse of `Rumor.relatedCharacterSlugs` — RUMORED_ABOUT. */
  rumorsByCharacterSlug: Map<string, Rumor[]>
  /** Reverse of `Rumor.relatedTrailerSlugs` — SUPPORTED_BY. */
  rumorsByTrailerSlug: Map<string, Rumor[]>
  /** Reverse of `Rumor.relatedNewsSlugs` — REPORTED_BY, from the news side. */
  rumorsByNewsSlug: Map<string, Rumor[]>
}

let indexesPromise: Promise<GraphIndexes> | null = null

/**
 * Builds every cross-entity lookup once and memoizes it for the life of the
 * process. Content here is static-first (no runtime writes), so there's
 * nothing to invalidate — this just avoids re-scanning every collection on
 * every relationship call, which matters once the dataset stops being tiny.
 */
function buildIndexes(): Promise<GraphIndexes> {
  if (!indexesPromise) {
    indexesPromise = (async () => {
      const [news, trailers, cast, characters, timeline, rumors] = await Promise.all([
        getNews(),
        getTrailers(),
        getCast(),
        getCharacters(),
        getTimeline(),
        getRumors(),
      ])

      const newsBySlug = new Map(news.map((article) => [article.slug, article]))
      const castBySlug = new Map(cast.map((person) => [person.slug, person]))
      const charactersBySlug = new Map(characters.map((character) => [character.slug, character]))
      const trailersBySlug = new Map(trailers.map((trailer) => [trailer.slug, trailer]))
      const timelineById = new Map(timeline.map((event) => [event.id, event]))
      const rumorsBySlug = new Map(rumors.map((rumor) => [rumor.slug, rumor]))

      const newsByCharacterSlug = new Map<string, NewsArticle[]>()
      for (const article of news) {
        for (const slug of article.relatedCharacterSlugs ?? []) {
          const list = newsByCharacterSlug.get(slug) ?? []
          list.push(article)
          newsByCharacterSlug.set(slug, list)
        }
      }

      const trailersByCharacterSlug = new Map<string, Trailer[]>()
      for (const trailer of trailers) {
        for (const slug of trailer.relatedCharacterSlugs ?? []) {
          const list = trailersByCharacterSlug.get(slug) ?? []
          list.push(trailer)
          trailersByCharacterSlug.set(slug, list)
        }
      }

      const characterByActorSlug = new Map<string, Character>()
      for (const character of characters) {
        if (character.actorSlug) characterByActorSlug.set(character.actorSlug, character)
      }

      const timelineByNewsSlug = new Map<string, TimelineEvent[]>()
      for (const event of timeline) {
        if (event.relatedNewsSlug) {
          const list = timelineByNewsSlug.get(event.relatedNewsSlug) ?? []
          list.push(event)
          timelineByNewsSlug.set(event.relatedNewsSlug, list)
        }
      }

      const trailersByNewsSlug = new Map<string, Trailer[]>()
      for (const trailer of trailers) {
        if (trailer.relatedNewsSlug) {
          const list = trailersByNewsSlug.get(trailer.relatedNewsSlug) ?? []
          list.push(trailer)
          trailersByNewsSlug.set(trailer.relatedNewsSlug, list)
        }
      }

      const rumorsByCharacterSlug = new Map<string, Rumor[]>()
      const rumorsByTrailerSlug = new Map<string, Rumor[]>()
      const rumorsByNewsSlug = new Map<string, Rumor[]>()
      for (const rumor of rumors) {
        for (const slug of rumor.relatedCharacterSlugs ?? []) {
          const list = rumorsByCharacterSlug.get(slug) ?? []
          list.push(rumor)
          rumorsByCharacterSlug.set(slug, list)
        }
        for (const slug of rumor.relatedTrailerSlugs ?? []) {
          const list = rumorsByTrailerSlug.get(slug) ?? []
          list.push(rumor)
          rumorsByTrailerSlug.set(slug, list)
        }
        for (const slug of rumor.relatedNewsSlugs ?? []) {
          const list = rumorsByNewsSlug.get(slug) ?? []
          list.push(rumor)
          rumorsByNewsSlug.set(slug, list)
        }
      }

      return {
        newsBySlug,
        castBySlug,
        charactersBySlug,
        trailersBySlug,
        timelineById,
        rumorsBySlug,
        newsByCharacterSlug,
        trailersByCharacterSlug,
        characterByActorSlug,
        timelineByNewsSlug,
        trailersByNewsSlug,
        rumorsByCharacterSlug,
        rumorsByTrailerSlug,
        rumorsByNewsSlug,
      }
    })()
  }
  return indexesPromise
}

function resolveCharacters(idx: GraphIndexes, slugs: string[] | undefined): Character[] {
  return (slugs ?? []).map((slug) => idx.charactersBySlug.get(slug)).filter((c): c is Character => Boolean(c))
}

export interface CharacterConnections {
  /** CASTS_AS reverse: the actor confirmed to play this character. */
  actor?: Person
  /** MENTIONED_IN reverse: news substantively about this character. */
  news: NewsArticle[]
  /** APPEARS_IN reverse: trailers confirmed to feature this character. */
  trailers: Trailer[]
  /** REFERENCES, transitive via related news: timeline events drawn from that news. */
  timeline: TimelineEvent[]
  /** RUMORED_ABOUT reverse: rumors whose claim concerns this character. */
  rumors: Rumor[]
}

/** A character page is the first true graph node — every connection a real, stored edge produces. */
export async function getCharacterConnections(characterSlug: string): Promise<CharacterConnections> {
  const idx = await buildIndexes()
  const character = idx.charactersBySlug.get(characterSlug)
  const news = idx.newsByCharacterSlug.get(characterSlug) ?? []
  const trailers = idx.trailersByCharacterSlug.get(characterSlug) ?? []
  const timeline = news.flatMap((article) => idx.timelineByNewsSlug.get(article.slug) ?? [])
  const rumors = idx.rumorsByCharacterSlug.get(characterSlug) ?? []

  return {
    actor: character?.actorSlug ? idx.castBySlug.get(character.actorSlug) : undefined,
    news,
    trailers,
    timeline,
    rumors,
  }
}

export interface CharacterContentCounts {
  trailers: number
  news: number
  rumors: number
}

/**
 * Cheap, index-only connection counts for every character at once — used by
 * the Characters grid to show "Featured in N trailers" on a card without an
 * N+1 `getCharacterConnections` call per card (see README's "Performance"
 * section). Reuses the same memoized indexes `getCharacterConnections`
 * reads from; nothing is stored or computed twice.
 */
export async function getCharacterContentCounts(): Promise<Map<string, CharacterContentCounts>> {
  const idx = await buildIndexes()
  const counts = new Map<string, CharacterContentCounts>()
  for (const character of idx.charactersBySlug.values()) {
    counts.set(character.slug, {
      trailers: (idx.trailersByCharacterSlug.get(character.slug) ?? []).length,
      news: (idx.newsByCharacterSlug.get(character.slug) ?? []).length,
      rumors: (idx.rumorsByCharacterSlug.get(character.slug) ?? []).length,
    })
  }
  return counts
}

export interface PersonConnections {
  /** CASTS_AS: the character this actor is confirmed to play. */
  character?: Character
  news: NewsArticle[]
  trailers: Trailer[]
  /** RUMORED_ABOUT, transitive via the character this actor plays. */
  rumors: Rumor[]
}

/** Person → Character → News/Trailer/Rumor, without storing the reverse of `actorSlug` a second time. */
export async function getPersonConnections(personSlug: string): Promise<PersonConnections> {
  const idx = await buildIndexes()
  const character = idx.characterByActorSlug.get(personSlug)
  if (!character) return { news: [], trailers: [], rumors: [] }

  return {
    character,
    news: idx.newsByCharacterSlug.get(character.slug) ?? [],
    trailers: idx.trailersByCharacterSlug.get(character.slug) ?? [],
    rumors: idx.rumorsByCharacterSlug.get(character.slug) ?? [],
  }
}

export interface NewsConnections {
  characters: Character[]
  /** REFERENCES reverse: timeline events drawn from this article. */
  timeline: TimelineEvent[]
  /** REPORTED_BY reverse: trailers this article reported the release of. */
  trailers: Trailer[]
  /** REPORTED_BY reverse: rumors this article directly covers. */
  rumors: Rumor[]
}

export async function getNewsConnections(newsSlug: string): Promise<NewsConnections> {
  const idx = await buildIndexes()
  const article = idx.newsBySlug.get(newsSlug)

  return {
    characters: resolveCharacters(idx, article?.relatedCharacterSlugs),
    timeline: idx.timelineByNewsSlug.get(newsSlug) ?? [],
    trailers: idx.trailersByNewsSlug.get(newsSlug) ?? [],
    rumors: idx.rumorsByNewsSlug.get(newsSlug) ?? [],
  }
}

export interface TrailerConnections {
  characters: Character[]
  /** REPORTED_BY-adjacent: the news article this trailer's release was reported in, if any. */
  news?: NewsArticle
  /** SUPPORTED_BY reverse: rumors this trailer's footage bears on. */
  rumors: Rumor[]
}

export async function getTrailerConnections(trailerSlug: string): Promise<TrailerConnections> {
  const idx = await buildIndexes()
  const trailer = idx.trailersBySlug.get(trailerSlug)

  return {
    characters: resolveCharacters(idx, trailer?.relatedCharacterSlugs),
    news: trailer?.relatedNewsSlug ? idx.newsBySlug.get(trailer.relatedNewsSlug) : undefined,
    rumors: idx.rumorsByTrailerSlug.get(trailerSlug) ?? [],
  }
}

export interface RumorConnections {
  /** RUMORED_ABOUT: characters this rumor's claim concerns. */
  characters: Character[]
  /** SUPPORTED_BY: trailers whose released footage bears on this claim. */
  trailers: Trailer[]
  /** REPORTED_BY: news articles directly covering this claim. */
  news: NewsArticle[]
}

export async function getRumorConnections(rumorSlug: string): Promise<RumorConnections> {
  const idx = await buildIndexes()
  const rumor = idx.rumorsBySlug.get(rumorSlug)

  return {
    characters: resolveCharacters(idx, rumor?.relatedCharacterSlugs),
    trailers: (rumor?.relatedTrailerSlugs ?? [])
      .map((slug) => idx.trailersBySlug.get(slug))
      .filter((t): t is Trailer => Boolean(t)),
    news: (rumor?.relatedNewsSlugs ?? [])
      .map((slug) => idx.newsBySlug.get(slug))
      .filter((n): n is NewsArticle => Boolean(n)),
  }
}

export interface TimelineEventConnections {
  news?: NewsArticle
  /** Transitive via the event's related news: characters that news is about. */
  characters: Character[]
}

export async function getTimelineEventConnections(eventId: string): Promise<TimelineEventConnections> {
  const idx = await buildIndexes()
  const event = idx.timelineById.get(eventId)
  const news = event?.relatedNewsSlug ? idx.newsBySlug.get(event.relatedNewsSlug) : undefined

  return {
    news,
    characters: resolveCharacters(idx, news?.relatedCharacterSlugs),
  }
}

/**
 * Flattens a character's connections into normalized, type-tagged pointers —
 * the shape a future "show everything connected to X" search feature needs
 * (Phase 9 brief, Part T). Not consumed by any UI yet; kept ready since it
 * costs nothing to derive from data `getCharacterConnections` already computes.
 */
export async function getCharacterEntityReferences(characterSlug: string): Promise<EntityReference[]> {
  const connections = await getCharacterConnections(characterSlug)
  const refs: EntityReference[] = []
  if (connections.actor) refs.push({ type: 'person', slug: connections.actor.slug })
  for (const article of connections.news) refs.push({ type: 'news', slug: article.slug })
  for (const trailer of connections.trailers) refs.push({ type: 'trailer', slug: trailer.slug })
  for (const event of connections.timeline) refs.push({ type: 'timeline', slug: event.id })
  return refs
}
