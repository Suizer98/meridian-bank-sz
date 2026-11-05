import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useCustomer } from '../../api/queries'
import type { Segment } from '../../api/types'

export type Theme = 'light' | 'dark'

// Keep in sync with the inline script in index.html.
const THEME_KEY = 'meridian-theme'
const SEGMENT_KEY = 'meridian-segment'

interface Preferences {
  theme: Theme
  segment: Segment
  setTheme: (theme: Theme) => void
  setSegment: (segment: Segment) => void
}

const PreferencesContext = createContext<Preferences | null>(null)

// index.html has already resolved the theme (stored choice or system setting).
function readInitialTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

function readStoredSegment(): Segment | null {
  try {
    const value = localStorage.getItem(SEGMENT_KEY)
    return value === 'retail' || value === 'premium' ? value : null
  } catch {
    return null
  }
}

function store(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Storage can be unavailable (e.g. private mode); the choice still applies for this visit.
  }
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const customer = useCustomer()
  const [theme, setThemeState] = useState<Theme>(readInitialTheme)
  const [chosenSegment, setChosenSegment] = useState<Segment | null>(readStoredSegment)

  const segment = chosenSegment ?? customer.data?.segment ?? 'retail'

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    document.documentElement.dataset.segment = segment
  }, [segment])

  const value: Preferences = {
    theme,
    segment,
    setTheme: (next) => {
      store(THEME_KEY, next)
      setThemeState(next)
    },
    setSegment: (next) => {
      store(SEGMENT_KEY, next)
      setChosenSegment(next)
    },
  }

  return <PreferencesContext value={value}>{children}</PreferencesContext>
}

export function usePreferences(): Preferences {
  const context = useContext(PreferencesContext)
  if (!context) {
    throw new Error('usePreferences must be used inside PreferencesProvider')
  }
  return context
}
