export type ThemeName = 'light' | 'dark'

export const sceneTokens: Record<ThemeName, { background: string; foreground: string; accent: string; fog: string }> = {
  light: { background: '#F7F5F2', foreground: '#14161A', accent: '#3B5BFF', fog: '#E7ECFF' },
  dark: { background: '#0D0F14', foreground: '#F2F1ED', accent: '#6C87FF', fog: '#14171E' },
}
