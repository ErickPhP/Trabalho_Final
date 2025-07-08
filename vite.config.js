import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'; // Essa linha
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
