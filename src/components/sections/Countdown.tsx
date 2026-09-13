import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CountdownUnit } from '../common'
import { activeCountdownTheme, toCountdownThemeVars } from '../../config/countdownTheme'
import { siteConfig } from '../../config/site'
import { useCountdown } from '../../hooks/useCountdown'
import { formatReleaseMoment } from '../../utils/date'
import styles from './Countdown.module.css'

const UNITS = [
  { key: 'months', label: 'Months' },
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
] as const

function pad(value: number) {
  return value.toString().padStart(2, '0')
}

/**
 * The live countdown to `siteConfig.releaseDate` — themed via
 * `activeCountdownTheme` (`src/config/countdownTheme.ts`). The palette lives
 * entirely in that config as `--countdown-*` custom properties scoped to
 * this component's own wrapper; nothing here hardcodes a color, so swapping
 * themes (or adding a release-week/release-day variant later) never touches
 * this file. Runs entirely in the browser — no backend — and switches to a
 * completed state instead of showing negative values once the release
 * moment passes.
 */
export function Countdown() {
  const remaining = useCountdown(siteConfig.releaseDate)
  const themeVars = toCountdownThemeVars(activeCountdownTheme) as CSSProperties

  const units: ReactNode[] = []
  UNITS.forEach(({ key, label }, index) => {
    units.push(<CountdownUnit key={key} value={pad(remaining[key])} label={label} size="lg" />)
    if (index < UNITS.length - 1) {
      units.push(
        <span key={`${key}-sep`} className={styles.separator} aria-hidden="true">
          :
        </span>,
      )
    }
  })

  return (
    <div className={styles.panel} style={themeVars}>
      {remaining.isComplete ? (
        <div className={styles.complete} role="status">
          <p className={`text-display ${styles.completeText}`}>Doomsday has arrived.</p>
        </div>
      ) : (
        <div className={styles.wrapper}>
          <p className={styles.movieTitle}>Avengers: Doomsday</p>
          <div
            className={styles.group}
            role="group"
            aria-label="Countdown to the Avengers: Doomsday release"
          >
            {units}
          </div>
          <p className="text-metadata">{formatReleaseMoment(siteConfig.releaseDate)}</p>
          <Link to="/trailers/doomsday-clock" className={styles.clockLink}>
            Watch the official Doomsday Clock
          </Link>
        </div>
      )}
    </div>
  )
}
