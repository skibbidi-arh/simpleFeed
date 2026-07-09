import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      '/auth': 'http://localhost:8000',
      '/feed': 'http://localhost:8000',
      '/upload': 'http://localhost:8000',
      '/posts': 'http://localhost:8000',
      '/users': 'http://localhost:8000',
    }
  }
})
