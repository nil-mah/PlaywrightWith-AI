/**
 * API Test Configuration
 * Extension to playwright.config.ts for API-specific tests
 */

import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env for local execution
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  // ─── Test Discovery ────────────────────────────────────────────────────────
  testDir: './tests',
  testMatch: ['**/*.spec.ts'],

  // ─── API Test Configuration ────────────────────────────────────────────────
  testTimeout: 30_000,                    // 30s timeout for API tests
  expect: {
    timeout: 5_000,                       // 5s for assertions
  },

  // ─── Execution ─────────────────────────────────────────────────────────────
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  timeout: 60_000,

  // ─── Reporters ─────────────────────────────────────────────────────────────
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/api-results.json' }],
  ],

  // ─── Shared Settings ───────────────────────────────────────────────────────
  use: {
    baseURL: process.env.BASE_URL || 'https://jsonplaceholder.typicode.com',
    headless: true,
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
  },

  // ─── Output ────────────────────────────────────────────────────────────────
  outputDir: 'test-results',
});
