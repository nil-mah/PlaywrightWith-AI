import { type APIRequestContext, type APIResponse } from '@playwright/test';
import { EnvHelper } from '../helpers/EnvHelper';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  data?: unknown;
  timeout?: number;
  failOnStatusCode?: boolean;
}

export interface ApiResponse<T = unknown> {
  status: number;
  body: T;
  headers: Record<string, string>;
  ok: boolean;
}

/**
 * ApiClient — thin, typed wrapper around Playwright's APIRequestContext.
 * Handles auth headers, base URL resolution, and JSON serialisation centrally.
 * Each test gets its own instance via the `api` fixture.
 */
export class ApiClient {
  private readonly request: APIRequestContext;
  private readonly baseUrl: string;

  constructor(request: APIRequestContext, baseUrl?: string) {
    this.request = request;
    this.baseUrl = baseUrl ?? EnvHelper.getApiBaseUrl();
  }

  // ─── Core Send ─────────────────────────────────────────────────────────────

  private async send<T>(
    method: HttpMethod,
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const { headers = {}, params, data, timeout, failOnStatusCode = false } = options;

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...this.getAuthHeaders(),
      ...headers,
    };

    let raw: APIResponse;

    switch (method) {
      case 'GET':
        raw = await this.request.get(url, { headers: defaultHeaders, params, timeout });
        break;
      case 'POST':
        raw = await this.request.post(url, { headers: defaultHeaders, params, data, timeout });
        break;
      case 'PUT':
        raw = await this.request.put(url, { headers: defaultHeaders, params, data, timeout });
        break;
      case 'PATCH':
        raw = await this.request.patch(url, { headers: defaultHeaders, params, data, timeout });
        break;
      case 'DELETE':
        raw = await this.request.delete(url, { headers: defaultHeaders, params, timeout });
        break;
    }

    if (failOnStatusCode && !raw.ok()) {
      throw new Error(
        `API ${method} ${url} failed with status ${raw.status()}: ${await raw.text()}`,
      );
    }

    const body = await this.parseBody<T>(raw);

    return {
      status: raw.status(),
      body,
      headers: raw.headers(),
      ok: raw.ok(),
    };
  }

  // ─── HTTP Methods ──────────────────────────────────────────────────────────

  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.send<T>('GET', endpoint, options);
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.send<T>('POST', endpoint, { ...options, data });
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.send<T>('PUT', endpoint, { ...options, data });
  }

  async patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.send<T>('PATCH', endpoint, { ...options, data });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.send<T>('DELETE', endpoint, options);
  }

  // ─── Auth ─────────────────────────────────────────────────────────────────

  /**
   * Returns the auth header. Reads from env so tests never hard-code tokens.
   * Override or extend for OAuth flows.
   */
  private getAuthHeaders(): Record<string, string> {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      return { Authorization: `Bearer ${apiKey}` };
    }
    return {};
  }

  withBearerToken(token: string): ApiClient {
    return new ApiClientWithToken(this.request, this.baseUrl, token);
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private buildUrl(endpoint: string): string {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    return `${this.baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  }

  private async parseBody<T>(response: APIResponse): Promise<T> {
    const contentType = response.headers()['content-type'] ?? '';
    if (contentType.includes('application/json')) {
      return response.json() as Promise<T>;
    }
    return response.text() as unknown as T;
  }
}

/**
 * Internal subclass that injects a specific bearer token.
 * Created via apiClient.withBearerToken(token).
 */
class ApiClientWithToken extends ApiClient {
  private readonly token: string;

  constructor(request: APIRequestContext, baseUrl: string, token: string) {
    super(request, baseUrl);
    this.token = token;
  }

  // @ts-expect-error — intentionally overriding private method via prototype trick
  private getAuthHeaders(): Record<string, string> {
    return { Authorization: `Bearer ${this.token}` };
  }
}
