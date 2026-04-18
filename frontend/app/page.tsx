import Navbar from '@/app/components/Navbar'
import Hero from '@/app/components/Hero'
import About from '@/app/components/About'
import MenuHighlights from '@/app/components/MenuHighlights'
import Gallery from '@/app/components/Gallery'
import OrderBand from '@/app/components/OrderBand'
import Location from '@/app/components/Location'
import Testimonials from '@/app/components/Testimonials'
import InstagramSection from '@/app/components/InstagramSection'
import Footer from '@/app/components/Footer'

/* Schema.org JSON-LD for local SEO */
const schemaData = {
  '@context': 'https://schema.org',
  '@type': 'CafeOrCoffeeShop',
  name: 'Kotta Kopi Ponorogo',
  description: 'Specialty coffee shop — Kopinya Anak Kota. Baru hadir di Ponorogo sejak 21 Maret 2026.',
  url: 'https://kottakopi.id',
  telephone: '+6281234567890',
  priceRange: 'Rp 14.000 – Rp 50.000',
  servesCuisine: ['Coffee', 'Bakery'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jl. [Nama Jalan No. XX]',
    addressLocality: 'Ponorogo',
    addressRegion: 'Jawa Timur',
    postalCode: '63411',
    addressCountry: 'ID',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -7.8660,
    longitude: 111.4638,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '22:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday', 'Sunday'], opens: '07:00', closes: '23:00' },
  ],
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '200' },
  sameAs: [
    'https://instagram.com/kottakopi',
    'https://tiktok.com/@kottakopigroup',
  ],
}

export default function HomePage() {
  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <Navbar />

      <main>
        <Hero />
        <About />
        <MenuHighlights />
        <Gallery />
        <OrderBand />
        <Location />
        <Testimonials />
        <InstagramSection />
      </main>

      <Footer />
    </>
  )
}
