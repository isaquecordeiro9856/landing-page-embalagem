import { useSmoothScroll } from './lib/useSmoothScroll'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Brand from './components/Brand'
import Flow from './components/Flow'
import Categories from './components/Categories'
import Catalog from './components/Catalog'
import Differentials from './components/Differentials'
import Showcase from './components/Showcase'
import CTA from './components/CTA'
import Footer from './components/Footer'

export default function App() {
  useSmoothScroll()

  return (
    <>
      <Loader />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Brand />
        <Flow />
        <Categories />
        <Catalog />
        <Differentials />
        <Showcase />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
