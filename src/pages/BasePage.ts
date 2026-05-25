import { Page, Locator } from '@playwright/test';

/**
 * Base Page class for common page functionality
 * Provides shared methods used across all page objects
 */
export class BasePage {
  readonly page: Page;
  readonly baseURL: string;

  constructor(page: Page, baseURL: string = 'https://eventhub.rahulshettyacademy.com') {
    this.page = page;
    this.baseURL = baseURL;
  }

  /**
   * Navigate to a specific URL
   */
  async goto(path: string): Promise<void> {
    await this.page.goto(`${this.baseURL}${path}`);
  }

  /**
   * Wait for a locator to be visible
   */
  async waitForElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
  }

  /**
   * Fill a text field
   */
  async fillField(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }

  /**
   * Click an element
   */
  async clickElement(locator: Locator): Promise<void> {
    await locator.click();
  }

  /**
   * Get text content of an element
   */
  async getText(locator: Locator): Promise<string> {
    return await locator.textContent() || '';
  }

  /**
   * Check if an element is visible
   */
  async isElementVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /**
   * Check if an element is enabled
   */
  async isElementEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  /**
   * Wait for navigation after an action
   */
  async waitForNavigation(callback: () => Promise<void>): Promise<void> {
    await Promise.all([this.page.waitForLoadState('networkidle'), callback()]);
  }

  /**
   * Get current URL
   */
  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Take a screenshot
   */
  async takeScreenshot(filename: string): Promise<Buffer> {
    return await this.page.screenshot({ path: `./screenshots/${filename}.png` });
  }
}
