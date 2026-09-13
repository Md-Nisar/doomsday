import type { ReactNode } from 'react'
import styles from './CardGrid.module.css'

interface CardGridProps {
  children: ReactNode
}

/** Shared responsive grid for card listings across every index page. */
export function CardGrid({ children }: CardGridProps) {
  return <div className={styles.grid}>{children}</div>
}
