import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  // O site é publicado em https://erick-das.github.io/TCC-multi-view/
  base: '/TCC-multi-view/',
  plugins: [svelte()],
  build: { target: 'es2022' },
})
