# EventHub Page Object Model (POM)

This directory contains the Page Object Model classes for the EventHub automation testing suite. The POM pattern encapsulates page interactions and locators, making tests more maintainable, readable, and reusable.

## Directory Structure

```
src/pages/
├── BasePage.ts                 # Base class with common page functionality
├── LoginPage.ts               # Login page object
├── HomePage.ts                # Home page object
├── EventsPage.ts              # Events browsing/listing page object
├── EventDetailsPage.ts        # Event details and booking page object
└── index.ts                   # Centralized exports
```

## Page Classes Overview

### BasePage
The base class that all page objects inherit from. Provides common functionality:

- **Navigation**: `goto(path)` - Navigate to a specific URL path
- **Element Interaction**: `clickElement()`, `fillField()`, `getText()`
- **Element State**: `isElementVisible()`, `isElementEnabled()`, `waitForElement()`
- **Page Context**: Access to Playwright `page` object and base URL

### LoginPage
Handles login functionality and login page interactions.

**Key Locators:**
- Email field
- Password field
- Sign In button
- Register link

**Key Methods:**
- `navigateToLoginPage()` - Go to login page
- `login(email, password)` - Login with credentials
- `enterEmail(email)` - Fill email field
- `enterPassword(password)` - Fill password field
- `clickSignIn()` - Click sign in button
- `isLoginPageDisplayed()` - Verify page is loaded

### HomePage
Handles home page interactions and featured events.

**Key Locators:**
- Navigation links (Home, Events, My Bookings, Admin)
- Logout button
- Main heading
- Browse Events button
- Featured event cards
- Book Now buttons

**Key Methods:**
- `navigateToHomePage()` - Navigate to home
- `waitForHomePageToLoad()` - Wait for page to load
- `clickBrowseEvents()` - Click browse events button
- `clickMyBookings()` - Click my bookings button
- `logout()` - Logout from application
- `getFeaturedEventCount()` - Get count of featured events
- `clickEventByName(eventName)` - Click event by name
- `isHomePageDisplayed()` - Verify page is loaded
- `isLogoutButtonVisible()` - Check logout button visibility

### EventsPage
Handles events listing, searching, and filtering.

**Key Locators:**
- Search input field
- Category dropdown
- City dropdown
- Event article cards
- Event titles
- Book Now buttons
- Add New Event button

**Key Methods:**
- `navigateToEventsPage()` - Navigate to events page
- `waitForEventsPageToLoad()` - Wait for page to load
- `searchForEvent(term)` - Search for events by keyword
- `selectCategory(category)` - Select event category
- `selectCity(city)` - Select city filter
- `getEventCount()` - Get number of displayed events
- `getAllEventTitles()` - Get all visible event titles
- `clickEventByName(name)` - Click event by name
- `clickBookNowByIndex(index)` - Click book button by index
- `getEventDetailsByIndex(index)` - Get event details (title, price, seats)
- `isEventsPageLoaded()` - Verify page is loaded
- `logout()` - Logout from application

### EventDetailsPage
Handles event details viewing and booking functionality.

**Key Locators:**
- Event title, image, description
- Event details (date, time, venue, city, price, seats)
- Booking form fields (name, email, phone)
- Ticket quantity controls (increment/decrement)
- Confirm Booking button
- Navigation breadcrumbs

**Key Methods:**
- `navigateToEventDetails(eventId)` - Navigate to event by ID
- `waitForEventDetailsPageToLoad()` - Wait for page to load
- `getEventTitle()` - Get event title
- `getEventDescription()` - Get event description
- `getEventPrice()` - Get price per ticket
- `incrementTickets()` - Increment ticket quantity
- `decrementTickets()` - Decrement ticket quantity
- `getCurrentTicketCount()` - Get current ticket count
- `enterFullName(name)` - Fill name field
- `enterEmail(email)` - Fill email field
- `enterPhoneNumber(phone)` - Fill phone field
- `fillBookingForm(name, email, phone)` - Fill complete booking form
- `bookEvent(name, email, phone, ticketCount)` - Complete booking process
- `clickConfirmBooking()` - Click confirm booking button
- `isEventDetailsPageDisplayed()` - Verify event details are visible
- `isBookingFormDisplayed()` - Verify booking form is visible
- `navigateToHome()` - Navigate to home via nav
- `navigateToEvents()` - Navigate to events page via nav
- `logout()` - Logout from application

## Usage Example

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage, HomePage, EventsPage, EventDetailsPage } from '../../src/pages';

test('Complete booking flow', async ({ page }) => {
  // Initialize page objects
  const loginPage = new LoginPage(page);
  const eventsPage = new EventsPage(page);
  const eventDetailsPage = new EventDetailsPage(page);

  // Login
  await loginPage.navigateToLoginPage();
  await loginPage.login('user@example.com', 'password123');

  // Browse events
  await eventsPage.navigateToEventsPage();
  await eventsPage.searchForEvent('diwali');
  await eventsPage.clickEventByName('Dilli Diwali Mela');

  // Book event
  await eventDetailsPage.waitForEventDetailsPageToLoad();
  await eventDetailsPage.bookEvent('John Doe', 'john@example.com', '+91 98765 43210', 2);

  // Verify confirmation
  expect(page.locator('body')).toContainText('Confirmed');
});
```

## Locator Strategy

The POM classes use the following locator strategies (in order of preference):

1. **Role-based locators**: `page.getByRole()` - Most accessible and robust
2. **Label-based locators**: `page.getByLabel()` - Good for form elements
3. **Placeholder-based**: `page.getByPlaceholder()` - For input fields
4. **Text-based**: `page.getByText()` - For content verification
5. **ID-based**: `page.locator('#id')` - Last resort for unique IDs

This approach ensures:
- Tests are resilient to UI changes
- Better accessibility testing
- More maintainable code
- Reduced brittleness

## Best Practices

1. **One responsibility per test** - Each test should focus on one user action or flow
2. **Use meaningful test names** - Describe what is being tested
3. **Avoid test interdependency** - Each test should be independent
4. **Use beforeEach/afterEach** - For setup and teardown (login/logout)
5. **Data-driven tests** - Use external data files for test inputs
6. **Wait for elements** - Always wait before interacting with elements
7. **Assertions** - Verify expected behavior with clear assertions
8. **Reuse page objects** - Leverage POM methods instead of direct element access

## Running Tests

### Run all tests
```bash
npm test
```

### Run specific test file
```bash
npm test eventhub-pom.spec.ts
```

### Run tests with specific tag
```bash
npm test -- --grep @pom
```

### Run tests in headed mode
```bash
npm test -- --headed
```

### Run tests with UI mode
```bash
npm test -- --ui
```

### Generate test report
```bash
npm test
npx allure serve allure-results
```

## Environment Variables

Create a `.env` file in the root directory:

```
BASE_URL=https://eventhub.rahulshettyacademy.com
TEST_USER_EMAIL=your-test-email@example.com
TEST_USER_PASSWORD=your-test-password
```

## Adding New Pages

To add a new page object:

1. Create a new file in `src/pages/` (e.g., `MyPage.ts`)
2. Extend `BasePage` class
3. Define locators in the constructor
4. Implement page-specific methods
5. Export from `src/pages/index.ts`

Example:

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyPage extends BasePage {
  readonly myElement: Locator;

  constructor(page: Page) {
    super(page);
    this.myElement = page.getByRole('button', { name: /my button/i });
  }

  async clickMyButton(): Promise<void> {
    await this.clickElement(this.myElement);
  }
}
```

## Troubleshooting

### Elements not found
- Ensure page is fully loaded using `waitForElement()` or `waitForPageToLoad()`
- Check locator selectors in browser DevTools
- Verify the locator strategy matches current DOM structure

### Tests timing out
- Add explicit waits for dynamic content
- Increase timeout in playwright.config.ts if needed
- Check for network delays

### Flaky tests
- Use proper waits instead of fixed timeouts
- Avoid element indexing when possible
- Use role-based selectors for better stability

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Locators Guide](https://playwright.dev/docs/locators)

## Contributing

When adding new page object methods:
1. Keep methods focused on single actions
2. Use clear, descriptive method names
3. Add JSDoc comments
4. Handle waits appropriately
5. Return meaningful values where applicable
6. Add example test demonstrating usage
