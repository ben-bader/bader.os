import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    spacing: { 1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '24px', 6: '32px', 7: '48px', 8: '64px', 9: '96px', 10: '128px', 11: '192px' },
    extend: { colors: { base: 'var(--bg-base)', elevated: 'var(--bg-elevated)', ink: 'var(--ink-primary)', accent: 'var(--accent)' }, borderRadius: { panel: '24px', pill: '999px' } },
  },
}

export default config
