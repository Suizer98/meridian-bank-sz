import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('../../packages/shared/src', import.meta.url)),
      'accounts/Dashboard': fileURLToPath(
        new URL('../accounts/src/features/dashboard/Dashboard.tsx', import.meta.url),
      ),
      'payments/TransferDialog': fileURLToPath(
        new URL('../payments/src/features/transfer/TransferDialog.tsx', import.meta.url),
      ),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: [fileURLToPath(new URL('../../packages/shared/src/test/setup.ts', import.meta.url))],
    css: true,
    restoreMocks: true,
    testTimeout: 15_000,
    env: { TZ: 'Asia/Singapore' },
  },
})
