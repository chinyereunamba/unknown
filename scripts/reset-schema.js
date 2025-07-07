#!/usr/bin/env node

/**
 * NextAuth.js Database Schema Reset for Supabase
 * This script drops existing tables and creates the required tables for NextAuth.js
 */

const { Pool } = require("pg");
require("dotenv").config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL not found in .env.local");
  console.log("Please set up your Supabase database URL first.");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20,
  host: connectionString.match(/@([^:]+):/)?.[1] || undefined,
  port: 5432,
});

const schemaSQL = `
-- Drop existing tables in correct order (due to foreign key constraints)
DROP TABLE IF EXISTS verification_tokens CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop triggers and functions
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_accounts_updated_at ON accounts;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- NextAuth.js Database Schema for Supabase
-- This creates all the required tables for NextAuth.js with Supabase adapter

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  email_verified TIMESTAMP,
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accounts table (for OAuth providers)
CREATE TABLE IF NOT EXISTS accounts (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type VARCHAR(255),
  scope VARCHAR(255),
  id_token TEXT,
  session_state VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider, provider_account_id)
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Verification tokens table (for email verification)
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) PRIMARY KEY,
  expires TIMESTAMP NOT NULL,
  UNIQUE(identifier, token)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_provider ON accounts(provider);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_session_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_identifier ON verification_tokens(identifier);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON verification_tokens(token);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

async function resetDatabaseSchema() {
  try {
    console.log("🔗 Connecting to Supabase database...");

    // Test connection
    const client = await pool.connect();
    console.log("✅ Connected to database successfully");

    console.log("🗑️  Dropping existing tables...");
    console.log("📝 Creating NextAuth.js schema...");

    // Execute schema reset
    await client.query(schemaSQL);

    console.log("✅ Database schema reset successfully!");
    console.log("");
    console.log("📋 Created tables:");
    console.log("  - users (user accounts)");
    console.log("  - accounts (OAuth connections)");
    console.log("  - sessions (user sessions)");
    console.log("  - verification_tokens (email verification)");
    console.log("");
    console.log(
      "🔍 You can now check your Supabase dashboard to see these tables."
    );
    console.log("   Go to: Table Editor in your Supabase project");

    client.release();
    await pool.end();
  } catch (error) {
    console.error("❌ Error resetting schema:", error.message);

    if (error.code === "ECONNREFUSED") {
      console.log(
        "💡 Make sure your DATABASE_URL is correct and Supabase is accessible."
      );
    } else if (error.code === "28P01") {
      console.log("💡 Check your database password in DATABASE_URL.");
    } else if (error.code === "ENETUNREACH") {
      console.log("💡 Network unreachable. This might be an IPv6 issue.");
      console.log(
        "💡 Try updating your DATABASE_URL to use IPv4 or check your network settings."
      );
    }

    process.exit(1);
  }
}

resetDatabaseSchema();
