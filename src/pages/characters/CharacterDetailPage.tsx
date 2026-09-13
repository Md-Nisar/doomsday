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
import { useContentItem } from '../../hooks/useContentItem'
import { useDocumentSeo } from '../../hooks/useDocumentSeo'
import { getCharacterBySlug } from '../../lib/content'
import { getCharacterConnections } from '../../lib/relationships'
import { buildBreadcrumbJsonLd, buildWebPageJsonLd, getCharacterSeo } from '../../lib/seo'
import { formatContentDate } from '../../utils/date'
import styles from './CharacterDetailPage.module.css'

export function CharacterDetailPage() {
  const { slug = '' } = useParams()
  const loadCharacter = useCallback(() => getCharacterBySlug(slug), [slug])
  const loadConnections = useCallback(() => getCharacterConnections(slug), [slug])
  const { item: character, loading } = useContentItem(loadCharacter)
  const { item: connections } = useContentItem(loadConnections)

  const seo = character ? getCharacterSeo(character) : undefined

  useDocumentSeo(
    seo
      ? { title: seo.title, description: seo.description, path: seo.canonicalPath }
      : {
          title: 'Characters',
          path: `${CATEGORIES.characters.path}/${slug}`,
          robots: { index: false, follow: true },
        },
  )

  if (!loading && !character) {
    return (
      <Container as="main" id="main-content">
        <NotFoundContent title="Character not found" description="This profile doesn't exist, or it moved." />
      </Container>
    )
  }

  if (!character) return null

  const sections: RelatedContentSection[] = [
    {
      heading: 'Portrayed by',
      items: connections?.actor
        ? [{ href: `${CATEGORIES.cast.path}/${connections.actor.slug}`, label: connections.actor.name }]
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
      heading: 'Timeline',
      items: (connections?.timeline ?? []).map((event) => ({
        label: event.title,
        meta: formatContentDate(event.date),
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
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Characters', path: CATEGORIES.characters.path },
          { name: character.name, path: seo!.canonicalPath },
        ])}
      />
      <Breadcrumbs
        items={[
          { label: 'Home', path: '/' },
          { label: 'Characters', path: CATEGORIES.characters.path },
          { label: character.name },
        ]}
      />
      <DetailHeader
        backHref={CATEGORIES.characters.path}
        backLabel="Characters"
        title={character.name}
        status={character.status}
        eyebrow={character.actor}
      />
      <div className={styles.portrait}>
        <MediaThumb
          media={character.image}
          fallbackIcon={<UserIcon />}
          fallbackLabel={`No character image available yet for ${character.name}`}
          fallbackName={character.name}
          aspect="portrait"
        />
      </div>
      <div className={styles.whatWeKnow}>
        <h2 className="text-label">What we know</h2>
        <p className="text-body">{character.description}</p>
      </div>
      <SourceAttributionView source={character.source} />
      <RelatedContent sections={sections} />
    </Container>
  )
}
