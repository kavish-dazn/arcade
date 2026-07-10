import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@styles/mixins" as *; @use "@styles/colors" as *;`,
      },
    },
  },
  resolve: {
    alias: [
      {
        find: '@pages',
        replacement: '/src/pages',
      },
      {
        find: '@focus',
        replacement: '/src/focus',
      },
      {
        find: '@router',
        replacement: '/src/router',
      },
      {
        find: '@styles',
        replacement: '/src/styles',
      }
    ]
  }
})
