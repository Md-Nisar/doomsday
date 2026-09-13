import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Container, JsonLd } from '../../components/common'
import { Breadcrumbs, DetailHeader, NotFoundContent, SourceAttributionView } from '../../components/content'
import { CATEGORIES } from '../../data/categories'
import { useContentItem } from '../../hooks/useContentItem'
import { useDocumentSeo } from '../../hooks/useDocumentSeo'
import { getTheoryBySlug } from '../../lib/content'
import { buildBreadcrumbJsonLd, buildWebPageJsonLd, getTheorySeo } from '../../lib/seo'

export function TheoryDetailPage() {
  const { slug = '' } = useParams()
  const loadTheory = useCallback(() => getTheoryBySlug(slug), [slug])
  const { item: theory, loading } = useContentItem(loadTheory)

  const seo = theory ? getTheorySeo(theory) : undefined

  useDocumentSeo(
    seo
      ? { title: seo.title, description: seo.description, path: seo.canonicalPath }
      : { title: 'Theories', path: `${CATEGORIES.theories.path}/${slug}`, robots: { index: false, follow: true } },
  )

  if (!loading && !theory) {
    return (
      <Container as="main" id="main-content">
        <NotFoundContent title="Theory not found" description="This theory doesn't exist, or it moved." />
      </Container>
    )
  }

  if (!theory) return null

  return (
    <Container as="main" id="main-content">
      <JsonLd data={buildWebPageJsonLd({ path: seo!.canonicalPath, title: seo!.title, description: seo!.description })} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Theories', path: CATEGORIES.theories.path },
          { name: theory.title, path: seo!.canonicalPath },
        ])}
      />
      <Breadcrumbs
        items={[
          { label: 'Home', path: '/' },
          { label: 'Theories', path: CATEGORIES.theories.path },
          { label: theory.title },
        ]}
      />
      <DetailHeader
        backHref={CATEGORIES.theories.path}
        backLabel="Theories"
        title={theory.title}
        status="theory"
        meta={`By ${theory.author.name} · Confidence: ${theory.confidence}`}
      />
      <p className="text-body">{theory.content}</p>
      <SourceAttributionView source={theory.source} publishedAt={theory.publishedAt} updatedAt={theory.updatedAt} />
    </Container>
  )
}
