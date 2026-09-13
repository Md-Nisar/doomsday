import type { NewsArticle } from '../../types/content'

const GMA_SOURCE = {
  name: 'Good Morning America',
  url: 'https://www.goodmorningamerica.com/culture/story/avengers-doomsday-trailer-release-date-marvel-movie-134860279',
}

const D23_SOURCE = {
  name: 'D23 (Disney)',
  url: 'https://d23.com/marvel-studios-announces-avengers-doomsday-cast/',
}

/**
 * Small, high-confidence set of officially reported developments — sourced
 * to reporting we've actually read, not scraped or assumed. See README's
 * "Content architecture" section for the provenance policy this follows.
 */
export const newsArticles: NewsArticle[] = [
  {
    id: 'news-cast-announcement-march-2025',
    slug: 'official-cast-announcement',
    title: 'Marvel Studios officially announces the Avengers: Doomsday cast',
    excerpt:
      'D23 published Marvel Studios\' official cast announcement for Avengers: Doomsday on March 26, 2025, naming 27 confirmed actors.',
    content:
      "Marvel Studios' official cast announcement for Avengers: Doomsday, published via D23 on March 26, 2025, named 27 confirmed actors — including Robert Downey Jr. as Victor von Doom/Doctor Doom, the only character pairing stated explicitly in that announcement. Every other actor's specific role listed on this site is drawn from their own pre-existing Marvel/X-Men-franchise identity, corroborated by subsequent trade reporting and, for several, by officially released trailer footage.",
    publishedAt: '2025-03-26',
    category: 'news',
    status: 'confirmed',
    source: D23_SOURCE,
    tags: ['casting', 'd23', 'marvel-studios'],
    relatedCharacterSlugs: [
      'doctor-doom',
      'scott-lang',
      'loki',
      'shang-chi',
      'bucky-barnes',
      'yelena-belova',
      'us-agent',
      'red-guardian',
      'ghost',
      'sentry',
      'joaquin-torres',
      'shuri',
      'mbaku',
      'namor',
      'susan-storm',
      'ben-grimm',
      'johnny-storm',
      'professor-x',
      'magneto',
      'cyclops',
      'mystique',
      'nightcrawler',
      'beast',
      'gambit',
    ],
  },
  {
    id: 'news-release-date-december-2026',
    slug: 'release-date-december-18-2026',
    title: 'Avengers: Doomsday set for December 18, 2026',
    excerpt:
      'Marvel Studios has confirmed Avengers: Doomsday for a Friday, December 18, 2026 theatrical release.',
    content:
      'Marvel Studios has confirmed Avengers: Doomsday, directed by Anthony and Joe Russo, for a Friday, December 18, 2026 theatrical release.',
    publishedAt: '2026-08-27',
    category: 'news',
    status: 'confirmed',
    source: GMA_SOURCE,
    tags: ['release-date', 'marvel-studios'],
  },
  {
    id: 'news-first-trailer-july-2026',
    slug: 'first-official-trailer-released',
    title: 'Marvel releases the first full trailer for Avengers: Doomsday',
    excerpt:
      'The first full-length trailer for Avengers: Doomsday arrived on July 20, 2026, giving audiences their first extended look at the film.',
    content:
      "Marvel Studios released the first full trailer for Avengers: Doomsday on July 20, 2026, offering an extended look at the film ahead of its December release.",
    publishedAt: '2026-07-20',
    category: 'news',
    status: 'confirmed',
    source: GMA_SOURCE,
    tags: ['trailer', 'marketing'],
  },
  {
    id: 'news-d23-2026-special-look',
    slug: 'd23-2026-special-look-doctor-doom',
    title: "D23 2026: New footage puts Robert Downey Jr.'s Doctor Doom center stage",
    excerpt:
      "A special-look reveal at Disney's D23 2026 fan event on August 14 focused on Robert Downey Jr.'s Victor von Doom.",
    content:
      "A special-look trailer for Avengers: Doomsday premiered at Disney's D23 fan event on August 14, 2026, with new footage centered on Robert Downey Jr.'s Doctor Doom.",
    publishedAt: '2026-08-14',
    category: 'news',
    status: 'confirmed',
    source: GMA_SOURCE,
    tags: ['d23', 'trailer', 'doctor-doom'],
    relatedCharacterSlugs: ['doctor-doom'],
  },
]
