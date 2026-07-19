'use client'

import { LenisProvider } from '@/components/providers/LenisProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ThemeProvider><LenisProvider>{children}</LenisProvider></ThemeProvider>
}
