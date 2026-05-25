/**
 * API Test Fixtures
 * Provides API clients and utilities for tests
 */

import { test as base, APIRequestContext } from '@playwright/test';
import { JsonPlaceholderClient } from '@api/clients/jsonplaceholder-client';
import { requestLogger } from '@api/utils/logger';

type ApiFixtures = {
  apiRequest: APIRequestContext;
  jsonPlaceholder: JsonPlaceholderClient;
};

/**
 * Custom test fixture with API clients
 */
export const test = base.extend<ApiFixtures>({
  jsonPlaceholder: async ({ request }, use) => {
    const client = new JsonPlaceholderClient(request);
    await use(client);

    // Cleanup: Log summary after test
    const logs = requestLogger.getLogs();
    console.log(`\n📊 API Requests Summary:`);
    console.log(`   Total requests: ${logs.length}`);
    console.log(`   Failed: ${requestLogger.getFailedRequests().length}`);
    console.log(`   Avg response time: ${
      logs.length > 0
        ? Math.round(logs.reduce((sum, log) => sum + log.responseTime, 0) / logs.length)
        : 0
    }ms`);
  },
});

export { expect } from '@playwright/test';
