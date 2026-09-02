import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssTarget: 'chrome90',
    assetsInlineLimit: 2048,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // só o essencial é fatiado à mão; three, r3f e suas dependências
        // (react-reconciler, zustand…) ficam no chunk lazy do hero
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react'
          if (/node_modules\/(gsap|lenis)\//.test(id)) return 'motion'
        },
      },
    },
  },
})
