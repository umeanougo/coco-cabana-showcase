import type { Submission } from "../lib/pricing-calculator/validation";
import type { Estimate } from "../lib/pricing-calculator/calculate-estimate";
export interface Statement {
  bind(...values: unknown[]): Statement;
  run(): Promise<unknown>;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<{ results: T[] }>;
}
export interface EstimateDB {
  prepare(sql: string): Statement;
  batch(statements: Statement[]): Promise<unknown[]>;
}
export type Snapshot = {
  schemaVersion: 2;
  catalogVersion: string;
  data: Submission;
  estimate: Estimate;
  disclaimer: string;
  exclusions: string;
  createdAt: number;
  preview: boolean;
};
export const schema = `
CREATE TABLE IF NOT EXISTS calculator_estimates_v2(reference TEXT PRIMARY KEY,request_hash TEXT NOT NULL,snapshot TEXT NOT NULL,created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS calculator_outbox_v2(id TEXT PRIMARY KEY,reference TEXT NOT NULL,channel TEXT NOT NULL,envelope TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'pending',provider_id TEXT,created_at INTEGER NOT NULL,lease_until INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS estimate_rate_limits(key TEXT PRIMARY KEY,count INTEGER NOT NULL,expires_at INTEGER NOT NULL);
`;
