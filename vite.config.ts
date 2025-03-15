import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'docs',
  },
  base: '/vite-project/',  // Replace 'repository-name' with your actual repo name
})
