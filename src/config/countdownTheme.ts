export interface CountdownTheme {
  background: string
  surface: string
  accent: string
  text: string
  mutedText: string
  glow: string
  overlay: string
}

/**
 * Named, swappable palettes for the homepage countdown. Never hardcode a
 * color inside `Countdown.tsx`/`CountdownUnit` — those components only ever
 * read the `--countdown-*` custom properties this file produces (see
 * `toCountdownThemeVars`), each falling back to the site's default tokens
 * when unset, so nothing else on the site (badges, links, the red brand
 * accent) is affected by switching a theme here.
 *
 * `neutral` mirrors whatever the site's own brand tokens (`tokens.css`)
 * currently are — the safe fallback, tracking the global palette rather
 * than hardcoding a color of its own. `doom` is the dark-green,
 * Doctor-Doom-inspired treatment (now also the site-wide brand accent —
 * see `tokens.css`'s "Color: accent" — so `doom` and `neutral` currently
 * render the same; they're kept distinct so a future site-wide rebrand
 * doesn't silently change the countdown too): an original CSS gradient/grid
 * composition, not a copy of any Marvel artwork or official color key.
 *
 * Future extension points (not implemented this phase — see README's
 * "Countdown 2.0" section):
 *   release_week — a heightened variant for the final 7 days before
 *                   `siteConfig.releaseDate`.
 *   release_day  — a dedicated palette for the "Doomsday has arrived" state.
 * Adding either later only means adding an entry here and choosing when
 * `activeCountdownThemeName` resolves to it — no component rewrite.
 */
export const COUNTDOWN_THEMES = {
  doom: {
    background: 'radial-gradient(ellipse 120% 80% at 50% -10%, #12352a 0%, #06140f 45%, #030a08 100%)',
    surface: '#0d211a',
    accent: '#35d98f',
    text: '#eafff4',
    mutedText: '#9bc4b3',
    glow: 'rgba(53, 217, 143, 0.35)',
    overlay: 'rgba(4, 15, 11, 0.72)',
  },
  neutral: {
    background: 'var(--color-bg)',
    surface: 'var(--color-surface)',
    accent: 'var(--color-accent-solid)',
    text: 'var(--color-text-primary)',
    mutedText: 'var(--color-text-muted)',
    glow: 'rgba(var(--color-accent-rgb), 0.35)',
    overlay: 'var(--color-overlay)',
  },
} as const satisfies Record<string, CountdownTheme>

export type CountdownThemeName = keyof typeof COUNTDOWN_THEMES

/** Developer-set active theme — swap this key to change the homepage countdown's palette. */
export const activeCountdownThemeName: CountdownThemeName = 'doom'

export const activeCountdownTheme: CountdownTheme = COUNTDOWN_THEMES[activeCountdownThemeName]

/** Maps a `CountdownTheme` to the CSS custom properties `Countdown.module.css`/`CountdownUnit.module.css` read, scoped to whatever element this is applied to via inline `style`. */
export function toCountdownThemeVars(theme: CountdownTheme): Record<string, string> {
  return {
    '--countdown-bg': theme.background,
    '--countdown-surface': theme.surface,
    '--countdown-accent': theme.accent,
    '--countdown-text': theme.text,
    '--countdown-muted-text': theme.mutedText,
    '--countdown-glow': theme.glow,
    '--countdown-overlay': theme.overlay,
  }
}
