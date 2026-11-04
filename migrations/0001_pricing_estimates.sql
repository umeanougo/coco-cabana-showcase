-- Cloudflare D1 binding ESTIMATES_DB. No public read/update route is exposed.
CREATE TABLE IF NOT EXISTS pricing_estimates (
 public_reference TEXT PRIMARY KEY,
 payload_hash TEXT NOT NULL,
 payload TEXT NOT NULL,
 email_delivery_status TEXT NOT NULL DEFAULT 'pending',
 webhook_status TEXT NOT NULL DEFAULT 'pending',
 created_at INTEGER NOT NULL,
 updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS estimate_rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS estimate_rate_expiry ON estimate_rate_limits(expires_at);
