# Playwright TypeScript Framework

A production-ready end-to-end test framework using **Playwright + TypeScript** with Page Object Model, data-driven testing, Allure reporting, and GitHub Actions CI.

---

## Features

| Feature | Details |
|---|---|
| **Language** | TypeScript 5 (strict mode) |
| **Test runner** | Playwright Test (latest) |
| **Architecture** | Page Object Model (POM) |
| **Test data** | JSON + CSV files — no hard-coded values |
| **Credentials** | `.env` locally, GitHub Secrets in CI |
| **Reporting** | Allure 3 + Playwright HTML report |
| **CI/CD** | GitHub Actions with sharding & caching |
| **Linting** | ESLint + `@typescript-eslint` |
| **Test types** | UI (Chromium) + API |

---

## Project Structure

```
playwright-ts-framework/
├── .github/
│   └── workflows/
│       └── playwright.yml        # CI pipeline
├── src/
│   ├── api/
│   │   └── ApiClient.ts          # Typed API wrapper
│   ├── fixtures/
│   │   └── index.ts              # Custom Playwright fixtures (POM + ApiClient)
│   ├── helpers/
│   │   ├── DataHelper.ts         # JSON/CSV loader
│   │   └── EnvHelper.ts          # Type-safe env variable access
│   ├── pages/
│   │   ├── BasePage.ts           # Shared page utilities
│   │   ├── HomePage.ts
│   │   ├── LoginPage.ts
│   │   └── index.ts              # Barrel export
│   └── types/
│       └── index.ts              # Shared TypeScript interfaces
├── test-data/
│   ├── test-cases.csv            # Data-driven login scenarios
│   └── users.json                # User profile data
├── tests/
│   ├── global.setup.ts           # Auth setup (runs once before UI tests)
│   ├── api/
│   │   └── users.spec.ts         # API test examples
│   └── ui/
│       └── login.spec.ts         # UI test examples (data-driven)
├── .env.example                  # Template — copy to .env for local runs
├── .gitignore
├── eslint.config.mjs
├── package.json
├── playwright.config.ts
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### 1. Install dependencies

```bash
npm ci
npx playwright install chromium --with-deps
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your real BASE_URL and credentials
```

### 3. Run tests

```bash
# All tests
npm test

# UI tests only
npm run test:ui

# API tests only
npm run test:api

# Run with browser visible
npm run test:headed

# Debug a specific test
npm run test:debug -- tests/ui/login.spec.ts
```

### 4. View reports

```bash
# Playwright HTML report
npm run test:report

# Allure report (requires allure CLI: https://allurereport.org/docs/install/)
npm run allure:generate
npm run allure:open

# Serve Allure live (watches allure-results/)
npm run allure:serve
```

---

## Credentials & Secrets

### Local development

Credentials live in `.env` (never committed):

```dotenv
BASE_URL=https://your-app.example.com
TEST_USER_EMAIL=user@example.com
TEST_USER_PASSWORD=secret
```

### CI (GitHub Actions)

Add the same variables as **Repository Secrets**:
`Settings → Secrets and variables → Actions → New repository secret`

| Secret name | Description |
|---|---|
| `BASE_URL` | Application URL |
| `API_BASE_URL` | API base URL (defaults to BASE_URL) |
| `TEST_USER_EMAIL` | Standard test user email |
| `TEST_USER_PASSWORD` | Standard test user password |
| `ADMIN_EMAIL` | Admin user email |
| `ADMIN_PASSWORD` | Admin user password |
| `API_KEY` | API key / bearer token |

The workflow YAML references these with `${{ secrets.SECRET_NAME }}` — they are injected as environment variables and are never printed in logs.

---

## Adding New Pages

1. Create `src/pages/MyPage.ts` extending `BasePage`
2. Export it from `src/pages/index.ts`
3. Add a fixture in `src/fixtures/index.ts` if needed

```typescript
// src/pages/ProfilePage.ts
import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  private readonly nameField: Locator;

  constructor(page: Page) {
    super(page);
    this.nameField = page.getByTestId('profile-name');
  }

  async getName(): Promise<string> {
    return this.getText(this.nameField);
  }
}
```

---

## Adding Test Data

- **JSON**: Add or extend files in `test-data/` and load with `DataHelper.loadJson<MyType>('file.json')`
- **CSV**: Add rows to `test-data/test-cases.csv` and load with `DataHelper.loadCsv<MyType>('file.csv')`
- **Credentials**: Always use `EnvHelper` — never put passwords in test-data files

---

## GitHub Actions Pipeline

The workflow in `.github/workflows/playwright.yml` runs on every push/PR to `main` or `develop`.

**Jobs:**

1. **install** — npm ci + Playwright browser cache
2. **lint** — TypeScript type-check + ESLint
3. **test-api** — API test project (single runner)
4. **test-ui** — UI tests sharded across 3 parallel runners
5. **allure-report** — Merges all results and publishes the Allure HTML report as an artifact (+ GitHub Pages on `main`)

**Manual trigger**: Go to `Actions → Playwright Tests → Run workflow` and optionally pick `all`, `ui`, or `api`.

---

## Allure Report Annotations

Use the `allure` object from `allure-playwright` in your tests:

```typescript
import { allure } from 'allure-playwright';

await allure.epic('Authentication');
await allure.feature('Login');
await allure.story('Valid login');
await allure.severity('critical');        // blocker | critical | normal | minor | trivial
await allure.parameter('username', email);
await allure.description('Verifies the happy-path login flow');
```

---

## Linting

```bash
npm run lint         # Check
npm run lint:fix     # Auto-fix
npm run typecheck    # TypeScript-only check (no emit)
```