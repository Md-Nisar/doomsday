import type { TimelineEvent } from '../../types/content'

const GMA_SOURCE = {
  name: 'Good Morning America',
  url: 'https://www.goodmorningamerica.com/culture/story/avengers-doomsday-trailer-release-date-marvel-movie-134860279',
}

const D23_SOURCE = {
  name: 'D23 (Disney)',
  url: 'https://d23.com/marvel-studios-announces-avengers-doomsday-cast/',
}

/** Confirmed developments only — no unverified production rumors. */
export const timelineEvents: TimelineEvent[] = [
  {
    id: 'timeline-cast-announcement',
    date: '2025-03-26',
    title: 'Cast officially announced',
    description: "Marvel Studios published its official Avengers: Doomsday cast announcement via D23.",
    type: 'casting',
    status: 'confirmed',
    source: D23_SOURCE,
    relatedNewsSlug: 'official-cast-announcement',
  },
  {
    id: 'timeline-first-trailer',
    date: '2026-07-20',
    title: 'First official trailer released',
    description: 'Marvel Studios released the first full trailer for Avengers: Doomsday.',
    type: 'marketing',
    status: 'confirmed',
    source: GMA_SOURCE,
    relatedNewsSlug: 'first-official-trailer-released',
  },
  {
    id: 'timeline-d23-2026-special-look',
    date: '2026-08-14',
    title: 'D23 2026 special look revealed',
    description: "New footage centered on Robert Downey Jr.'s Doctor Doom premiered at Disney's D23 fan event.",
    type: 'marketing',
    status: 'confirmed',
    source: GMA_SOURCE,
    relatedNewsSlug: 'd23-2026-special-look-doctor-doom',
  },
  {
    id: 'timeline-theatrical-release',
    date: '2026-12-18',
    title: 'Theatrical release',
    description: 'Avengers: Doomsday opens in U.S. theaters.',
    type: 'release',
    status: 'confirmed',
    source: GMA_SOURCE,
    relatedNewsSlug: 'release-date-december-18-2026',
  },
]
