import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env for local execution; CI injects secrets via environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  // ─── Test Discovery ────────────────────────────────────────────────────────
  testDir: './tests',
  testMatch: ['**/*.spec.ts'],

  // ─── Execution ─────────────────────────────────────────────────────────────
  fullyParallel: true,
  forbidOnly: !!process.env.CI,          // Prevent .only from being committed
  retries: process.env.CI ? 2 : 0,       // Retry twice on CI
  workers: process.env.CI ? 4 : undefined,
  timeout: 60_000,                        // 60 s per test
  expect: {
    timeout: 10_000,                      // 10 s for assertions
  },

  // ─── Reporters ─────────────────────────────────────────────────────────────
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  // ─── Shared Settings ───────────────────────────────────────────────────────
  use: {
    baseURL: process.env.BASE_URL,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    // Extra HTTP headers applied to all requests (e.g., for API tests)
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
  },

  // ─── Output ────────────────────────────────────────────────────────────────
  outputDir: 'test-results',
});
