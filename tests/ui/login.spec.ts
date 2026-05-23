import { allure } from 'allure-playwright';
import { test, expect } from '../../src/fixtures';
import { DataHelper } from '../../src/helpers/DataHelper';
import { EnvHelper } from '../../src/helpers/EnvHelper';
import type { LoginTestCase } from '../../src/types';

/**
 * Login spec — demonstrates:
 *  • POM usage (LoginPage, HomePage)
 *  • Data-driven tests from CSV (no hard-coded values in test logic)
 *  • Credentials from env via EnvHelper
 *  • Allure annotations for rich reporting
 */

// Load CSV test data once (outside describe so it's computed at collection time)
const loginCases = DataHelper.loadCsv<LoginTestCase>('test-cases.csv');

test.describe('Login Page', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  // ── Happy path ──────────────────────────────────────────────────────────────

  test('should log in successfully with valid credentials', async ({ loginPage, homePage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login');
    await allure.story('Valid login');
    await allure.severity('critical');

    await loginPage.login(EnvHelper.getTestUserEmail(), EnvHelper.getTestUserPassword());

    await expect(homePage.page).not.toHaveURL(/.*login.*/);
    expect(await homePage.isLoaded()).toBe(true);
  });

  // ── Data-driven negative tests from CSV ────────────────────────────────────

  for (const { scenario, email, password, expectedResult, expectedError } of loginCases) {
    if (expectedResult === 'failure') {
      test(`should reject: ${scenario}`, async ({ loginPage }) => {
        await allure.epic('Authentication');
        await allure.feature('Login');
        await allure.story('Invalid login');
        await allure.severity('normal');
        await allure.parameter('scenario', scenario);
        await allure.parameter('email', email);

        await loginPage.login(email, password);

        // Should stay on the login page
        await expect(loginPage.page).toHaveURL(/.*login.*/);

        if (expectedError) {
          const errorText = await loginPage.getErrorMessage();
          expect(errorText).toContain(expectedError);
        } else {
          expect(await loginPage.isErrorVisible()).toBe(true);
        }
      });
    }
  }

  // ── Edge cases ─────────────────────────────────────────────────────────────

  test('should navigate to forgot-password page', async ({ loginPage }) => {
    await allure.feature('Login');
    await allure.story('Forgot password');
    await allure.severity('minor');

    await loginPage.clickForgotPassword();
    await expect(loginPage.page).toHaveURL(/.*forgot-password.*/);
  });
});
