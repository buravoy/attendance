import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'esnext' //browsers can handle the latest ES features
  },
  server: {
    port: 5566,
    allowedHosts: ['rburakevich.tecel.ru']
  }
})
