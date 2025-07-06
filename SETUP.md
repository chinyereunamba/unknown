# 🔐 Authentication Setup Guide

This guide will help you set up the authentication system for your SummaryAI application.

## 📋 Prerequisites

- Node.js 18+ or Bun
- A Google Cloud Console account
- A Supabase account (for database)

## 🚀 Quick Setup

### 1. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

### 2. Generate Better Auth Secret

```bash
openssl rand -base64 32
```

Copy the output and add it to your `.env.local` file as `BETTER_AUTH_SECRET`.

### 3. Google OAuth Setup

#### Step 1: Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it

#### Step 2: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Configure the OAuth consent screen:
   - User Type: External
   - App name: SummaryAI
   - User support email: your email
   - Developer contact information: your email

#### Step 3: Create OAuth Client

1. Application type: Web application
2. Name: SummaryAI Web Client
3. **Authorized redirect URIs** (add these):
   ```
   http://localhost:3000/api/auth/callback/google
   https://yourdomain.com/api/auth/callback/google
   ```

#### Step 4: Get Credentials

Copy the Client ID and Client Secret to your `.env.local`:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

### 4. Database Setup (Supabase)

#### Step 1: Create Supabase Project

1. Go to [Supabase](https://supabase.com/)
2. Sign up/Login and create a new project
3. Wait for the project to be set up (usually takes 1-2 minutes)

#### Step 2: Get Database Connection String

1. In your Supabase dashboard, go to **Settings** → **Database**
2. Scroll down to **Connection string**
3. Select **URI** format
4. Copy the connection string that looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```

#### Step 3: Update Environment Variables

Replace `[YOUR-PASSWORD]` with your actual database password (found in the same Database settings page).

Your `.env.local` should include:

```env
DATABASE_URL=postgresql://postgres:your_actual_password@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

#### Step 4: Generate Database Schema

Better Auth will automatically create the required tables when you first use the database. However, you can also generate the schema manually:

```bash
# Install Better Auth CLI if not already installed
bun add -g @better-auth/cli

# Generate schema (this will create the tables in your Supabase database)
better-auth generate-schema
```

### 5. Final Environment Configuration

Your `.env.local` should look like this:

```env
# Better Auth Configuration
GOOGLE_CLIENT_ID=your_actual_google_client_id
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret
BETTER_AUTH_SECRET=sJnzYMQ4x1gb6Bt3siVK/FkpG9aiWuM/GAS0BnaHwZY=

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (Supabase)
DATABASE_URL=postgresql://postgres:your_actual_password@db.xxxxxxxxxxxxx.supabase.co:5432/postgres

# Other variables
NEXT_PUBLIC_AUTUMN_BACKEND_URL=your_autumn_backend_url_here
```

## 🧪 Testing

### 1. Start the Development Server

```bash
bun run dev
```

### 2. Test Authentication

1. Visit `http://localhost:3000/login`
2. Try signing in with Google
3. Check the console for any error messages

### 3. Verify Database Connection

You should see these messages in the console:

- ✅ Database connected successfully
- No more "using in-memory storage" warnings

### 4. Check Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Table Editor**
3. You should see tables like `users`, `sessions`, `accounts` created by Better Auth

## 🔧 Troubleshooting

### OAuth Timeout Issues

- Check your internet connection
- Verify redirect URIs in Google Cloud Console
- Ensure Google+ API is enabled
- Check if your Google account has 2FA enabled

### Database Connection Issues

- Verify your Supabase credentials
- Check if your IP is whitelisted in Supabase
- Ensure the password in DATABASE_URL is correct
- Try connecting from Supabase dashboard to test credentials

### Common Errors

- `invalid_code`: OAuth configuration issue
- `ETIMEDOUT`: Network or database connection issue
- `No database configuration`: Using in-memory storage
- `password authentication failed`: Wrong database password

## 📚 Additional Resources

- [Better Auth Documentation](https://better-auth.com/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Documentation](https://supabase.com/docs)

## 🆘 Need Help?

If you encounter issues:

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all redirect URIs are properly configured
4. Test database connection in Supabase dashboard
5. Check if tables are created in Supabase Table Editor
