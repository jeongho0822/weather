import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    server: {
      port: 5173,
      open: true,
      strictPort: false
    },
    build: {
      target: 'esnext',
      minify: 'terser',
      outDir: 'dist',
      assetsDir: 'assets',
      terserOptions: {
        compress: {
          drop_console: false
        }
      }
    },
    envPrefix: 'VITE_',
    plugins: [
      {
        name: 'inject-config',
        transformIndexHtml(html) {
          return html.replace(
            'YOUR_PLACEHOLDER',
            env.VITE_WEATHER_API_KEY || 'YOUR_OPENWEATHERMAP_API_KEY'
          );
        }
      }
    ]
  };
});
