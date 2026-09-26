import { defineConfig } from 'vite'

function safeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

export default defineConfig({
  base: '/javalab/',
  server: {
    fs: {
      allow: ['..'],
    },
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: (chunk) => `assets/${safeName(chunk.name) || 'chunk'}-[hash].js`,
      },
    },
  },
})
