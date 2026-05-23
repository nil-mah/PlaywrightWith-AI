import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * HomePage — actions and selectors for the main dashboard / home page.
 */
export class HomePage extends BasePage {
  // ─── Locators ──────────────────────────────────────────────────────────────
  private readonly welcomeHeading: Locator;
  private readonly userMenu: Locator;
  private readonly logoutButton: Locator;
  private readonly navigationLinks: Locator;
  private readonly notificationBell: Locator;
  private readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeHeading = page.getByRole('heading', { level: 1 });
    this.userMenu = page.getByTestId('user-menu');
    this.logoutButton = page.getByRole('menuitem', { name: 'Log out' });
    this.navigationLinks = page.getByRole('navigation').getByRole('link');
    this.notificationBell = page.getByRole('button', { name: 'Notifications' });
    this.searchInput = page.getByRole('searchbox');
  }

  // ─── Navigation ────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.navigateTo('/');
    await this.waitForPageLoad();
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  async logout(): Promise<void> {
    await this.clickElement(this.userMenu);
    await this.clickElement(this.logoutButton);
  }

  async search(query: string): Promise<void> {
    await this.fillField(this.searchInput, query);
    await this.page.keyboard.press('Enter');
  }

  async openNotifications(): Promise<void> {
    await this.clickElement(this.notificationBell);
  }

  async clickNavLink(linkName: string): Promise<void> {
    await this.clickElement(this.page.getByRole('link', { name: linkName }));
  }

  // ─── Assertions ────────────────────────────────────────────────────────────

  async getWelcomeText(): Promise<string> {
    return this.getText(this.welcomeHeading);
  }

  async isLoaded(): Promise<boolean> {
    return this.isVisible(this.welcomeHeading);
  }

  async getNavLinks(): Promise<string[]> {
    return this.navigationLinks.allTextContents();
  }
}
