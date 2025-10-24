import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/astore/', // GitHub Pages 仓库名
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
