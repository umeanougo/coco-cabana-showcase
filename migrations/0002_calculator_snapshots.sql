
CREATE TABLE IF NOT EXISTS calculator_estimates_v2(reference TEXT PRIMARY KEY,request_hash TEXT NOT NULL,snapshot TEXT NOT NULL,created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS calculator_outbox_v2(id TEXT PRIMARY KEY,reference TEXT NOT NULL,channel TEXT NOT NULL,envelope TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'pending',provider_id TEXT,created_at INTEGER NOT NULL,lease_until INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS estimate_rate_limits(key TEXT PRIMARY KEY,count INTEGER NOT NULL,expires_at INTEGER NOT NULL);
