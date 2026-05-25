/**
 * Users API Test Suite
 * Tests for user endpoints on JSONPlaceholder API
 */

import { test, expect } from '../fixtures/api.fixture';
import { ApiAssertions } from '@api/utils/assertions';

test.describe('📋 Users API Tests', () => {
  test.describe('GET /users - List all users', () => {
    test('should retrieve all users successfully', async ({
      jsonPlaceholder,
    }) => {
      // Act
      const response = await jsonPlaceholder.getAllUsers();

      // Assert
      ApiAssertions.assertSuccessStatus(response.status);
      ApiAssertions.assertContentType(response.headers, 'application/json');
      ApiAssertions.assertArrayNotEmpty(response.body);
      expect(response.body.length).toBe(10);
    });

    test('should return users with valid schema', async ({
      jsonPlaceholder,
    }) => {
      // Act
      const response = await jsonPlaceholder.getAllUsers();

      // Assert
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            username: expect.any(String),
            email: expect.any(String),
          }),
        ])
      );
    });

    test('should return response within acceptable time', async ({
      jsonPlaceholder,
    }) => {
      // Act
      const response = await jsonPlaceholder.getAllUsers();

      // Assert
      ApiAssertions.assertResponseTime(response.status);
    });

    test('should have correct content-type header', async ({
      jsonPlaceholder,
    }) => {
      // Act
      const response = await jsonPlaceholder.getAllUsers();

      // Assert
      ApiAssertions.assertHeader(response.headers, 'content-type');
      expect(response.headers['content-type']).toContain('application/json');
    });
  });

  test.describe('GET /users/:id - Get user by ID', () => {
    test('should retrieve user by valid ID', async ({ jsonPlaceholder }) => {
      // Arrange
      const userId = 1;

      // Act
      const response = await jsonPlaceholder.getUserById(userId);

      // Assert
      ApiAssertions.assertSuccessStatus(response.status);
      expect(response.body.id).toBe(userId);
      expect(response.body.name).toBeTruthy();
    });

    test('should contain valid user data structure', async ({
      jsonPlaceholder,
    }) => {
      // Act
      const response = await jsonPlaceholder.getUserById(1);

      // Assert
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          username: expect.any(String),
          email: expect.any(String),
          address: expect.any(Object),
          phone: expect.any(String),
          website: expect.any(String),
          company: expect.any(Object),
        })
      );
    });

    test('should have correct geolocation in address', async ({
      jsonPlaceholder,
    }) => {
      // Act
      const response = await jsonPlaceholder.getUserById(1);

      // Assert
      expect(response.body.address).toHaveProperty('geo');
      expect(response.body.address.geo).toEqual(
        expect.objectContaining({
          lat: expect.any(String),
          lng: expect.any(String),
        })
      );
    });

    test('should return 404 for non-existent user ID', async ({
      jsonPlaceholder,
    }) => {
      // Act
      const response = await jsonPlaceholder.getUserById(999);

      // Assert
      expect(response.status).toBe(404);
      expect(response.ok).toBe(false);
    });

    test('should handle each user ID from 1 to 10', async ({
      jsonPlaceholder,
    }) => {
      // Arrange & Act
      for (let userId = 1; userId <= 10; userId++) {
        const response = await jsonPlaceholder.getUserById(userId);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(userId);
      }
    });
  });

  test.describe('GET /users?username= - Search users by username', () => {
    test('should find user by username', async ({ jsonPlaceholder }) => {
      // Arrange
      const username = 'Bret';

      // Act
      const response = await jsonPlaceholder.getUserByUsername(username);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].username).toBe(username);
    });

    test('should return empty array for non-existent username', async ({
      jsonPlaceholder,
    }) => {
      // Act
      const response = await jsonPlaceholder.getUserByUsername(
        'NonExistentUser'
      );

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });

  test.describe('Data validation', () => {
    test('should have valid email format for all users', async ({
      jsonPlaceholder,
    }) => {
      // Arrange
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Act
      const response = await jsonPlaceholder.getAllUsers();

      // Assert
      response.body.forEach((user: any) => {
        expect(user.email).toMatch(emailRegex);
      });
    });

    test('should have unique user IDs', async ({ jsonPlaceholder }) => {
      // Act
      const response = await jsonPlaceholder.getAllUsers();

      // Assert
      const ids = response.body.map((user: any) => user.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('should have valid company data structure', async ({
      jsonPlaceholder,
    }) => {
      // Act
      const response = await jsonPlaceholder.getUserById(1);

      // Assert
      expect(response.body.company).toEqual(
        expect.objectContaining({
          name: expect.any(String),
          catchPhrase: expect.any(String),
          bs: expect.any(String),
        })
      );
    });
  });
});
