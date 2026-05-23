/**
 * EnvHelper — single source of truth for reading environment variables.
 *
 * Benefits:
 *  • Fails fast with a clear message when a required variable is missing.
 *  • No test ever calls process.env directly, so renaming a var is a 1-line fix.
 *  • Typed getters prevent accidental string/undefined mistakes.
 */
export class EnvHelper {
  // ─── Required getters (throw if missing) ───────────────────────────────────

  static getBaseUrl(): string {
    return EnvHelper.require('BASE_URL');
  }

  static getApiBaseUrl(): string {
    return EnvHelper.get('API_BASE_URL') ?? EnvHelper.getBaseUrl();
  }

  static getTestUserEmail(): string {
    return EnvHelper.require('TEST_USER_EMAIL');
  }

  static getTestUserPassword(): string {
    return EnvHelper.require('TEST_USER_PASSWORD');
  }

  static getAdminEmail(): string {
    return EnvHelper.require('ADMIN_EMAIL');
  }

  static getAdminPassword(): string {
    return EnvHelper.require('ADMIN_PASSWORD');
  }

  static getApiKey(): string {
    return EnvHelper.require('API_KEY');
  }

  // ─── Optional getters (return undefined if missing) ────────────────────────

  static isCI(): boolean {
    return process.env.CI === 'true' || process.env.CI === '1';
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  private static require(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(
        `[EnvHelper] Required environment variable "${key}" is not set.\n` +
          `  • For local runs: add it to your .env file (see .env.example).\n` +
          `  • For CI: add it as a GitHub Actions secret.`,
      );
    }
    return value;
  }

  private static get(key: string): string | undefined {
    return process.env[key];
  }
}
