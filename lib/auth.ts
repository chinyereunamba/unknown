// import { betterAuth } from "better-auth";
// import { Pool } from "pg";
// import { sendEmail } from "./email";

// // Database configuration with better error handling
// const createDatabasePool = () => {
//   const connectionString = process.env.DATABASE_URL;

//   if (!connectionString) {
//     console.warn("DATABASE_URL not found, using in-memory storage");
//     return undefined;
//   }

//   try {
//     // Extract host from connection string to force IPv4
//     const hostMatch = connectionString.match(/@([^:]+):/);
//     const host = hostMatch ? hostMatch[1] : undefined;

//     const pool = new Pool({
//       connectionString,
//       // Add connection timeout and retry settings
//       connectionTimeoutMillis: 10000, // 10 seconds
//       idleTimeoutMillis: 30000, // 30 seconds
//       max: 20, // Maximum number of clients
//       ssl:
//         process.env.NODE_ENV === "production"
//           ? { rejectUnauthorized: false }
//           : false,
//       // Force IPv4 connections to avoid ENETUNREACH errors
//       host,
//       port: 5432,
//     });

//     // Test the connection
//     pool.query("SELECT NOW()", (err) => {
//       if (err) {
//         console.error("Database connection failed:", err.message);
//         if ((err as any).code === "ENETUNREACH") {
//           console.warn("💡 IPv6 connection issue detected. Trying IPv4...");
//         }
//       } else {
//         console.log("✅ Database connected successfully");
//       }
//     });

//     return pool;
//   } catch (error) {
//     console.error("Failed to create database pool:", error);
//     return undefined;
//   }
// };

// // Validate OAuth configuration
// const validateOAuthConfig = () => {
//   const googleClientId = process.env.GOOGLE_CLIENT_ID;
//   const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
//   const betterAuthSecret = process.env.BETTER_AUTH_SECRET;
//   const appUrl = process.env.NEXT_PUBLIC_APP_URL;

//   if (!googleClientId || googleClientId === "your_google_client_id_here") {
//     console.warn(
//       "⚠️  GOOGLE_CLIENT_ID not configured. Google OAuth will not work."
//     );
//   }

//   if (
//     !googleClientSecret ||
//     googleClientSecret === "your_google_client_secret_here"
//   ) {
//     console.warn(
//       "⚠️  GOOGLE_CLIENT_SECRET not configured. Google OAuth will not work."
//     );
//   }

//   if (
//     !betterAuthSecret ||
//     betterAuthSecret === "your_better_auth_secret_here"
//   ) {
//     console.warn(
//       "⚠️  BETTER_AUTH_SECRET not configured. Using default secret."
//     );
//   }

//   if (!appUrl) {
//     console.warn(
//       "⚠️  NEXT_PUBLIC_APP_URL not configured. Using localhost:3000."
//     );
//   }

//   return {
//     googleClientId,
//     googleClientSecret,
//     betterAuthSecret,
//     appUrl: appUrl || "http://localhost:3000",
//   };
// };

// const config = validateOAuthConfig();

// export const auth = betterAuth({
//   emailVerification: {
//     sendVerificationEmail: async ({ user, url, token }, request) => {
//       await sendEmail({
//         to: user.email,
//         subject: "Verify your email address",
//         text: `Click the link to verify your email: ${url}`,
//       });
//     },
//   },
//   emailAndPassword: {
//     enabled: true,
//     async sendResetPassword({ user, url, token }, request) {
//       await sendEmail({
//         to: user.email,
//         subject: "Reset your password",
//         text: `Click the link to reset your password: ${url}`,
//       });
//     },
//   },
//   socialProviders:
//     config.googleClientId && config.googleClientSecret
//       ? {
//           google: {
//             clientId: config.googleClientId,
//             clientSecret: config.googleClientSecret,
//           },
//         }
//       : undefined,
//   secret:
//     config.betterAuthSecret || "sJnzYMQ4x1gb6Bt3siVK/FkpG9aiWuM/GAS0BnaHwZY=",

//   /** Use database if available, otherwise use memory */
//   database: createDatabasePool(),

//   session: {
//     expiresIn: 60 * 60 * 24 * 7,
//     updateAge: 60 * 60 * 24,
//     strategy: "database",
//     cookie: {
//       name: "session",
//       expires: false,
//     },
//   },
// });
import { betterAuth } from "better-auth";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { reactResetPasswordEmail } from "./email/reset-password";
import { resend } from "./email/resend";
import { MysqlDialect } from "kysely";
import { createPool } from "mysql2/promise";

const from = process.env.BETTER_AUTH_EMAIL || "delivered@resend.dev";
const to = process.env.TEST_EMAIL || "";

const libsql = new LibsqlDialect({
  url: process.env.TURSO_DATABASE_URL || "",
  authToken: process.env.TURSO_AUTH_TOKEN || "",
});

const mysql = process.env.USE_MYSQL
  ? new MysqlDialect(createPool(process.env.MYSQL_DATABASE_URL || ""))
  : null;

const dialect = process.env.USE_MYSQL ? mysql : libsql;

if (!dialect) {
  throw new Error("No dialect found");
}

export const auth = betterAuth({
  appName: "Better Auth Demo",
  database: {
    dialect: libsql,
    type: "sqlite",
  },
  emailVerification: {
    async sendVerificationEmail({ user, url }) {
      const res = await resend.emails.send({
        from,
        to: to || user.email,
        subject: "Verify your email address",
        html: `<a href="${url}">Verify your email address</a>`,
      });
      console.log(res, user.email);
    },
  },
  account: {
    accountLinking: {
      trustedProviders: ["google"],
    },
  },
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      await resend.emails.send({
        from,
        to: user.email,
        subject: "Reset your password",
        react: reactResetPasswordEmail({
          username: user.email,
          resetLink: url,
        }),
      });
    },
  },
  socialProviders: {
    
    google: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  
  trustedOrigins: ["exp://"],
});