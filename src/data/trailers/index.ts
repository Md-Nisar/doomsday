import type { MediaAsset, Trailer } from '../../types/content'

const MARVEL_YOUTUBE_SOURCE = {
  name: 'Marvel Entertainment (YouTube)',
  url: 'https://www.youtube.com/@marvel',
}

const GMA_SOURCE = {
  name: 'Good Morning America',
  url: 'https://abcnews.com/GMA/Culture/new-avengers-trailer-drops-d23-featuring-robert-downey/story?id=135561482',
}

/**
 * Builds the thumbnail for a verified official upload from YouTube's own
 * thumbnail CDN — hotlinked by video ID, never downloaded or rehosted. Only
 * ever called with an ID that's been independently confirmed (via YouTube's
 * oEmbed endpoint — `author_name` came back `"Marvel Entertainment"`, not
 * just assumed from a search-result title) to belong to Marvel's channel.
 */
function officialYouTubeThumbnail(videoId: string, alt: string): MediaAsset {
  return {
    url: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    alt,
    credit: 'Marvel Entertainment',
    source: 'Marvel Entertainment (YouTube)',
    attributionUrl: `https://www.youtube.com/watch?v=${videoId}`,
    usageBasis: 'official-thumbnail',
    type: 'video-thumbnail',
  }
}

/**
 * Officially released trailer material only — every entry is sourced to
 * reporting we've actually read, never scraped or assumed (see README's
 * "Trailer Intelligence" section for the full provenance/verification
 * policy).
 *
 * BUG-001 hardening re-audit (Phase 11.5): every `videoUrl` below was
 * independently re-verified via YouTube's oEmbed endpoint immediately
 * before this pass — not assumed from a headline or search-result title.
 * oEmbed only resolves for a public, embeddable video and returns that
 * video's real `author_name`, so a result of `"Marvel Entertainment"` is
 * confirmation the upload belongs to Marvel's own channel. The Steve
 * Rogers, Thor, and X-Men teasers newly cleared that bar this pass (Marvel
 * has since posted them to its channel) and moved to `verified` with an
 * embed. The Wakanda/Fantastic Four teaser and the D23 Special Look did
 * not — every YouTube upload found for them (via search) belongs to a fan,
 * reaction, or aggregator channel (confirmed via the same oEmbed check),
 * never Marvel's own — so they stay `'unverified'` and link to reporting
 * instead of embedding anything. This is re-checked, not assumed, each
 * hardening pass — see README.
 */
export const trailers: Trailer[] = [
  {
    id: 'trailer-teaser-steve-rogers-2025-12-23',
    slug: 'steve-rogers-teaser',
    title: 'Avengers: Doomsday | Steve Rogers Teaser',
    type: 'teaser',
    releaseDate: '2025-12-23',
    duration: 80,
    description:
      "The first Avengers: Doomsday teaser, built entirely around Chris Evans' Steve Rogers. It played in theaters ahead of Avatar: Fire and Ash before circulating online.",
    videoUrl: 'https://www.youtube.com/watch?v=UiMg566PREA',
    thumbnail: officialYouTubeThumbnail(
      'UiMg566PREA',
      "Official YouTube thumbnail for the Avengers: Doomsday Steve Rogers teaser, from Marvel Entertainment's channel.",
    ),
    source: MARVEL_YOUTUBE_SOURCE,
    verificationStatus: 'verified',
    relatedCharacterSlugs: ['steve-rogers'],
    analysis: {
      observations: [
        {
          text: 'Steve Rogers is visibly packing away his Captain America uniform.',
          evidenceLevel: 'VISIBLE',
          relatedCharacterSlugs: ['steve-rogers'],
        },
        {
          text: 'Steve Rogers is confirmed to return in Avengers: Doomsday, played by Chris Evans.',
          evidenceLevel: 'CONFIRMED',
          relatedCharacterSlugs: ['steve-rogers'],
        },
        {
          text: "The teaser frames Rogers as now a father, suggesting his return carries a personal stake alongside the team-wide threat.",
          evidenceLevel: 'INFERRED',
          relatedCharacterSlugs: ['steve-rogers'],
        },
      ],
    },
  },
  {
    id: 'trailer-teaser-thor-2025-12-30',
    slug: 'thor-teaser',
    title: 'Avengers: Doomsday | Thor Teaser',
    type: 'teaser',
    releaseDate: '2025-12-30',
    description:
      "The second Avengers: Doomsday teaser, centered on Chris Hemsworth's Thor praying to Odin ahead of battle for a safe return to his daughter.",
    videoUrl: 'https://www.youtube.com/watch?v=1clWprLC5Ak',
    thumbnail: officialYouTubeThumbnail(
      '1clWprLC5Ak',
      "Official YouTube thumbnail for the Avengers: Doomsday Thor teaser, from Marvel Entertainment's channel.",
    ),
    source: MARVEL_YOUTUBE_SOURCE,
    verificationStatus: 'verified',
    relatedCharacterSlugs: ['thor'],
    analysis: {
      observations: [
        {
          text: 'Thor is shown praying to Odin ahead of battle.',
          evidenceLevel: 'VISIBLE',
          relatedCharacterSlugs: ['thor'],
        },
        {
          text: 'Thor is confirmed to return in Avengers: Doomsday, played by Chris Hemsworth.',
          evidenceLevel: 'CONFIRMED',
          relatedCharacterSlugs: ['thor'],
        },
        {
          text: 'The prayer for a safe return to his daughter suggests the film gives Thor a personal stake distinct from the team-wide threat.',
          evidenceLevel: 'INFERRED',
          relatedCharacterSlugs: ['thor'],
        },
      ],
    },
  },
  {
    id: 'trailer-teaser-x-men-2026-01-06',
    slug: 'x-men-teaser',
    title: 'Avengers: Doomsday | X-Men Teaser',
    type: 'teaser',
    releaseDate: '2026-01-06',
    description:
      "The third Avengers: Doomsday teaser, reuniting Patrick Stewart's Professor X and Ian McKellen's Magneto over a game of chess before cutting to James Marsden's Cyclops.",
    videoUrl: 'https://www.youtube.com/watch?v=kH1XlwHQv9o',
    thumbnail: officialYouTubeThumbnail(
      'kH1XlwHQv9o',
      "Official YouTube thumbnail for the Avengers: Doomsday X-Men teaser, from Marvel Entertainment's channel.",
    ),
    source: MARVEL_YOUTUBE_SOURCE,
    verificationStatus: 'verified',
    relatedCharacterSlugs: ['professor-x', 'magneto', 'cyclops'],
    analysis: {
      observations: [
        {
          text: 'Charles Xavier and Magneto are shown reuniting over a game of chess.',
          evidenceLevel: 'VISIBLE',
          relatedCharacterSlugs: ['professor-x', 'magneto'],
        },
        {
          text: "Cyclops removes his visor and fires his optic blast.",
          evidenceLevel: 'VISIBLE',
          relatedCharacterSlugs: ['cyclops'],
        },
        {
          text: 'The X-Men — including Professor X, Magneto, and Cyclops — are confirmed to appear in Avengers: Doomsday, played by their original actors.',
          evidenceLevel: 'CONFIRMED',
          relatedCharacterSlugs: ['professor-x', 'magneto', 'cyclops'],
        },
      ],
    },
  },
  {
    id: 'trailer-teaser-wakanda-fantastic-four-2026-01-13',
    slug: 'wakanda-fantastic-four-teaser',
    title: 'Avengers: Doomsday | Wakanda / Fantastic Four Teaser',
    type: 'teaser',
    releaseDate: '2026-01-13',
    description:
      "The fourth Avengers: Doomsday teaser, the first to pair Wakanda's Shuri and M'Baku with the Fantastic Four's Namor and The Thing. Reed Richards, Sue Storm, and Johnny Storm do not appear in this specific teaser.",
    source: {
      name: 'Deadline',
      url: 'https://deadline.com/2026/01/avengers-doomsday-teaser-fantastic-four-mbaku-wakanda-1236681547/',
    },
    verificationStatus: 'unverified',
    relatedCharacterSlugs: ['shuri', 'mbaku', 'namor', 'ben-grimm'],
    analysis: {
      observations: [
        {
          text: "M'Baku and The Thing (Ben Grimm) share a scene together — the first on-screen interaction between Wakanda and the Fantastic Four.",
          evidenceLevel: 'VISIBLE',
          relatedCharacterSlugs: ['mbaku', 'ben-grimm'],
        },
        {
          text: "Shuri/Black Panther, M'Baku, Namor, and The Thing are confirmed to appear in Avengers: Doomsday.",
          evidenceLevel: 'CONFIRMED',
          relatedCharacterSlugs: ['shuri', 'mbaku', 'namor', 'ben-grimm'],
        },
      ],
    },
  },
  {
    id: 'trailer-official-2026-07-20',
    slug: 'official-trailer',
    title: 'Avengers: Doomsday | Official Trailer',
    type: 'trailer',
    releaseDate: '2026-07-20',
    description:
      "The first full trailer for Avengers: Doomsday, released by Marvel Studios ahead of the film's December 18, 2026 premiere.",
    videoUrl: 'https://www.youtube.com/watch?v=irVNGjRFZGk',
    thumbnail: officialYouTubeThumbnail(
      'irVNGjRFZGk',
      "Official YouTube thumbnail for the Avengers: Doomsday Official Trailer, from Marvel Entertainment's channel.",
    ),
    source: MARVEL_YOUTUBE_SOURCE,
    verificationStatus: 'verified',
    relatedCharacterSlugs: ['doctor-doom'],
    relatedNewsSlug: 'first-official-trailer-released',
    analysis: {
      observations: [
        {
          text: "Doctor Doom (Robert Downey Jr.) is established as the film's central antagonist.",
          evidenceLevel: 'CONFIRMED',
          relatedCharacterSlugs: ['doctor-doom'],
        },
        {
          text: 'The Avengers, the Fantastic Four, and the X-Men are shown crossing paths in the same footage.',
          evidenceLevel: 'VISIBLE',
        },
      ],
    },
  },
  {
    id: 'trailer-special-look-2026-08-14',
    slug: 'special-look',
    title: 'Avengers: Doomsday | D23 2026 Special Look',
    type: 'special_look',
    releaseDate: '2026-08-14',
    description:
      "New footage shown at Disney's D23 2026 fan event, introduced onstage by Marvel Studios president Kevin Feige alongside Robert Downey Jr., Chris Evans, and Hayley Atwell, centered on Robert Downey Jr.'s Doctor Doom.",
    source: GMA_SOURCE,
    verificationStatus: 'unverified',
    relatedCharacterSlugs: ['doctor-doom'],
    relatedNewsSlug: 'd23-2026-special-look-doctor-doom',
    analysis: {
      observations: [
        {
          text: "New footage centered on Robert Downey Jr.'s Doctor Doom was shown onstage at D23 2026.",
          evidenceLevel: 'CONFIRMED',
          relatedCharacterSlugs: ['doctor-doom'],
        },
        {
          text: 'The special look was introduced by Kevin Feige alongside Robert Downey Jr., Chris Evans, and Hayley Atwell.',
          evidenceLevel: 'CONFIRMED',
        },
      ],
    },
  },
  {
    id: 'trailer-doomsday-clock-2026-01-13',
    slug: 'doomsday-clock',
    title: 'AVENGERS: DOOMSDAY CLOCK',
    type: 'clock',
    releaseDate: '2026-01-13',
    description:
      "Marvel Entertainment's official AVENGERS: DOOMSDAY CLOCK video, published to its YouTube channel — a countdown asset separate from the film's teasers and trailers.",
    videoUrl: 'https://www.youtube.com/watch?v=f17J3AXVK5w',
    thumbnail: officialYouTubeThumbnail(
      'f17J3AXVK5w',
      "Official YouTube thumbnail for Marvel Entertainment's AVENGERS: DOOMSDAY CLOCK video.",
    ),
    source: MARVEL_YOUTUBE_SOURCE,
    verificationStatus: 'verified',
  },
]
