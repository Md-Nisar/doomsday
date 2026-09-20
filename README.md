# Avengers: Doomsday

**Brand:** Avengers: Doomsday
**Primary domain (canonical):** [avengers-doomsday.in](https://avengers-doomsday.in)
**Secondary domain (owned, not live):** doomsdays.in

## Overview

This is an unofficial fan/content site. It launches with a live countdown
to *Avengers: Doomsday* and now hosts a real, routed content platform on top
of it: news, trailers, cast, character profiles, theories, rumors, and a
timeline — each item traceable to a source and labeled **confirmed**,
**rumor**, or **theory**. See "Content provenance policy" below for the
rules every content item follows.

This is an unofficial fan project. It is not affiliated with, endorsed by, or
sponsored by Marvel Studios, Marvel, or Disney.

> Note on naming: the visible brand is **Avengers: Doomsday** (matching the
> film title), at the user's explicit request — this replaces an earlier,
> deliberately film-agnostic **Doomsday** brand that was kept distinct from
> the film/domain specifically so the shell could host unrelated future
> content without a rename (see "Initial purpose vs. long-term purpose"
> below; that structural intent still holds, only the brand text changed).
> The project still serves from **avengers-doomsday.in** (the chosen
> primary/canonical domain); **doomsdays.in** is a second domain the project
> owns but does not currently serve from. This is a reversible
> technical/branding decision, not a legal conclusion about either name — see
> "Deployment → Domain architecture" below for the single place this is
> configured and what switching back would involve.

## Initial purpose vs. long-term purpose

The initial product is a countdown site for one film. The codebase is not
coupled to that film, however: Marvel/Avengers content lives in `src/data/`
as plain data, not baked into components or routing. The intent is for this
site to be able to host future, unrelated content or projects under the same
shell without an architectural rewrite — the brand text above being the film
title doesn't change that; it can be renamed again independently of the code
structure.

```
Avengers: Doomsday
├── Initial project: Avengers: Doomsday countdown
├── Future content/projects
└── Future independent projects
```

## Architecture

Stack: **Vite + React + TypeScript + react-router-dom**, chosen for a
static build output that deploys cleanly to GitHub Pages and needs no
backend for the countdown or the content platform.

```
src/
├── assets/          # images, icons, fonts
├── components/
│   ├── common/      # reusable UI primitives (Button, Card, Badge, ...)
│   ├── content/     # content-page building blocks (ContentCard, DetailHeader, ...)
│   ├── layout/      # site-wide chrome (Header, Layout, Footer)
│   └── sections/    # reusable page sections (Hero, Countdown, Explore, ...)
├── pages/           # route-level components, one subfolder per category
├── data/            # structured content, decoupled from presentation
├── hooks/           # reusable client-side logic (countdown timer, content loading)
├── lib/             # shared libraries / integration helpers
├── utils/           # small pure utility functions
├── types/           # shared TypeScript types
├── config/          # central site configuration
├── styles/          # global styles
├── App.tsx          # route table
└── main.tsx

public/
├── favicon/
├── images/
└── robots.txt

scripts/
└── generate-sitemap.ts   # writes public/sitemap.xml from real content, run during `npm run build`
```

Empty directories are kept with a `.gitkeep` file to preserve the intended
structure before content exists — this is a foundation being laid out ahead
of feature work, not a request to add filler content.

### Directory responsibilities

- **`components/common/`** — reusable, presentation-only UI primitives.
  Nothing is added here speculatively; components appear when a real reuse
  need exists.
- **`components/layout/`** — site-wide structural components (header, nav,
  footer).
- **`components/sections/`** — composed page sections (hero, countdown, the
  homepage's data-driven content preview).
- **`components/content/`** — the shared building blocks every content page
  is built from: `ContentCard` (index-page cards), `DetailHeader` and
  `SourceAttributionView` (detail pages), `NotFoundContent` (missing routes
  and missing slugs), `RelatedContent` (the "known connections" panel — see
  "Knowledge graph" below), `Breadcrumbs` (visible nav trail on detail
  pages), `TrailerTimestamps` (see "Trailer Intelligence" below),
  `RumorSourceList` (see "Rumor Intelligence" below), and `MediaThumb` (the
  shared image-or-fallback box — see "Media provenance" below). One shape
  reused across all seven categories, not a bespoke component per category.
  `EvidenceBadge`, `RumorStatusBadge` (evidence-level and rumor-lifecycle
  pills, alongside `StatusBadge`) live in `components/common/` instead, for
  the same reason `StatusBadge` does. `ContentCard` and `DetailHeader` both
  accept an optional `badge` override so an entity graded on its own
  vocabulary (`Trailer`'s eyebrow, `Rumor`'s `RumorStatusBadge`) doesn't
  have to force itself through the `ContentStatus`-shaped `status` prop;
  `ContentCard` also accepts an optional `media` slot on the same pattern.
- **`pages/`** — route-level views, one subfolder per category
  (`pages/news/`, `pages/trailers/`, `pages/cast/`, `pages/characters/`,
  `pages/theories/`, `pages/rumors/`, `pages/timeline/`) plus `Home.tsx` and
  `NotFound.tsx`.
- **`data/`** — structured content kept separate from UI, so a future
  API/CMS/database can replace local data files without a UI rewrite.
- **`hooks/`** — reusable logic, e.g. the future countdown timer will live
  here as a hook rather than embedded in a component.
- **`lib/`** — shared integration helpers: `content.ts` (the content access
  layer) and `relationships.ts` (the knowledge-graph layer built on top of
  it — see "Knowledge graph" below), plus `seo.ts`. Kept intentionally thin.
- **`utils/`** — small, pure helper functions (date/time formatting, URL
  helpers, etc.).
- **`types/`** — shared TypeScript interfaces/types, centralized rather than
  duplicated per-feature.
- **`config/`** — `site.ts` holds the single source of truth for site-wide
  values (see below); `countdownTheme.ts` holds the countdown's swappable
  color palettes (see "Countdown theme"). Nothing else should hard-code
  these values.
- **`styles/`** — global stylesheet and future design-system foundations. No
  design system yet — just a minimal reset.

### Central site configuration

`src/config/site.ts` exports a single `siteConfig` object (typed by
`src/types/site.ts`) holding `siteName`, `domain`, `description`,
`releaseDate`, `disclaimer`, and social metadata placeholders. Any future UI
(countdown, meta tags, footer disclaimer, etc.) should read from this file
rather than hard-coding these values.

### Content architecture

News, trailers, cast, characters, theories, rumors, and a timeline are all
real, routed features today, each reading through one access layer
(`src/lib/content.ts`) so the data source behind them can still move from
local files to a REST API, CMS, database, or serverless functions without a
frontend rewrite. A second layer, `src/lib/relationships.ts`, resolves how
those entities connect to each other (the "knowledge graph" foundation) —
see "Content architecture" and "Knowledge graph" further down for the full
model, routing, sourcing, and relationship rules.

## Local development

```bash
npm install
npm run dev
```

## Build commands

```bash
npm run build             # tsc -b, validate content, regenerate public/sitemap.xml, then build dist/
npm run preview           # serve the production build locally
npm run typecheck         # tsc -b on its own
npm run lint              # run oxlint
npm run validate:content  # run the content-graph validation script on its own
npm run generate:sitemap  # regenerate public/sitemap.xml on its own
```

## Deployment

The app builds to a static `dist/` bundle with no server-side requirements —
the countdown runs entirely in the browser. Deployment target: **GitHub
Pages**, served at the custom domain **`https://avengers-doomsday.in/`**.

### Domain architecture (primary/secondary, reversibility)

The project owns two domains:

- **`avengers-doomsday.in`** — current primary/canonical domain. Every
  production URL (canonical link, `og:url`, sitemap, robots.txt, JSON-LD
  `url` fields, `public/CNAME`) resolves to this domain today.
- **`doomsdays.in`** — a secondary domain the project also owns, retained
  for possible future use. It is **not** wired into `CNAME`, SEO metadata,
  the sitemap, robots.txt, or DNS. It is not a live redirect target; it is
  simply reserved.

This choice is deliberately reversible. **`src/config/site.ts`'s
`siteConfig.domain`** is the single source of truth every other production
URL derives from (`src/config/seo.ts` → `seoConfig.domain`, then
`getSiteUrl()`/`getCanonicalUrl()` in `src/lib/seo.ts`, which every
canonical link, `og:url`, and JSON-LD builder calls). Switching the primary
domain back to `doomsdays.in` later means changing exactly:

1. `src/config/site.ts` — `domain: 'avengers-doomsday.in'` → `'doomsdays.in'`.
2. `index.html` — its hand-kept static `canonical`/`og:url` tags (the one
   place a value is duplicated outside the config, since a static file
   can't call `getCanonicalUrl()`).
3. `public/CNAME` — back to `doomsdays.in`.
4. `public/sitemap.xml` and `public/robots.txt` — back to `doomsdays.in`.
5. The DNS records and GitHub Pages custom-domain setting (manual, outside
   this repository — see below).

Nothing else in the codebase references a domain directly — no component,
hook, or data file hardcodes `avengers-doomsday.in` or `doomsdays.in`.

### Architecture

`.github/workflows/deploy.yml` builds and deploys on every push to `main`
(and can be run manually via `workflow_dispatch`):

```
push to main
 → checkout
 → setup Node 24 (npm cache)
 → npm ci
 → npm run build        # tsc -b && vite build — fails the job on any error
 → upload dist/ as a Pages artifact
 → deploy to the github-pages environment
```

It uses GitHub's own `actions/upload-pages-artifact` +
`actions/deploy-pages`, not a third-party deployment action, and requests
only the permissions it needs (`contents: read`, `pages: write`,
`id-token: write`). A failed build never deploys — the `deploy` job depends
on `build` succeeding first. `dist/` is never committed to the repository
(it's already `.gitignore`d); the workflow is the only thing that produces
and publishes it.

If the repository's default branch is not `main`, update the `branches:`
trigger in the workflow to match before relying on it.

### Base path

`vite.config.ts` sets `base: './'` (relative), not the Vite default of `/`.

**Phase 13 launch-readiness fix.** The previous configuration (no `base`,
defaulting to `/`) emitted root-absolute asset paths (`/assets/...`,
`/favicon/...`). Those are exactly correct once `avengers-doomsday.in/` (an
apex custom domain) is actually live and DNS-configured — but GitHub Pages
*always* also serves a project repo's build at its own
`https://<user>.github.io/<repo>/` subpath, custom domain or not. Root-
absolute paths there ask the browser for assets at the *github.io domain
root*, not the `/repo/` subpath — a 404 on every JS/CSS file, rendering a
completely blank page. This was caught during Phase 13 by deploying and
checking the raw `github.io/doomsday/` URL, which is the only way to
verify a Pages deployment before DNS for the custom domain is actually
pointed at it.

`base: './'` fixes this without hardcoding `/doomsday/` anywhere (which
would in turn break the apex custom domain once DNS is live, and would
need updating if the repo is ever renamed): every asset URL becomes
relative to wherever `index.html` itself was actually served from, so it
resolves correctly whether that's a domain root or a `/repo-name/` subpath.

**A second, non-obvious bug this surfaced**: the GitHub Pages deep-link
redirect script (see "GitHub Pages deep-link resolution" below) used to sit
first in `<head>`, before any other tag. With relative asset paths, that
broke deep links specifically: the script's own `history.replaceState`
call rewrites `location.href` *before* the parser reaches
`<script type="module" src="./assets/...">` a few lines later — and a
relative `src` is resolved against whatever URL is current *at the moment
the parser reaches that tag*, not the URL the document was originally
fetched from. So the module script's relative path silently resolved
against the just-restored deep-link path instead of the real page root,
404ing on every deep link (never on a plain `/` load, since nothing needs
restoring there — this is why it wasn't caught until deep links were
specifically re-tested against a true GitHub-Pages-shaped 404 emulation,
not `vite preview`, which has its own SPA fallback that masks this entirely).
The fix was to move that inline script to the end of `<body>`, after the
module script tag: a classic inline script always executes at parse time
regardless of position, and a `type="module"` script is always deferred
until after the document finishes parsing regardless of position either —
so placing the redirect script after the module tag still guarantees it
runs before `main.tsx`'s code does, while now leaving the module tag's own
`src` to resolve while the URL is still untouched.

Only reachable by testing the *actual* GitHub Pages 404-then-redirect
behavior end-to-end (a small throwaway Node static file server that serves
the literal file or `404.html` with a real `404` status, mirroring GitHub
Pages exactly) — `vite preview` and generic static-file servers
(`serve`/`http-server` defaults) both silently fall back to `index.html`
for any unmatched path, which never exercises this code path at all.

### Custom domain (`CNAME`)

`public/CNAME` contains exactly:

```
avengers-doomsday.in
```

Vite copies everything in `public/` verbatim into `dist/`, so this file
lands at the root of every deployment automatically. It contains only the
bare domain — no `https://`, no path, no `www`.

### DNS records — USER MUST CONFIGURE AT THE DNS PROVIDER

These are **not** set by this repository; they must be created wherever
`avengers-doomsday.in` is registered/managed. Use GitHub's currently
published values (Pages → Settings → your custom domain will show/validate
these):

| Host | Type | Points to |
| --- | --- | --- |
| `@` (apex) | `A` | GitHub Pages' current apex IP addresses (see GitHub's [Pages custom domain docs](https://docs.github.com/pages) for the current list) |
| `www` | `CNAME` | `<github-username>.github.io` |

`avengers-doomsday.in` (the apex) is this project's current canonical
domain (matches `src/config/site.ts` and `src/config/seo.ts`); if
`www.avengers-doomsday.in` is also pointed at Pages, configure it as a
redirect to the apex in the GitHub Pages custom-domain setting so there is
only one canonical URL, consistent with the existing SEO/canonical-URL
architecture. `doomsdays.in` is not part of this DNS configuration — it is
an owned but currently-unconfigured secondary domain (see "Domain
architecture" above). DNS propagation can take anywhere from minutes to
~48 hours.

### Domain verification — USER MUST DO ON GITHUB

Before (or alongside) adding the custom domain, verify ownership of
`avengers-doomsday.in` under the GitHub account/organization's **Settings →
Pages → Custom domains** (or **Settings → Code security → Domain
verification**, depending on account type). GitHub will generate a TXT
record specific to that account — add exactly the value GitHub shows; one
was not invented here. This step reduces the risk of a future domain
takeover and should be done before the domain is heavily relied upon.

### GitHub repository settings — USER MUST DO ON GITHUB

1. **Settings → Pages → Build and deployment → Source**: set to
   **GitHub Actions** (not "Deploy from a branch").
2. **Settings → Pages → Custom domain**: enter `avengers-doomsday.in`, save,
   and wait for DNS validation to succeed.
3. Once validated, enable **Enforce HTTPS**. GitHub provisions the
   certificate automatically after DNS is correctly pointed — this
   repository cannot activate or verify HTTPS itself, and HTTPS should not
   be assumed active until confirmed in that settings page.

### Local development / production preview

```bash
npm install
npm run dev       # local dev server
npm run build     # production build to dist/
npm run preview   # serve the production build locally, for a final check
```

### What this repository does vs. what requires manual action

**Done in code:** the Actions workflow, the `CNAME` file (`avengers-doomsday.in`),
the root-relative build (no base-path change needed), a static `404.html`,
and SEO metadata (canonical, `og:url`, sitemap, robots.txt, JSON-LD) that
now consistently points at `https://avengers-doomsday.in/` with no
remaining production reference to `doomsdays.in`.

**Must be done manually, outside this repository:** creating/pushing the
repository to GitHub if it isn't already, the DNS records above, GitHub
domain verification, the Pages source/custom-domain/HTTPS settings above.
None of this can be done from this environment — it has no authenticated
GitHub access and does not control DNS. DNS was not modified as part of
this change, and no domain has been verified or confirmed to have HTTPS
active.

## Content architecture

The content platform (news, trailers, cast, characters, theories, rumors,
timeline) is real and routed. Every page reads through one access layer, so
the data source behind it can move from local files to an API/CMS/database
later without touching a single page or component.

```
Routing              react-router-dom (src/App.tsx, src/components/layout/Layout.tsx)
 ↓
UI (pages / sections / components/content)
 ↓                              ↓
Content access layer      Relationship (graph) layer
src/lib/content.ts         src/lib/relationships.ts
 ↓                              ↓
Data source            src/data/*  (local today → API/CMS/database later)
```

### Entity models — `src/types/content.ts`

Every content entity is a plain TypeScript interface: `NewsArticle`,
`Trailer`, `Person` (cast), `Character`, `Theory`, `Rumor`, and
`TimelineEvent`. Shared shapes (`MediaAsset`, `SourceAttribution`, `Author`)
are factored out so images, source links, and author bylines are typed
consistently everywhere they appear rather than redeclared per entity.
`MediaAsset` requires `alt` and carries optional `source` /
`attributionUrl` / `usageBasis` / `type` fields recording *why* an image is
safe to show — see "Media provenance" under Performance for the full
policy this enforces.
Fields like `title`, `slug`, `excerpt`/`description`, `publishedAt`,
`updatedAt`, and `featuredImage`/`image` already carry what the SEO layer
needs, so no separate SEO-only type was added. `Trailer`, `Person`,
`Character`, and `Theory` each carry an optional `source?: SourceAttribution`
so every factual entity can name where it came from; `Rumor` instead carries
a `sources: RumorSource[]` array — see "Rumor Intelligence" below for why a
claim needs more than one source. The relationship fields —
`NewsArticle.relatedCharacterSlugs?`, `Trailer.relatedCharacterSlugs?`,
`Trailer.relatedNewsSlug?`, `Character.actorSlug?`,
`TimelineEvent.relatedNewsSlug?`, and `Rumor.relatedCharacterSlugs? /
relatedTrailerSlugs? / relatedNewsSlugs?` — are the graph's only stored
edges; see "Knowledge graph" below for how they're resolved. `EntityType`
and `EntityReference` (`{ type, slug }`) are also defined here — a
type-agnostic pointer any entity can be reduced to, kept ready for a future
cross-category search feature (see "Search readiness" below).

### Content status system

`ContentStatus` (`'confirmed' | 'rumor' | 'theory'`) lives in
`src/types/content.ts` — the single definition shared by the content models
and the `StatusBadge` component (`src/components/common/StatusBadge.tsx`,
which re-exports it for existing imports). `StatusBadge` pairs each status
with both a label and a distinct icon shape, never color alone, so the
distinction still reads for colorblind users and in text-only contexts.
`Theory` additionally carries a `ConfidenceLevel` (`'low' | 'medium' | 'high'`)
— how strongly a piece of speculation is believed. `Theory` has no `status`
field of its own (every theory is, definitionally, a theory — pages pass
`status="theory"` directly to `StatusBadge`); `TimelineEvent` stores `status`
explicitly since a timeline entry's confirmation state isn't implied by its
type. `Rumor` carries **no `ContentStatus`** at all — like `Trailer`, it's
graded on its own dedicated vocabulary instead (`RumorStatus`, rendered via
`RumorStatusBadge`) because "is this a rumor" is true of every entry in the
collection by definition; what actually varies, and needs grading, is the
claim's evidence lifecycle. See "Rumor Intelligence" below.

### Categories — `src/data/categories.ts`

`CATEGORIES` maps each `ContentCategory` to its display label and route
(`{ slug, label, path }`) — the single source every route path is read
from, in `src/App.tsx` (route definitions), `src/data/navigation.ts` (nav
hrefs), every page's own links, and `scripts/generate-sitemap.ts`.

### Local data — `src/data/`

```
src/data/
├── categories.ts     # category → label/path map
├── navigation.ts      # primary nav items (consumed by Header)
├── news/
├── trailers/
├── cast/
├── characters/
├── theories/
├── rumors/
└── timeline/
```

Each content folder exports one typed array. `news/`, `trailers/`, `cast/`,
`characters/`, `rumors/`, and `timeline/` now hold a small, high-confidence
set of officially reported (or, for rumors, responsibly *tracked*) content
(see "Content provenance policy" and "Rumor Intelligence" below for how each
item was verified). `theories/` is still deliberately empty — no fan theory
was judged well-sourced enough to publish yet, and an under-filled category
is preferable to a fabricated one. The homepage preview and every index page
render an explicit empty state (`src/components/common/EmptyState.tsx`) when
a collection has nothing in it, rather than fabricating entries to fill the
layout.

### Content access layer — `src/lib/content.ts`

The UI never imports `src/data/*` directly. It calls one of `getNews()`,
`getTrailers()`, `getCast()`, `getCharacters()`, `getTheories()`,
`getRumors()`, or `getTimeline()` for a full collection, or `getNewsBySlug()`,
`getTrailerBySlug()`, `getCastBySlug()`, `getCharacterBySlug()`,
`getTheoryBySlug()`, or `getRumorBySlug()` for one entity by slug — every
detail page resolves its content this way rather than filtering a full
collection itself. Every function is `async` even though local data
resolves synchronously — so that migrating a function's body to a
`fetch()` call or a CMS SDK later changes nothing at any call site.
`src/hooks/useContentList.ts` and `src/hooks/useContentItem.ts` are the two
small hooks every page uses to call these functions and track
loading/result state, so that loading logic isn't reimplemented per page.

### Knowledge graph

The goal is interconnection, not a visualization — this is a data
relationship foundation, deliberately not a node-diagram UI. No graph
library (D3, Cytoscape, React Flow, etc.) is installed; every "connection"
on a page is a plain, server-rendered list of real `<Link>`s built from
`src/lib/relationships.ts`, which sits alongside `content.ts`:

```
UI (pages / components/content)
 ↓                        ↓
content.ts            relationships.ts   ("what is X connected to?")
 ↓                        ↓
src/data/*  (relationships.ts calls content.ts's get*() — never src/data/* directly)
```

**Relationship vocabulary.** A small, deliberate set — only what current
content actually needs (`RelationshipType` in `relationships.ts`):

| Type | Meaning | Stored on |
| --- | --- | --- |
| `CASTS_AS` | actor confirmed to play this character | `Character.actorSlug` |
| `APPEARS_IN` | character confirmed to feature in this trailer | `Trailer.relatedCharacterSlugs` |
| `MENTIONED_IN` | character is substantively discussed in this news | `NewsArticle.relatedCharacterSlugs` |
| `REFERENCES` | timeline event / trailer drawn from this news | `TimelineEvent.relatedNewsSlug`, `Trailer.relatedNewsSlug` |
| `REPORTED_BY` | any entity's source; also, news covering a rumor | `*.source`, `Rumor.relatedNewsSlugs` |
| `RUMORED_ABOUT` | a rumor's claim concerns this character | `Rumor.relatedCharacterSlugs` |
| `SUPPORTED_BY` | released trailer footage bears on this rumor's claim | `Rumor.relatedTrailerSlugs` |

`EvidenceLevel` (`VISIBLE` / `CONFIRMED` / `INFERRED` / `THEORY`, in
`src/types/content.ts`) is a **separate, smaller vocabulary** added in the
Trailer Intelligence phase — see "Trailer Intelligence" below for why it
isn't folded into `RelationshipType` or `ContentStatus`. It's reused inside
a `Rumor`'s own `observations` (see "Rumor Intelligence" below) rather than
duplicated with a rumor-specific evidence scale.

`RELATIONSHIP_LABELS` maps each type to the heading shown in the UI
("Portrayed by", "Featured in", "Related news", "Timeline", "Source",
"Related rumors", "Related trailer evidence") — the graph's vocabulary and
the UI copy are one definition, not two kept in sync by hand. `RELATED_TO`
and `INSPIRES` remain intentionally unimplemented — reserved for a future
Theory↔Rumor edge with no real data to attach it to yet; adding them now
would be exactly the decorative-graph-for-its-own-sake this project
avoids.

**Reverse lookups are computed, not stored.** Every relationship is stored
on exactly one side (e.g. a news article names its related characters; a
character never separately lists its related news). `relationships.ts`
builds a small set of `Map`s once per process (`buildIndexes()`, memoized —
static content has nothing to invalidate) and derives every reverse
direction and transitive hop from them:

- `getCharacterConnections(slug)` → actor (via `actorSlug`), related news,
  featuring trailers, timeline events (transitively, via that news), and
  rumors whose claim concerns this character
- `getPersonConnections(slug)` → the character this actor plays, and that
  character's news/trailers
- `getNewsConnections(slug)` → related characters, timeline events drawn
  from this article, trailers this article reported the release of, and
  rumors this article directly covers
- `getTrailerConnections(slug)` → featured characters, the news article
  reporting its release, and rumors this footage bears on
- `getTimelineEventConnections(id)` → the source news article, and
  (transitively) the characters that article is about
- `getRumorConnections(slug)` → the characters, trailers, and news articles
  a rumor names — added for Rumor Intelligence, resolved the same way as
  every other connection function (see "Rumor Intelligence" below)

This means, concretely: **Doctor Doom** → actor Robert Downey Jr. → related
news (D23 special look) → timeline (D23 event) — and the same graph walked
in reverse from the D23 timeline entry surfaces Doctor Doom, all from three
stored fields (`actorSlug`, `relatedCharacterSlugs`, `relatedNewsSlug`), not
six.

**`RelatedContent`** (`src/components/content/`) is the one reusable "known
connections" panel every detail page renders — it takes typed sections
(`{ heading, items: [{ href?, label, meta? }] }`), drops any section with no
items, and renders nothing at all if every section is empty. An item
without an `href` (a timeline event, since there's no timeline detail page
yet) renders as plain text rather than a fake or dead link.
**`Breadcrumbs`** (same folder) is a small, separate visible nav trail
(Home → Category → Item) paired with `buildBreadcrumbJsonLd`, added to
every detail page this phase.

**Search readiness.** `getCharacterEntityReferences(slug)` flattens a
character's connections into `EntityReference[]` — the type-agnostic shape
a future "show everything connected to X" search feature needs. It isn't
called from any UI yet; it exists because the data to answer that question
was already one function call away once `getCharacterConnections` existed.

**Theory readiness.** `theories/` stays empty (see "Content provenance
policy" below) and `Theory` carries no relationship fields yet — adding
`relatedCharacterSlugs`-style fields with nothing real to populate them
would be speculative. `Rumor` went through exactly this step this phase:
when a genuinely sourced rumor needed to link to a character/trailer/news
article, it got the same kind of optional slug field used elsewhere
(`relatedCharacterSlugs?`, `relatedTrailerSlugs?`, `relatedNewsSlugs?`) plus
a matching `relationships.ts` function (`getRumorConnections`) and reverse
indexes — no new relationship mechanism, just the established pattern
applied to a fourth entity. The same recipe carries over directly to
`Theory` whenever a real sourced connection exists to attach it to.

**Validation.** `scripts/validate-content.ts` (run via `tsx` as part of
`npm run build`, before the sitemap generator) checks every stored
relationship field resolves to a real slug in its target collection, and
that no collection has a duplicate `id` or `slug`. Any failure exits
non-zero and fails the build with a listed reason — a broken relationship
can't silently ship as a dead link.

### Content provenance policy

This is the product's core discipline, not an afterthought:

1. **Every factual item has a source.** `SourceAttribution` (`{ name, url }`)
   is attached to every populated news article, trailer, cast member,
   character, and timeline event, rendered via
   `src/components/content/SourceAttributionView.tsx` — never buried in
   body text, never omitted.
2. **Status is never implied — it's labeled.** `confirmed` / `rumor` /
   `theory` is shown via `StatusBadge`'s label + icon (never color alone) on
   every card and every detail page.
3. **Reporting is not fact, and a trailer is not a plot summary.**
   Populated content in this phase summarizes only what a cited source
   explicitly states (a release date, a casting confirmation, a trailer's
   existence and premiere date) — it does not restate trailer-analysis
   speculation about plot or character actions as if it were confirmed.
4. **Quality over quantity.** `theories/` is empty rather than populated
   with something merely because the category exists — see "Local data"
   above. `rumors/` is populated, but only with claims that could be traced
   to an identifiable, dated source; see "Rumor Intelligence" below for the
   research discipline behind each entry.
5. **Original wording, no reproduced articles.** Every excerpt/description
   is written for this site, summarizing what a source reports; no article
   text is copied from the outlets it cites.
6. **No copyrighted promotional artwork.** No Marvel/Disney poster, still,
   or promotional image has been added anywhere — `MediaAsset`/`image`/
   `thumbnail`/`featuredImage` fields exist on the content models but are
   left unset. See "Trailer Intelligence" below for the policy on which
   trailer entries embed real footage vs. link out to reporting instead.

### Trailer Intelligence

Added this phase. `/trailers` and each trailer detail page evolved from a
single embedded video into a structured, source-aware record of what each
piece of official footage actually establishes — still built entirely on
the existing content/relationship layers (`src/lib/content.ts`,
`src/lib/relationships.ts`), with no parallel data system.

**Official footage dataset.** Seven entries in `src/data/trailers/index.ts`,
chronological: four character teasers (Steve Rogers, Thor, X-Men,
Wakanda/Fantastic Four — Dec 2025–Jan 2026), the AVENGERS: DOOMSDAY CLOCK
(Jan 2026 — see below), the July 2026 Official Trailer, and the August
2026 D23 Special Look. Each carries a `type` (`teaser` / `trailer` /
`special_look` / `tv_spot` / `clip` / `clock` / `other` — `TrailerType` in
`src/types/content.ts`), release date, and a `SourceAttribution`.

**Verification status — re-audited each hardening pass.** `Trailer.videoUrl`
is optional, gated by `verificationStatus: 'verified' | 'unverified'`:
`'verified'` embeds `videoUrl` in an `<iframe>`; `'unverified'` shows a short
note ("No independently verified official upload yet…") and links to
reporting via `SourceAttributionView` instead — never an embed.
`validate-content.ts` enforces the two never disagree.

Verification itself is re-checked, not assumed to still hold from a
previous pass: this phase (BUG-001 hardening) re-audited all six original
entries via YouTube's public oEmbed endpoint
(`youtube.com/oembed?url=…&format=json`), which only resolves for a public,
embeddable video and returns that video's real `author_name` — a
independent, mechanical confirmation of the uploading channel, not a guess
from a search-result title. Result: the Steve Rogers, Thor, and X-Men
teasers now have a Marvel Entertainment upload (they didn't during the
original Trailer Intelligence pass) and moved to `'verified'` with an
embed; the Official Trailer re-confirmed `'verified'`; the Wakanda/Fantastic
Four teaser and the D23 Special Look still have no confirmed Marvel
Entertainment upload — every candidate found for them via search belongs to
a fan, reaction, or aggregator channel (checked the same way) — so they stay
`'unverified'`. Two of six releases having no safe embed is the intended,
honest outcome of this policy, not a gap to "fix" by relaxing it.

**Evidence model — `EvidenceLevel`, not `ContentStatus`.**
`ContentStatus` (`confirmed`/`rumor`/`theory`) grades a whole editorial
entry; every `Trailer` here is real released footage, so it has no
`ContentStatus` of its own. What needed grading instead is one specific
claim *about* that footage — so `EvidenceLevel` (`VISIBLE` / `CONFIRMED` /
`INFERRED` / `THEORY`, `src/types/content.ts`) is a separate, smaller
vocabulary, rendered via the new `EvidenceBadge` (`src/components/common/`,
alongside `StatusBadge`, never the same component). Each `TrailerObservation`
carries exactly one evidence level. A trailer detail page derives three
views from the same array rather than storing them three times: "What this
footage shows" (all observations), "What it confirms" (`CONFIRMED` only),
"What it suggests" (`INFERRED`/`THEORY` only) — so the sections can never
silently drift out of sync with each other.

**Timestamp architecture, deliberately unpopulated.** `TrailerAnalysis.timestamps`
(`TrailerTimestamp[]`, seconds + title + `EvidenceLevel` + optional
character slugs) and the `TrailerTimestamps` component
(`src/components/content/`, renders nothing when empty, same convention as
`RelatedContent`) are fully built and wired to seek the embedded player —
clicking a timestamp re-points the `<iframe src>` at
`?start=<seconds>&autoplay=1` (`withStartTime` in `src/utils/youtube.ts`;
no YouTube IFrame Player API, no new dependency). No trailer ships with any
timestamps yet: producing a real one requires reviewing the actual official
footage frame-by-frame, which wasn't possible this phase (no video-viewing
tool), and copying "around the 0:20 mark" style timing from secondary
coverage is exactly the fabrication this architecture exists to prevent.
`validate-content.ts` already enforces non-negative times, no duplicates,
times within the trailer's `duration`, and that any timestamp/observation
`relatedCharacterSlugs` is a subset of the trailer's own — ready the moment
someone populates real ones.

**Relationships.** Trailer → Character (`APPEARS_IN`) and Trailer ↔ News
(`REPORTED_BY`) reuse the existing computed-reverse-lookup pattern with no
new mechanism: adding `relatedCharacterSlugs`/`relatedNewsSlug` to the new
trailer entries made them show up automatically in
`CharacterDetailPage`'s existing "Featured in" section and (new this
phase) `NewsDetailPage`'s "Trailer coverage" section, via one added
`trailersByNewsSlug` index in `relationships.ts`. Teasers whose confirmed
characters (Professor X, Magneto, Cyclops, Shuri, M'Baku, Namor, The Thing)
aren't part of the existing five-character roster simply carry no
`relatedCharacterSlugs` — extending the roster is future-phase work, not
implied by this one.

**AVENGERS: DOOMSDAY CLOCK.** Marvel Entertainment's official countdown
video (published January 13, 2026) is a genuinely different kind of asset
— not a teaser, trailer, or clip — but the BUG-001 hardening pass added it
as a `Trailer` (`type: 'clock'`, slug `doomsday-clock`) rather than building
a parallel model: it needs exactly the same verification/embed/JSON-LD/
validation machinery a trailer already has, so it gets all of that for free
at `/trailers/doomsday-clock`, and the homepage countdown links to it
directly. Its `videoUrl` was confirmed the same oEmbed way as every other
entry. No duration, timestamps, or observations are attached — none of that
was independently verifiable, so none was invented.

**Media provenance.** `MediaAsset` (`src/types/content.ts`) requires `alt`
and gained optional `source`/`attributionUrl`/`usageBasis`/`type` fields —
see "Media provenance" under Performance/Cards below for the full policy.
Every trailer thumbnail added this phase (the five now-verified entries)
hotlinks YouTube's own thumbnail CDN for that exact verified video ID
(`i.ytimg.com/vi/<id>/hqdefault.jpg`) — never downloaded or rehosted —
tagged `usageBasis: 'official-thumbnail'`.

**Deferred / extension points**, documented rather than half-built:
comparing footage across releases ("which trailer introduced a
character?"), a populated `locations` field, and expanding the character
roster to match everyone teased so far.

### Rumor Intelligence

Added this phase. `/rumors` and each rumor detail page evolved from a
single unsourced description into a structured, evidence-graded record of a
**claim** — who's making it, how credible the reporting is, whether it's
been corroborated or contradicted, and what (if anything) has actually been
confirmed. Built entirely on the existing content/relationship layers, same
as Trailer Intelligence — no parallel data system, and this project's core
editorial line: a rumor must never become a confirmed fact merely because
many sites repeat it, and this archive is not a leak-aggregation feed.

**A rumor models a claim, not an article.** `Rumor.claim` is the neutral
statement being tracked ("Character X appears in the film"), `Rumor.summary`
is a neutral account of what's being reported, and `Rumor.sources` is the
evidence for it — never the other way around. An article about the same
topic is one source among possibly several, not the rumor itself.

**`RumorStatus` — a lifecycle, deliberately separate from `ContentStatus`.**
Every entry under `/rumors` is, by definition, a tracked rumor — the same
reasoning `Trailer` uses to carry no `ContentStatus` of its own (see
"Content status system" above). What actually varies is the claim's
evidence lifecycle, graded by `RumorStatus` (`src/types/content.ts`):
`UNVERIFIED` → `REPORTED` → `CORROBORATED` / `DISPUTED` → `DEBUNKED` /
`CONFIRMED`, rendered via `RumorStatusBadge`
(`src/components/common/RumorStatusBadge.tsx`) — a label and a distinct
icon per status, matching `StatusBadge`/`EvidenceBadge`'s never-color-alone
convention, on a new `Badge` `danger` tone reserved for `DEBUNKED` so it
never reads as the brand accent. `confidence?: ConfidenceLevel` is reused
from `Theory`, but it's a **separate axis** from `status`: status is what
the evidence currently establishes, confidence is how strongly available
reporting supports that assessment — a `REPORTED` claim can be `low`
confidence, a `CORROBORATED` one `medium`; `confidence` is optional and
normally omitted once a claim reaches `CONFIRMED`, which doesn't need a
subjective score.

**Source model — one array, three derived views.** `RumorSource` (`{ name,
url, publishedAt, type, reliability, author?, summary, role }`) captures
one piece of reporting: `type` (`OFFICIAL` / `TRADE_PRESS` / `MAJOR_OUTLET`
/ `JOURNALIST` / `INTERVIEW` / `SOCIAL` / `AGGREGATOR` / `UNKNOWN`) and
`reliability` (`HIGH` / `MEDIUM` / `LOW` / `UNKNOWN`) are separate, both
qualitative — reliability grades the *source's* track record and
identifiability, never the truth of one specific claim, since (per the
brief this phase implemented against) a normally reputable outlet can still
publish an incorrect rumor, and an anonymous account can occasionally be
right. `role` (`FIRST_REPORT` / `CORROBORATION` / `CONTRADICTION` /
`CONFIRMATION` / `CONTEXT`) is what lets one `sources` array serve three
page sections without duplicating data: "Source history" renders every
source chronologically; "Corroboration" and "Contradictions" are the same
list, pre-filtered by `role`, via one `RumorSourceList` component
(`src/components/content/`) — exactly the derived-views pattern Trailer
Intelligence established for observations ("confirms" / "suggests" from one
array), applied to sources instead. **Reposts don't count as corroboration**
— if ten sites repeated one original leak, only the original (or a
genuinely separate reporting chain) is listed as a source; this principle
is documented inline in `src/data/rumors/index.ts` and, where relevant, in
a rumor's own `notes` field (e.g. the Tobey Maguire opening-battle entry
flags that its two sources may share an ultimate origin).

**Rumor vs. Theory, kept distinct.** A rumor is "someone claims this will
happen" (evidence: `sources`); a theory is "this is our interpretation of
known evidence" (`Theory.confidence`, no sources required). Neither
collection borrows the other's vocabulary, and nothing here converts a
theory into a rumor for sounding plausible, or a rumor into fact for being
popular.

**Rumor → Trailer evidence, architected but not exercised yet.**
`RumorObservation` (`{ text, evidenceLevel, relatedTrailerSlug? }`) reuses
`EvidenceLevel` from Trailer Intelligence rather than a rumor-specific
scale, and can point at the trailer whose released footage grounds it —
the mechanism `validate-content.ts` requires before a rumor may be marked
`CONFIRMED` (a `CONFIRMATION`-role source or a `CONFIRMED` observation) or
`DEBUNKED` (a `CONTRADICTION`-role source). None of the six current entries
needed this — none of the tracked claims overlaps with what a populated
trailer's analysis already establishes — so `observations` ships empty on
every entry rather than forced. Same precedent as Trailer Intelligence's
unpopulated timestamps: build the architecture, don't fabricate the data to
exercise it.

**Relationships — the same mechanism, a fourth entity.** `Rumor →
Character` (`RUMORED_ABOUT`), `Rumor → Trailer` (`SUPPORTED_BY`), and
`Rumor ↔ News` (`REPORTED_BY`) reuse the exact computed-reverse-lookup
pattern from `relationships.ts` — three new indexes
(`rumorsByCharacterSlug`, `rumorsByTrailerSlug`, `rumorsByNewsSlug`) and one
new `getRumorConnections(slug)`. `CharacterDetailPage`'s "Related rumors",
`TrailerDetailPage`'s "Related rumors", and `NewsDetailPage`'s "Related
rumor" sections all render automatically the moment a `Rumor` names a real
slug — verified this phase with a temporary fixture (added
`relatedCharacterSlugs`/`relatedTrailerSlugs`/`relatedNewsSlugs` to one
entry, confirmed all three reverse sections rendered correctly with no
console errors, then reverted). None of the six real entries currently
names a character from the five-person roster or an existing trailer/news
article — the actual current rumor landscape (Spider-Man variants, X-Men,
Doctor Strange) mostly concerns people outside that roster, the same
roster-boundary judgment call Trailer Intelligence made.

**Index page.** `/rumors` sorts by most-recently-updated first and offers a
plain, accessible status filter (a row of `<button aria-pressed>`s, no new
dependency) — "All" plus one button per `RumorStatus`. Filtering is a
client-side array filter over already-loaded data, not a new fetch.

**Detail page** renders, only when populated: status + confidence header,
the claim, what's being reported, "What we know" (`observations`, when
any), an editorial `notes` callout (when present — e.g. flagging that
specific character names circulating around the X-Men/Avengers death-toll
rumor are fan speculation the source itself never specified), source
history, corroboration, contradictions, and related characters/trailers/news.

**Editorial safety in the copy itself.** Every summary is written in
sourced-claim language ("has been reported," "one report claims," "has not
been officially confirmed") never assertion language ("X is in the film")
— checked against the brief's own good/bad examples while writing each of
the six entries.

**SEO.** `getRumorSeo` composes `Rumor: {title} — What We Know` rather than
phrasing the claim as a headline, specifically to avoid a sensationalized
title implying the claim is settled. JSON-LD stays `WebPage` +
`BreadcrumbList` only — no `Article` schema, matching the existing `Theory`
convention (a rumor page is analysis of reporting, not a first-hand news
article) — and, per policy, no invented ratings/engagement numbers.

**Validation** (`scripts/validate-content.ts`): unique rumor id/slug (existing
check, now exercised), every `relatedCharacterSlugs`/`relatedTrailerSlugs`/
`relatedNewsSlugs` entry resolves to a real slug, at least one source per
rumor, no duplicate source URLs within one rumor, `lastUpdatedAt` never
before `firstReportedAt`, every `observation.relatedTrailerSlug` resolves,
`CONFIRMED` rumors have a `CONFIRMATION` source or `CONFIRMED` observation,
`DEBUNKED` rumors have a `CONTRADICTION` source, and `CORROBORATED` rumors
have at least two corroborating sources. Tested this phase by temporarily
marking a `DEBUNKED` rumor `CONFIRMED` with no confirming evidence — the
build failed with the exact expected message — then reverted.

**Data population.** Six claims, each researched against multiple
reputable outlets (Deadline, The Hollywood Reporter, Variety, Empire,
ScreenRant, Collider, TheDirect, ComicBookMovie, Yahoo Entertainment,
ComicBook.com, ABC News/GMA) rather than any single aggregator: Tom
Holland's Spider-Man cameo (`UNVERIFIED`), Tobey Maguire's opening-battle
appearance (`REPORTED`), Doctor Octopus in that same battle (`DEBUNKED`),
the ~180-actor ensemble size (`REPORTED`), Benedict Cumberbatch's Doctor
Strange role (`DISPUTED` — the actor's own on-record statements directly
conflict with each other across more than a year), and an insider's
"3 X-Men and 2 Avengers die" claim (`UNVERIFIED`). No claim reached
`CORROBORATED` or `CONFIRMED`: every multi-source entry either conflicts
(`DISPUTED`/`DEBUNKED`) or traces back to reporting that couldn't be
confirmed as genuinely independent — an honest reflection of the current
rumor mill, not a gap in the vocabulary. `CORROBORATED`/`CONFIRMED` remain
fully implemented and validated; they're simply unexercised by today's
data, the same posture Trailer Intelligence took with unpopulated
timestamps.

**Deferred / extension points**, documented rather than half-built: a
homepage rumor preview (deliberately not added — six entries isn't enough
to justify a permanent homepage section, and the brief is explicit that
the homepage must never become a rumor feed), automated source monitoring
or change detection, rumor notifications, community submissions, a rumor
comparison/graph view, and post-release automatic status transitions.

### Comics enrichment research (Marvel Developer API) — not integrated

Researched this phase, per an explicit "document, don't implement" brief.
**Nothing below is wired into the app** — no API key, no fetch call, no
Marvel-sourced data of any kind exists in this codebase.

- **Current status is a blocker, not just a choice.** `developer.marvel.com`'s
  documentation and dashboard URLs now redirect to Marvel's marketing
  homepage — the public developer portal appears to be down or retired as
  of this research (corroborated by third-party reports; Marvel's own
  current docs could not be loaded to confirm directly). This is a stronger
  reason to defer than "not needed yet."
- **Historical shape** (from archived docs/third-party references, not
  freshly verified): entities are Characters/Comics/Series/Events/Stories/
  Creators, cross-linked to each other; auth is a public/private key pair
  with per-request MD5 hash signing (`ts + privateKey + publicKey`); the
  public key is meant for client-side use, the private key never is — the
  same rule this project already follows for any credential; rate limits
  were on the order of low thousands of calls/day per key, gated behind a
  developer account; attribution text was required on any page displaying
  API data ("Data provided by Marvel. © [year] Marvel"); images were meant
  to be referenced by API-returned URL, not mirrored or redistributed; and
  Marvel's terms reserved the right to charge for or restrict access at any
  time.
- **If it ever becomes viable again**, the natural shape is an optional,
  read-only enrichment layer sitting beside — never merged into — our own
  movie-canon data: `Movie Character → Marvel Character Reference → Comics/
  Series/Events`, added only where a trustworthy character mapping
  genuinely exists (never forced), and always visually and structurally
  distinct from movie canon and from fan theories. `EntityReference`/
  `EntityType` (see "Knowledge graph" above) already generalize over "any
  entity, any source," so a future `comic` entity type would extend the
  same shape rather than requiring a parallel system.
- **Recommendation:** do not build against this API until Marvel republishes
  current, working developer documentation and a live key-issuance flow.
  Revisit as a research task, not an assumption baked into any roadmap.

## Cast & Character intelligence (Phase 12)

Expanded the Cast/Character datasets from 5 entries each to 28 each, reusing
every existing model, card, page, and relationship mechanism unchanged — no
new entity types, no parallel card components, no new relationship storage.

- **Sourcing.** The 23 new actor/character pairs are all drawn from Marvel
  Studios' official cast announcement, published via D23 (Disney's own
  fan-club/news outlet) on March 26, 2025 — the only source in the hierarchy
  above trade reporting that was actually available. That announcement names
  the actor but pairs a role only for Robert Downey Jr./Doctor Doom; every
  other actor's specific character is their own pre-existing Marvel/X-Men
  identity (reprised, not invented for this film) and is independently
  corroborated by trade reporting (e.g. TV Insider, Aug 17, 2026) and, for
  the X-Men trio and the Wakanda/Fantastic-Four group, by this site's own
  already-published trailer analysis. Deliberately excluded: actors/roles
  reported only via set-photo spotting or a single social-media account
  (e.g. Namora, Attuma), and every name this project's own Rumor
  Intelligence layer already tracks as unconfirmed (Spider-Man, Wolverine,
  Deadpool, Doctor Strange, Hawkeye) — promoting any of those to a
  `Character` record would contradict the rumor entries that already
  correctly grade them as unresolved.
- **Relationships.** The two pre-existing trailer entries (`x-men-teaser`,
  `wakanda-fantastic-four-teaser`) already described these characters in
  prose but couldn't link to them — their `relatedCharacterSlugs` were
  empty because the characters didn't exist yet. Both are now wired up, at
  the observation level too. A new `NewsArticle` + `TimelineEvent` pair
  documents the D23 announcement itself and links every new character to
  it (a real MENTIONED_IN/REFERENCES basis, not an invented one).
  `getPersonConnections` (an actor's page) now also resolves `rumors`
  transitively through the character it plays, matching the character
  side's existing behavior — this was a gap, not a new relationship type.
  A new `getCharacterContentCounts()` gives the Characters grid a cheap
  "Featured in N trailers" count without an N+1 `getCharacterConnections`
  call per card.
- **Images: still none, deliberately.** No cast or character photo has a
  legitimate, recorded usage basis (see "Media provenance" above) — nothing
  changed about that policy this phase, and downloading an actor headshot
  or a Marvel promotional still to fill the new cards would violate it.
  Instead, `MediaThumb` gained a `fallbackName` prop: a deterministic
  monogram (initials + one of four subtle same-hue tint variants, keyed off
  the name) replaces the old bare-icon fallback for people specifically —
  more premium and more individually legible across a 28-card grid, while
  still never claiming to be a real photo. It also gained an `aspect`
  prop (`'video'` default / `'portrait'`) so person cards use a 3:4 frame
  instead of the 16:9 frame built for trailer thumbnails.
- **Detail pages.** Both Cast and Character detail pages now render a
  (fallback) portrait via `MediaThumb`, matching the "image" step of each
  page's recommended structure. The Character page's description now sits
  under an explicit "What we know" heading. Cast pages gained a "Related
  rumors" section (previously missing, unlike the Character page's).
- **Validation.** `validate-content.ts` gained one check:
  `character.actorSlug` values must be unique (a duplicate would mean two
  characters silently claiming the same actor). Verified by temporarily
  reusing a real actor slug across two characters and confirming the build
  fails with a clear message, then reverting.
- **Performance.** The production `index-*.js` chunk grew ~15KB raw / ~3.5KB
  gzipped from the added data. This is pre-existing architecture, not a new
  regression this phase introduced: `src/lib/content.ts` (and therefore
  every `src/data/*` module) was already eagerly reachable before Phase 12,
  because the homepage's `Explore` section imports it directly and is not
  itself lazy-loaded. Splitting `content.ts` into per-category dynamic
  imports would fix this but is a real architecture change, not a data
  change — out of scope here per this phase's "avoid a broad rewrite unless
  the regression is material" guidance; ~3.5KB gzip is not material.

## Future CMS/API strategy

`src/data/` is the seam where local, static data can be swapped for a REST
API, headless CMS, or database-backed source. Components should be written
against the shape of the data (typed via `src/types/`), not against "this
comes from a local file," so that swap can happen without touching
presentation code. Concretely, migrating means editing the bodies of the
`get*()`/`get*BySlug()` functions in `src/lib/content.ts` to fetch from the
new source and map the response onto the existing `src/types/content.ts`
shapes — nothing above that layer (pages, sections, components) needs to
change. A real API would likely also want pagination and field selection;
see "Future content-loading strategy" under Performance for what's
intentionally deferred there.

## Routing

`react-router-dom` (declarative `<BrowserRouter>`/`<Routes>`/`<Route>`, no
data-router/loader APIs) is the smallest router that gives the app real,
bookmarkable URLs. `src/App.tsx` is the single route table, reading every
path from `CATEGORIES` (`src/data/categories.ts`) rather than restating a
string per route:

| Category   | List           | Detail               |
| ---------- | -------------- | -------------------- |
| News       | `/news`        | `/news/:slug`         |
| Trailers   | `/trailers`    | `/trailers/:slug`     |
| Cast       | `/cast`        | `/cast/:slug`         |
| Characters | `/characters`  | `/characters/:slug`   |
| Theories   | `/theories`    | `/theories/:slug`     |
| Rumors     | `/rumors`      | `/rumors/:slug`       |
| Timeline   | `/timeline`    | —                     |

plus `/` (home) and a `*` wildcard rendering `src/pages/NotFound.tsx` for
any unmatched in-app route. `src/components/layout/Layout.tsx` renders
`Header`/`Footer` once around an `<Outlet />`, so no page component
re-renders its own header/footer. A route exists for every category
regardless of whether it currently has content — an index page with zero
items renders `EmptyState` rather than being left unrouted (see "Local
data" above) — but no detail route was invented for content that doesn't
exist: every populated `href`/`Link` in the app points at a real slug from
`src/data/*`.

Every route except `/` is a separate `React.lazy()` chunk (see "Route-level
code splitting" under Performance) — `Home`/`Layout` load eagerly since
every visitor needs them, everything else loads only when that route is
actually visited, behind a plain-text `<Suspense fallback={<RouteFallback />}>`.

### GitHub Pages deep-link resolution

GitHub Pages is a static file server with no route table of its own: a
client-side navigation (clicking a `Link`) always worked, but a hard
browser navigation or refresh on a deep URL (e.g.
`avengers-doomsday.in/news/some-slug`) used to hit GitHub's server directly,
find no matching file, and return `public/404.html` instead of loading the
app — even for perfectly valid routes.

**Solution:** the well-established GitHub-Pages-SPA redirect pattern,
implemented with the smallest script that does the job (no new dependency,
no router change):

1. `public/404.html` (served by GitHub Pages, with a real HTTP 404 status,
   for any path with no matching file) runs a small inline script that
   saves the exact requested path (`pathname + search + hash`) to
   `sessionStorage` and replaces the document with the real app at `/`.
   It does **not** decide whether the path is valid — it just hands it back
   to the app. If JS is unavailable, this script never runs and the
   existing plain, branded, JS-free 404 markup (unchanged from Phase 7)
   is what the visitor sees.
2. `index.html` runs a matching inline script, placed at the end of
   `<body>` — deliberately *after* `<script type="module" src="./assets/...">`,
   not before it (see "Base path" above for why: with the relative `base`
   that section explains, position relative to the module tag matters).
   A classic inline script still always executes before a deferred
   `type="module"` script's own code runs, regardless of which one appears
   first in the document, so this still always runs before `src/main.tsx`
   mounts React and before `BrowserRouter` reads `window.location`: if a
   saved path exists, it restores it via `history.replaceState` and clears
   the sessionStorage entry, then the app mounts and **React Router
   decides** whether that path is a real route (renders the matching page)
   or not (renders `NotFound`, `noindex`) — exactly as it would for any
   other load.

Both scripts are a handful of lines each, run only on the exact condition
that needs them (a no-op on every normal navigation, since nothing is ever
in `sessionStorage` otherwise), and require no change to `src/App.tsx` or
the deploy workflow — `BrowserRouter`'s route table never sees anything
different between a client-side navigation and a restored hard-navigation.
This is a client-side redirect (`location.replace`,
not an HTTP 301) followed by a `history.replaceState`, not a permanent
redirect to the homepage: a genuinely invalid URL still ends up exactly
where it should — its own address bar path, rendering the branded
`NotFound` page with `noindex`, never silently substituted with homepage
content. Query strings and hashes round-trip through `sessionStorage`
unchanged. Verified end-to-end (see "Verification" further down) with a
small local static server that reproduces GitHub Pages' actual 404
behavior — `vite preview` was not usable for this test, since it already
has its own built-in SPA fallback that would have masked whether the fix
was doing anything.

**Residual limitation:** a crawler or tool that does not execute JavaScript
still receives an HTTP 404 status and the static 404 body for a deep
content URL requested directly (only a JS-executing visitor gets redirected
into the real page) — an inherent constraint of static-hosting a
client-routed SPA with no server-side rewrite rule, not something fixable
without moving off static GitHub Pages hosting, which is out of scope here.

### Navigation

`src/data/navigation.ts`'s `NAV_ITEMS` only sets `href` for a category that
currently has real content — `components/layout/Header.tsx` renders any
item without one as a disabled "Soon" label. A route existing is not
sufficient to enable its nav entry; update `NAV_ITEMS` by hand as a category
goes from empty to populated (or back).

## Source attribution

`NewsArticle`, `Trailer`, `Person`, `Character`, `Theory`, and `Rumor` can
all carry an optional `source: { name, url }`; news and timeline entries
also carry `publishedAt`/`updatedAt` timestamps. `SourceAttributionView`
(`src/components/content/`) renders it consistently everywhere it appears.
The intent is to summarize and link to original reporting, never to
reproduce full articles from other outlets — see "Content provenance
policy" above for the full policy this follows.

## SEO architecture

SEO follows the same layering principle as content: one config, one access
layer, no logic duplicated across components.

```
src/config/seo.ts   → seoConfig (titles, description, robots, locale, image)
src/lib/seo.ts       → canonical URLs, title building, per-content SEO
                        defaults, JSON-LD builders
src/hooks/useDocumentSeo.ts → keeps the rendered document in sync at runtime
index.html            → static duplicate of the homepage's tags, for
                        crawlers/social scrapers that never run the app's JS
```

### Metadata strategy

`src/config/seo.ts` holds `siteName`, `domain`, `titleTemplate`,
`defaultTitle`, `defaultDescription`, `defaultImage` (unset — see Social
sharing below), `locale`, `twitterHandle`, and a `robots` policy. It derives
`siteName`/`domain` from `src/config/site.ts` rather than restating them.

Because there is no server-side rendering, `index.html` is the only thing
search engines and social scrapers see without executing JavaScript, so its
`<title>`, `description`, `og:*`, and `twitter:*` tags are a hand-kept
static copy of `seoConfig`'s **homepage** values only — they intentionally
do not (and cannot) reflect a `/news/:slug` URL, since a crawler that
executes JavaScript is what actually sees a content page's real title.
Every page — `Home` and all thirteen category/detail pages — calls
`useDocumentSeo` with its own `title`/`description`/`path`, which writes
`document.title`, the meta description, canonical link, and robots
directive at runtime; for the homepage this duplicates what `index.html`
already has, and for every other page it's the only place that page's
metadata is set.

### Canonical URL strategy

`getSiteUrl()` and `getCanonicalUrl(path)` in `src/lib/seo.ts` are the only
place `https://${seoConfig.domain}` (currently `https://avengers-doomsday.in`)
is constructed in application code — everything
that needs an absolute URL (canonical link, `og:url`, JSON-LD `url` fields)
calls one of these instead of concatenating the domain itself. `index.html`
is the one unavoidable exception: a static file can't call a TS function, so
its canonical/`og:url` values are a literal copy kept in sync by hand.

### Structured-data strategy

`src/lib/seo.ts` exports JSON-LD builders (`buildWebSiteJsonLd`,
`buildWebPageJsonLd`, `buildBreadcrumbJsonLd`, `buildArticleJsonLd`,
`buildPersonJsonLd`, `buildVideoObjectJsonLd`) and a `<JsonLd data={...} />`
component (`src/components/common/JsonLd.tsx`) that renders them as a safely
escaped `<script type="application/ld+json">`. The homepage renders
`WebSite` and `WebPage`; every news detail page additionally renders
`Article`, every cast detail page renders `Person`, and every detail page
(news, trailers, cast, characters, theories, rumors) now also renders
`BreadcrumbList` — each fed only real, sourced fields already on that
entity (`headline`/`datePublished` from the article, the same
Home → Category → Item trail as the visible `Breadcrumbs` component, etc.),
never an invented rating, review, author, or organization. A trailer detail
page additionally renders `VideoObject` **only when `videoUrl` is set**
(`verificationStatus: 'verified'` — see "Trailer Intelligence"); an
unverified trailer has no confirmed `contentUrl` to put in one, so it
renders no `VideoObject` at all rather than one with a missing/fabricated
field. Characters, theories, and rumors render `WebPage` + `BreadcrumbList`
only; none of the schema types here ever claim official Marvel affiliation.

### Future content-page SEO

`NewsArticle`, `Trailer`, `Person`, `Character`, `Theory`, and `Rumor` each
carry an optional `seo?: SeoOverrides` field (`src/types/seo.ts`) for a
title/description/canonical path/image override. `src/lib/seo.ts` exposes a
`get*Seo()` resolver per entity (e.g. `getNewsArticleSeo`) that falls back to
the entity's own `title`/`excerpt`/`slug`/image when no override is set —
most future content will never need to set `seo` at all.

### Social sharing

`og:title`, `og:description`, `og:type`, `og:url`, `twitter:card`,
`twitter:title`, and `twitter:description` are populated. `og:image`/
`twitter:image` are intentionally omitted: no real, non-Marvel-artwork share
image exists yet. `seoConfig.defaultImage` is the placeholder for one —
once a real image is added under `public/images/`, set it there and add the
two tags (to `index.html` and to `useDocumentSeo`'s writes).

### Robots & sitemap

`public/robots.txt` allows full crawling and points to
`public/sitemap.xml`. `public/sitemap.xml` is no longer hand-maintained —
`scripts/generate-sitemap.ts` reads through the exact same content access
layer the app uses (`src/lib/content.ts`'s `get*()` functions) and writes
one `<url>` entry for `/`, for each category's index page **only if that
category has at least one item**, and for each item's own detail page. A
category with zero items (currently `theories`, `rumors`) contributes no
URLs at all, so the sitemap can never list a route search engines would
find empty or a slug that doesn't exist. It runs via `tsx` (a small
dev-only dependency, since these source files use the same
extensionless/bundler-style imports as the rest of `src/` — plain Node
can't resolve those without it) as part of `npm run build`, before Vite
copies `public/` into `dist/`:

```
tsc -b  →  tsx scripts/generate-sitemap.ts  →  vite build
```

Run `npm run generate:sitemap` on its own to regenerate
`public/sitemap.xml` without doing a full build.

### GitHub Pages considerations

The custom domain `avengers-doomsday.in` means canonical URLs and `og:url`
never need a repo-name subpath prefix — `BrowserRouter` is likewise used
with no `basename`, since the app is served from the apex root. If the
deployment target ever changes to an unconfigured `github.io` subpath,
`getSiteUrl()`/`getCanonicalUrl()`, `vite.config.ts`'s `base`, and
`BrowserRouter`'s `basename` would all need revisiting together — right now
none of them is path-prefix-aware. The deployment workflow, `CNAME`, and a
static `404.html` are in place (see Deployment above); DNS, domain
verification, and the Pages custom-domain/HTTPS settings still require
manual action outside this repository. `doomsdays.in` remains an owned but
unconfigured secondary domain — see "Domain architecture" in Deployment for
what switching to it would involve. See "GitHub Pages deep-link resolution"
under Routing above for how a hard navigation or refresh on a nested URL
(e.g. `/news/some-slug`) is handled.

## Analytics

Lightweight GA4 (Google Analytics 4) measurement, added as a
measurement-only phase — no redesign, no backend, no new runtime
dependency. It uses gtag.js directly (the same script Google's own GA4
snippet loads) rather than a wrapper package like `react-ga4`, since a
SPA's entire integration surface here is "load one script, push a few
events" — not enough to justify a dependency.

### Configuration

The GA4 Measurement ID lives in exactly one place: `GA_MEASUREMENT_ID` in
`src/config/analytics.ts`. Nothing else in the app hardcodes it. To point
the site at a different GA4 property, or to disable analytics entirely,
change (or blank) that one constant — no other file needs touching. A
Measurement ID is a public client-side identifier by design (every GA4
site ships it in page source), not a secret, so committing it is safe;
it is not an API key or credential.

### Production-only gating

`isAnalyticsEnabled()` (same file) is the single gate every analytics call
goes through, and it checks one thing: `window.location.hostname ===
siteConfig.domain` (`avengers-doomsday.in`). This means analytics is a
no-op on `vite dev`, `vite preview`, any local static-file server, and the
raw `github.io` project subpath — not because of a `DEV`/`PROD` build-mode
flag, but because none of those hostnames can ever equal the production
domain. A production *build* previewed anywhere other than the live domain
still can't emit real GA4 data.

### Architecture

- `src/config/analytics.ts` — the Measurement ID and the production-only
  gate described above.
- `src/lib/analytics.ts` — `initAnalytics()` injects the `gtag.js` `<script
  async>` tag and configures GA4 once, and `trackPageview(path, title)`
  pushes a `page_view` event. Both are no-ops when
  `isAnalyticsEnabled()` is false, and both are wrapped in `try/catch` —
  a blocked or failed script load (ad blockers, offline) can never throw
  into the app. `initAnalytics` passes `send_page_view: false` to gtag's
  own `config` call, since this is a client-side-routed SPA: gtag's
  automatic pageview only fires once, on the initial `window` load event,
  and would otherwise miss every subsequent React Router navigation.
- `src/components/common/Analytics.tsx` — a headless component (renders
  `null`) mounted once inside `<BrowserRouter>` in `App.tsx`, alongside
  `<Routes>` rather than inside `Layout`, so it observes every route
  regardless of which lazy page is showing. Calls `initAnalytics()` once
  on mount, then calls `trackPageview()` — using `useLocation()`'s
  `pathname`/`search` — on the initial route and every subsequent
  navigation, so there is exactly one `page_view` per route, including
  the first, with the current production URL (`page_location` reads
  `window.location.href` at fire time, so query strings are included and
  it is never a stale/previous route).

### Privacy / data minimization

Only GA4's own standard, aggregated pageview measurement is sent —
`page_location`, `page_path`, `page_title`. Nothing here reads or sends
form contents, names, emails, or other personal identifiers, and nothing
builds a custom user profile. This project has no existing
cookie/consent banner or other consent mechanism, and this phase does not
add one. GA4's default configuration (used as-is here, with no
IP-anonymization or consent-mode code added) does set first-party
measurement cookies and, depending on the visitor's jurisdiction, may
require a cookie/consent notice under regimes like GDPR/ePrivacy or
similar regional rules — that legal/consent determination and any banner
implementation is explicitly out of scope for this phase and is flagged
here as follow-up work for a dedicated privacy/consent phase, not
something this README asserts compliance with.

### Bundle impact

No new dependency was installed — `gtag.js` itself is fetched from Google
at runtime in production only, never bundled. The three new local files
(`src/config/analytics.ts`, `src/lib/analytics.ts`,
`src/components/common/Analytics.tsx`) add to the initial (eager) chunk,
since `Analytics` is mounted unconditionally in `App.tsx`:

| Asset | Before | After | Delta |
| --- | --- | --- | --- |
| Initial JS | 330.18 kB / 102.33 kB gzip | 330.90 kB / 102.62 kB gzip | +0.72 kB / +0.29 kB gzip |
| Initial CSS | 22.55 kB / 4.85 kB gzip | 22.55 kB / 4.85 kB gzip | unchanged |

("Before" is the Phase 13 GitHub Pages asset-path fix build, immediately
preceding this phase.) No lazy route chunk changed size.

### Error handling

Every exported function in `src/lib/analytics.ts` is wrapped in
`try/catch` and every call site is gated by `isAnalyticsEnabled()`
first — a GA4/network failure (ad blocker, offline, Google outage) can
change only whether a pageview is recorded, never the app's own
rendering, routing, or countdown behavior.

## Performance

### Philosophy

Ship as little JavaScript and CSS as the app actually needs, keep the one
continuous animation cheap, and prefer removing unnecessary work over
adding tooling to compensate for it. `react-router-dom` was added this
phase because real, multi-page routing is a genuine requirement, not
speculatively — no performance framework, state-management library,
service worker, or bundle-analyzer dependency has been added alongside it.

### Current bundle baseline

Production build (`npm run build`), 131 modules, route-level code
splitting (see "Route-level code splitting" below) — initial load vs. Phase
8's single-chunk baseline:

| Asset | Phase 8 (single chunk) | Phase 9 | Phase 10 | Phase 11 | Phase 11.5 hardening (initial load) |
| --- | --- | --- | --- | --- | --- |
| `index.html` | 2.15 kB / 0.70 kB gzip | 2.15 kB / 0.70 kB gzip | 3.01 kB / 1.11 kB gzip | 3.01 kB / 1.11 kB gzip | 3.01 kB / 1.11 kB gzip |
| Initial CSS | 15.89 kB / 3.79 kB gzip | 16.40 kB / 3.82 kB gzip | 17.64 kB / 3.99 kB gzip | 18.45 kB / 4.11 kB gzip | 21.48 kB / 4.71 kB gzip |
| Initial JS | 296.68 kB / 92.05 kB gzip | 289.57 kB / 91.04 kB gzip | 296.92 kB / 93.01 kB gzip | 310.68 kB / 97.55 kB gzip | 314.88 kB / 98.79 kB gzip |

(`index.html`'s Phase 9→10 growth is the GitHub Pages deep-link redirect
script from Phase 9B, not a content-phase change — see "GitHub Pages
deep-link resolution" under Routing. The Phase 11→11.5 CSS growth is the
countdown theme/panel styles and the new `MediaThumb`/card-media CSS, all
shared eager modules; the JS growth is five new `MediaAsset` objects on
verified trailers plus the countdown's new `months` unit, not new page
code.)

Every other route is a separate lazy chunk, fetched only when visited —
none of it is in the numbers above:

| Chunk | Size | Gzip |
| --- | --- | --- |
| `NotFound` | 0.22 kB | 0.19 kB |
| `useContentItem` (shared) | 0.32 kB | 0.23 kB |
| `TheoriesIndexPage` | 0.89 kB | 0.53 kB |
| `CastIndexPage` | 0.97 kB | 0.56 kB |
| `NewsIndexPage` | 1.01 kB | 0.57 kB |
| `CharactersIndexPage` | 1.01 kB | 0.57 kB |
| `TheoryDetailPage` | 1.31 kB | 0.66 kB |
| `TrailersIndexPage` | 1.46 kB | 0.82 kB |
| `CastDetailPage` | 1.73 kB | 0.82 kB |
| `NewsDetailPage` | 1.92 kB | 0.87 kB |
| `CharacterDetailPage` | 1.95 kB | 0.85 kB |
| `TimelinePage` | 2.01 kB | 0.94 kB |
| `RumorsIndexPage` | 2.08 kB | 1.05 kB |
| `relationships.ts` (shared) | 3.02 kB | 0.86 kB |
| `RumorDetailPage` | 3.72 kB | 1.32 kB |
| `TrailerDetailPage` | 4.74 kB | 1.82 kB |

`TrailersIndexPage`/`TrailerDetailPage` grew slightly this phase from the
new `MediaThumb`/play-indicator markup and the `clock` trailer type;
`CastIndexPage`/`NewsIndexPage`/`CharactersIndexPage` grew slightly from
their own `MediaThumb` fallback wiring. Each is still a lazy chunk paid for
only by a visitor who opens that route.

**Known regression, carried forward from Phase 10/11:** `Explore.tsx`
(the homepage's "What's confirmed so far" section, eager since Phase 1)
statically imports `getTrailers`/`getNews`/`getCharacters`/`getTimeline`
from `src/lib/content.ts` — one shared module that unconditionally imports
every category's data, `src/data/trailers/index.ts` and
`src/data/rumors/index.ts` included, at the top level. The five newly
verified trailers' thumbnail URLs/sources are therefore also reachable from
the eager homepage bundle, the same pre-existing architectural
characteristic disclosed in Phase 10 (rumor data) and now true of trailer
data too — confirmed by grepping `dist/assets/`: the new thumbnail URLs are
physically present in the main `index-*.js` chunk, not only in
`TrailersIndexPage`/`TrailerDetailPage`. The real fix — splitting
per-category data out of `content.ts`'s single module graph, or having
`Explore` fetch previews dynamically instead of through a
statically-imported barrel — remains a genuine future optimization,
deliberately not done here: it touches `Explore.tsx`/`content.ts`
architecture this hardening phase wasn't scoped to redesign, for a few kB
of gzip saving.

**Honest framing of the reduction:** the initial-JS drop (~7 kB raw / ~1 kB
gzip) is real but modest, not dramatic — most of the initial bundle's
weight is React 19 + ReactDOM's client runtime and `react-router-dom`
itself (all required for the homepage regardless), plus `src/lib/content.ts`
and the shared design-system components, which the homepage's "What's
confirmed so far" section (`Explore.tsx`) already needs and which every
other page also shares. The category pages themselves were thin UI shells
over that already-shared code, so splitting them out was never going to
remove a large fraction of the bundle — the win is that a homepage visit no
longer pays for News/Trailers/Cast/Characters/Theories/Rumors/Timeline/
NotFound-specific code at all, not that the app got dramatically smaller
overall.

`dependencies` in `package.json` is `react`, `react-dom`, and
`react-router-dom` — there is still no CMS SDK, animation library, icon
library, or analytics script contributing to bundle size. `StyleGuide.tsx`
(an internal design-system reference page) is never imported from
`App.tsx`, so it isn't part of this bundle at all.

### Countdown performance

`src/hooks/useCountdown.ts` already computed remaining time from
`targetTime - Date.now()` on every tick rather than decrementing a counter,
so a throttled or delayed interval can never drift — the next tick simply
recomputes the true remaining time. This phase added one change: the
`setInterval` is now stopped entirely while `document.hidden` is true and
restarted (with an immediate resync tick) on `visibilitychange` — a
backgrounded tab no longer wakes the JS engine once a second for a UI
nobody is looking at. The interval is still always cleared on unmount, and
the completed state (`isComplete`) is unaffected. Countdown state lives in
the `Countdown` leaf component, so the per-second re-render was already
scoped to it and its five `CountdownUnit` children — `Header`, `Hero`,
`Explore`, and `Footer` never re-render from the tick.

**Countdown 2.0 (BUG-001 hardening).** `useCountdown` gained a `months`
field, computed with real calendar-month arithmetic (walking forward one
`Date.setMonth` step at a time until the next step would pass the target,
then splitting the remainder into days/hours/minutes/seconds exactly as
before) rather than a fixed-length division — months vary from 28 to 31
days, so a naive `diff / (30 * DAY_MS)` would drift against the actual
calendar. The tick/visibility/cleanup/self-correcting-from-absolute-
timestamps behavior described above is unchanged; only the breakdown of one
already-correct `diff` changed. `Countdown.tsx` now renders five units
(Months/Days/Hours/Minutes/Seconds) with colon separators (hidden below
640px — see "Mobile checks" in the hardening report) inside a themed panel;
see "Countdown theme" below.

### Countdown theme

`src/config/countdownTheme.ts` defines named `CountdownTheme` palettes
(`background`/`surface`/`accent`/`text`/`mutedText`/`glow`/`overlay`) and
`toCountdownThemeVars()`, which turns the active one into `--countdown-*`
CSS custom properties applied via inline `style` on `Countdown.tsx`'s own
wrapper. `CountdownUnit.module.css` and `Countdown.module.css` read those
properties with a fallback to the site's normal tokens
(`var(--countdown-accent, var(--color-accent-solid))`), so nothing outside
the countdown panel is affected by the theme, and the `CountdownUnit`
instances rendered by `StyleGuide.tsx`/`CountdownPreview.tsx` (which never
set the custom properties) render exactly as before. Two palettes exist
today: `doom` (active) — an original dark-green, Doctor-Doom-inspired
gradient/grid composition, not a copy of any Marvel artwork — and `neutral`,
which tracks whatever `tokens.css`'s own brand accent currently is (see
below) rather than hardcoding a color, so it can never silently drift back
to a stale palette. Swapping the active palette, or adding a future
`release_week`/`release_day` variant, only means editing this one config
file — never `Countdown.tsx`.

**Site-wide accent color.** Following this hardening phase, `tokens.css`'s
brand accent (`--color-accent`/`--color-accent-solid`/`--color-accent-muted`/
the new `--color-accent-rgb`) was changed from the original signal red to
the same green as the `doom` countdown palette, at the user's explicit
request, so the whole site — Hero's ambient glow, nav focus rings, buttons,
`StatusBadge`'s `accent` tone, the Rumors filter pills — now shares one
consistent brand hue instead of the countdown panel being the only green
surface. Every hardcoded rgba() that used to spell out the old red's RGB
triplet directly (`Badge.module.css`'s `.accent` border,
`RumorsIndexPage.module.css`'s active-filter border, `motion.css`'s
`.ambient-glow`, `tokens.css`'s own `--shadow-glow-accent`) now derives from
`--color-accent-rgb` instead, so a future accent change is a one-line edit
in `tokens.css`, not a multi-file hunt. `--color-success`/`--color-warning`/
`--color-danger` (CONFIRMED/DISPUTED/DEBUNKED-style status colors) are
untouched and remain visually distinct via label + icon, not color alone.

### Media provenance (cards, thumbnails)

Added this phase. `MediaAsset` (`src/types/content.ts`) now requires `alt`
and carries optional `source`/`attributionUrl`/`usageBasis`/`type` — the
`usageBasis` values (`official-embed` / `official-thumbnail` / `press-kit`
/ `editorial-fair-use`) name *why* an asset is safe to show, so nothing is
ever displayed on an assumed or unrecorded basis. This maps to a simple
editorial classification this project treats as policy, not code:

- **GREEN** (usable) — licensed, explicit permission, or a clearly
  permitted official embed/reference (e.g. a verified trailer's own YouTube
  thumbnail).
- **YELLOW** (case-by-case) — potentially defensible editorial/commentary
  use; nothing in the current dataset relies on this tier.
- **RED** (never used) — unknown provenance, a random image-search result,
  a fan upload, an unauthorized Marvel promotional asset, or any
  copyrighted asset with no established permission.

`MediaThumb` (`src/components/content/MediaThumb.tsx`) is the one
image-or-fallback box every card reuses: it reserves a 16:9 box (no layout
shift), lazy-loads (`loading="lazy"`, `decoding="async"`), and — via an
`onError` handler — falls back to a tasteful, abstract, on-brand placeholder
(a category icon over a subtle gradient, `role="img"` + `aria-label`) rather
than ever showing a broken image or an unrelated stock photo. `ContentCard`
gained an optional `media` slot (a `ReactNode`, following the same override
pattern as its existing `badge` slot) rendered full-bleed above the card
body; card types with no media concept (rumors, theories, timeline) simply
never pass one, so they render exactly as before.

**What's actually populated today, and what isn't (honestly):** the five
now-`verified` trailers (see "Trailer Intelligence") each have a real
thumbnail — YouTube's own served image for that exact confirmed video,
hotlinked by ID, never downloaded — tagged `official-thumbnail`. News,
cast, and character images remain unset: no legitimately sourced photo for
any of them was found this phase, and inventing or scraping one would be
exactly the kind of unrecorded-provenance asset this policy exists to
prevent. Their cards render the tasteful fallback instead — built,
consistent, and ready for a real photo the moment one is legitimately
sourced, never manufactured to "fill" the grid. `validate-content.ts` now
checks every populated `MediaAsset` for non-empty `alt` and an `https://`
`url` (see "Validation").

### Image strategy

The only local visual asset is `public/favicon/favicon.svg`; every other
image referenced by the app is either a verified official YouTube
thumbnail (hotlinked, not hosted here — see "Media provenance" above) or
absent, rendering a CSS/SVG fallback instead. The trailer detail page still
embeds official YouTube `<iframe>`s directly — no local video file is
hosted by this repository. Every `<img>` added this phase declares
`loading="lazy"` and sits in a fixed-`aspect-ratio` box so it reserves
layout space before it loads (no CLS); when real news/cast/character
photos do arrive, prefer a modern compressed format (WebP/AVIF) over
PNG/JPEG and keep the same lazy/aspect-ratio discipline.

### Font strategy

Space Grotesk (weights 500/700) and Inter (weights 400/500/600) load via
Google Fonts with `preconnect` to both `fonts.googleapis.com` and
`fonts.gstatic.com` and `display=swap`. Auditing every `font-weight` actually
used against `var(--font-display)`/`var(--font-body)` in the codebase
confirmed both loaded weight sets are fully used — the design system's
"semibold" (600) display-font token has no dedicated 600 file and resolves
to the loaded 700 face under the standard CSS font-matching rules, which is
how the homepage already renders today, so no font file was added or
removed. No new web font was introduced.

### Animation & reduced-motion status

Every transition in the app (button/card hover, header nav-link color, the
skip-link's focus reveal) is short, interaction-triggered, and already uses
cheap properties. The one continuous animation is `.ambient-glow`
(`src/styles/motion.css`), used behind the hero title — it animates
`background-position`, which can't run on the compositor the way
`transform`/`opacity` can, so full GPU offload isn't possible without
changing its markup (it's a plain drop-in class used on both an absolute
full-bleed backdrop and a static card in the style guide, and restructuring
it into a positioned pseudo-element would break that generality for no
shipped benefit, since the style-guide page isn't in the bundle). Instead,
this phase added `contain: paint` so the browser only ever repaints that
element's own box, not whatever it's layered under, plus `will-change:
background-position` scoped inside the same `prefers-reduced-motion:
no-preference` block that gates the animation — so a reduced-motion visitor
never pays for a promoted layer at all. `src/styles/global.css` already
forces every animation/transition to near-zero duration under
`prefers-reduced-motion: reduce`, which fully disables `.ambient-glow`'s
motion independently of its own media query.

### Core Web Vitals considerations

- **CLS**: `CountdownUnit` already uses `font-variant-numeric: tabular-nums`
  and fixed `min-width`, so digit changes every second never resize the
  cards. No image is rendered yet, so there is nothing to reserve layout
  space for today; see Image strategy above for what to do once one exists.
- **LCP**: the hero title is text rendered from the initial HTML/CSS with no
  network-dependent image in front of it; the only render-blocking request
  beyond the JS bundle is the Google Fonts stylesheet, which is already
  `preconnect`ed.
- **INP**: the only frequent interaction is the mobile menu toggle and hover
  states, none of which do expensive work on the main thread.

### Route-level code splitting

Implemented this phase. Every route in `src/App.tsx` except `/` (`Home`) is
`React.lazy(() => import('./pages/.../XPage').then(m => ({ default: m.XPage })))`
— the `.then()` maps the named export each page file already used onto the
default export `React.lazy` requires, without changing any page's own
export style. Each `<Route element={...}>` wraps its lazy component in
`<Suspense fallback={<RouteFallback />}>` individually (not one `Suspense`
around the whole `<Routes>` tree), so navigating between two lazy routes
only shows the fallback if the next chunk genuinely isn't loaded yet, not
on every navigation. `RouteFallback` (`src/components/common/`) is
deliberately plain text ("Loading…"), no spinner/animation — the chunks are
small enough that it's rarely on screen long enough to justify one.
Splitting is at the **route** level (one page component = one chunk), not
per-component — `Header`, `Footer`, `ContentCard`, `RelatedContent`,
`Breadcrumbs`, etc. all stay in the shared/initial bundle since every route
uses them, which is the right call per Vite's own chunking guidance:
splitting shared code would only add request overhead, not reduce it.
`Layout` and `Home` stay eager since the homepage is the entry point every
visitor hits first. See "Current bundle baseline" above for the measured
before/after.

### Future content-loading strategy

`src/lib/content.ts` is already `async` end-to-end even though it currently
resolves from in-memory arrays — that's the seam a future API/CMS swap
happens behind, with no call-site changes. Every collection is still small
enough (single digits per category) that a list page downloads the whole
category with the rest of the JS bundle at no real cost; once real
categories grow past that, the implementation behind `getNews()`,
`getTrailers()`, etc. should add pagination, selective field fetching, and
caching, so a list page never has to download the entire dataset to render
one page of it, and a detail page never downloads fields it doesn't
render. None of that is implemented yet.

### Static hosting considerations

Vite's default build already hashes asset filenames
(`assets/index-<hash>.js`/`.css`), which is cache-friendly for GitHub Pages
or any static host. The only external network requests the production site
makes are to `fonts.googleapis.com`/`fonts.gstatic.com` and, in
production only, GA4's `googletagmanager.com` script — see "Analytics"
above. No service worker was added.

### Performance budget / guardrails

Baselined against the numbers above, not chosen arbitrarily:

- JS: stay close to the current ~290 kB / ~91 kB gzip **initial** load (see
  "Current bundle baseline" above); a material jump in the initial chunk
  without a matching new feature is worth investigating before merging. New
  page-level code should land in its own lazy route chunk (see "Route-level
  code splitting"), not the initial bundle.
- CSS: stay close to the current ~16 kB / ~4 kB gzip; most future growth
  should be per-component CSS Modules, not global stylesheet growth.
- No new runtime dependency (CMS SDK, animation library, analytics) without
  re-measuring its bundle impact against these numbers first.
- No content page should ever ship the full `src/data/*` dataset to the
  client once real data replaces the empty arrays — see Future
  content-loading strategy above.
- No layout shift from dynamic UI (countdown, future badges/labels) —
  verify with fixed-width/tabular-nums techniques before shipping, not after.

## Future scalability considerations

- The architecture avoids coupling to Marvel/Avengers specifically so
  Doomsday can host unrelated future content or projects under the same
  shell.
- Hosting can move off GitHub Pages later (the static build has no
  dependency on GitHub-specific features).
- State management, animation libraries, analytics, and similar dependencies
  are deliberately not installed yet — they should be added only when a
  concrete feature needs them.
