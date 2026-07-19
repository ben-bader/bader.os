import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'
import { profile, socials } from '@/content/data'
import { AppProviders } from '@/components/providers/AppProviders'

const display = Fraunces({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
})

const body = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://baderbennani.dev'),
  title: {
    default: 'Bader Bennani — Full-Stack Engineer & Software Architecture',
    template: '%s | Bader Bennani — Full-Stack Engineer',
  },
  description:
    'Full-stack engineer specializing in React, Next.js, Laravel, and Spring Boot, with a focus on secure, scalable application architecture. Based in Meknès, Morocco.',
  openGraph: {
    type: 'website',
    title: 'Bader Bennani — Full-Stack Engineer & Software Architecture',
    description:
      'Full-stack engineer specializing in React, Next.js, Laravel, and Spring Boot, with a focus on secure, scalable application architecture.',
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: '#F7F5F2',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: 'Full-Stack Software Engineer',
    url: 'https://baderbennani.dev',
    sameAs: [socials.github.url, socials.linkedin.url],
    alumniOf: 'École Supérieure de Technologie – Meknès',
  }

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
        <a className="skip-link" href="#main">Skip to content</a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
