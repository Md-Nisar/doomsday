import type { ReactNode } from 'react'
import styles from './SectionHeading.module.css'

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  /** `h1` for a page's own top-level heading (e.g. a category index page with no other h1); defaults to `h2` for an in-page section. */
  level?: 'h1' | 'h2'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  level = 'h2',
}: SectionHeadingProps) {
  const classes = [styles.heading, align === 'center' && styles.center].filter(Boolean).join(' ')
  const Heading = level
  return (
    <div className={classes}>
      {eyebrow && <span className={`text-label ${styles.eyebrow}`}>{eyebrow}</span>}
      <Heading className={level === 'h1' ? 'text-h1' : 'text-h2'}>{title}</Heading>
      {description && <p className="text-subheading">{description}</p>}
    </div>
  )
}
