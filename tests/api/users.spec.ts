import { allure } from 'allure-playwright';
import { test, expect } from '../../src/fixtures';
import { DataHelper } from '../../src/helpers/DataHelper';
import type { ApiUser, CreateUserPayload } from '../../src/types';

/**
 * Users API spec — demonstrates:
 *  • Typed ApiClient usage (get, post, put, delete)
 *  • Test data from JSON (no hard-coded payloads)
 *  • Allure annotations
 *  • Using JSONPlaceholder as a sample public API
 *
 * NOTE: Replace the endpoint paths with your actual API.
 * The BASE_URL / API_BASE_URL should point to JSONPlaceholder for demo:
 *   API_BASE_URL=https://jsonplaceholder.typicode.com
 */

test.describe('Users API', () => {
  // ── GET ────────────────────────────────────────────────────────────────────

  test('GET /users — should return a list of users', async ({ apiClient }) => {
    await allure.epic('Users');
    await allure.feature('GET /users');
    await allure.severity('critical');

    const response = await apiClient.get<ApiUser[]>('/users');

    expect(response.status).toBe(200);
    expect(response.ok).toBe(true);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    const firstUser = response.body[0];
    expect(firstUser).toHaveProperty('id');
    expect(firstUser).toHaveProperty('name');
    expect(firstUser).toHaveProperty('email');
  });

  test('GET /users/:id — should return a specific user', async ({ apiClient }) => {
    await allure.epic('Users');
    await allure.feature('GET /users/:id');
    await allure.severity('critical');
    await allure.parameter('userId', '1');

    const response = await apiClient.get<ApiUser>('/users/1');

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
    expect(response.body.name).toBeTruthy();
    expect(response.body.email).toContain('@');
  });

  test('GET /users/:id — should return 404 for non-existent user', async ({ apiClient }) => {
    await allure.epic('Users');
    await allure.feature('GET /users/:id');
    await allure.story('Not found');
    await allure.severity('normal');

    const response = await apiClient.get('/users/99999');

    expect(response.status).toBe(404);
    expect(response.ok).toBe(false);
  });

  // ── POST ───────────────────────────────────────────────────────────────────

  test('POST /users — should create a new user', async ({ apiClient }) => {
    await allure.epic('Users');
    await allure.feature('POST /users');
    await allure.severity('critical');

    // Load payload from JSON — no hard-coded data in test
    const users = DataHelper.loadJson<ApiUser[]>('users.json');
    const userData = users[0];

    const payload: CreateUserPayload = {
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      username: userData.email.split('@')[0],
    };

    await allure.parameter('name', payload.name);
    await allure.parameter('email', payload.email);

    const response = await apiClient.post<ApiUser>('/users', payload);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(payload.name);
    expect(response.body.email).toBe(payload.email);
  });

  // ── PUT ────────────────────────────────────────────────────────────────────

  test('PUT /users/:id — should update an existing user', async ({ apiClient }) => {
    await allure.epic('Users');
    await allure.feature('PUT /users/:id');
    await allure.severity('normal');

    const updatedPayload: Partial<CreateUserPayload> = {
      name: 'Updated Name',
      email: 'updated@example.com',
    };

    const response = await apiClient.put<ApiUser>('/users/1', updatedPayload);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedPayload.name);
  });

  // ── DELETE ─────────────────────────────────────────────────────────────────

  test('DELETE /users/:id — should delete a user', async ({ apiClient }) => {
    await allure.epic('Users');
    await allure.feature('DELETE /users/:id');
    await allure.severity('normal');

    const response = await apiClient.delete('/users/1');

    expect([200, 204]).toContain(response.status);
  });
});
