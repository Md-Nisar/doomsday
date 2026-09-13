import { Header } from '../components/layout'
import { CountdownPreview } from '../components/sections'
import { Badge, Button, Card, Container, Divider, SectionHeading, StatusBadge, Surface } from '../components/common'
import { siteConfig } from '../config/site'
import styles from './StyleGuide.module.css'

const COLOR_TOKENS = [
  { name: 'Background', variable: '--color-bg' },
  { name: 'Surface', variable: '--color-surface' },
  { name: 'Surface Elevated', variable: '--color-surface-elevated' },
  { name: 'Border', variable: '--color-border-strong' },
  { name: 'Foreground', variable: '--color-foreground' },
  { name: 'Text Muted', variable: '--color-text-muted' },
  { name: 'Accent', variable: '--color-accent' },
  { name: 'Warning', variable: '--color-warning' },
  { name: 'Success / Confirmed', variable: '--color-success' },
]

const TYPE_SCALE = [
  { className: 'text-display', label: 'Display', sample: 'THE COUNTDOWN HAS BEGUN.' },
  { className: 'text-h1', label: 'Heading 1', sample: 'Avengers: Doomsday' },
  { className: 'text-h2', label: 'Heading 2', sample: 'Latest updates' },
  { className: 'text-h3', label: 'Heading 3', sample: 'Cast & characters' },
  { className: 'text-subheading', label: 'Subheading', sample: 'An unofficial countdown, built for the fans.' },
  { className: 'text-body', label: 'Body', sample: 'Body copy stays highly readable at every size, in every theme.' },
  { className: 'text-caption', label: 'Caption', sample: 'Supporting detail or secondary information.' },
  { className: 'text-label', label: 'Label', sample: 'Section Label' },
  { className: 'text-metadata', label: 'Metadata', sample: 'Updated 2 hours ago' },
]

const CARD_KINDS = ['News', 'Trailer', 'Character', 'Theory']

const SPACING_STEPS = [1, 2, 3, 4, 5, 6, 7, 8]

/**
 * Internal design-system reference for Phase 2. Not the production
 * homepage — no live countdown, no real content, no routing.
 */
export function StyleGuide() {
  return (
    <>
      <Header />
      <main id="main-content" className={styles.page}>
        <Container className={styles.intro}>
          <span className="text-label">Internal — Design System</span>
          <h1 className="text-display">Avengers: Doomsday</h1>
          <p className={`text-subheading ${styles.introText}`}>
            A visual language reference for the Avengers: Doomsday project. Not the production
            homepage.
          </p>
        </Container>

        <Container as="section" className={styles.section}>
          <SectionHeading
            eyebrow="Foundation"
            title="Color system"
            description="A restrained, dark palette. The accent is used sparingly."
          />
          <div className={styles.colorGrid}>
            {COLOR_TOKENS.map((token) => (
              <Surface key={token.variable} className={styles.swatchCard}>
                <span className={styles.swatch} style={{ background: `var(${token.variable})` }} />
                <span className="text-caption">{token.name}</span>
                <span className="text-metadata">{token.variable}</span>
              </Surface>
            ))}
          </div>
        </Container>

        <Divider />

        <Container as="section" className={styles.section}>
          <SectionHeading
            eyebrow="Foundation"
            title="Typography"
            description="Space Grotesk for display and headings, Inter for body and UI text."
          />
          <div className={styles.typeScale}>
            {TYPE_SCALE.map((item) => (
              <div key={item.label} className={styles.typeRow}>
                <span className="text-label">{item.label}</span>
                <span className={item.className}>{item.sample}</span>
              </div>
            ))}
          </div>
        </Container>

        <Divider />

        <Container as="section" className={styles.section}>
          <SectionHeading eyebrow="Components" title="Buttons" />
          <div className={styles.row}>
            <Button variant="primary">Primary action</Button>
            <Button variant="secondary">Secondary action</Button>
            <Button variant="ghost">Ghost action</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </Container>

        <Divider />

        <Container as="section" className={styles.section}>
          <SectionHeading
            eyebrow="Components"
            title="Status & badges"
            description="Confirmed, rumor, and theory are distinguished by icon and label, not color alone."
          />
          <div className={styles.row}>
            <StatusBadge status="confirmed" />
            <StatusBadge status="rumor" />
            <StatusBadge status="theory" />
            <Badge tone="neutral">Neutral</Badge>
          </div>
        </Container>

        <Divider />

        <Container as="section" className={styles.section}>
          <SectionHeading
            eyebrow="Components"
            title="Cards"
            description="A shared surface for future news, trailers, cast, and theory content."
          />
          <div className={styles.cardGrid}>
            {CARD_KINDS.map((kind) => (
              <Card key={kind} interactive>
                <span className="text-label">{kind}</span>
                <h3 className="text-h3">Card title placeholder</h3>
                <p className="text-caption">Supporting description text for a future {kind.toLowerCase()} card.</p>
              </Card>
            ))}
          </div>
        </Container>

        <Divider />

        <Container as="section" className={styles.section}>
          <SectionHeading
            eyebrow="Direction"
            title="Countdown"
            description="A static preview of the visual language. The live countdown ships in Phase 3."
          />
          <CountdownPreview />
        </Container>

        <Divider />

        <Container as="section" className={styles.section}>
          <SectionHeading
            eyebrow="Foundation"
            title="Surfaces & motion"
            description="Restrained elevation and slow, ambient movement. Respects reduced motion."
          />
          <div className={styles.row}>
            <Surface level="base" className={styles.surfaceDemo}>
              <span className="text-caption">Base surface</span>
            </Surface>
            <Surface level="elevated" className={styles.surfaceDemo}>
              <span className="text-caption">Elevated surface</span>
            </Surface>
            <Surface level="elevated" className={`${styles.surfaceDemo} ambient-glow`}>
              <span className="text-caption">Ambient glow</span>
            </Surface>
          </div>
        </Container>

        <Divider />

        <Container as="section" className={styles.section}>
          <SectionHeading eyebrow="Foundation" title="Spacing scale" />
          <div className={styles.spacingScale}>
            {SPACING_STEPS.map((step) => (
              <div key={step} className={styles.spacingRow}>
                <span className="text-metadata">{`--space-${step}`}</span>
                <span className={styles.spacingBar} style={{ width: `var(--space-${step})` }} />
              </div>
            ))}
          </div>
        </Container>

        <Divider />

        <Container as="footer" className={styles.footer}>
          <p className="text-caption">{siteConfig.disclaimer}</p>
        </Container>
      </main>
    </>
  )
}
