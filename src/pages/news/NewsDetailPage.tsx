import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Container, JsonLd } from '../../components/common'
import { Breadcrumbs, DetailHeader, NotFoundContent, RelatedContent, SourceAttributionView } from '../../components/content'
import type { RelatedContentSection } from '../../components/content'
import { CATEGORIES } from '../../data/categories'
import { useContentItem } from '../../hooks/useContentItem'
import { useDocumentSeo } from '../../hooks/useDocumentSeo'
import { getNewsBySlug } from '../../lib/content'
import { getNewsConnections } from '../../lib/relationships'
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildWebPageJsonLd, getNewsArticleSeo } from '../../lib/seo'
import { formatContentDate } from '../../utils/date'
import styles from './NewsDetailPage.module.css'

export function NewsDetailPage() {
  const { slug = '' } = useParams()
  const loadArticle = useCallback(() => getNewsBySlug(slug), [slug])
  const loadConnections = useCallback(() => getNewsConnections(slug), [slug])
  const { item: article, loading } = useContentItem(loadArticle)
  const { item: connections } = useContentItem(loadConnections)

  const seo = article ? getNewsArticleSeo(article) : undefined

  useDocumentSeo(
    seo
      ? { title: seo.title, description: seo.description, path: seo.canonicalPath }
      : { title: 'News', path: `${CATEGORIES.news.path}/${slug}`, robots: { index: false, follow: true } },
  )

  if (!loading && !article) {
    return (
      <Container as="main" id="main-content">
        <NotFoundContent title="Article not found" description="This news item doesn't exist, or it moved." />
      </Container>
    )
  }

  if (!article) return null

  const sections: RelatedContentSection[] = [
    {
      heading: 'Related characters',
      items: (connections?.characters ?? []).map((character) => ({
        href: `${CATEGORIES.characters.path}/${character.slug}`,
        label: character.name,
      })),
    },
    {
      heading: 'Timeline',
      items: (connections?.timeline ?? []).map((event) => ({
        label: event.title,
        meta: formatContentDate(event.date),
      })),
    },
    {
      heading: 'Trailer coverage',
      items: (connections?.trailers ?? []).map((trailer) => ({
        href: `${CATEGORIES.trailers.path}/${trailer.slug}`,
        label: trailer.title,
        meta: formatContentDate(trailer.releaseDate),
      })),
    },
    {
      heading: 'Related rumor',
      items: (connections?.rumors ?? []).map((rumor) => ({
        href: `${CATEGORIES.rumors.path}/${rumor.slug}`,
        label: rumor.title,
      })),
    },
  ]

  return (
    <Container as="main" id="main-content">
      <JsonLd data={buildWebPageJsonLd({ path: seo!.canonicalPath, title: seo!.title, description: seo!.description })} />
      <JsonLd data={buildArticleJsonLd(article)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'News', path: CATEGORIES.news.path },
          { name: article.title, path: seo!.canonicalPath },
        ])}
      />
      <Breadcrumbs
        items={[
          { label: 'Home', path: '/' },
          { label: 'News', path: CATEGORIES.news.path },
          { label: article.title },
        ]}
      />
      <DetailHeader
        backHref={CATEGORIES.news.path}
        backLabel="News"
        title={article.title}
        status={article.status}
        meta={formatContentDate(article.publishedAt)}
      />
      <p className={`text-body ${styles.body}`}>{article.content}</p>
      <SourceAttributionView source={article.source} publishedAt={article.publishedAt} updatedAt={article.updatedAt} />
      <RelatedContent sections={sections} />
    </Container>
  )
}
