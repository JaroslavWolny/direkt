import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string }

// Čas sestavení v „O aplikaci" — na telefonu podle něj poznáš, že už běží nová verze.
const built = new Date().toLocaleString('cs-CZ', {
  timeZone: 'Europe/Prague', // Vercel sestavuje v UTC
  day: 'numeric',
  month: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(`${version} (${built})`) },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'DIREKT',
        short_name: 'DIREKT',
        description: 'Trenér na boxovací pytel — hlas hlásí komba čísly.',
        lang: 'cs',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#f3f2ee',
        theme_color: '#f3f2ee',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,mp3,ico,woff2}'],
        // Navigace jde z precache (cache-first) — v gymu bez signálu nesmí start viset (R12).
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],
})
