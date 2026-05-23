// ─── User / Auth ──────────────────────────────────────────────────────────────

export interface TestUser {
  role: 'standard' | 'admin' | 'readonly';
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  username: string;
  address?: ApiAddress;
}

export interface ApiAddress {
  street: string;
  suite?: string;
  city: string;
  zipcode: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  username: string;
}

// ─── Test Data ────────────────────────────────────────────────────────────────

export interface LoginTestCase {
  scenario: string;
  email: string;
  password: string;
  expectedResult: 'success' | 'failure';
  expectedError?: string;
}
