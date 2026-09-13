import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Container, JsonLd, UserIcon } from '../../components/common'
import {
  Breadcrumbs,
  DetailHeader,
  MediaThumb,
  NotFoundContent,
  RelatedContent,
  SourceAttributionView,
} from '../../components/content'
import type { RelatedContentSection } from '../../components/content'
import { CATEGORIES } from '../../data/categories'
import styles from './CastDetailPage.module.css'
import { useContentItem } from '../../hooks/useContentItem'
import { useDocumentSeo } from '../../hooks/useDocumentSeo'
import { getCastBySlug } from '../../lib/content'
import { getPersonConnections } from '../../lib/relationships'
import { buildBreadcrumbJsonLd, buildPersonJsonLd, buildWebPageJsonLd, getCastSeo } from '../../lib/seo'
import { formatContentDate } from '../../utils/date'

export function CastDetailPage() {
  const { slug = '' } = useParams()
  const loadPerson = useCallback(() => getCastBySlug(slug), [slug])
  const loadConnections = useCallback(() => getPersonConnections(slug), [slug])
  const { item: person, loading } = useContentItem(loadPerson)
  const { item: connections } = useContentItem(loadConnections)

  const seo = person ? getCastSeo(person) : undefined

  useDocumentSeo(
    seo
      ? { title: seo.title, description: seo.description, path: seo.canonicalPath }
      : { title: 'Cast', path: `${CATEGORIES.cast.path}/${slug}`, robots: { index: false, follow: true } },
  )

  if (!loading && !person) {
    return (
      <Container as="main" id="main-content">
        <NotFoundContent title="Cast member not found" description="This profile doesn't exist, or it moved." />
      </Container>
    )
  }

  if (!person) return null

  const sections: RelatedContentSection[] = [
    {
      heading: 'Plays',
      items: connections?.character
        ? [{ href: `${CATEGORIES.characters.path}/${connections.character.slug}`, label: connections.character.name }]
        : [],
    },
    {
      heading: 'Related news',
      items: (connections?.news ?? []).map((article) => ({
        href: `${CATEGORIES.news.path}/${article.slug}`,
        label: article.title,
        meta: formatContentDate(article.publishedAt),
      })),
    },
    {
      heading: 'Featured in',
      items: (connections?.trailers ?? []).map((trailer) => ({
        href: `${CATEGORIES.trailers.path}/${trailer.slug}`,
        label: trailer.title,
      })),
    },
    {
      heading: 'Related rumors',
      items: (connections?.rumors ?? []).map((rumor) => ({
        href: `${CATEGORIES.rumors.path}/${rumor.slug}`,
        label: rumor.title,
      })),
    },
  ]

  return (
    <Container as="main" id="main-content">
      <JsonLd data={buildWebPageJsonLd({ path: seo!.canonicalPath, title: seo!.title, description: seo!.description })} />
      <JsonLd data={buildPersonJsonLd(person)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Cast', path: CATEGORIES.cast.path },
          { name: person.name, path: seo!.canonicalPath },
        ])}
      />
      <Breadcrumbs
        items={[
          { label: 'Home', path: '/' },
          { label: 'Cast', path: CATEGORIES.cast.path },
          { label: person.name },
        ]}
      />
      <DetailHeader backHref={CATEGORIES.cast.path} backLabel="Cast" title={person.name} eyebrow={person.role} />
      <div className={styles.portrait}>
        <MediaThumb
          media={person.image}
          fallbackIcon={<UserIcon />}
          fallbackLabel={`No portrait available yet for ${person.name}`}
          fallbackName={person.name}
          aspect="portrait"
        />
      </div>
      <p className="text-body">{person.description}</p>
      <SourceAttributionView source={person.source} />
      <RelatedContent sections={sections} />
    </Container>
  )
}
