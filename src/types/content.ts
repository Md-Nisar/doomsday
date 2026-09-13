/**
 * Core content entities for the future news/information platform. Local
 * data (`src/data/`) and the access layer (`src/lib/content.ts`) are both
 * written against these types, so a later swap to a CMS/API only has to
 * satisfy this same shape.
 */

import type { SeoOverrides } from './seo'

export type ContentCategory =
  | 'news'
  | 'trailers'
  | 'cast'
  | 'characters'
  | 'theories'
  | 'rumors'
  | 'timeline'

/**
 * Lives here rather than on the `StatusBadge` component so both the UI
 * and the content models share one definition — `StatusBadge` re-exports
 * this type for existing imports.
 */
export type ContentStatus = 'confirmed' | 'rumor' | 'theory'

export type ConfidenceLevel = 'low' | 'medium' | 'high'

/**
 * Why an image is safe to display — set for every `MediaAsset` this project
 * actually adds, never left to be inferred from the URL. There is no
 * "unknown provenance" option on purpose: if a legitimate basis can't be
 * named, the asset doesn't get added (see README's "Media provenance"
 * section for the GREEN/YELLOW/RED classification this maps to).
 *   official-embed     — a frame grab/thumbnail belonging to a verified,
 *                         embeddable official video (see `Trailer.videoUrl`).
 *   official-thumbnail — the official video host's own served thumbnail
 *                         image for a verified video, hotlinked (never
 *                         downloaded/rehosted) from that host.
 *   press-kit          — supplied directly by an official studio/press kit.
 *   editorial-fair-use — a case-by-case editorial/commentary use, recorded
 *                         here so it's never silently assumed later.
 */
export type MediaUsageBasis = 'official-embed' | 'official-thumbnail' | 'press-kit' | 'editorial-fair-use'

export type MediaAssetType = 'photo' | 'poster' | 'video-thumbnail' | 'artwork'

export interface MediaAsset {
  url: string
  /** Required — every displayed image needs meaningful alt text, not decoration-only. */
  alt: string
  credit?: string
  /** Who actually produced/hosts this asset, e.g. "Marvel Entertainment (YouTube)". */
  source?: string
  /** Where a viewer can verify this asset's origin, e.g. the video's watch URL. */
  attributionUrl?: string
  usageBasis?: MediaUsageBasis
  type?: MediaAssetType
}

export interface SourceAttribution {
  name: string
  url: string
}

export interface Author {
  name: string
  slug?: string
  avatar?: MediaAsset
}

export interface NewsArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  publishedAt: string
  updatedAt?: string
  category: ContentCategory
  status: ContentStatus
  source?: SourceAttribution
  author?: Author
  featuredImage?: MediaAsset
  tags: string[]
  /** Slugs of `Character` entries this article is substantively about. */
  relatedCharacterSlugs?: string[]
  seo?: SeoOverrides
}

/**
 * `clock` covers Marvel's official "AVENGERS: DOOMSDAY CLOCK" countdown
 * video — a real, verified official YouTube asset that isn't a trailer,
 * teaser, or clip, but reuses this same entity/collection (rather than a
 * parallel data model) since every other piece of Trailer Intelligence
 * infrastructure — verification, embedding, JSON-LD, validation — already
 * applies to it unchanged.
 */
export type TrailerType = 'teaser' | 'trailer' | 'special_look' | 'tv_spot' | 'clip' | 'clock' | 'other'

/**
 * Evidence vocabulary for one observation *within* a trailer's analysis —
 * deliberately separate from `ContentStatus`. `ContentStatus` grades an
 * entire editorial entry (is this whole page a rumor, a theory, or
 * confirmed?); every `Trailer` here is real released footage, so the
 * `Trailer` itself carries no `ContentStatus`. `EvidenceLevel` instead
 * grades one specific claim about what that footage shows:
 *   VISIBLE   — the footage visibly contains this.
 *   CONFIRMED — the footage and/or an official source explicitly establishes this.
 *   INFERRED  — a reasonable interpretation derived from visible footage.
 *   THEORY    — speculation that goes beyond the footage; never used just
 *               because something is visually ambiguous.
 * See README's "Trailer Intelligence" section for the full rationale.
 */
export type EvidenceLevel = 'VISIBLE' | 'CONFIRMED' | 'INFERRED' | 'THEORY'

export interface TrailerObservation {
  text: string
  evidenceLevel: EvidenceLevel
  /** Slugs of `Character` entries this specific observation is about, if any — must be a subset of the trailer's own `relatedCharacterSlugs`. */
  relatedCharacterSlugs?: string[]
}

export interface TrailerTimestamp {
  /** Seconds from the start of the footage. */
  time: number
  title: string
  description?: string
  evidenceLevel: EvidenceLevel
  /** Must be a subset of the trailer's own `relatedCharacterSlugs`. */
  relatedCharacterSlugs?: string[]
}

export interface TrailerAnalysis {
  observations: TrailerObservation[]
  /**
   * Left empty until the actual footage has been reviewed frame-by-frame
   * for exact timings — copying "around the 0:20 mark" style timing from
   * secondary coverage is exactly the kind of fabrication this model exists
   * to prevent. See README.
   */
  timestamps?: TrailerTimestamp[]
}

export interface Trailer {
  id: string
  slug: string
  title: string
  type: TrailerType
  releaseDate: string
  /** Seconds. Omitted when no reliably reported duration exists. */
  duration?: number
  description: string
  /** Omitted when no independently verified official upload exists — see `verificationStatus`. */
  videoUrl?: string
  thumbnail?: MediaAsset
  source?: SourceAttribution
  /**
   * 'verified' — `videoUrl` was independently confirmed (by inspecting the
   * actual video page, not just a headline) to be the genuine official
   * upload, and is safe to embed.
   * 'unverified' — the footage/release itself is confirmed by reputable
   * reporting, but no specific upload could be independently distinguished
   * from an unofficial reupload or mirror, so nothing is embedded and the
   * page links to the reporting instead. See README.
   */
  verificationStatus: 'verified' | 'unverified'
  /** Slugs of `Character` entries this trailer is confirmed to feature. */
  relatedCharacterSlugs?: string[]
  /** Slug of the `NewsArticle` reporting on this trailer's release, if one exists. */
  relatedNewsSlug?: string
  analysis?: TrailerAnalysis
  seo?: SeoOverrides
}

export interface Person {
  id: string
  slug: string
  name: string
  /** The character this actor plays in the film, e.g. "Victor von Doom / Doctor Doom". */
  role: string
  image?: MediaAsset
  description: string
  source?: SourceAttribution
  seo?: SeoOverrides
}

export interface Character {
  id: string
  slug: string
  name: string
  actor?: string
  /** Slug of the `Person` entry playing this character — the real, navigable form of `actor`. */
  actorSlug?: string
  status: ContentStatus
  description: string
  image?: MediaAsset
  source?: SourceAttribution
  seo?: SeoOverrides
}

export interface Theory {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  publishedAt: string
  updatedAt?: string
  author: Author
  confidence: ConfidenceLevel
  /** What the theory is actually based on (an interview, trailer footage, etc.), if applicable. */
  source?: SourceAttribution
  tags: string[]
  seo?: SeoOverrides
}

/**
 * The rumor lifecycle — deliberately separate from `ContentStatus`. Every
 * `Rumor` here lives under the "rumor" category by definition (like a
 * `Trailer`, it carries no `ContentStatus` of its own); `RumorStatus`
 * instead grades what the evidence currently establishes about the CLAIM:
 *   UNVERIFIED   — a claim exists with little or no independent corroboration.
 *   REPORTED     — a reasonably identifiable source has reported the claim.
 *   CORROBORATED — multiple genuinely independent credible sources agree
 *                  (reposts/reprints of the same original report don't count).
 *   DISPUTED     — credible reporting conflicts on the claim.
 *   DEBUNKED     — reliable evidence contradicts the claim.
 *   CONFIRMED    — an authoritative source (official statement, or footage
 *                  an official Trailer Observation establishes) has settled it.
 * A rumor must never reach CORROBORATED/CONFIRMED merely because many sites
 * repeat one report, and never reach CONFIRMED merely because it became
 * popular. See README's "Rumor Intelligence" section.
 */
export type RumorStatus = 'UNVERIFIED' | 'REPORTED' | 'CORROBORATED' | 'DISPUTED' | 'DEBUNKED' | 'CONFIRMED'

export type RumorSourceType =
  | 'OFFICIAL'
  | 'TRADE_PRESS'
  | 'MAJOR_OUTLET'
  | 'JOURNALIST'
  | 'INTERVIEW'
  | 'SOCIAL'
  | 'AGGREGATOR'
  | 'UNKNOWN'

/**
 * Qualitative and contextual, never a precision score — a normally
 * reputable outlet can still publish an incorrect rumor, and an unknown
 * source can occasionally be right. This grades the source's track record
 * and identifiability, not the truth of any specific claim it makes.
 */
export type SourceReliability = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN'

/**
 * What this specific source did for the claim's lifecycle — the same
 * source list renders three different ways (chronological history,
 * corroboration, contradictions) by filtering on this field, rather than
 * duplicating a source's data across separate arrays.
 */
export type RumorSourceRole = 'FIRST_REPORT' | 'CORROBORATION' | 'CONTRADICTION' | 'CONFIRMATION' | 'CONTEXT'

export interface RumorSource {
  name: string
  url: string
  publishedAt: string
  type: RumorSourceType
  reliability: SourceReliability
  author?: string
  /** A concise paraphrase of what this source reports — never a copied excerpt. */
  summary: string
  role: RumorSourceRole
}

export interface RumorObservation {
  text: string
  evidenceLevel: EvidenceLevel
  /** Slug of the `Trailer` this observation is grounded in, if the evidence comes from released footage. */
  relatedTrailerSlug?: string
}

export interface Rumor {
  id: string
  slug: string
  title: string
  /** The neutral claim being tracked, e.g. "Character X appears in the film" — not an article headline. */
  claim: string
  /** Neutral summary of what is being reported — never phrased as if the claim were established fact. */
  summary: string
  status: RumorStatus
  /**
   * How strongly available reporting supports the current assessment —
   * distinct from `status` (what the evidence establishes). Omitted once a
   * claim reaches CONFIRMED, which doesn't need a subjective confidence score.
   */
  confidence?: ConfidenceLevel
  firstReportedAt: string
  lastUpdatedAt?: string
  sources: RumorSource[]
  /** Facts supported by evidence, graded like a Trailer's observations — left empty rather than fabricated. */
  observations?: RumorObservation[]
  /** Slugs of `Character` entries this claim is substantively about. */
  relatedCharacterSlugs?: string[]
  /** Slugs of `Trailer` entries whose footage bears on this claim. */
  relatedTrailerSlugs?: string[]
  /** Slugs of `NewsArticle` entries directly covering this claim. */
  relatedNewsSlugs?: string[]
  /** Editorial context that doesn't fit `claim`/`summary` (e.g. a caveat about fan speculation layered on top of a vaguer source claim). */
  notes?: string
  seo?: SeoOverrides
}

export type TimelineEventType = 'production' | 'marketing' | 'release' | 'casting' | 'other'

export interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  type: TimelineEventType
  status: ContentStatus
  source?: SourceAttribution
  /** Slug of the `NewsArticle` this event is drawn from, if one exists. */
  relatedNewsSlug?: string
}

/**
 * Every entity type the knowledge graph (`src/lib/relationships.ts`) can
 * point at. `cast` (the `ContentCategory`/route) is `person` here, since the
 * entity itself is a `Person`, not the collection page.
 */
export type EntityType = 'news' | 'trailer' | 'person' | 'character' | 'theory' | 'rumor' | 'timeline'

/**
 * A stable, type-agnostic pointer to any entity — the shape a future
 * cross-category search ("show everything connected to X") can consume
 * without importing every entity type. See `src/lib/relationships.ts`.
 */
export interface EntityReference {
  type: EntityType
  slug: string
}
