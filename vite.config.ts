import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages serves project sites from a /<repo-name>/ subpath. The
// deploy workflow sets GH_PAGES=true so only that build uses it — local dev
// and any other host (Vercel/Netlify/Cloudflare Pages, which serve from
// root) are unaffected.
const base = process.env.GH_PAGES ? '/Hebrew-Learning-App/' : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/icon-192.svg', 'icons/icon-512.svg'],
      manifest: {
        name: 'Ivrit Avoda — Hebrew for Work & Life',
        short_name: 'Ivrit Avoda',
        description: 'Personalized Hebrew learning for construction/PM professionals moving to Israel.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        scope: base,
        icons: [
          {
            src: `${base}icons/icon-192.svg`,
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: `${base}icons/icon-512.svg`,
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: `${base}icons/icon-maskable.svg`,
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallbackDenylist: [/^\/supabase\//],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
})
