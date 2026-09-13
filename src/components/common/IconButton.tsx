import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './IconButton.module.css'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  label: string
}

export function IconButton({ icon, label, className, type = 'button', ...props }: IconButtonProps) {
  const classes = [styles.iconButton, className].filter(Boolean).join(' ')
  return (
    <button type={type} aria-label={label} className={classes} {...props}>
      {icon}
    </button>
  )
}
