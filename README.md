# Playwright TypeScript Framework

A production-ready end-to-end test framework using **Playwright + TypeScript** with Page Object Model, data-driven testing, and GitHub Actions CI.

---

## Features

| Feature | Details |
|---|---|
| **Language** | TypeScript 5 (strict mode) |
| **Test runner** | Playwright Test (latest) |
| **Architecture** | Page Object Model (POM) |
| **Test data** | JSON + CSV files — no hard-coded values |
| **Credentials** | `.env` locally, GitHub Secrets in CI |
| **Reporting** | Playwright HTML report |
| **CI/CD** | GitHub Actions with sharding & caching |
| **Linting** | ESLint + `@typescript-eslint` |
| **Test types** | UI (Chromium)

---

## Project Structure

```
playwright-ts-framework/
├── .github/
│   └── workflows/
│       └── playwright.yml        # CI pipeline
├── src/
│   ├── fixtures/
│   │   └── index.ts              # Custom Playwright fixtures (POM)
│   ├── helpers/
│   │   └── DataHelper.ts         # JSON/CSV loader
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

# Run with browser visible
npm run test:headed

# Debug a specific test
npm run test:debug -- tests/ui/login.spec.ts
```

### 4. View reports

```bash
# Playwright HTML report
npm run test:report
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
| `TEST_USER_EMAIL` | Standard test user email |
| `TEST_USER_PASSWORD` | Standard test user password |
| `ADMIN_EMAIL` | Admin user email |
| `ADMIN_PASSWORD` | Admin user password |

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
- **Credentials**: Use `.env` variables via `dotenv` — never put passwords in test-data files

---

## GitHub Actions Pipeline

The workflow in `.github/workflows/playwright.yml` runs on every push/PR to `main` or `develop`.

**Jobs:**

1. **install** — npm ci + Playwright browser cache
2. **lint** — TypeScript type-check + ESLint
3. **test-ui** — UI tests sharded across 3 parallel runners

**Manual trigger**: Go to `Actions → Playwright Tests → Run workflow` and optionally pick `all` or `ui`.

---

## Linting

```bash
npm run lint         # Check
npm run lint:fix     # Auto-fix
npm run typecheck    # TypeScript-only check (no emit)
```