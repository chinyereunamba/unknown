import { betterAuth } from "better-auth";
import { Pool } from "pg";
 
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data, request) {
      // Send an email to the user with a link to reset their password
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  // database: new Pool({
  //   connectionString: process.env.DATABASE_URL,
  // }),
});
