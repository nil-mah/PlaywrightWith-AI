import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login Page Object Model
 * Handles login functionality and related operations
 */
export class LoginPage extends BasePage {
  // Locators
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly signInButton: Locator;
  readonly registerLink: Locator;
  readonly pageHeading: Locator;
  readonly subtitleText: Locator;

  constructor(page: Page) {
    super(page);
    // Initialize locators using label-based and other selectors as per the test
    this.emailField = page.getByLabel('Email');
    this.passwordField = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: /sign in/i });
    this.registerLink = page.getByRole('link', { name: /register/i });
    this.pageHeading = page.getByRole('heading', { name: /sign in to eventhub/i });
    this.subtitleText = page.getByText('Enter your credentials to continue');
  }

  /**
   * Navigate to login page
   */
  async navigateToLoginPage(): Promise<void> {
    await this.goto('/login');
  }

  /**
   * Wait for login page to be loaded
   */
  async waitForLoginPageToLoad(): Promise<void> {
    await this.waitForElement(this.pageHeading);
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillField(this.emailField, email);
    await this.fillField(this.passwordField, password);
    await this.clickElement(this.signInButton);
  }

  /**
   * Fill email field
   */
  async enterEmail(email: string): Promise<void> {
    await this.fillField(this.emailField, email);
  }

  /**
   * Fill password field
   */
  async enterPassword(password: string): Promise<void> {
    await this.fillField(this.passwordField, password);
  }

  /**
   * Click Sign In button
   */
  async clickSignIn(): Promise<void> {
    await this.clickElement(this.signInButton);
  }

  /**
   * Click Register link to navigate to registration page
   */
  async clickRegister(): Promise<void> {
    await this.clickElement(this.registerLink);
  }

  /**
   * Verify login page is displayed
   */
  async isLoginPageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.pageHeading);
  }

  /**
   * Get email field placeholder
   */
  async getEmailPlaceholder(): Promise<string | null> {
    return await this.emailField.getAttribute('placeholder');
  }

  /**
   * Get password field placeholder
   */
  async getPasswordPlaceholder(): Promise<string | null> {
    return await this.passwordField.getAttribute('placeholder');
  }
}
