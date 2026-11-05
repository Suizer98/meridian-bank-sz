import { Moon, Sun } from 'lucide-react'
import { usePreferences } from './PreferencesProvider'

export function ThemeToggle() {
  const { theme, setTheme } = usePreferences()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="icon-button"
      aria-label="Dark mode"
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <Moon size={20} aria-hidden="true" /> : <Sun size={20} aria-hidden="true" />}
    </button>
  )
}
