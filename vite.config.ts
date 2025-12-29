import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import { rmSync } from 'node:fs';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isServe = command === 'serve';
  const isBuild = command === 'build';
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;

  if (isBuild) {
    rmSync('dist-electron', { recursive: true, force: true });
  }

  return {
    plugins: [
      react(),
      electron([
        {
          // Main process entry
          entry: 'electron/main.ts',
          onstart(args) {
            if (process.env.VSCODE_DEBUG) {
              console.log('[startup] Electron App');
            } else {
              args.startup();
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron/main',
              rollupOptions: {
                external: ['better-sqlite3', 'electron']
              }
            }
          }
        },
        {
          // Preload script
          entry: 'electron/preload.ts',
          onstart(args) {
            args.reload();
          },
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined,
              minify: isBuild,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external: ['electron']
              }
            }
          }
        }
      ])
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    build: {
      outDir: 'dist-renderer',
      sourcemap
    },
    server: {
      port: 5173,
      strictPort: true
    },
    clearScreen: false
  };
});
