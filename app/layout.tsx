import type { Metadata, Viewport } from 'next'
import './globals.css'
import { identity } from '@/lib/content'
import SkipLink from '@/components/ui/SkipLink'
import ExperienceRuntime from '@/components/experience/ExperienceRuntime'

export const metadata: Metadata = {
  metadataBase: new URL('https://baderbennani.dev'),
  title: {
    default: 'Bader Bennani — Computer Engineering Student',
    template: '%s | Bader Bennani',
  },
  description: 'Computer engineering student at EILCO in Calais, France. Explore software projects and experience across Spring Boot, Next.js, Laravel, and PostgreSQL.',
  keywords: [
    'Bader Bennani', 'Computer Engineering Student', 'Full Stack Developer',
    'Spring Boot', 'Next.js', 'React', 'France', 'EILCO', 'Microservices',
    'PostgreSQL', 'Laravel',
  ],
  authors: [{ name: 'Bader Bennani', url: identity.github }],
  creator: identity.name,
  openGraph: {
    type: 'website',
    url: 'https://baderbennani.dev',
    title: 'Bader Bennani — Computer Engineering Student',
    description: 'Software projects and experience across Spring Boot, Next.js, Laravel, and PostgreSQL.',
    siteName: 'Bader Bennani',
  },
  twitter: {
    card: 'summary',
    title: 'Bader Bennani — Computer Engineering Student',
    description: 'Software projects and experience across Spring Boot, Next.js, Laravel, and PostgreSQL.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#101315',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: identity.name,
    jobTitle: identity.title,
    url: 'https://baderbennani.dev',
    email: identity.email,
    address: { '@type': 'PostalAddress', addressLocality: 'Calais', addressCountry: 'FR' },
    sameAs: [identity.github, identity.linkedin],
    knowsAbout: [
      'JavaScript', 'TypeScript', 'Java', 'PHP', 'React', 'Next.js',
      'Spring Boot', 'Laravel', 'PostgreSQL', 'MySQL', 'SQLite', 'MongoDB',
      'Docker', 'RabbitMQ', 'REST APIs', 'Microservices',
    ],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'École Supérieure de Technologie — Meknès',
    },
  }

  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </head>
      <body>
        <SkipLink />
        <div className="portfolio-content">{children}</div>
        <ExperienceRuntime />
      </body>
    </html>
  )
}
