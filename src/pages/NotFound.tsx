import { NotFoundContent } from '../components/content'
import { useDocumentSeo } from '../hooks/useDocumentSeo'

/**
 * Handles an unmatched in-app route (client-side navigation to an unknown
 * path). `public/404.html` is the separate static page GitHub Pages serves
 * for a hard/direct navigation that never loads this app at all.
 */
export function NotFound() {
  useDocumentSeo({ title: 'Page not found', robots: { index: false, follow: true } })

  return (
    <main id="main-content">
      <NotFoundContent />
    </main>
  )
}
