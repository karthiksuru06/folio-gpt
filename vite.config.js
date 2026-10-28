import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Warns at build time when the contact form has no key.
 *
 * Vite statically inlines `import.meta.env.VITE_*` at build time, so an unset
 * key means the whole submit path is dead-code-eliminated from the bundle and
 * the form permanently renders its "not configured" fallback. That degrades
 * gracefully, but it is silent — this makes it visible in build output.
 */
const warnMissingFormKey = () => ({
  name: 'warn-missing-form-key',
  apply: 'build',
  buildStart() {
    if (!process.env.VITE_WEB3FORMS_KEY) {
      this.warn(
        'VITE_WEB3FORMS_KEY is not set — the contact form will show its ' +
          '"email me directly" fallback instead of sending. See .env.example.'
      )
    }
  },
})

export default defineConfig({
  plugins: [react(), warnMissingFormKey()],
  build: {
    rollupOptions: {
      output: {
        // Split vendor code so a copy change doesn't invalidate the cached
        // React/Framer bundles on every deploy.
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: false,
    include: ['src/**/*.{test,spec}.{js,jsx}', 'tests/unit/**/*.test.js'],
  },
})
