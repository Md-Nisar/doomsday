import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RouteFallback } from './components/common'
import { Layout } from './components/layout'
import { CATEGORIES } from './data/categories'
import { Home } from './pages/Home'

/**
 * Route paths are read from `CATEGORIES` (src/data/categories.ts) rather
 * than retyped here, so the URL structure has exactly one source of truth.
 *
 * `Home` and `Layout` load eagerly — every visitor needs them immediately.
 * Every other route is a separate lazy chunk: the countdown homepage never
 * pays for News/Trailers/Cast/Characters/Theories/Rumors/Timeline/NotFound
 * JavaScript it doesn't use. Chunking is at the route level (one page =
 * one chunk), not per-component, matching the brief's "don't over-split" guidance.
 */
const NewsIndexPage = lazy(() => import('./pages/news/NewsIndexPage').then((m) => ({ default: m.NewsIndexPage })))
const NewsDetailPage = lazy(() => import('./pages/news/NewsDetailPage').then((m) => ({ default: m.NewsDetailPage })))

const TrailersIndexPage = lazy(() =>
  import('./pages/trailers/TrailersIndexPage').then((m) => ({ default: m.TrailersIndexPage })),
)
const TrailerDetailPage = lazy(() =>
  import('./pages/trailers/TrailerDetailPage').then((m) => ({ default: m.TrailerDetailPage })),
)

const CastIndexPage = lazy(() => import('./pages/cast/CastIndexPage').then((m) => ({ default: m.CastIndexPage })))
const CastDetailPage = lazy(() => import('./pages/cast/CastDetailPage').then((m) => ({ default: m.CastDetailPage })))

const CharactersIndexPage = lazy(() =>
  import('./pages/characters/CharactersIndexPage').then((m) => ({ default: m.CharactersIndexPage })),
)
const CharacterDetailPage = lazy(() =>
  import('./pages/characters/CharacterDetailPage').then((m) => ({ default: m.CharacterDetailPage })),
)

const TheoriesIndexPage = lazy(() =>
  import('./pages/theories/TheoriesIndexPage').then((m) => ({ default: m.TheoriesIndexPage })),
)
const TheoryDetailPage = lazy(() =>
  import('./pages/theories/TheoryDetailPage').then((m) => ({ default: m.TheoryDetailPage })),
)

const RumorsIndexPage = lazy(() =>
  import('./pages/rumors/RumorsIndexPage').then((m) => ({ default: m.RumorsIndexPage })),
)
const RumorDetailPage = lazy(() =>
  import('./pages/rumors/RumorDetailPage').then((m) => ({ default: m.RumorDetailPage })),
)

const TimelinePage = lazy(() => import('./pages/timeline/TimelinePage').then((m) => ({ default: m.TimelinePage })))

const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          <Route
            path={CATEGORIES.news.path}
            element={
              <Suspense fallback={<RouteFallback />}>
                <NewsIndexPage />
              </Suspense>
            }
          />
          <Route
            path={`${CATEGORIES.news.path}/:slug`}
            element={
              <Suspense fallback={<RouteFallback />}>
                <NewsDetailPage />
              </Suspense>
            }
          />

          <Route
            path={CATEGORIES.trailers.path}
            element={
              <Suspense fallback={<RouteFallback />}>
                <TrailersIndexPage />
              </Suspense>
            }
          />
          <Route
            path={`${CATEGORIES.trailers.path}/:slug`}
            element={
              <Suspense fallback={<RouteFallback />}>
                <TrailerDetailPage />
              </Suspense>
            }
          />

          <Route
            path={CATEGORIES.cast.path}
            element={
              <Suspense fallback={<RouteFallback />}>
                <CastIndexPage />
              </Suspense>
            }
          />
          <Route
            path={`${CATEGORIES.cast.path}/:slug`}
            element={
              <Suspense fallback={<RouteFallback />}>
                <CastDetailPage />
              </Suspense>
            }
          />

          <Route
            path={CATEGORIES.characters.path}
            element={
              <Suspense fallback={<RouteFallback />}>
                <CharactersIndexPage />
              </Suspense>
            }
          />
          <Route
            path={`${CATEGORIES.characters.path}/:slug`}
            element={
              <Suspense fallback={<RouteFallback />}>
                <CharacterDetailPage />
              </Suspense>
            }
          />

          <Route
            path={CATEGORIES.theories.path}
            element={
              <Suspense fallback={<RouteFallback />}>
                <TheoriesIndexPage />
              </Suspense>
            }
          />
          <Route
            path={`${CATEGORIES.theories.path}/:slug`}
            element={
              <Suspense fallback={<RouteFallback />}>
                <TheoryDetailPage />
              </Suspense>
            }
          />

          <Route
            path={CATEGORIES.rumors.path}
            element={
              <Suspense fallback={<RouteFallback />}>
                <RumorsIndexPage />
              </Suspense>
            }
          />
          <Route
            path={`${CATEGORIES.rumors.path}/:slug`}
            element={
              <Suspense fallback={<RouteFallback />}>
                <RumorDetailPage />
              </Suspense>
            }
          />

          <Route
            path={CATEGORIES.timeline.path}
            element={
              <Suspense fallback={<RouteFallback />}>
                <TimelinePage />
              </Suspense>
            }
          />

          <Route
            path="*"
            element={
              <Suspense fallback={<RouteFallback />}>
                <NotFound />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
