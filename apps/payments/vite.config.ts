import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  server: { port: 5002, origin: 'http://localhost:5002' },
  publicDir: fileURLToPath(new URL('../shell/public', import.meta.url)),
  plugins: [
    react(),
    federation({
      name: 'payments',
      filename: 'remoteEntry.js',
      dts: false,
      exposes: {
        './TransferDialog': './src/features/transfer/TransferDialog.tsx',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        '@tanstack/react-query': { singleton: true },
      },
      bundleAllCSS: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('../../packages/shared/src', import.meta.url)),
    },
  },
})
