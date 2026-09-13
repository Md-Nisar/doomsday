import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import styles from './Breadcrumbs.module.css'

export interface BreadcrumbItem {
  label: string
  /** Omitted for the current page — rendered as plain text, not a link to itself. */
  path?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

/** Visible, accessible breadcrumb trail — pair with `buildBreadcrumbJsonLd` for the matching JSON-LD. */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={styles.nav}>
      <ol className={styles.list}>
        {items.map((item, index) => (
          <Fragment key={item.label}>
            <li className={styles.item}>
              {item.path ? (
                <Link to={item.path} className={styles.link}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page">{item.label}</span>
              )}
            </li>
            {index < items.length - 1 && (
              <li aria-hidden="true" className={styles.separator}>
                /
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}
