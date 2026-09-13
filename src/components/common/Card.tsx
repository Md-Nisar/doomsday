import type { HTMLAttributes, ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  interactive?: boolean
}

export function Card({ children, className, interactive = false, ...props }: CardProps) {
  const classes = [styles.card, interactive && styles.interactive, className]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={classes} tabIndex={interactive ? 0 : undefined} {...props}>
      {children}
    </div>
  )
}
