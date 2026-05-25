/**
 * API Request Logger
 * Logs API requests and responses for debugging and audit trails
 */

import * as fs from 'fs';
import * as path from 'path';

export interface RequestLog {
  timestamp: string;
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: any;
  status: number;
  responseTime: number;
  responseBody?: any;
  responseHeaders?: Record<string, string>;
}

class RequestLogger {
  private logs: RequestLog[] = [];
  private logFile: string;

  constructor() {
    const logsDir = path.join(__dirname, '../../../test-results/api-logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    this.logFile = path.join(logsDir, `api-logs-${Date.now()}.json`);
  }

  /**
   * Log API request and response
   */
  log(logEntry: RequestLog): void {
    this.logs.push(logEntry);
    this.persistLog(logEntry);
  }

  /**
   * Persist log to file
   */
  private persistLog(logEntry: RequestLog): void {
    fs.appendFileSync(
      this.logFile,
      JSON.stringify(logEntry, null, 2) + ',\n'
    );
  }

  /**
   * Get all logs
   */
  getLogs(): RequestLog[] {
    return this.logs;
  }

  /**
   * Get logs by method
   */
  getLogsByMethod(method: string): RequestLog[] {
    return this.logs.filter(log => log.method === method);
  }

  /**
   * Get logs by status code
   */
  getLogsByStatus(status: number): RequestLog[] {
    return this.logs.filter(log => log.status === status);
  }

  /**
   * Get failed requests
   */
  getFailedRequests(): RequestLog[] {
    return this.logs.filter(log => log.status >= 400);
  }

  /**
   * Clear logs
   */
  clear(): void {
    this.logs = [];
  }
}

export const requestLogger = new RequestLogger();
