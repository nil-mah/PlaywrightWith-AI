import * as fs from 'fs';
import * as path from 'path';
import { parse as parseCsv } from 'csv-parse/sync';

/**
 * DataHelper — utilities for loading test data from JSON and CSV files.
 *
 * Usage:
 *   const users = DataHelper.loadJson<User[]>('users.json');
 *   const cases = DataHelper.loadCsv<TestCase>('test-cases.csv');
 */
export class DataHelper {
  private static readonly dataDir = path.resolve(__dirname, '../../test-data');

  // ─── JSON ──────────────────────────────────────────────────────────────────

  /**
   * Load and parse a JSON file from the test-data directory.
   * @param fileName  e.g. 'users.json'
   */
  static loadJson<T>(fileName: string): T {
    const filePath = path.join(DataHelper.dataDir, fileName);
    DataHelper.assertFileExists(filePath);
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  }

  // ─── CSV ───────────────────────────────────────────────────────────────────

  /**
   * Load and parse a CSV file from the test-data directory.
   * Assumes the first row is the header row.
   * @param fileName  e.g. 'test-cases.csv'
   */
  static loadCsv<T extends Record<string, string>>(fileName: string): T[] {
    const filePath = path.join(DataHelper.dataDir, fileName);
    DataHelper.assertFileExists(filePath);
    const raw = fs.readFileSync(filePath, 'utf-8');
    return parseCsv(raw, {
      columns: true,          // Use first row as keys
      skip_empty_lines: true,
      trim: true,
    }) as T[];
  }

  // ─── Lookup helpers ────────────────────────────────────────────────────────

  /**
   * Find a single user from users.json by role.
   * Throws if no user is found for that role.
   */
  static getUserByRole<T extends { role: string }>(role: string): T {
    const users = DataHelper.loadJson<T[]>('users.json');
    const user = users.find((u) => u.role === role);
    if (!user) {
      throw new Error(`[DataHelper] No user found with role "${role}" in users.json`);
    }
    return user;
  }

  // ─── Private ───────────────────────────────────────────────────────────────

  private static assertFileExists(filePath: string): void {
    if (!fs.existsSync(filePath)) {
      throw new Error(`[DataHelper] Test-data file not found: ${filePath}`);
    }
  }
}
