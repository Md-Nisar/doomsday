import styles from './Divider.module.css'

interface DividerProps {
  className?: string
}

export function Divider({ className }: DividerProps) {
  return <hr className={[styles.divider, className].filter(Boolean).join(' ')} />
}
