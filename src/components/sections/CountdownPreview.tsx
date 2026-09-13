import { CountdownUnit } from '../common'
import styles from './CountdownPreview.module.css'

const DEMO_UNITS = [
  { value: '128', label: 'Days' },
  { value: '14', label: 'Hours' },
  { value: '52', label: 'Minutes' },
  { value: '09', label: 'Seconds' },
]

/**
 * Static visual mockup of the future live countdown — demo values only, no
 * timer. The real thing ships in Phase 3, driven by a `useCountdown` hook
 * reading `siteConfig.releaseDate`.
 */
export function CountdownPreview() {
  return (
    <div className={styles.row}>
      {DEMO_UNITS.map((unit) => (
        <CountdownUnit key={unit.label} value={unit.value} label={unit.label} />
      ))}
    </div>
  )
}
