export interface NavItem {
  label: string
  href?: string
}

/**
 * `href` is only set for sections that currently hold real, sourced
 * content — `components/layout/Header` renders any item without one as a
 * disabled "Soon" label instead of a link to an empty page. Update this
 * list as categories go from empty to populated (see `src/data/*`), not
 * the other way around: a route existing is not enough to enable its nav
 * entry.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'News', href: '/news' },
  { label: 'Trailers', href: '/trailers' },
  { label: 'Cast', href: '/cast' },
  { label: 'Characters', href: '/characters' },
  { label: 'Theories' },
  { label: 'Rumors', href: '/rumors' },
  { label: 'Timeline', href: '/timeline' },
]
