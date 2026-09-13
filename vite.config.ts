import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/kitaabghar/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Kitaabghar',
        short_name: 'Kitaabghar',
        description:
          "A local-first reading tracker with shelves, streaks, goals, and a year-in-review — no accounts, your data stays on your device.",
        start_url: '/kitaabghar/',
        scope: '/kitaabghar/',
        display: 'standalone',
        background_color: '#F4F4F6',
        theme_color: '#3556E8',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
