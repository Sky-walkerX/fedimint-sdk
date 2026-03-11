import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import wasm from 'vite-plugin-wasm'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), wasm()],

  // These worker settings are required
  worker: {
    format: 'es',
    plugins: () => [
      wasm(), // Required for wasm
    ],
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    minify: false,
  },
  optimizeDeps: {
    exclude: ['@fedimint/core', '@fedimint/transport-web'],
  },
})
