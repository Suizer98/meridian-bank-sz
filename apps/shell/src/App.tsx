import { lazy, Suspense, useState } from 'react'
import { Header } from './components/Header'
import { PreferencesProvider } from './features/preferences/PreferencesProvider'
import { SegmentSwitch } from './features/preferences/SegmentSwitch'

const Dashboard = lazy(() =>
  import('accounts/Dashboard').then((module) => ({ default: module.Dashboard })),
)

const TransferDialog = lazy(() =>
  import('payments/TransferDialog').then((module) => ({ default: module.TransferDialog })),
)

export default function App() {
  const [isTransferOpen, setTransferOpen] = useState(false)

  return (
    <PreferencesProvider>
      <Header />
      <main className="container page">
        <Suspense fallback={<p>Loading…</p>}>
          <Dashboard
            onNewTransfer={() => setTransferOpen(true)}
            greetingControls={<SegmentSwitch className="segment-switch-inline" />}
          />
        </Suspense>
      </main>
      {isTransferOpen && (
        <Suspense fallback={null}>
          <TransferDialog onClose={() => setTransferOpen(false)} />
        </Suspense>
      )}
    </PreferencesProvider>
  )
}
