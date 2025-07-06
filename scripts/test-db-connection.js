#!/usr/bin/env node

/**
 * Simple database connection test for Supabase
 */

const { Pool } = require("pg");
require("dotenv").config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL not found in .env.local");
  process.exit(1);
}

console.log("🔗 Testing database connection...");
console.log("URL format:", connectionString.replace(/:[^:@]*@/, ":****@")); // Hide password

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }, // Always use SSL for Supabase
  connectionTimeoutMillis: 30000, // 30 seconds
});

async function testConnection() {
  try {
    console.log("📡 Attempting to connect...");
    const client = await pool.connect();
    console.log("✅ Connected successfully!");

    const result = await client.query("SELECT NOW() as current_time");
    console.log("⏰ Database time:", result.rows[0].current_time);

    client.release();
    await pool.end();

    console.log("✅ Connection test passed!");
  } catch (error) {
    console.error("❌ Connection failed:", error.message);

    if (error.code === "ECONNREFUSED") {
      console.log(
        "💡 Connection refused. Check if the host and port are correct."
      );
    } else if (error.code === "28P01") {
      console.log("💡 Authentication failed. Check your password.");
    } else if (error.code === "ENOTFOUND") {
      console.log("💡 Host not found. Check your DATABASE_URL.");
    } else if (error.code === "ETIMEDOUT") {
      console.log(
        "💡 Connection timed out. Check your network or firewall settings."
      );
    }

    process.exit(1);
  }
}

testConnection();
