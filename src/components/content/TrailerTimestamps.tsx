import { Link } from 'react-router-dom'
import { EvidenceBadge } from '../common'
import type { Character, TrailerTimestamp } from '../../types/content'
import { CATEGORIES } from '../../data/categories'
import { formatDuration } from '../../utils/duration'
import styles from './TrailerTimestamps.module.css'

interface TrailerTimestampsProps {
  timestamps: TrailerTimestamp[]
  /** Resolves `relatedCharacterSlugs` to links — pass the trailer's own connected characters. */
  characters: Character[]
  /** Omitted when there's no embedded player to seek (e.g. an unverified trailer with no video). */
  onSeek?: (seconds: number) => void
}

/**
 * Renders nothing when empty, matching `RelatedContent`'s convention — every
 * trailer ships with this architecture ready, but only timestamps that have
 * actually been reviewed frame-by-frame in the real footage belong here.
 */
export function TrailerTimestamps({ timestamps, characters, onSeek }: TrailerTimestampsProps) {
  if (timestamps.length === 0) return null

  const characterBySlug = new Map(characters.map((character) => [character.slug, character]))

  return (
    <ol className={styles.list}>
      {timestamps.map((timestamp) => {
        const time = formatDuration(timestamp.time)
        const spotted = (timestamp.relatedCharacterSlugs ?? [])
          .map((slug) => characterBySlug.get(slug))
          .filter((c): c is Character => Boolean(c))

        return (
          <li key={timestamp.time} className={styles.item}>
            {onSeek ? (
              <button
                type="button"
                className={styles.time}
                onClick={() => onSeek(timestamp.time)}
                aria-label={`Seek to ${time} — ${timestamp.title}`}
              >
                {time}
              </button>
            ) : (
              <span className={styles.time}>{time}</span>
            )}
            <div className={styles.body}>
              <div className={styles.heading}>
                <span className="text-caption">{timestamp.title}</span>
                <EvidenceBadge level={timestamp.evidenceLevel} />
              </div>
              {timestamp.description && <p className="text-caption">{timestamp.description}</p>}
              {spotted.length > 0 && (
                <p className={styles.characters}>
                  {spotted.map((character) => (
                    <Link key={character.slug} to={`${CATEGORIES.characters.path}/${character.slug}`} className={styles.characterLink}>
                      {character.name}
                    </Link>
                  ))}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
