import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Container, EvidenceBadge, JsonLd, RumorStatusBadge } from '../../components/common'
import {
  Breadcrumbs,
  DetailHeader,
  NotFoundContent,
  RelatedContent,
  RumorSourceList,
} from '../../components/content'
import type { RelatedContentSection } from '../../components/content'
import { CATEGORIES } from '../../data/categories'
import { useContentItem } from '../../hooks/useContentItem'
import { useDocumentSeo } from '../../hooks/useDocumentSeo'
import { getRumorBySlug } from '../../lib/content'
import { getRumorConnections } from '../../lib/relationships'
import { buildBreadcrumbJsonLd, buildWebPageJsonLd, getRumorSeo } from '../../lib/seo'
import { formatContentDate } from '../../utils/date'
import styles from './RumorDetailPage.module.css'

export function RumorDetailPage() {
  const { slug = '' } = useParams()
  const loadRumor = useCallback(() => getRumorBySlug(slug), [slug])
  const loadConnections = useCallback(() => getRumorConnections(slug), [slug])
  const { item: rumor, loading } = useContentItem(loadRumor)
  const { item: connections } = useContentItem(loadConnections)

  const seo = rumor ? getRumorSeo(rumor) : undefined

  useDocumentSeo(
    seo
      ? { title: seo.title, description: seo.description, path: seo.canonicalPath }
      : { title: 'Rumors', path: `${CATEGORIES.rumors.path}/${slug}`, robots: { index: false, follow: true } },
  )

  if (!loading && !rumor) {
    return (
      <Container as="main" id="main-content">
        <NotFoundContent title="Rumor not found" description="This rumor doesn't exist, or it moved." />
      </Container>
    )
  }

  if (!rumor) return null

  const observations = rumor.observations ?? []
  const corroboration = rumor.sources.filter((s) => s.role === 'CORROBORATION' || s.role === 'CONFIRMATION')
  const contradictions = rumor.sources.filter((s) => s.role === 'CONTRADICTION')

  const sections: RelatedContentSection[] = [
    {
      heading: 'Related characters',
      items: (connections?.characters ?? []).map((character) => ({
        href: `${CATEGORIES.characters.path}/${character.slug}`,
        label: character.name,
      })),
    },
    {
      heading: 'Related trailers',
      items: (connections?.trailers ?? []).map((trailer) => ({
        href: `${CATEGORIES.trailers.path}/${trailer.slug}`,
        label: trailer.title,
        meta: formatContentDate(trailer.releaseDate),
      })),
    },
    {
      heading: 'Related news',
      items: (connections?.news ?? []).map((article) => ({
        href: `${CATEGORIES.news.path}/${article.slug}`,
        label: article.title,
        meta: formatContentDate(article.publishedAt),
      })),
    },
  ]

  return (
    <Container as="main" id="main-content">
      <JsonLd data={buildWebPageJsonLd({ path: seo!.canonicalPath, title: seo!.title, description: seo!.description })} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Rumors', path: CATEGORIES.rumors.path },
          { name: rumor.title, path: seo!.canonicalPath },
        ])}
      />
      <Breadcrumbs
        items={[
          { label: 'Home', path: '/' },
          { label: 'Rumors', path: CATEGORIES.rumors.path },
          { label: rumor.title },
        ]}
      />
      <DetailHeader
        backHref={CATEGORIES.rumors.path}
        backLabel="Rumors"
        title={rumor.title}
        badge={<RumorStatusBadge status={rumor.status} />}
        meta={
          <>
            First reported {formatContentDate(rumor.firstReportedAt)}
            {rumor.lastUpdatedAt && rumor.lastUpdatedAt !== rumor.firstReportedAt && (
              <> · Updated {formatContentDate(rumor.lastUpdatedAt)}</>
            )}
            {rumor.confidence && <> · Confidence: {rumor.confidence}</>}
          </>
        }
      />

      <p className={`text-body ${styles.claim}`}>{rumor.claim}</p>

      <section className={styles.section}>
        <h2 className="text-h3">What is being reported</h2>
        <p className="text-caption">{rumor.summary}</p>
      </section>

      {observations.length > 0 && (
        <section className={styles.section}>
          <h2 className="text-h3">What we know</h2>
          <ul className={styles.observationList}>
            {observations.map((observation, index) => (
              <li key={index} className={styles.observationItem}>
                <EvidenceBadge level={observation.evidenceLevel} />
                <span className="text-caption">{observation.text}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {rumor.notes && (
        <section className={styles.section}>
          <p className={`text-metadata ${styles.note}`}>{rumor.notes}</p>
        </section>
      )}

      <section className={styles.section}>
        <h2 className="text-h3">Source history</h2>
        <RumorSourceList sources={rumor.sources} />
      </section>

      {corroboration.length > 0 && (
        <section className={styles.section}>
          <h2 className="text-h3">Corroboration</h2>
          <p className="text-caption">
            {corroboration.length} independent report{corroboration.length === 1 ? '' : 's'} support this claim.
          </p>
          <RumorSourceList sources={corroboration} />
        </section>
      )}

      {contradictions.length > 0 && (
        <section className={styles.section}>
          <h2 className="text-h3">Contradictions</h2>
          <p className="text-caption">
            {contradictions.length} report{contradictions.length === 1 ? '' : 's'} conflict with this claim.
          </p>
          <RumorSourceList sources={contradictions} />
        </section>
      )}

      <RelatedContent sections={sections} />
    </Container>
  )
}
