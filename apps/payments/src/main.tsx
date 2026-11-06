import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { setupWorker } from 'msw/browser'
import { handlers } from '@shared/mocks/handlers'
import '../../shell/src/index.css'
import { TransferDialog } from './features/transfer/TransferDialog'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
})

const worker = setupWorker(...handlers)

void worker.start({ onUnhandledRequest: 'bypass' }).then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <TransferDialog onClose={() => {}} />
      </QueryClientProvider>
    </StrictMode>,
  )
})
