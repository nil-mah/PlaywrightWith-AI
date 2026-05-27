import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Events Page Object Model (Browse Events)
 * Handles events listing, searching, and filtering
 */
export class EventsPage extends BasePage {
  // Navigation locators
  readonly logoutButton: Locator;
  readonly homeNavLink: Locator;
  readonly myBookingsNavLink: Locator;

  // Page header
  readonly pageHeading: Locator;
  readonly pageSubtitle: Locator;

  // Search and filter locators
  readonly searchInput: Locator;
  readonly categoryDropdown: Locator;
  readonly cityDropdown: Locator;

  // Event card locators
  readonly eventArticles: Locator;
  readonly eventTitles: Locator;
  readonly eventLinks: Locator;
  readonly bookNowButtons: Locator;

  // Additional buttons
  readonly addNewEventButton: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation locators
    this.logoutButton = page.getByRole('button', { name: /logout/i });
    this.homeNavLink = page.getByRole('link', { name: /^Home$/i });
    this.myBookingsNavLink = page.getByRole('link', { name: /^My Bookings$/i });

    // Page header
    this.pageHeading = page.getByRole('heading', { name: /upcoming events/i });
    this.pageSubtitle = page.getByText(/Find your next unforgettable experience/);

    // Search and filter locators
    this.searchInput = page.getByPlaceholder(/search events, venues/i);
    this.categoryDropdown = page.locator('select').first();
    this.cityDropdown = page.locator('select').nth(1);

    // Event card locators
    this.eventArticles = page.locator('article, [class*="event-card"], [class*="eventCard"], [role="article"]');
    this.eventTitles = page.locator('h3, h2, [class*="event-title"], [class*="eventTitle"]');
    this.eventLinks = page.locator('article a[href*="/events/"]').first();
    this.bookNowButtons = page.getByRole('link', { name: /book now/i });

    // Additional buttons
    this.addNewEventButton = page.getByRole('link', { name: /add new event/i });
  }

  /**
   * Navigate to events page
   */
  async navigateToEventsPage(): Promise<void> {
    await this.goto('/events');
  }

  /**
   * Wait for events page to load
   */
  async waitForEventsPageToLoad(): Promise<void> {
    await this.waitForElement(this.pageHeading);
    await this.waitForElement(this.searchInput);
  }

  /**
   * Search for events by keyword
   */
  async searchForEvent(searchTerm: string): Promise<void> {
    await this.fillField(this.searchInput, searchTerm);
    // Wait for search results to load
    await this.page.waitForTimeout(1500);
  }

  /**
   * Wait for search results to be visible
   */
  async waitForSearchResults(): Promise<void> {
    // Wait for at least one event article to be visible
    await this.page.waitForSelector('article, [class*="event-card"], [class*="eventCard"], [role="article"]', { timeout: 15000 });
  }

  /**
   * Clear search input
   */
  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
  }

  /**
   * Select category from dropdown
   */
  async selectCategory(categoryValue: string): Promise<void> {
    await this.categoryDropdown.selectOption(categoryValue);
  }

  /**
   * Select city from dropdown
   */
  async selectCity(cityValue: string): Promise<void> {
    await this.cityDropdown.selectOption(cityValue);
  }

  /**
   * Get selected category
   */
  async getSelectedCategory(): Promise<string | null> {
    return await this.categoryDropdown.inputValue();
  }

  /**
   * Get selected city
   */
  async getSelectedCity(): Promise<string | null> {
    return await this.cityDropdown.inputValue();
  }

  /**
   * Get count of displayed events
   */
  async getEventCount(): Promise<number> {
    return await this.eventArticles.count();
  }

  /**
   * Get all event titles
   */
  async getAllEventTitles(): Promise<string[]> {
    const count = await this.eventTitles.count();
    const titles: string[] = [];
    for (let i = 0; i < count; i++) {
      const title = await this.getText(this.eventTitles.nth(i));
      titles.push(title);
    }
    return titles;
  }

  /**
   * Click on event by name
   */
  async clickEventByName(eventName: string): Promise<void> {
    const eventLink = this.page.locator('a').filter({ hasText: new RegExp(eventName, 'i') }).first();
    await this.clickElement(eventLink);
  }

  /**
   * Click Book Now button by event index
   */
  async clickBookNowByIndex(index: number): Promise<void> {
    await this.bookNowButtons.nth(index).click();
  }

  /**
   * Get event price by index
   */
  async getEventPriceByIndex(index: number): Promise<string> {
    const priceLocator = this.eventArticles.nth(index).locator('p:has-text("$")').first();
    return await this.getText(priceLocator);
  }

  /**
   * Get available seats by index
   */
  async getAvailableSeatsByIndex(index: number): Promise<string> {
    const seatsLocator = this.eventArticles.nth(index).locator('text=/seats available/');
    return await this.getText(seatsLocator);
  }

  /**
   * Verify events page is loaded
   */
  async isEventsPageLoaded(): Promise<boolean> {
    return await this.isElementVisible(this.pageHeading);
  }

  /**
   * Verify search functionality
   */
  async isSearchInputVisible(): Promise<boolean> {
    return await this.isElementVisible(this.searchInput);
  }

  /**
   * Get event card by index
   */
  async getEventCard(index: number): Promise<Locator> {
    return this.eventArticles.nth(index);
  }

  /**
   * Click Add New Event button
   */
  async clickAddNewEvent(): Promise<void> {
    await this.clickElement(this.addNewEventButton);
  }

  /**
   * Get event details by index (title, price, location)
   */
  async getEventDetailsByIndex(index: number): Promise<{
    title: string;
    price: string;
    seats: string;
  }> {
    const eventCard = await this.getEventCard(index);
    const title = await eventCard.locator('h3').textContent() || '';
    const price = await eventCard.locator('p:has-text("$")').first().textContent() || '';
    const seats = await eventCard.locator('text=/seats available/').textContent() || '';

    return { title, price, seats };
  }

  /**
   * Click logout button
   */
  async logout(): Promise<void> {
    await this.clickElement(this.logoutButton);
  }
}
