import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  server: { port: 5000, origin: 'http://localhost:5000' },
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        accounts: {
          type: 'module',
          name: 'accounts',
          entry: 'http://localhost:5001/remoteEntry.js',
        },
        payments: {
          type: 'module',
          name: 'payments',
          entry: 'http://localhost:5002/remoteEntry.js',
        },
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        '@tanstack/react-query': { singleton: true },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('../../packages/shared/src', import.meta.url)),
    },
  },
})
