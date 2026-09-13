const RELEASE_TIME_ZONE = 'America/New_York'

const releaseMomentFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: RELEASE_TIME_ZONE,
})

/**
 * Formats a release timestamp in the timezone the release is actually
 * pinned to, not the visitor's local zone — so the printed date always
 * matches the instant the countdown is counting down to, instead of
 * shifting a day earlier or later for visitors west or east of it.
 */
export function formatReleaseMoment(iso: string): string {
  return `${releaseMomentFormatter.format(new Date(iso))} ET`
}

const contentDateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'long',
  timeZone: 'UTC',
})

/**
 * Formats a plain content date (`YYYY-MM-DD`, no time component) — pinned to
 * UTC so the printed date never shifts a day earlier for visitors west of
 * UTC, the way rendering a date-only string in the local zone can.
 */
export function formatContentDate(iso: string): string {
  return contentDateFormatter.format(new Date(iso))
}
