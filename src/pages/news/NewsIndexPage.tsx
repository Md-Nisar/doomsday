import { Container, CardGrid, EmptyState, NewspaperIcon, SectionHeading } from '../../components/common'
import { ContentCard, MediaThumb } from '../../components/content'
import { CATEGORIES } from '../../data/categories'
import { useContentList } from '../../hooks/useContentList'
import { useDocumentSeo } from '../../hooks/useDocumentSeo'
import { getNews } from '../../lib/content'
import { formatContentDate } from '../../utils/date'

export function NewsIndexPage() {
  useDocumentSeo({
    title: CATEGORIES.news.label,
    description: 'Verified Avengers: Doomsday news and official announcements, tracked as they land.',
    path: CATEGORIES.news.path,
  })

  const { items, loading } = useContentList(getNews)

  return (
    <Container as="main" id="main-content">
      <SectionHeading
        level="h1"
        eyebrow="News"
        title="Verified updates"
        description="Official announcements and sourced reporting on Avengers: Doomsday, tracked as they land."
      />
      {!loading && items.length === 0 && (
        <EmptyState
          title="No news tracked yet"
          description="Nothing sourced to publish yet — check back as official news is announced."
        />
      )}
      {items.length > 0 && (
        <CardGrid>
          {items.map((article) => (
            <ContentCard
              key={article.id}
              href={`${CATEGORIES.news.path}/${article.slug}`}
              title={article.title}
              description={article.excerpt}
              status={article.status}
              media={
                <MediaThumb
                  media={article.featuredImage}
                  fallbackIcon={<NewspaperIcon />}
                  fallbackLabel="No article image available"
                />
              }
              meta={formatContentDate(article.publishedAt)}
            />
          ))}
        </CardGrid>
      )}
    </Container>
  )
}
