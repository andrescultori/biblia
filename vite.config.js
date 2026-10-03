import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base relativa: funciona em GitHub Pages (user.github.io/timoteo-app/) e em qualquer subpasta.
export default defineConfig({
  base: './',
  plugins: [react()],
});
