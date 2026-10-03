import { useLayoutEffect, useRef } from 'react'
import type { CSSProperties, ElementType, ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Position in a staggered group; each step delays the reveal by `--stagger-step`. */
  index?: number
}

/**
 * Fades/rises its children in once as they scroll into view.
 *
 * Progressive by construction: the element renders fully visible, and is only
 * "armed" (hidden) after mount when it's below the fold, motion is allowed and
 * IntersectionObserver exists. Anything already on screen, or any visitor who
 * can't or doesn't want the effect, just sees the content. It reveals once and
 * stops observing — no scroll listeners, no re-triggering.
 */
export function Reveal({ children, as: Tag = 'div', className, index = 0 }: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      element.getBoundingClientRect().top < window.innerHeight
    ) {
      return
    }

    element.setAttribute('data-armed', '')
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          element.setAttribute('data-visible', '')
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const style = index > 0 ? ({ '--reveal-index': index } as CSSProperties) : undefined

  return (
    <Tag ref={ref} className={['reveal', className].filter(Boolean).join(' ')} style={style}>
      {children}
    </Tag>
  )
}
