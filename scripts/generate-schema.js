#!/usr/bin/env node

/**
 * Better Auth Database Schema Generator for Supabase
 * This script creates the required tables for Better Auth in your Supabase database
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
  // Force IPv4 connections to avoid ENETUNREACH errors
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20,
  // Add these options to force IPv4
  host: connectionString.match(/@([^:]+):/)?.[1] || undefined,
  port: 5432,
});

const schema = `
-- Better Auth Database Schema for Supabase
-- This creates all the required tables for user authentication

-- Users table
-- USERS
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  image VARCHAR(255),
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SESSIONS
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ACCOUNTS
CREATE TABLE IF NOT EXISTS accounts (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

-- VERIFICATION TOKENS
CREATE TABLE IF NOT EXISTS verifications (
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) PRIMARY KEY,
  expiresAt TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_provider ON accounts(provider);
CREATE INDEX IF NOT EXISTS idx_verifications_identifier ON verifications(identifier);
CREATE INDEX IF NOT EXISTS idx_verifications_token ON verifications(token);

-- Triggers for updated_at
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

async function generateSchema() {
  try {
    console.log("🔗 Connecting to Supabase database...");

    // Test connection
    const client = await pool.connect();
    console.log("✅ Connected to database successfully");

    console.log("📝 Generating Better Auth schema...");

    // Execute schema
    await client.query(schema);

    console.log("✅ Database schema generated successfully!");
    console.log("");
    console.log("📋 Created tables:");
    console.log("  - users (user accounts)");
    console.log("  - sessions (user sessions)");
    console.log("  - accounts (OAuth connections)");
    console.log("  - verification_tokens (email verification)");
    console.log("");
    console.log(
      "🔍 You can now check your Supabase dashboard to see these tables."
    );
    console.log("   Go to: Table Editor in your Supabase project");

    client.release();
    await pool.end();
  } catch (error) {
    console.error("❌ Error generating schema:", error.message);

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

generateSchema();
