import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

const BASE_URL = process.env.BASE_URL || 'https://eventhub.rahulshettyacademy.com';
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

test.describe('EventHub event browsing and booking', () => {
  const loginPageUrl = `${BASE_URL}/login`;
  const eventsPageUrl = `${BASE_URL}/events`;

  // Background: User login
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto(loginPageUrl);

    // Verify login page is loaded
    await expect(page).toHaveURL(/login/);

    // Fill email field using label
    await page.getByLabel('Email').fill(TEST_USER_EMAIL);

    // Fill password field using label - updated 0524
    await page.getByLabel('Password').fill(TEST_USER_PASSWORD);

    // Click Sign In button
    await page.getByRole('button', { name: /sign in/i }).click();

    // Verify user is logged in (page will redirect to home)
    await expect(page).toHaveURL(/^https:\/\/eventhub\.rahulshettyacademy\.com\/?$/);
    
    // Verify logout button is visible (indicates successful login)
    await page.getByRole('button', { name: /logout/i }).waitFor({ state: 'visible' });
  });

  // Cleanup: Logout
  test.afterEach(async ({ page }) => {
    // Find and click logout button
    const logoutButton = page.getByRole('button', { name: /logout|sign out/i });
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await expect(page).toHaveURL(/login/);
    }
  });

  test('@headed @mcp | Browse Diwali events', async ({ page }) => {
    // Navigate to events page after login
    await page.goto(eventsPageUrl);

    // Verify events page is loaded
    await expect(page).toHaveURL(/events/);
    await page.getByPlaceholder(/search events/i).waitFor({ state: 'visible' });

    // Search for "diwali"
    const searchInput = page.getByPlaceholder(/search events/i);
    await searchInput.fill('diwali');
    await searchInput.press('Enter');

    // Verify single event result is visible
    const eventTitle = page.getByRole('heading', { name: /Dilli Diwali Mela/i });
    await expect(eventTitle).toBeVisible();

    // Verify event title count
    const eventCount = await page.getByRole('heading', { name: /Dilli Diwali Mela/i }).count();
    expect(eventCount).toBe(1);
  });

  test('@headed @mcp | Book a Diwali event', async ({ page }) => {
    // Navigate to events page after login
    await page.goto(eventsPageUrl);

    // Verify events page is loaded
    await expect(page).toHaveURL(/events/);
    await page.getByPlaceholder(/search events/i).waitFor({ state: 'visible' });

    // Search for "diwali"
    const searchInput = page.getByPlaceholder(/search events/i);
    await searchInput.fill('diwali');
    await searchInput.press('Enter');

    // Wait for event to appear
    await page.getByRole('heading', { name: /Dilli Diwali Mela/i }).waitFor({ state: 'visible' });

    // Select the event titled "Dilli Diwali Mela"
    const eventLink = page.locator('a').filter({ hasText: /Dilli Diwali Mela/i }).first();
    await Promise.all([
      page.waitForURL(/events\/3/),
      eventLink.click(),
    ]);

    // Wait for booking form to load
    await page.locator('#customerName').waitFor({ state: 'visible' });

    // Fill booking form
    await page.locator('#customerName').fill(BOOKING_NAME);
    await page.locator('#customer-email').fill(BOOKING_EMAIL);
    await page.locator('#phone').fill(BOOKING_CONTACT);

    // Select number of tickets
    const ticketQuantity = parseInt(BOOKING_TICKETS, 10);
    for (let i = 1; i < ticketQuantity; i++) {
      await page.getByRole('button', { name: /\+/i }).click();
    }

    // Submit booking
    await page.getByRole('button', { name: /Confirm Booking/i }).click();

    // Wait for confirmation message to appear
    await page.locator('body').waitFor({ state: 'visible' });

    // Verify confirmation message
    const pageContent = await page.locator('body').innerText();
    expect(pageContent).toMatch(/Booking Confirmed|Thank you|Confirmed|reserved/i);
  });
});
