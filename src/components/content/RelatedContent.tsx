import { Link } from 'react-router-dom'
import styles from './RelatedContent.module.css'

export interface RelatedContentItem {
  /** Omitted when there's genuinely nowhere to link yet (e.g. timeline events with no detail page). */
  href?: string
  label: string
  meta?: string
}

export interface RelatedContentSection {
  heading: string
  items: RelatedContentItem[]
}

interface RelatedContentProps {
  sections: RelatedContentSection[]
}

/**
 * The one "known connections" panel reused on every detail page — headings
 * come from `RELATIONSHIP_LABELS` in `lib/relationships.ts`, so the graph's
 * vocabulary and the UI text are the same thing, not two things kept in sync
 * by hand. Sections with nothing in them are dropped rather than shown
 * empty; if every section is empty, the whole component renders nothing.
 */
export function RelatedContent({ sections }: RelatedContentProps) {
  const populated = sections.filter((section) => section.items.length > 0)
  if (populated.length === 0) return null

  return (
    <div className={styles.wrapper}>
      {populated.map((section) => (
        <section key={section.heading} className={styles.section}>
          <h2 className={`text-label ${styles.heading}`}>{section.heading}</h2>
          <ul className={styles.list}>
            {section.items.map((item) => (
              <li key={`${item.href ?? 'unlinked'}-${item.label}`}>
                {item.href ? (
                  <Link to={item.href} className={styles.link}>
                    <span className="text-caption">{item.label}</span>
                    {item.meta && <span className="text-metadata">{item.meta}</span>}
                  </Link>
                ) : (
                  <span className={styles.unlinked}>
                    <span className="text-caption">{item.label}</span>
                    {item.meta && <span className="text-metadata">{item.meta}</span>}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
