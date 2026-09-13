import type { HTMLAttributes, ReactNode } from 'react'
import styles from './Surface.module.css'

type SurfaceLevel = 'base' | 'elevated'

interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  level?: SurfaceLevel
  children: ReactNode
}

export function Surface({ level = 'base', children, className, ...props }: SurfaceProps) {
  const classes = [styles.surface, styles[level], className].filter(Boolean).join(' ')
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}
