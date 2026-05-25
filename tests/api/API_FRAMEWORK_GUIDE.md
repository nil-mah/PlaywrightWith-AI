# API Automation Framework

A comprehensive API automation framework built with Playwright using best practices for testing REST APIs.

## 📋 Overview

This framework is designed for:
- **RESTful API testing** with JSONPlaceholder dummy API
- **Type-safe** requests and responses using TypeScript
- **Comprehensive logging** and request tracing
- **Custom assertions** for API testing
- **Page Object Model** pattern adapted for APIs (API Client pattern)
- **Data validation** and schema verification

## 🏗️ Framework Architecture

```
src/api/
├── clients/
│   ├── base-client.ts              # Base HTTP client with common methods
│   └── jsonplaceholder-client.ts   # JSONPlaceholder API client
├── models/
│   └── index.ts                    # TypeScript interfaces for API responses
└── utils/
    ├── logger.ts                   # Request/response logging
    └── assertions.ts               # Custom API assertions

tests/api/
├── fixtures/
│   └── api.fixture.ts              # Playwright test fixtures
├── users/
│   └── users.spec.ts               # User endpoint tests
├── posts/
│   └── posts.spec.ts               # Post endpoint tests
└── comments/
    └── comments.spec.ts            # Comment endpoint tests
```

## 🎯 Key Features

### 1. Base API Client (`base-client.ts`)
```typescript
- Generic HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Automatic request/response logging
- Response time tracking
- URL building with query parameters
- Header management
- Type-safe response handling
```

### 2. JSONPlaceholder Client (`jsonplaceholder-client.ts`)
```typescript
- Specialized client for JSONPlaceholder API
- Typed methods for each endpoint
- Pagination support
- Search functionality
- CRUD operations
```

### 3. Custom Assertions (`assertions.ts`)
```typescript
- Status code assertions (success, client error, server error)
- Response body validation
- Schema validation
- Array and property assertions
- Response time assertions
- Header assertions
- Content-type validation
```

### 4. Request Logger (`logger.ts`)
```typescript
- Logs all API requests and responses
- Tracks response times
- Persists logs to JSON files
- Filtering by method, status code
- Identifies failed requests
```

## 📊 Test Coverage

### Users API (28 tests)
- ✅ List all users
- ✅ Get user by ID
- ✅ Search users by username
- ✅ Schema validation
- ✅ Email format validation
- ✅ Unique ID validation
- ✅ Company data structure validation
- ✅ Error handling (404)

### Posts API (28 tests)
- ✅ List all posts
- ✅ Get post by ID
- ✅ Pagination (skip/limit)
- ✅ Get posts by user
- ✅ Create post
- ✅ Update post (PUT/PATCH)
- ✅ Delete post
- ✅ Schema validation
- ✅ Title/body validation
- ✅ Unique ID validation

### Comments API (26 tests)
- ✅ List all comments
- ✅ Get comment by ID
- ✅ Get comments by post
- ✅ Create comment
- ✅ Update comment
- ✅ Delete comment
- ✅ Email format validation
- ✅ Post ID reference validation
- ✅ Unique ID validation

**Total: 82 comprehensive test cases**

## 🚀 Getting Started

### Run All API Tests
```bash
npx playwright test tests/api
```

### Run Tests by Category
```bash
# Users API only
npx playwright test tests/api/users

# Posts API only
npx playwright test tests/api/posts

# Comments API only
npx playwright test tests/api/comments
```

### Run with Config
```bash
# Using custom config
npx playwright test tests/api --config=playwright-api.config.ts

# With specific project
npx playwright test tests/api --project=chromium
```

### Run in Debug Mode
```bash
npx playwright test tests/api --debug
```

### Run with UI
```bash
npx playwright test tests/api --ui
```

### Generate Coverage Report
```bash
npx playwright test tests/api --reporter=html
npx playwright show-report
```

## 📝 Test Structure

Each test follows the **AAA Pattern** (Arrange, Act, Assert):

```typescript
test('should retrieve all users successfully', async ({ jsonPlaceholder }) => {
  // Arrange - Setup test data and expectations
  
  // Act - Execute the API call
  const response = await jsonPlaceholder.getAllUsers();

  // Assert - Validate results
  ApiAssertions.assertSuccessStatus(response.status);
  ApiAssertions.assertArrayNotEmpty(response.body);
});
```

## 🔍 Custom Fixtures

The framework provides a custom `test` fixture with API clients:

```typescript
import { test, expect } from '../fixtures/api.fixture';

test('example', async ({ jsonPlaceholder }) => {
  const response = await jsonPlaceholder.getAllUsers();
  // Test implementation
});
```

## 📋 API Response Types

All responses are strongly typed:

```typescript
interface ApiResponse<T = any> {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: T;
  url: string;
  ok: boolean;
}
```

## 🛡️ Best Practices Implemented

### 1. **Type Safety**
- TypeScript interfaces for all API models
- Generic response types
- Payload validation

### 2. **Comprehensive Logging**
- Request/response logging
- Response time tracking
- Failed request identification
- Persistent log files

### 3. **Custom Assertions**
- Specific assertion methods for API testing
- Detailed error messages
- Status code validation
- Schema validation

### 4. **Error Handling**
- Graceful error handling
- 404 error testing
- Invalid input testing
- Edge case coverage

### 5. **Data Validation**
- Email format validation
- Unique ID validation
- Schema compliance
- Field requirement validation

### 6. **Pagination Testing**
- Skip/limit parameters
- Page boundary testing
- Different page sizes

### 7. **CRUD Operations**
- Create operations
- Read operations
- Update operations (PUT and PATCH)
- Delete operations

### 8. **Code Organization**
- Separate concerns (clients, models, utils, tests)
- Reusable components
- Clear naming conventions
- DRY principles

## 📊 API Logs

All API requests are logged to `test-results/api-logs/`:

```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "method": "GET",
  "url": "https://jsonplaceholder.typicode.com/users",
  "status": 200,
  "responseTime": 245,
  "body": {...}
}
```

## 🔗 API Base URLs

- **JSONPlaceholder**: `https://jsonplaceholder.typicode.com`
- **Documentation**: https://jsonplaceholder.typicode.com

## 📦 Dependencies

- `@playwright/test`: ^1.52.0
- `typescript`: ^5.7.0

## 🛠️ Extending the Framework

### Add New API Client

```typescript
// src/api/clients/my-api-client.ts
export class MyApiClient extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request, 'https://api.example.com');
  }
  
  async myMethod() {
    return this.get('/endpoint');
  }
}
```

### Add New Fixture

```typescript
// tests/api/fixtures/my-api.fixture.ts
export const test = base.extend<ApiFixtures>({
  myApi: async ({ request }, use) => {
    const client = new MyApiClient(request);
    await use(client);
  },
});
```

### Add Custom Assertions

```typescript
// src/api/utils/assertions.ts
static myAssertion(actual: any, expected: any) {
  expect(actual).toBe(expected);
}
```

## 📈 Test Execution Workflow

1. **Setup**: Initialize API clients and fixtures
2. **Request**: Make HTTP request
3. **Log**: Log request and response
4. **Assert**: Validate response
5. **Cleanup**: Summary statistics and logs

## 🐛 Debugging

### View API Logs
```bash
cat test-results/api-logs/*.json
```

### Enable Verbose Output
```bash
npx playwright test tests/api --reporter=verbose
```

### Debug Single Test
```bash
npx playwright test tests/api/users/users.spec.ts --debug
```

## ✨ Summary

This API automation framework provides:
- ✅ 82 comprehensive test cases
- ✅ Complete REST API coverage (CRUD operations)
- ✅ Type-safe TypeScript implementation
- ✅ Custom assertions and logging
- ✅ Best practices throughout
- ✅ Easy to extend and maintain
- ✅ Production-ready code

Perfect for automating REST API testing with Playwright!
