import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  server: { port: 5001, origin: 'http://localhost:5001' },
  publicDir: fileURLToPath(new URL('../shell/public', import.meta.url)),
  plugins: [
    react(),
    federation({
      name: 'accounts',
      filename: 'remoteEntry.js',
      dts: false,
      exposes: {
        './Dashboard': './src/features/dashboard/Dashboard.tsx',
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
