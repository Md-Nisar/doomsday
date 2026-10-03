import styles from './CountdownUnit.module.css'

interface CountdownUnitProps {
  value: string
  label: string
  size?: 'md' | 'lg'
}

/**
 * A single value/label pair used by both the static style-guide preview
 * and the live homepage countdown. Digits are hidden from assistive tech
 * and replaced with one `sr-only` sentence per unit — a per-second
 * `aria-live` announcement would be too noisy for screen reader users.
 */
export function CountdownUnit({ value, label, size = 'md' }: CountdownUnitProps) {
  const classes = [styles.unit, size === 'lg' && styles.lg].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      {/* Keyed on the value so each change replays the one-shot tick keyframe (no-op under reduced motion). */}
      <span key={value} className={styles.value} aria-hidden="true">
        {value}
      </span>
      <span className="text-label" aria-hidden="true">
        {label}
      </span>
      <span className="sr-only">{`${value} ${label}`}</span>
    </div>
  )
}
