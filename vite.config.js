import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    open: true,
    strictPort: false
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    outDir: 'dist',
    assetsDir: 'assets'
  },
  // 환경변수 prefix 설정
  envPrefix: 'VITE_'
});
