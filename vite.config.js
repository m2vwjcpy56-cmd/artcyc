import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { readFileSync } from 'node:fs';

// Build-Konstanten — werden zur Build-Zeit ins Bundle injiziert.
// Damit zeigt die App Version + Build-Datum in den Einstellungen an.
// (Lesen via fs statt JSON-Import-Attribute, damit's auf älteren
// Node-Versionen ohne `with { type: 'json' }`-Support funktioniert.)
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const APP_VERSION = pkg.version;
const BUILD_DATE = new Date().toISOString().slice(0, 10);

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(APP_VERSION),
    __BUILD_DATE__: JSON.stringify(BUILD_DATE),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'ArtCyc Coach',
        short_name: 'ArtCyc',
        description: 'Trainings- und Wettkampf-Tool für Kunstradsport',
        lang: 'de',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#F2F2F7',
        theme_color: '#0F172A',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallbackDenylist: [/^\/api/],
        // SW soll sich SOFORT aktivieren wenn neue Version da ist —
        // ohne dass der User die App schließen + wieder öffnen muss.
        skipWaiting: true,
        clientsClaim: true,
        // Cache-First nur für externe (CDN) Assets, eigene Assets sind
        // Network-First damit Updates sofort durchschlagen.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-pdfjs',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    host: true
  }
});
