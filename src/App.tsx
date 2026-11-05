import { Header } from './components/Header'
import { Dashboard } from './features/dashboard/Dashboard'
import { PreferencesProvider } from './features/preferences/PreferencesProvider'

export default function App() {
  return (
    // Contexts provider
    <PreferencesProvider>
      <Header />
      <main className="container page">
        <Dashboard />
      </main>
    </PreferencesProvider>
  )
}
