'use client'

import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import type { ThemeName } from '@/lib/tokens'

type ThemeContextValue = { theme: ThemeName; toggleTheme: () => void }
export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [theme, setTheme] = useState<ThemeName>('light')

  useEffect(() => {
    const saved = window.localStorage.getItem('theme') as ThemeName | null
    const initial = saved === 'light' || saved === 'dark' ? saved : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const frame = window.requestAnimationFrame(() => setTheme(initial))
    document.documentElement.dataset.theme = initial
    return () => window.cancelAnimationFrame(frame)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'light' ? 'dark' : 'light'
      document.documentElement.dataset.theme = next
      window.localStorage.setItem('theme', next)
      return next
    })
  }, [])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
