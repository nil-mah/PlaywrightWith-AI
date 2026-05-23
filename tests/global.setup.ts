import { test as setup, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { EnvHelper } from '../src/helpers/EnvHelper';
import { LoginPage } from '../src/pages/LoginPage';

const authFile = path.join(__dirname, '../.auth/user.json');

/**
 * global.setup.ts — runs once before all UI tests.
 * Logs in, saves the authenticated browser state to .auth/user.json,
 * so every UI test starts already authenticated (no re-login per test).
 *
 * The .auth/ directory is in .gitignore — credentials never leave the machine.
 */
setup('authenticate', async ({ page }) => {
  // Ensure .auth directory exists
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(EnvHelper.getTestUserEmail(), EnvHelper.getTestUserPassword());

  // Wait until we're past the login page
  await expect(page).not.toHaveURL(/.*login.*/);

  // Save the authenticated storage state
  await page.context().storageState({ path: authFile });
});
