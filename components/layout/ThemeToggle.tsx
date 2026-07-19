'use client'

import { useContext } from 'react'
import { Moon, Sun } from 'lucide-react'
import { ThemeContext } from '@/components/providers/ThemeProvider'

export function ThemeToggle(): React.ReactElement | null {
  const context = useContext(ThemeContext)
  if (!context) return null
  const { theme, toggleTheme } = context
  const isDark = theme === 'dark'
  return <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}><Sun aria-hidden={!isDark} size={16} /><Moon aria-hidden={isDark} size={16} /></button>
}
