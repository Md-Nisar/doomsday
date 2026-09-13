import { Countdown, Explore, Hero } from '../components/sections'
import { Container, JsonLd, SectionHeading } from '../components/common'
import { useDocumentSeo } from '../hooks/useDocumentSeo'
import { seoConfig } from '../config/seo'
import { buildWebPageJsonLd, buildWebSiteJsonLd } from '../lib/seo'
import styles from './Home.module.css'

/** The production homepage: brand, live countdown, and a preview of the content platform. */
export function Home() {
  useDocumentSeo({ description: seoConfig.defaultDescription, path: '/' })

  return (
    <>
      <JsonLd data={buildWebSiteJsonLd()} />
      <JsonLd data={buildWebPageJsonLd({ path: '/' })} />
      <main id="main-content">
        <Hero />

        <Container as="section" className={styles.countdownSection}>
          <SectionHeading
            align="center"
            eyebrow="Release date"
            title="The wait, measured."
            description="Calculated live in your browser — down to the second."
          />
          <Countdown />
        </Container>

        <Explore />
      </main>
    </>
  )
}
