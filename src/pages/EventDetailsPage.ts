import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Event Details & Booking Page Object Model
 * Handles event details viewing and booking functionality
 */
export class EventDetailsPage extends BasePage {
  // Navigation breadcrumbs
  readonly breadcrumbEvents: Locator;
  readonly eventNameBreadcrumb: Locator;

  // Event details section
  readonly eventImage: Locator;
  readonly eventTitle: Locator;
  readonly eventCategory: Locator;
  readonly eventFeaturedBadge: Locator;

  // Event information locators
  readonly eventDate: Locator;
  readonly eventTime: Locator;
  readonly eventVenue: Locator;
  readonly eventCity: Locator;
  readonly availableSeats: Locator;
  readonly pricePerTicket: Locator;
  readonly aboutEventSection: Locator;
  readonly eventDescription: Locator;

  // Booking form locators
  readonly bookingFormHeading: Locator;
  readonly ticketCountDisplay: Locator;
  readonly decrementButton: Locator;
  readonly incrementButton: Locator;
  readonly maxTicketsInfo: Locator;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly priceBreakdown: Locator;
  readonly totalPrice: Locator;
  readonly confirmBookingButton: Locator;

  // Navigation
  readonly logoutButton: Locator;
  readonly homeNavLink: Locator;
  readonly eventsNavLink: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation breadcrumbs
    this.breadcrumbEvents = page.getByRole('link', { name: /events/i });
    this.eventNameBreadcrumb = page.locator('nav >> text').last();

    // Event details section
    this.eventImage = page.locator('img[alt*="event"]').first();
    this.eventTitle = page.getByRole('heading', { level: 1 });
    this.eventCategory = page.locator('[class*="badge"]').first();
    this.eventFeaturedBadge = page.getByText(/featured/i);

    // Event information
    this.eventDate = page.locator('text=/Tuesday|Sat|Mon|Wed|Thu|Fri/');
    this.eventTime = page.locator('text=/pm|am/').first();
    this.eventVenue = page.locator('text=/Exhibition|Stadium|City/').first();
    this.eventCity = page.locator('text=/Delhi|Los Angeles|Hyderabad/').first();
    this.availableSeats = page.locator('text=/seats available|max \\d+/').first();
    this.pricePerTicket = page.locator('p').filter({ hasText: /\$/ }).first();
    this.aboutEventSection = page.getByRole('heading', { name: /about this event/i });
    this.eventDescription = this.aboutEventSection.locator('.. >> p');

    // Booking form locators
    this.bookingFormHeading = page.getByRole('heading', { name: /book tickets/i });
    this.decrementButton = page.getByRole('button', { name: /−/i });
    this.incrementButton = page.getByRole('button', { name: /\+/i });
    this.maxTicketsInfo = page.getByText(/max \d+/i);
    this.fullNameInput = page.locator('#customerName');
    this.emailInput = page.locator('#customer-email');
    this.phoneNumberInput = page.locator('#phone');
    this.ticketCountDisplay = page.locator('span, div, p').filter({ hasText: /^\d+$/ }).first();
    this.priceBreakdown = page.locator('[class*="price"], [class*="breakdown"]').first();
    this.totalPrice = page.locator('[class*="total"], text=/Total/i').first();
    this.confirmBookingButton = page.getByRole('button', { name: /confirm booking/i });

    // Navigation
    this.logoutButton = page.getByRole('button', { name: /logout/i });
    this.homeNavLink = page.getByRole('link', { name: /^Home$/i });
    this.eventsNavLink = page.getByRole('link', { name: /^Events$/i });
  }

  /**
   * Navigate to event details page by event ID
   */
  async navigateToEventDetails(eventId: number): Promise<void> {
    await this.goto(`/events/${eventId}`);
  }

  /**
   * Wait for event details page to load
   */
  async waitForEventDetailsPageToLoad(): Promise<void> {
    await this.waitForElement(this.eventTitle);
    await this.waitForElement(this.bookingFormHeading);
  }

  /**
   * Get event title
   */
  async getEventTitle(): Promise<string> {
    return await this.getText(this.eventTitle);
  }

  /**
   * Get event description
   */
  async getEventDescription(): Promise<string> {
    return await this.getText(this.eventDescription);
  }

  /**
   * Get event price per ticket
   */
  async getEventPrice(): Promise<string> {
    return await this.getText(this.pricePerTicket);
  }

  /**
   * Get available seats information
   */
  async getAvailableSeatsInfo(): Promise<string> {
    return await this.getText(this.availableSeats);
  }

  /**
   * Increment ticket quantity
   */
  async incrementTickets(): Promise<void> {
    await this.clickElement(this.incrementButton);
  }

  /**
   * Increment tickets multiple times
   */
  async incrementTicketsBy(count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      await this.incrementTickets();
    }
  }

  /**
   * Decrement ticket quantity
   */
  async decrementTickets(): Promise<void> {
    await this.clickElement(this.decrementButton);
  }

  /**
   * Get current ticket count
   */
  async getCurrentTicketCount(): Promise<string> {
    return await this.getText(this.ticketCountDisplay);
  }

  /**
   * Fill full name field
   */
  async enterFullName(name: string): Promise<void> {
    await this.fillField(this.fullNameInput, name);
  }

  /**
   * Fill email field
   */
  async enterEmail(email: string): Promise<void> {
    await this.fillField(this.emailInput, email);
  }

  /**
   * Fill phone number field
   */
  async enterPhoneNumber(phone: string): Promise<void> {
    await this.fillField(this.phoneNumberInput, phone);
  }

  /**
   * Fill complete booking form
   */
  async fillBookingForm(fullName: string, email: string, phoneNumber: string): Promise<void> {
    await this.enterFullName(fullName);
    await this.enterEmail(email);
    await this.enterPhoneNumber(phoneNumber);
  }

  /**
   * Click Confirm Booking button
   */
  async clickConfirmBooking(): Promise<void> {
    await this.clickElement(this.confirmBookingButton);
  }

  /**
   * Book event with full details
   */
  async bookEvent(fullName: string, email: string, phoneNumber: string, ticketCount: number = 1): Promise<void> {
    // Increment tickets if needed
    if (ticketCount > 1) {
      await this.incrementTicketsBy(ticketCount - 1);
    }

    // Fill booking form
    await this.fillBookingForm(fullName, email, phoneNumber);

    // Confirm booking
    await this.clickConfirmBooking();
  }

  /**
   * Verify event details page is displayed
   */
  async isEventDetailsPageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.eventTitle);
  }

  /**
   * Verify booking form is displayed
   */
  async isBookingFormDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.bookingFormHeading);
  }

  /**
   * Check if decrement button is enabled
   */
  async isDecrementButtonEnabled(): Promise<boolean> {
    return await this.isElementEnabled(this.decrementButton);
  }

  /**
   * Check if increment button is enabled
   */
  async isIncrementButtonEnabled(): Promise<boolean> {
    return await this.isElementEnabled(this.incrementButton);
  }

  /**
   * Check if confirm booking button is enabled
   */
  async isConfirmBookingEnabled(): Promise<boolean> {
    return await this.isElementEnabled(this.confirmBookingButton);
  }

  /**
   * Get full name input value
   */
  async getFullNameValue(): Promise<string | null> {
    return await this.fullNameInput.inputValue();
  }

  /**
   * Get email input value
   */
  async getEmailValue(): Promise<string | null> {
    return await this.emailInput.inputValue();
  }

  /**
   * Get phone number input value
   */
  async getPhoneNumberValue(): Promise<string | null> {
    return await this.phoneNumberInput.inputValue();
  }

  /**
   * Click on Events breadcrumb to navigate back
   */
  async clickEventsBreadcrumb(): Promise<void> {
    await this.clickElement(this.breadcrumbEvents);
  }

  /**
   * Click logout button
   */
  async logout(): Promise<void> {
    await this.clickElement(this.logoutButton);
  }

  /**
   * Navigate to home via nav
   */
  async navigateToHome(): Promise<void> {
    await this.clickElement(this.homeNavLink);
  }

  /**
   * Navigate to events page via nav
   */
  async navigateToEvents(): Promise<void> {
    await this.clickElement(this.eventsNavLink);
  }
}
