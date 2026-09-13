export interface SiteConfig {
  siteName: string
  domain: string
  description: string
  releaseDate: string
  disclaimer: string
  social: {
    twitter?: string
    instagram?: string
    ogImage?: string
  }
}
