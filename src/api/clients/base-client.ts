/**
 * Base API Client
 * Provides common functionality for making HTTP requests
 */

import { APIRequestContext } from '@playwright/test';
import { requestLogger, RequestLog } from '../utils/logger';
import { ApiResponse } from '../models';

export class BaseApiClient {
  protected baseUrl: string;
  protected request: APIRequestContext;
  protected defaultHeaders: Record<string, string>;

  constructor(
    request: APIRequestContext,
    baseUrl: string,
    defaultHeaders?: Record<string, string>
  ) {
    this.request = request;
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
  }

  /**
   * Make GET request
   */
  async get<T = any>(
    endpoint: string,
    options?: { headers?: Record<string, string>; params?: Record<string, any> }
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.params);
    const startTime = Date.now();

    const response = await this.request.get(url, {
      headers: { ...this.defaultHeaders, ...options?.headers },
    });

    return this.parseResponse(response, startTime, 'GET', url);
  }

  /**
   * Make POST request
   */
  async post<T = any>(
    endpoint: string,
    data?: any,
    options?: { headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const startTime = Date.now();

    const response = await this.request.post(url, {
      headers: { ...this.defaultHeaders, ...options?.headers },
      data,
    });

    return this.parseResponse(response, startTime, 'POST', url, data);
  }

  /**
   * Make PUT request
   */
  async put<T = any>(
    endpoint: string,
    data?: any,
    options?: { headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const startTime = Date.now();

    const response = await this.request.put(url, {
      headers: { ...this.defaultHeaders, ...options?.headers },
      data,
    });

    return this.parseResponse(response, startTime, 'PUT', url, data);
  }

  /**
   * Make PATCH request
   */
  async patch<T = any>(
    endpoint: string,
    data?: any,
    options?: { headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const startTime = Date.now();

    const response = await this.request.patch(url, {
      headers: { ...this.defaultHeaders, ...options?.headers },
      data,
    });

    return this.parseResponse(response, startTime, 'PATCH', url, data);
  }

  /**
   * Make DELETE request
   */
  async delete<T = any>(
    endpoint: string,
    options?: { headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const startTime = Date.now();

    const response = await this.request.delete(url, {
      headers: { ...this.defaultHeaders, ...options?.headers },
    });

    return this.parseResponse(response, startTime, 'DELETE', url);
  }

  /**
   * Build full URL from endpoint
   */
  protected buildUrl(
    endpoint: string,
    params?: Record<string, any>
  ): string {
    let url = `${this.baseUrl}${endpoint}`;

    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
      const query = queryParams.toString();
      if (query) {
        url += `?${query}`;
      }
    }

    return url;
  }

  /**
   * Parse response and log it
   */
  protected async parseResponse<T = any>(
    response: any,
    startTime: number,
    method: string,
    url: string,
    requestBody?: any
  ): Promise<ApiResponse<T>> {
    const responseTime = Date.now() - startTime;
    const status = response.status();
    
    // Get headers - handle different Playwright versions
    let headers: Record<string, string> = {};
    if (typeof response.headers === 'function') {
      headers = response.headers();
    } else if (typeof response.allHeaders === 'function') {
      headers = await response.allHeaders();
    } else if (typeof response.headersArray === 'function') {
      const headerArray = response.headersArray();
      headers = headerArray.reduce((acc: Record<string, string>, [key, value]: [string, string]) => {
        acc[key] = value;
        return acc;
      }, {});
    }

    let body: T;
    try {
      body = await response.json();
    } catch (e) {
      body = (await response.text()) as any;
    }

    const apiResponse: ApiResponse<T> = {
      status,
      statusText: response.statusText(),
      headers,
      body,
      url,
      ok: response.ok(),
    };

    // Log the request
    const logEntry: RequestLog = {
      timestamp: new Date().toISOString(),
      method,
      url,
      body: requestBody,
      status,
      responseTime,
      responseBody: body,
      responseHeaders: headers,
    };

    requestLogger.log(logEntry);

    return apiResponse;
  }
}
