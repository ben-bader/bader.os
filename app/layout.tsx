import type { Metadata, Viewport } from 'next'
import { Geist, Inter } from 'next/font/google'
import './globals.css'
import { identity } from '@/lib/content'
import SkipLink from '@/components/ui/SkipLink'

const display = Geist({
  variable: '--font-display',
  subsets:  ['latin'],
  display:  'swap',
})

const bodyFont = Inter({
  variable: '--font-body',
  subsets:  ['latin'],
  display:  'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://baderbennani.dev'),
  title: {
    default:  'Bader Bennani — Computer Engineering Student',
    template: '%s | Bader Bennani',
  },
  description:
    'Computer Engineering student at EILCO in Calais, France. Building scalable full-stack applications with Spring Boot, Next.js, Laravel, and PostgreSQL.',
  keywords: [
    'Bader Bennani',
    'Computer Engineering Student',
    'Full Stack Developer',
    'Spring Boot',
    'Next.js',
    'React',
    'France',
    'EILCO',
    'Microservices',
    'PostgreSQL',
    'Laravel',
  ],
  authors:  [{ name: 'Bader Bennani', url: 'https://github.com/ben-bader' }],
  creator:  'Bader Bennani',
  openGraph: {
    type:        'website',
    url:         'https://baderbennani.dev',
    title:       'Bader Bennani — Computer Engineering Student',
    description: 'Building scalable full-stack applications. Spring Boot · Next.js · Laravel · PostgreSQL.',
    siteName:    'Bader Bennani',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Bader Bennani — Computer Engineering Student',
    description: 'Building scalable full-stack applications. Spring Boot · Next.js · Laravel · PostgreSQL.',
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:              true,
      follow:             true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet':       -1,
    },
  },
}

export const viewport: Viewport = {
  colorScheme:  'dark',
  themeColor:   '#020204',
  width:        'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type':    'Person',
    name:       identity.name,
    jobTitle:   identity.title,
    url:        'https://baderbennani.dev',
    email:      identity.email,
    address:    { '@type': 'PostalAddress', addressLocality: 'Calais', addressCountry: 'FR' },
    sameAs:     [identity.github, identity.linkedin],
    knowsAbout: [
      'JavaScript', 'TypeScript', 'Java', 'PHP',
      'React', 'Next.js', 'Spring Boot', 'Laravel',
      'PostgreSQL', 'MySQL', 'SQLite', 'MongoDB',
      'Docker', 'RabbitMQ', 'REST APIs', 'Microservices',
    ],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name:    'École Supérieure de Technologie – Meknès',
    },
  }

  return (
    <html
      lang="en"
      className={`${display.variable} ${bodyFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body>
        <SkipLink />
        {children}
      </body>
    </html>
  )
}
