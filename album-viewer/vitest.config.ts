import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

// Keep Vitest (unit tests) separate from Playwright (e2e tests in ./tests).
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      exclude: ['**/node_modules/**', '**/dist/**', 'tests/**', '**/*.spec.ts']
    }
  })
)
