import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// GitHub Pages serves project sites from /<repo-name>/, so the build base
// path is switched via an env flag set in the deploy workflow/script.
// Local dev and `vite preview` keep the root path.
export default defineConfig(({ mode }) => ({
  base: mode === 'gh-pages' ? '/msft-learning/' : '/',
  plugins: [react(), tailwindcss()],
}))
