import React, { createContext, useContext, useEffect, useState } from 'react'

export type ThemeMode = 'dark' | 'light' | 'ocean' | 'emerald'

export interface ThemeOption {
  id: ThemeMode
  name: string
  description: string
  accentColor: string
  bgPreview: string
  isDark: boolean
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'dark',
    name: 'Cyber Command',
    description: 'High-tech dark operations center with electric cyan accents',
    accentColor: '#22d3ee',
    bgPreview: '#050b16',
    isDark: true,
  },
  {
    id: 'light',
    name: 'Executive Light',
    description: 'Clean municipal enterprise dashboard with high contrast',
    accentColor: '#0284c7',
    bgPreview: '#f8fafc',
    isDark: false,
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    description: 'Hydraulic navy & maritime indigo with aqua highlights',
    accentColor: '#38bdf8',
    bgPreview: '#030b1c',
    isDark: true,
  },
  {
    id: 'emerald',
    name: 'Eco Smart City',
    description: 'Sustainable urban drainage with radiant emerald accents',
    accentColor: '#10b981',
    bgPreview: '#04130f',
    isDark: true,
  },
]

interface ThemeContextType {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  currentThemeConfig: ThemeOption
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = 'draintwin-theme-mode'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode
      if (saved && THEME_OPTIONS.some((t) => t.id === saved)) {
        return saved
      }
    } catch {
      // ignore
    }
    return 'dark'
  })

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // ignore
    }

    const root = document.documentElement
    root.setAttribute('data-theme', theme)

    const isCurrentDark = theme !== 'light'
    if (isCurrentDark) {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
  }, [theme])

  const currentThemeConfig = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0]
  const isDark = theme !== 'light'

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentThemeConfig, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
