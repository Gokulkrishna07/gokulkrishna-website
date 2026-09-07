import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const ROUTE_AI = 'https://routeai-backend-btbb.onrender.com'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Loaded without the VITE_ prefix filter so the key stays server side.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./vitest.setup.js"],
      include: ["tests/**/*.test.{js,jsx}"],
      restoreMocks: true,
      // Cold starts are slow: each file spins up jsdom and pulls in mixpanel-browser.
      testTimeout: 20000,
      hookTimeout: 20000,
      coverage: {
        provider: "v8",
        reporter: ["text", "html"],
        include: ["src/**/*.{js,jsx}", "api/**/*.js"],
        thresholds: { lines: 100, functions: 100, branches: 100, statements: 100 },
      },
    },
    server: {
      proxy: {
        // The browser calls /api/chat; the key is attached here, in the dev server,
        // so it is never part of the client bundle.
        '/api/chat': {
          target: ROUTE_AI,
          changeOrigin: true,
          rewrite: () => '/api/v1/chat',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (env.ROUTEAI_API_KEY) proxyReq.setHeader('x-api-key', env.ROUTEAI_API_KEY)
            })
          },
        },
      },
    },
  }
})
