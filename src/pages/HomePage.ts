import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Home Page Object Model
 * Handles home page functionality and featured events
 */
export class HomePage extends BasePage {
  // Navigation locators
  readonly logoLink: Locator;
  readonly homeNavLink: Locator;
  readonly eventsNavLink: Locator;
  readonly myBookingsNavLink: Locator;
  readonly apiDocsNavLink: Locator;
  readonly adminButton: Locator;
  readonly userEmailDisplay: Locator;
  readonly logoutButton: Locator;

  // Main content locators
  readonly mainHeading: Locator;
  readonly browseEventsButton: Locator;
  readonly myBookingsButton: Locator;
  readonly featuredEventsSection: Locator;
  readonly exploreAllEventsButton: Locator;

  // Event cards
  readonly eventCards: Locator;
  readonly eventBookNowButtons: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation locators
    this.logoLink = page.getByRole('link', { name: /eventhub/i }).first();
    this.homeNavLink = page.getByRole('link', { name: /^Home$/i });
    this.eventsNavLink = page.getByRole('link', { name: /^Events$/i });
    this.myBookingsNavLink = page.getByRole('link', { name: /^My Bookings$/i });
    this.apiDocsNavLink = page.getByRole('link', { name: /^API Docs$/i });
    this.adminButton = page.getByRole('button', { name: /admin/i });
    this.logoutButton = page.getByRole('button', { name: /logout/i });

    // Main content locators
    this.mainHeading = page.getByRole('heading', { name: /discover & book amazing events/i });
    this.browseEventsButton = page.getByRole('link', { name: /browse events/i }).first();
    this.myBookingsButton = page.getByRole('button', { name: /my bookings/i }).first();
    this.featuredEventsSection = page.getByRole('heading', { name: /featured events/i });
    this.exploreAllEventsButton = page.getByRole('button', { name: /explore all events/i });

    // Event cards
    this.eventCards = page.locator('article');
    this.eventBookNowButtons = page.getByRole('link', { name: /book now/i });
  }

  /**
   * Navigate to home page
   */
  async navigateToHomePage(): Promise<void> {
    await this.goto('/');
  }

  /**
   * Wait for home page to load
   */
  async waitForHomePageToLoad(): Promise<void> {
    await this.waitForElement(this.mainHeading);
  }

  /**
   * Click on Browse Events button
   */
  async clickBrowseEvents(): Promise<void> {
    await this.clickElement(this.browseEventsButton);
  }

  /**
   * Click on My Bookings button
   */
  async clickMyBookings(): Promise<void> {
    await this.clickElement(this.myBookingsButton);
  }

  /**
   * Navigate to Events page via nav link
   */
  async navigateToEventsViaNav(): Promise<void> {
    await this.clickElement(this.eventsNavLink);
  }

  /**
   * Navigate to My Bookings page via nav link
   */
  async navigateToMyBookingsViaNav(): Promise<void> {
    await this.clickElement(this.myBookingsNavLink);
  }

  /**
   * Click Admin button
   */
  async clickAdminButton(): Promise<void> {
    await this.clickElement(this.adminButton);
  }

  /**
   * Click logout button
   */
  async logout(): Promise<void> {
    await this.clickElement(this.logoutButton);
  }

  /**
   * Click explore all events button
   */
  async clickExploreAllEvents(): Promise<void> {
    await this.clickElement(this.exploreAllEventsButton);
  }

  /**
   * Get count of featured event cards
   */
  async getFeaturedEventCount(): Promise<number> {
    return await this.eventCards.count();
  }

  /**
   * Get event title by index
   */
  async getEventTitleByIndex(index: number): Promise<string> {
    const eventTitle = this.eventCards.nth(index).locator('h3');
    return await this.getText(eventTitle);
  }

  /**
   * Click on event card by event name
   */
  async clickEventByName(eventName: string): Promise<void> {
    const eventLink = this.page.getByRole('link', { name: eventName }).first();
    await this.clickElement(eventLink);
  }

  /**
   * Click Book Now button by event index
   */
  async clickBookNowByIndex(index: number): Promise<void> {
    await this.eventBookNowButtons.nth(index).click();
  }

  /**
   * Verify home page is displayed
   */
  async isHomePageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.mainHeading);
  }

  /**
   * Get user email from display
   */
  async getUserEmail(): Promise<string> {
    return await this.getText(this.userEmailDisplay);
  }

  /**
   * Check if logout button is visible
   */
  async isLogoutButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.logoutButton);
  }

  /**
   * Check if featured events section is visible
   */
  async isFeaturedEventsSectionVisible(): Promise<boolean> {
    return await this.isElementVisible(this.featuredEventsSection);
  }
}
