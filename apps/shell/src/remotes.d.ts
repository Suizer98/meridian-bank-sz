declare module 'accounts/Dashboard' {
  import type { ComponentType, ReactNode } from 'react'
  export const Dashboard: ComponentType<{ onNewTransfer: () => void; greetingControls: ReactNode }>
}

declare module 'payments/TransferDialog' {
  import type { ComponentType } from 'react'
  export const TransferDialog: ComponentType<{ onClose: () => void }>
}
