import { Container, CardGrid, EmptyState, SectionHeading, UserIcon } from '../../components/common'
import { ContentCard, MediaThumb } from '../../components/content'
import { CATEGORIES } from '../../data/categories'
import { useContentItem } from '../../hooks/useContentItem'
import { useContentList } from '../../hooks/useContentList'
import { useDocumentSeo } from '../../hooks/useDocumentSeo'
import { getCharacters } from '../../lib/content'
import { getCharacterContentCounts } from '../../lib/relationships'

export function CharactersIndexPage() {
  useDocumentSeo({
    title: CATEGORIES.characters.label,
    description: 'The Avengers: Doomsday character roster, as officially confirmed material reveals it.',
    path: CATEGORIES.characters.path,
  })

  const { items, loading } = useContentList(getCharacters)
  const { item: counts } = useContentItem(getCharacterContentCounts)

  return (
    <Container as="main" id="main-content">
      <SectionHeading
        level="h1"
        eyebrow="Characters"
        title="The roster"
        description="Profiles only where the identity or appearance is officially established."
      />
      {!loading && items.length === 0 && (
        <EmptyState
          title="No characters confirmed yet"
          description="Nothing officially revealed yet — this fills in as the roster is confirmed."
        />
      )}
      {items.length > 0 && (
        <CardGrid>
          {items.map((character) => {
            const trailerCount = counts?.get(character.slug)?.trailers ?? 0
            return (
              <ContentCard
                key={character.id}
                href={`${CATEGORIES.characters.path}/${character.slug}`}
                eyebrow={character.actor}
                title={character.name}
                description={character.description}
                status={character.status}
                meta={trailerCount > 0 ? `Featured in ${trailerCount} trailer${trailerCount === 1 ? '' : 's'}` : undefined}
                media={
                  <MediaThumb
                    media={character.image}
                    fallbackIcon={<UserIcon />}
                    fallbackLabel={`No character image available yet for ${character.name}`}
                    fallbackName={character.name}
                    aspect="portrait"
                  />
                }
              />
            )
          })}
        </CardGrid>
      )}
    </Container>
  )
}
