import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

/** Shared route shell: header + page outlet + footer, rendered once per route. */
export function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}
