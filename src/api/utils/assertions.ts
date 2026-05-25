/**
 * API Assertion Helpers
 * Custom assertions for API testing with detailed error messages
 */

import { expect } from '@playwright/test';

export class ApiAssertions {
  /**
   * Assert response status is successful
   */
  static assertSuccessStatus(status: number): void {
    expect(status).toBeGreaterThanOrEqual(200);
    expect(status).toBeLessThan(300);
  }

  /**
   * Assert response status is client error
   */
  static assertClientErrorStatus(status: number): void {
    expect(status).toBeGreaterThanOrEqual(400);
    expect(status).toBeLessThan(500);
  }

  /**
   * Assert response status is server error
   */
  static assertServerErrorStatus(status: number): void {
    expect(status).toBeGreaterThanOrEqual(500);
    expect(status).toBeLessThan(600);
  }

  /**
   * Assert specific status code
   */
  static assertStatusCode(actual: number, expected: number): void {
    expect(actual).toBe(expected);
  }

  /**
   * Assert response body contains property
   */
  static assertResponseContainsProperty(
    body: any,
    property: string
  ): void {
    expect(body).toHaveProperty(property);
  }

  /**
   * Assert response body matches schema
   */
  static assertResponseSchema(body: any, schema: Record<string, string>): void {
    Object.entries(schema).forEach(([key, type]) => {
      expect(body).toHaveProperty(key);
      expect(typeof body[key]).toBe(type);
    });
  }

  /**
   * Assert response array contains expected number of items
   */
  static assertArrayLength(array: any[], expectedLength: number): void {
    expect(Array.isArray(array)).toBe(true);
    expect(array).toHaveLength(expectedLength);
  }

  /**
   * Assert response array is not empty
   */
  static assertArrayNotEmpty(array: any[]): void {
    expect(Array.isArray(array)).toBe(true);
    expect(array.length).toBeGreaterThan(0);
  }

  /**
   * Assert object properties match expected values
   */
  static assertObjectProperties(
    actual: Record<string, any>,
    expected: Record<string, any>
  ): void {
    Object.entries(expected).forEach(([key, value]) => {
      expect(actual[key]).toBe(value);
    });
  }

  /**
   * Assert response time is within acceptable range
   */
  static assertResponseTime(
    responseTime: number,
    maxTime: number = 5000
  ): void {
    expect(responseTime).toBeLessThanOrEqual(maxTime);
  }

  /**
   * Assert header is present and has expected value
   */
  static assertHeader(
    headers: Record<string, string>,
    headerName: string,
    expectedValue?: string
  ): void {
    expect(headers[headerName] || headers[headerName.toLowerCase()]).toBeDefined();
    if (expectedValue) {
      expect(
        headers[headerName] || headers[headerName.toLowerCase()]
      ).toContain(expectedValue);
    }
  }

  /**
   * Assert Content-Type header
   */
  static assertContentType(
    headers: Record<string, string>,
    contentType: string
  ): void {
    const type = headers['content-type'] || headers['Content-Type'];
    expect(type).toContain(contentType);
  }
}
