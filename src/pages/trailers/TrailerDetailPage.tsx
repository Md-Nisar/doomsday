import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container, EvidenceBadge, JsonLd } from '../../components/common'
import {
  Breadcrumbs,
  DetailHeader,
  NotFoundContent,
  RelatedContent,
  SourceAttributionView,
  TrailerTimestamps,
} from '../../components/content'
import type { RelatedContentSection } from '../../components/content'
import { CATEGORIES } from '../../data/categories'
import { useContentItem } from '../../hooks/useContentItem'
import { useDocumentSeo } from '../../hooks/useDocumentSeo'
import { getTrailerBySlug } from '../../lib/content'
import { getTrailerConnections } from '../../lib/relationships'
import { buildBreadcrumbJsonLd, buildVideoObjectJsonLd, buildWebPageJsonLd, getTrailerSeo } from '../../lib/seo'
import type { EvidenceLevel } from '../../types/content'
import { formatContentDate } from '../../utils/date'
import { formatDuration } from '../../utils/duration'
import { getYouTubeEmbedUrl, withStartTime } from '../../utils/youtube'
import styles from './TrailerDetailPage.module.css'

const TYPE_LABEL: Record<string, string> = {
  teaser: 'Teaser',
  trailer: 'Trailer',
  special_look: 'Special Look',
  tv_spot: 'TV Spot',
  clip: 'Clip',
  clock: 'Doomsday Clock',
  other: 'Promotional footage',
}

const EVIDENCE_ORDER: EvidenceLevel[] = ['CONFIRMED', 'VISIBLE', 'INFERRED', 'THEORY']

export function TrailerDetailPage() {
  const { slug = '' } = useParams()
  const loadTrailer = useCallback(() => getTrailerBySlug(slug), [slug])
  const loadConnections = useCallback(() => getTrailerConnections(slug), [slug])
  const { item: trailer, loading } = useContentItem(loadTrailer)
  const { item: connections } = useContentItem(loadConnections)
  const [seekState, setSeekState] = useState<{ slug: string; seconds: number | null }>({ slug, seconds: null })

  const seekSeconds = seekState.slug === slug ? seekState.seconds : null
  const setSeekSeconds = (seconds: number) => setSeekState({ slug, seconds })

  const seo = trailer ? getTrailerSeo(trailer) : undefined

  useDocumentSeo(
    seo
      ? { title: seo.title, description: seo.description, path: seo.canonicalPath }
      : { title: 'Trailers', path: `${CATEGORIES.trailers.path}/${slug}`, robots: { index: false, follow: true } },
  )

  if (!loading && !trailer) {
    return (
      <Container as="main" id="main-content">
        <NotFoundContent title="Trailer not found" description="This trailer doesn't exist, or it moved." />
      </Container>
    )
  }

  if (!trailer) return null

  const embedUrl = trailer.videoUrl ? getYouTubeEmbedUrl(trailer.videoUrl) : undefined
  const embedSrc = embedUrl && seekSeconds !== null ? withStartTime(embedUrl, seekSeconds) : embedUrl

  const observations = trailer.analysis?.observations ?? []
  const confirms = observations.filter((o) => o.evidenceLevel === 'CONFIRMED')
  const suggests = observations.filter((o) => o.evidenceLevel === 'INFERRED' || o.evidenceLevel === 'THEORY')
  const timestamps = [...(trailer.analysis?.timestamps ?? [])].sort((a, b) => a.time - b.time)

  const sections: RelatedContentSection[] = [
    {
      heading: 'Characters spotted',
      items: (connections?.characters ?? []).map((character) => ({
        href: `${CATEGORIES.characters.path}/${character.slug}`,
        label: character.name,
      })),
    },
    {
      heading: 'Related coverage',
      items: connections?.news
        ? [
            {
              href: `${CATEGORIES.news.path}/${connections.news.slug}`,
              label: connections.news.title,
              meta: formatContentDate(connections.news.publishedAt),
            },
          ]
        : [],
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
      {trailer.videoUrl && <JsonLd data={buildVideoObjectJsonLd({ ...trailer, videoUrl: trailer.videoUrl })} />}
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Trailers', path: CATEGORIES.trailers.path },
          { name: trailer.title, path: seo!.canonicalPath },
        ])}
      />
      <Breadcrumbs
        items={[
          { label: 'Home', path: '/' },
          { label: 'Trailers', path: CATEGORIES.trailers.path },
          { label: trailer.title },
        ]}
      />
      <DetailHeader
        backHref={CATEGORIES.trailers.path}
        backLabel="Trailers"
        title={trailer.title}
        eyebrow={TYPE_LABEL[trailer.type]}
        meta={
          <>
            {formatContentDate(trailer.releaseDate)}
            {trailer.duration && ` · ${formatDuration(trailer.duration)}`}
          </>
        }
      />

      {embedSrc ? (
        <div className={styles.embedWrapper}>
          <iframe
            src={embedSrc}
            title={trailer.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        <p className={`text-caption ${styles.unverifiedNote}`}>
          No independently verified official upload for this footage yet — see the coverage linked below instead of an embed.
        </p>
      )}

      <p className={`text-body ${styles.description}`}>{trailer.description}</p>

      {observations.length > 0 && (
        <section className={styles.section}>
          <h2 className="text-h3">What this footage shows</h2>
          <ul className={styles.observationList}>
            {[...observations]
              .sort((a, b) => EVIDENCE_ORDER.indexOf(a.evidenceLevel) - EVIDENCE_ORDER.indexOf(b.evidenceLevel))
              .map((observation, index) => (
                <li key={index} className={styles.observationItem}>
                  <EvidenceBadge level={observation.evidenceLevel} />
                  <span className="text-caption">{observation.text}</span>
                </li>
              ))}
          </ul>
        </section>
      )}

      {timestamps.length > 0 && (
        <section className={styles.section}>
          <h2 className="text-h3">Timestamps</h2>
          <TrailerTimestamps
            timestamps={timestamps}
            characters={connections?.characters ?? []}
            onSeek={embedUrl ? setSeekSeconds : undefined}
          />
        </section>
      )}

      {confirms.length > 0 && (
        <section className={styles.section}>
          <h2 className="text-h3">What it confirms</h2>
          <ul className={styles.observationList}>
            {confirms.map((observation, index) => (
              <li key={index} className={styles.observationItem}>
                <EvidenceBadge level={observation.evidenceLevel} />
                <span className="text-caption">{observation.text}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {suggests.length > 0 && (
        <section className={styles.section}>
          <h2 className="text-h3">What it suggests</h2>
          <ul className={styles.observationList}>
            {suggests.map((observation, index) => (
              <li key={index} className={styles.observationItem}>
                <EvidenceBadge level={observation.evidenceLevel} />
                <span className="text-caption">{observation.text}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <SourceAttributionView source={trailer.source} publishedAt={trailer.releaseDate} />
      <RelatedContent sections={sections} />
    </Container>
  )
}
