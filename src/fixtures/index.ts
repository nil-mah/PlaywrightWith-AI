import { test as base, type APIRequestContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { ApiClient } from '../api/ApiClient';
import { EnvHelper } from '../helpers/EnvHelper';

// ─── Fixture type definitions ─────────────────────────────────────────────────

interface UiFixtures {
  loginPage: LoginPage;
  homePage: HomePage;
  authenticatedPage: HomePage; // Home page with an already-logged-in session
}

interface ApiFixtures {
  apiClient: ApiClient;
  authenticatedApiClient: ApiClient; // Pre-authenticated API client
}

type AllFixtures = UiFixtures & ApiFixtures;

// ─── Extended test object ─────────────────────────────────────────────────────

/**
 * `test` — drop-in replacement for Playwright's built-in `test`.
 * Import this everywhere instead of `@playwright/test`.
 *
 * Available fixtures:
 *   loginPage, homePage, authenticatedPage   ← UI
 *   apiClient, authenticatedApiClient         ← API
 */
export const test = base.extend<AllFixtures>({
  // ── UI Fixtures ─────────────────────────────────────────────────────────────

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  /**
   * Provides a HomePage where the user is already logged in.
   * Reads credentials from env — never hard-coded.
   */
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(EnvHelper.getTestUserEmail(), EnvHelper.getTestUserPassword());
    const homePage = new HomePage(page);
    await homePage.waitForPageLoad();
    await use(homePage);
  },

  // ── API Fixtures ─────────────────────────────────────────────────────────────

  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request as APIRequestContext));
  },

  /**
   * Provides an ApiClient with a Bearer token obtained via the auth endpoint.
   * The token is fetched once per test; no credential is hard-coded.
   */
  authenticatedApiClient: async ({ request }, use) => {
    const client = new ApiClient(request as APIRequestContext);
    // Perform login to get a token (adapt the endpoint/payload to your app)
    const response = await client.post<{ token: string }>('/auth/login', {
      email: EnvHelper.getTestUserEmail(),
      password: EnvHelper.getTestUserPassword(),
    });
    const token = response.body.token;
    await use(client.withBearerToken(token));
  },
});

// Re-export expect so tests only import from this file
export { expect } from '@playwright/test';
