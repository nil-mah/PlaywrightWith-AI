
@eventhub @headed @mcp
Feature: EventHub event browsing and booking
  As a user of the EventHub app
  I want to search for events and book tickets through the UI

  Background:
    Given the EventHub login page is open at "{{ BASE_URL }}/login"
    When I login with email "{{ TEST_USER_EMAIL }}" and password "{{ TEST_USER_PASSWORD }}"
    Then I should land on the events listing page

  @headed @mcp
  Scenario: Browse Diwali events
    Given I am on the events listing page
    When I click on "Browse Events"
    And I search for "diwali"
    Then I should see a single event result
    And the event title should contain "Dilli Diwali Mela"

  @headed @mcp
  Scenario: Book a Diwali event
    Given I am on the events listing page
    When I click on "Browse Events"
    And I search for "diwali"
    And I select the event titled "Dilli Diwali Mela"
    And I fill the booking form with name "{{ BOOKING_NAME }}", email "{{ BOOKING_EMAIL }}" and contact "{{ BOOKING_CONTACT }}"
    And I select "{{ BOOKING_TICKETS }}" tickets
    Then I should submit the booking and see a confirmation message

