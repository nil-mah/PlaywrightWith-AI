import { test, expect } from '@playwright/test';
import { LoginPage, HomePage, EventsPage, EventDetailsPage } from '../../src/pages';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || 'nileshma0201@gmail.com';
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'Playauto@0523';

// Load booking data from JSON file
const bookingDataPath = path.join(__dirname, '../../test-data/booking-data.json');
const bookingDataRaw = fs.readFileSync(bookingDataPath, 'utf-8');
const bookingData = JSON.parse(bookingDataRaw);
const BOOKING_NAME = bookingData.bookingDetails.customerName;
const BOOKING_EMAIL = bookingData.bookingDetails.customerEmail;
const BOOKING_CONTACT = bookingData.bookingDetails.contactNumber;
const BOOKING_TICKETS = bookingData.bookingDetails.ticketsQuantity;

test.describe('EventHub event browsing and booking with Page Object Model', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let eventsPage: EventsPage;
  let eventDetailsPage: EventDetailsPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    eventsPage = new EventsPage(page);
    eventDetailsPage = new EventDetailsPage(page);

    // Navigate to login page
    await loginPage.navigateToLoginPage();
    await loginPage.waitForLoginPageToLoad();

    // Verify login page is displayed
    expect(await loginPage.isLoginPageDisplayed()).toBe(true);

    // Login with test credentials
    await loginPage.login(TEST_USER_EMAIL, TEST_USER_PASSWORD);

    // Wait for home page to load
    await homePage.waitForHomePageToLoad();

    // Verify user is logged in
    expect(await homePage.isHomePageDisplayed()).toBe(true);
    expect(await homePage.isLogoutButtonVisible()).toBe(true);
  });

  test.afterEach(async ({ page }) => {
    // Logout after each test
    if (await homePage.isLogoutButtonVisible()) {
      await homePage.logout();
      await expect(page).toHaveURL(/login/);
    }
  });

  test('@pom @headed | Browse Diwali events using POM', async () => {
    // Navigate to events page
    await eventsPage.navigateToEventsPage();

    // Verify events page is loaded
    await eventsPage.waitForEventsPageToLoad();
    expect(await eventsPage.isEventsPageLoaded()).toBe(true);

    // Search for "diwali"
    await eventsPage.searchForEvent('diwali');

    // Wait for search results to load
    await eventsPage.waitForSearchResults();

    // Get all event titles
    const eventTitles = await eventsPage.getAllEventTitles();

    // Verify event is found
    expect(eventTitles.length).toBeGreaterThan(0);
    expect(eventTitles.some(title => title.includes('Dilli Diwali Mela'))).toBe(true);
  });

  test('@pom @headed | Book a Diwali event using POM', async ({ page }) => {
    // Navigate to events page
    await eventsPage.navigateToEventsPage();

    // Wait for events page to load
    await eventsPage.waitForEventsPageToLoad();

    // Search for diwali event
    await eventsPage.searchForEvent('diwali');

    // Click on Dilli Diwali Mela event
    await eventsPage.clickEventByName('Dilli Diwali Mela');

    // Wait for event details page to load
    await eventDetailsPage.waitForEventDetailsPageToLoad();

    // Verify event details page is displayed
    expect(await eventDetailsPage.isEventDetailsPageDisplayed()).toBe(true);
    expect(await eventDetailsPage.isBookingFormDisplayed()).toBe(true);

    // Get event title and verify
    const eventTitle = await eventDetailsPage.getEventTitle();
    expect(eventTitle).toContain('Dilli Diwali Mela');

    // Book the event
    const ticketQuantity = parseInt(BOOKING_TICKETS, 10);
    await eventDetailsPage.bookEvent(BOOKING_NAME, BOOKING_EMAIL, BOOKING_CONTACT, ticketQuantity);

    // Verify booking confirmation
    const pageContent = await page.locator('body').innerText();
    expect(pageContent).toMatch(/Booking Confirmed|Thank you|Confirmed|reserved/i);
  });

  test('@pom @headed | Verify event details page elements', async () => {
    // Navigate directly to event details page
    await eventDetailsPage.navigateToEventDetails(3);

    // Wait for page to load
    await eventDetailsPage.waitForEventDetailsPageToLoad();

    // Verify all key elements are visible
    expect(await eventDetailsPage.isEventDetailsPageDisplayed()).toBe(true);
    expect(await eventDetailsPage.isBookingFormDisplayed()).toBe(true);

    // Get event information
    const eventTitle = await eventDetailsPage.getEventTitle();
    const eventPrice = await eventDetailsPage.getEventPrice();
    const availableSeats = await eventDetailsPage.getAvailableSeatsInfo();

    // Verify information is not empty
    expect(eventTitle).toBeTruthy();
    expect(eventPrice).toBeTruthy();
    expect(availableSeats).toBeTruthy();

    // Verify form fields are visible
    expect(await eventDetailsPage.fullNameInput.isVisible()).toBe(true);
    expect(await eventDetailsPage.emailInput.isVisible()).toBe(true);
    expect(await eventDetailsPage.phoneNumberInput.isVisible()).toBe(true);
  });

  test('@pom @headed | Verify ticket increment functionality', async () => {
    // Navigate to event details page
    await eventDetailsPage.navigateToEventDetails(3);

    // Wait for page to load
    await eventDetailsPage.waitForEventDetailsPageToLoad();

    // Get initial ticket count
    const initialCount = await eventDetailsPage.getCurrentTicketCount();

    // Increment tickets
    await eventDetailsPage.incrementTickets();

    // Get new ticket count
    const newCount = await eventDetailsPage.getCurrentTicketCount();

    // Verify ticket count increased
    expect(parseInt(newCount)).toBe(parseInt(initialCount) + 1);
  });

  test('@pom @headed | Test all EventsPage filter options', async () => {
    // Navigate to events page
    await eventsPage.navigateToEventsPage();

    // Wait for page to load
    await eventsPage.waitForEventsPageToLoad();

    // Wait for initial events to load
    await eventsPage.waitForSearchResults();

    // Verify filters are available
    expect(await eventsPage.searchInput.isVisible()).toBe(true);
    expect(await eventsPage.categoryDropdown.isVisible()).toBe(true);
    expect(await eventsPage.cityDropdown.isVisible()).toBe(true);

    // Get initial event count
    const initialCount = await eventsPage.getEventCount();
    expect(initialCount).toBeGreaterThan(0);

    // Search for an event
    await eventsPage.searchForEvent('World');

    // Wait for search results
    await eventsPage.waitForSearchResults();
    const searchResultCount = await eventsPage.getEventCount();
    expect(searchResultCount).toBeLessThanOrEqual(initialCount);
  });
});
