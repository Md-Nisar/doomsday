import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  /**
   * Relative, not '/'. The production canonical domain
   * (avengers-doomsday.in, via public/CNAME) serves the built app from its
   * own root, where relative and absolute asset paths behave identically.
   * But GitHub Pages ALSO always serves a project repo's Pages build at its
   * own github.io/<repo> subpath regardless of a configured custom domain —
   * with an absolute '/assets/...' base (Vite's default), index.html
   * requested from that subpath asks the browser for assets at the
   * *domain* root instead of the subpath, which 404s and renders a blank
   * page. A relative base makes every asset URL resolve against wherever
   * index.html itself was actually served from, so both URLs load their
   * JS/CSS correctly without hardcoding '/doomsday/' anywhere.
   */
  base: './',
})
