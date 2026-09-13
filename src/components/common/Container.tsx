import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import styles from './Container.module.css'

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  children: ReactNode
}

export function Container({ as: Tag = 'div', children, className, ...props }: ContainerProps) {
  const classes = [styles.container, className].filter(Boolean).join(' ')
  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  )
}
