import { useCallback, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Button,
  CardGrid,
  Container,
  RumorStatusBadge,
  SectionHeading,
  StatusBadge,
  Surface,
} from '../../components/common'
import { ContentCard, RelatedContent } from '../../components/content'
import { SEARCH_PATH } from '../../data/navigation'
import { useContentItem } from '../../hooks/useContentItem'
import { useDocumentSeo } from '../../hooks/useDocumentSeo'
import {
  SEARCH_GROUPS,
  cleanQuery,
  getAvailableGroups,
  getConnectedSections,
  getSearchIndex,
  getSuggestions,
  searchIndex,
  type SearchDocument,
} from '../../lib/search'
import styles from './SearchPage.module.css'

const SEARCH_DESCRIPTION =
  'Search Avengers: Doomsday characters, cast, news, trailers, rumors and timeline events in one place.'

/** Result pages are never indexed — only the bare `/search` landing page is. */
const NOINDEX = { index: false, follow: true } as const

const SINGULAR = new Map(SEARCH_GROUPS.map((group) => [group.type, group.singular]))

function listWords(labels: string[]): string {
  const words = labels.map((label) => (label === 'Timeline' ? 'timeline events' : label.toLowerCase()))
  if (words.length <= 1) return words.join('')
  return `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`
}

function searchHref(query: string): string {
  return `${SEARCH_PATH}?${new URLSearchParams({ q: query })}`
}

function ResultCard({ doc, headingLevel }: { doc: SearchDocument; headingLevel: 'h2' | 'h3' }) {
  const eyebrow = [SINGULAR.get(doc.type), doc.subtitle].filter(Boolean).join(' · ')
  // A rumor is graded on its own lifecycle vocabulary, never on `ContentStatus`.
  const badge = doc.rumorStatus ? (
    <RumorStatusBadge status={doc.rumorStatus} />
  ) : doc.type === 'theory' ? (
    <StatusBadge status="theory" />
  ) : undefined

  return (
    <ContentCard
      href={doc.href}
      eyebrow={eyebrow}
      title={doc.title}
      description={doc.description}
      status={doc.status}
      badge={badge}
      meta={doc.meta}
      headingLevel={headingLevel}
    />
  )
}

export function SearchPage() {
  const [params, setParams] = useSearchParams()
  const query = cleanQuery(params.get('q'))

  // The URL is the source of truth; the draft only holds what's typed but
  // not yet submitted, and re-syncs when back/forward changes the URL.
  const [draft, setDraft] = useState(query)
  const [prevQuery, setPrevQuery] = useState(query)
  if (query !== prevQuery) {
    setPrevQuery(query)
    setDraft(query)
  }

  useDocumentSeo({
    title: query ? `Search: ${query}` : 'Search',
    description: SEARCH_DESCRIPTION,
    path: SEARCH_PATH,
    robots: query ? NOINDEX : undefined,
  })

  const { item: index } = useContentItem(getSearchIndex)
  const response = useMemo(() => (index ? searchIndex(index, query) : undefined), [index, query])

  const top = response?.top
  const loadConnected = useCallback(() => (top ? getConnectedSections(top) : Promise.resolve(undefined)), [top])
  const { item: connected } = useContentItem(loadConnected)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = cleanQuery(draft)
    if (next === query) return
    setParams(next ? { q: next } : {})
  }

  const hasQuery = query.length > 0
  const groups = response?.groups ?? []
  const singleGroup = groups.length === 1
  const showConnected = Boolean(top && connected?.some((section) => section.items.length > 0))

  const availableGroups = index ? getAvailableGroups(index) : []
  const suggestions = index ? getSuggestions(index) : []

  return (
    <Container as="main" id="main-content">
      <SectionHeading
        level="h1"
        eyebrow="Search"
        title="Search DOOMSDAY"
        description={
          availableGroups.length > 0
            ? `Find ${listWords(availableGroups.map((group) => group.label))}.`
            : 'Find characters, cast, news, trailers, rumors and timeline events.'
        }
      />

      <form role="search" className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="search-input" className="text-label">
          Search the site
        </label>
        <div className={styles.field}>
          <input
            id="search-input"
            name="q"
            type="search"
            className={styles.input}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="A character, actor, trailer, rumor…"
            maxLength={100}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="search"
            autoFocus={!hasQuery}
          />
          <Button type="submit">Search</Button>
        </div>
      </form>

      {!hasQuery && suggestions.length > 0 && (
        <section className={styles.suggestions} aria-labelledby="search-try">
          <h2 id="search-try" className="text-label">
            Try searching for
          </h2>
          <ul className={styles.chips}>
            {suggestions.map((name) => (
              <li key={name}>
                <Link to={searchHref(name)} className={styles.chip}>
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasQuery && response && (
        <>
          <p role="status" className={`text-caption ${styles.count}`}>
            {response.total === 0
              ? `No results for “${query}”`
              : `${response.total} result${response.total === 1 ? '' : 's'} for “${query}”`}
          </p>

          {response.total === 0 && (
            <Surface level="base" className={styles.empty}>
              <p className="text-label">No results</p>
              <p className="text-h3">Nothing in DOOMSDAY matches “{query}”.</p>
              <p className="text-caption">Try:</p>
              <ul className={styles.tryList}>
                <li>a character name</li>
                <li>an actor</li>
                <li>a trailer</li>
                <li>a rumor</li>
                <li>a news topic</li>
              </ul>
            </Surface>
          )}

          {groups.map((group) => (
            <section key={group.type} className={styles.group} aria-labelledby={`search-group-${group.type}`}>
              <h2
                id={`search-group-${group.type}`}
                className={singleGroup ? 'sr-only' : `text-label ${styles.groupHeading}`}
              >
                {group.label}
                {!singleGroup && <span className={styles.groupCount}> ({group.results.length})</span>}
              </h2>
              <CardGrid>
                {group.results.map((doc) => (
                  <ResultCard key={`${doc.type}-${doc.slug}`} doc={doc} headingLevel={singleGroup ? 'h2' : 'h3'} />
                ))}
              </CardGrid>
            </section>
          ))}

          {showConnected && top && connected && (
            <section className={styles.connected} aria-labelledby="search-connected">
              <h2 id="search-connected" className="text-label">
                Connected to {top.title}
              </h2>
              <RelatedContent sections={connected} />
            </section>
          )}
        </>
      )}
    </Container>
  )
}
