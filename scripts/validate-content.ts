import {
  getCast,
  getCharacters,
  getNews,
  getRumors,
  getTheories,
  getTimeline,
  getTrailers,
} from '../src/lib/content'
import { getYouTubeEmbedUrl } from '../src/utils/youtube'

/**
 * Build-time graph consistency check. Runs before the sitemap is generated
 * and before Vite builds, so a broken relationship (a slug that points
 * nowhere, a duplicate id) fails the build instead of silently shipping a
 * dead link. Deliberately small: this checks referential integrity of the
 * fields the app actually stores, not a general-purpose schema validator.
 */

const errors: string[] = []

function checkUnique(label: string, values: string[]) {
  const seen = new Set<string>()
  for (const value of values) {
    if (seen.has(value)) errors.push(`Duplicate ${label}: "${value}"`)
    seen.add(value)
  }
}

/**
 * Every `MediaAsset` the project actually ships must carry meaningful alt
 * text and resolve over https — the two properties a runtime check can
 * still catch even though `alt` is required at the type level (an empty
 * string, or a non-https `url`, both still type-check). Anything deeper
 * (is this image actually legitimate to use) is a research/editorial
 * question, not something this script can verify — see README's "Media
 * provenance" section.
 */
function checkMedia(label: string, media: { url: string; alt: string } | undefined) {
  if (!media) return
  if (!media.alt || media.alt.trim().length === 0) {
    errors.push(`${label} has a media asset with no alt text`)
  }
  if (!/^https:\/\//.test(media.url)) {
    errors.push(`${label} has a media asset with a non-https url ("${media.url}")`)
  }
}

const [news, trailers, cast, characters, theories, rumors, timeline] = await Promise.all([
  getNews(),
  getTrailers(),
  getCast(),
  getCharacters(),
  getTheories(),
  getRumors(),
  getTimeline(),
])

checkUnique('news id', news.map((a) => a.id))
checkUnique('news slug', news.map((a) => a.slug))
checkUnique('trailer id', trailers.map((t) => t.id))
checkUnique('trailer slug', trailers.map((t) => t.slug))
checkUnique('cast id', cast.map((p) => p.id))
checkUnique('cast slug', cast.map((p) => p.slug))
checkUnique('character id', characters.map((c) => c.id))
checkUnique('character slug', characters.map((c) => c.slug))
checkUnique('theory id', theories.map((t) => t.id))
checkUnique('theory slug', theories.map((t) => t.slug))
checkUnique('rumor id', rumors.map((r) => r.id))
checkUnique('rumor slug', rumors.map((r) => r.slug))
checkUnique('timeline event id', timeline.map((e) => e.id))

const newsSlugs = new Set(news.map((a) => a.slug))
const characterSlugs = new Set(characters.map((c) => c.slug))
const castSlugs = new Set(cast.map((p) => p.slug))
const trailerSlugs = new Set(trailers.map((t) => t.slug))

for (const article of news) {
  for (const slug of article.relatedCharacterSlugs ?? []) {
    if (!characterSlugs.has(slug)) {
      errors.push(`News "${article.slug}" references unknown character slug "${slug}"`)
    }
  }
  checkMedia(`News "${article.slug}" featuredImage`, article.featuredImage)
}

for (const person of cast) {
  checkMedia(`Cast "${person.slug}" image`, person.image)
}

for (const character of characters) {
  checkMedia(`Character "${character.slug}" image`, character.image)
}

for (const trailer of trailers) {
  const ownCharacterSlugs = new Set(trailer.relatedCharacterSlugs ?? [])

  for (const slug of trailer.relatedCharacterSlugs ?? []) {
    if (!characterSlugs.has(slug)) {
      errors.push(`Trailer "${trailer.slug}" references unknown character slug "${slug}"`)
    }
  }
  if (trailer.relatedNewsSlug && !newsSlugs.has(trailer.relatedNewsSlug)) {
    errors.push(`Trailer "${trailer.slug}" references unknown news slug "${trailer.relatedNewsSlug}"`)
  }

  checkMedia(`Trailer "${trailer.slug}" thumbnail`, trailer.thumbnail)

  if (trailer.videoUrl) {
    if (trailer.verificationStatus !== 'verified') {
      errors.push(`Trailer "${trailer.slug}" has a videoUrl but verificationStatus is not "verified"`)
    }
    if (!getYouTubeEmbedUrl(trailer.videoUrl)) {
      errors.push(`Trailer "${trailer.slug}" has a videoUrl that isn't a valid YouTube watch URL`)
    }
  } else if (trailer.verificationStatus === 'verified') {
    errors.push(`Trailer "${trailer.slug}" is marked "verified" but has no videoUrl`)
  }

  if (trailer.duration !== undefined && trailer.duration <= 0) {
    errors.push(`Trailer "${trailer.slug}" has a non-positive duration`)
  }

  const seenTimestamps = new Set<number>()
  for (const timestamp of trailer.analysis?.timestamps ?? []) {
    if (timestamp.time < 0) {
      errors.push(`Trailer "${trailer.slug}" has a negative timestamp (${timestamp.time})`)
    }
    if (trailer.duration !== undefined && timestamp.time > trailer.duration) {
      errors.push(`Trailer "${trailer.slug}" has a timestamp (${timestamp.time}s) past its duration (${trailer.duration}s)`)
    }
    if (seenTimestamps.has(timestamp.time)) {
      errors.push(`Trailer "${trailer.slug}" has a duplicate timestamp (${timestamp.time}s)`)
    }
    seenTimestamps.add(timestamp.time)

    for (const slug of timestamp.relatedCharacterSlugs ?? []) {
      if (!ownCharacterSlugs.has(slug)) {
        errors.push(
          `Trailer "${trailer.slug}" timestamp (${timestamp.time}s) references character slug "${slug}" not in the trailer's own relatedCharacterSlugs`,
        )
      }
    }
  }

  for (const observation of trailer.analysis?.observations ?? []) {
    for (const slug of observation.relatedCharacterSlugs ?? []) {
      if (!ownCharacterSlugs.has(slug)) {
        errors.push(
          `Trailer "${trailer.slug}" observation references character slug "${slug}" not in the trailer's own relatedCharacterSlugs`,
        )
      }
    }
  }
}

for (const character of characters) {
  if (character.actorSlug && !castSlugs.has(character.actorSlug)) {
    errors.push(`Character "${character.slug}" references unknown cast slug "${character.actorSlug}"`)
  }
}

checkUnique(
  'character actorSlug',
  characters.map((c) => c.actorSlug).filter((slug): slug is string => Boolean(slug)),
)

for (const rumor of rumors) {
  for (const slug of rumor.relatedCharacterSlugs ?? []) {
    if (!characterSlugs.has(slug)) {
      errors.push(`Rumor "${rumor.slug}" references unknown character slug "${slug}"`)
    }
  }
  for (const slug of rumor.relatedTrailerSlugs ?? []) {
    if (!trailerSlugs.has(slug)) {
      errors.push(`Rumor "${rumor.slug}" references unknown trailer slug "${slug}"`)
    }
  }
  for (const slug of rumor.relatedNewsSlugs ?? []) {
    if (!newsSlugs.has(slug)) {
      errors.push(`Rumor "${rumor.slug}" references unknown news slug "${slug}"`)
    }
  }

  if (rumor.sources.length === 0) {
    errors.push(`Rumor "${rumor.slug}" has no sources`)
  }

  const seenSourceUrls = new Set<string>()
  for (const source of rumor.sources) {
    if (seenSourceUrls.has(source.url)) {
      errors.push(`Rumor "${rumor.slug}" has a duplicate source URL "${source.url}"`)
    }
    seenSourceUrls.add(source.url)
  }

  if (rumor.lastUpdatedAt && rumor.lastUpdatedAt < rumor.firstReportedAt) {
    errors.push(`Rumor "${rumor.slug}" has lastUpdatedAt before firstReportedAt`)
  }

  for (const observation of rumor.observations ?? []) {
    if (observation.relatedTrailerSlug && !trailerSlugs.has(observation.relatedTrailerSlug)) {
      errors.push(
        `Rumor "${rumor.slug}" observation references unknown trailer slug "${observation.relatedTrailerSlug}"`,
      )
    }
  }

  if (rumor.status === 'CONFIRMED') {
    const hasConfirmationEvidence =
      rumor.sources.some((s) => s.role === 'CONFIRMATION') ||
      (rumor.observations ?? []).some((o) => o.evidenceLevel === 'CONFIRMED')
    if (!hasConfirmationEvidence) {
      errors.push(`Rumor "${rumor.slug}" is marked CONFIRMED but has no CONFIRMATION source or CONFIRMED observation`)
    }
  }

  if (rumor.status === 'DEBUNKED' && !rumor.sources.some((s) => s.role === 'CONTRADICTION')) {
    errors.push(`Rumor "${rumor.slug}" is marked DEBUNKED but has no CONTRADICTION source`)
  }

  if (rumor.status === 'CORROBORATED') {
    const corroboratingCount = rumor.sources.filter(
      (s) => s.role === 'CORROBORATION' || s.role === 'CONFIRMATION',
    ).length
    if (corroboratingCount < 2) {
      errors.push(`Rumor "${rumor.slug}" is marked CORROBORATED but has fewer than 2 corroborating sources`)
    }
  }
}

for (const event of timeline) {
  if (event.relatedNewsSlug && !newsSlugs.has(event.relatedNewsSlug)) {
    errors.push(`Timeline event "${event.id}" references unknown news slug "${event.relatedNewsSlug}"`)
  }
}

if (errors.length > 0) {
  console.error(`Content graph validation failed with ${errors.length} error(s):`)
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}

console.log(
  `Content graph OK: ${news.length} news, ${trailers.length} trailers, ${cast.length} cast, ${characters.length} characters, ${theories.length} theories, ${rumors.length} rumors, ${timeline.length} timeline events — all relationships resolve.`,
)
