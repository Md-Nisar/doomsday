/** Derives a `youtube.com/embed/…` URL from a standard watch URL, for iframe embedding. */
export function getYouTubeEmbedUrl(videoUrl: string): string | undefined {
  try {
    const url = new URL(videoUrl)
    const id = url.searchParams.get('v')
    if (!id) return undefined
    return `https://www.youtube.com/embed/${id}`
  } catch {
    return undefined
  }
}

/**
 * Appends a start time to an embed URL so re-rendering the iframe with a new
 * `src` seeks the player there — the simplest reliable way to make a
 * timestamp clickable without the YouTube IFrame Player API or a new
 * dependency.
 */
export function withStartTime(embedUrl: string, seconds: number): string {
  return `${embedUrl}?start=${Math.max(0, Math.floor(seconds))}&autoplay=1`
}
