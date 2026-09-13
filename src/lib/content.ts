import type {
  Character,
  NewsArticle,
  Person,
  Rumor,
  Theory,
  TimelineEvent,
  Trailer,
} from '../types/content'
import { cast } from '../data/cast'
import { characters } from '../data/characters'
import { newsArticles } from '../data/news'
import { rumors } from '../data/rumors'
import { theories } from '../data/theories'
import { timelineEvents } from '../data/timeline'
import { trailers } from '../data/trailers'

/**
 * The only seam the UI should read content through. Each function is
 * `async` even though local data resolves instantly, so a later swap to
 * `fetch()`/a CMS SDK changes only the body here — no call site changes.
 */

export async function getNews(): Promise<NewsArticle[]> {
  return newsArticles
}

export async function getTrailers(): Promise<Trailer[]> {
  return trailers
}

export async function getCast(): Promise<Person[]> {
  return cast
}

export async function getCharacters(): Promise<Character[]> {
  return characters
}

export async function getTheories(): Promise<Theory[]> {
  return theories
}

export async function getRumors(): Promise<Rumor[]> {
  return rumors
}

export async function getTimeline(): Promise<TimelineEvent[]> {
  return [...timelineEvents].sort((a, b) => a.date.localeCompare(b.date))
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | undefined> {
  return newsArticles.find((article) => article.slug === slug)
}

export async function getTrailerBySlug(slug: string): Promise<Trailer | undefined> {
  return trailers.find((trailer) => trailer.slug === slug)
}

export async function getCastBySlug(slug: string): Promise<Person | undefined> {
  return cast.find((person) => person.slug === slug)
}

export async function getCharacterBySlug(slug: string): Promise<Character | undefined> {
  return characters.find((character) => character.slug === slug)
}

export async function getTheoryBySlug(slug: string): Promise<Theory | undefined> {
  return theories.find((theory) => theory.slug === slug)
}

export async function getRumorBySlug(slug: string): Promise<Rumor | undefined> {
  return rumors.find((rumor) => rumor.slug === slug)
}
