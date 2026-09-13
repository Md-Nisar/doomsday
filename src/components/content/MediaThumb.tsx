import { useState } from 'react'
import type { ReactNode } from 'react'
import type { MediaAsset } from '../../types/content'
import styles from './MediaThumb.module.css'

interface MediaThumbProps {
  media?: MediaAsset
  /** Decorative fallback shown when there's no legitimately sourced image yet — never an unknown/random photo. */
  fallbackIcon: ReactNode
  /** Announced to assistive tech in place of the (absent) image's alt text. */
  fallbackLabel: string
  /** A small play glyph over the image, for video thumbnails — shape-based, not color-only. */
  showPlayIndicator?: boolean
  /**
   * A name to derive a monogram + a stable tint variant from, for
   * person-shaped fallbacks (cast/character cards) — purely decorative
   * variety within the site's one brand hue, never a stand-in for a real
   * photo and never used to convey status.
   */
  fallbackName?: string
  /** '16:9' (default) suits video thumbnails; 'portrait' suits people. */
  aspect?: 'video' | 'portrait'
}

/** Small, stable hash so the same name always gets the same tint variant. */
function tintVariant(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff
  return Math.abs(hash) % 4
}

function initialsOf(name: string): string {
  const words = name.split(/\s+/).filter(Boolean)
  const first = words[0]?.[0] ?? ''
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}

/**
 * The one image-or-fallback box reused by every card/detail view that shows
 * media (`ContentCard`'s `media` slot). Reserves a fixed aspect ratio so
 * there's no layout shift whether the real image, the fallback, or (via
 * `onError`) a broken-image recovery ends up rendering. Never renders an
 * unknown/random placeholder photo — the fallback is always the same
 * abstract, on-brand box plus a category icon, optionally paired with a
 * monogram derived from `fallbackName` for a more premium, person-specific
 * feel than a bare icon on its own.
 */
export function MediaThumb({
  media,
  fallbackIcon,
  fallbackLabel,
  showPlayIndicator,
  fallbackName,
  aspect = 'video',
}: MediaThumbProps) {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(media) && !failed

  return (
    <div className={[styles.thumb, aspect === 'portrait' && styles.portrait].filter(Boolean).join(' ')}>
      {showImage && media ? (
        <img
          src={media.url}
          alt={media.alt}
          loading="lazy"
          decoding="async"
          className={styles.image}
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className={[styles.fallback, fallbackName && styles[`tone${tintVariant(fallbackName)}`]]
            .filter(Boolean)
            .join(' ')}
          role="img"
          aria-label={fallbackLabel}
        >
          {fallbackName && <span className={styles.monogram}>{initialsOf(fallbackName)}</span>}
          <span className={styles.fallbackIcon}>{fallbackIcon}</span>
        </div>
      )}
      {showImage && showPlayIndicator && (
        <span className={styles.playIndicator} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      )}
    </div>
  )
}
