import { Container, CardGrid, EmptyState, SectionHeading } from '../../components/common'
import { ContentCard } from '../../components/content'
import { CATEGORIES } from '../../data/categories'
import { useContentList } from '../../hooks/useContentList'
import { useDocumentSeo } from '../../hooks/useDocumentSeo'
import { getTheories } from '../../lib/content'

export function TheoriesIndexPage() {
  useDocumentSeo({
    title: CATEGORIES.theories.label,
    description: 'Fan theories about Avengers: Doomsday — clearly labeled as theory, never as fact.',
    path: CATEGORIES.theories.path,
  })

  const { items, loading } = useContentList(getTheories)

  return (
    <Container as="main" id="main-content">
      <SectionHeading
        level="h1"
        eyebrow="Theories"
        title="Theories"
        description="Speculation, always labeled as such — published only when there's something genuinely worth reading."
      />
      {!loading && items.length === 0 && (
        <EmptyState
          title="No theories published yet"
          description="Quality over quantity — nothing meets the bar yet."
        />
      )}
      {items.length > 0 && (
        <CardGrid>
          {items.map((theory) => (
            <ContentCard
              key={theory.id}
              href={`${CATEGORIES.theories.path}/${theory.slug}`}
              title={theory.title}
              description={theory.excerpt}
              status="theory"
              meta={`Confidence: ${theory.confidence}`}
            />
          ))}
        </CardGrid>
      )}
    </Container>
  )
}
