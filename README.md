# Codinex Vercel Deployment

This repository is prepared for deployment on Vercel.

## What changed
- Added Vercel serverless API routes in `api/`
- Added `package.json` and `vercel.json`
- Updated the chatbot to call `/api/query`
- Added a contact form backend at `/api/contact`

## Local development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run locally:
   ```bash
   npm run dev
   ```
3. Set your environment variables in Vercel or a `.env` file:
   - `OPENAI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Deployment
Deploy the root folder to Vercel. The static frontend and API routes will work together.

## Supabase setup
Create a Supabase project, then create the `contacts` table with:

```sql
CREATE TABLE contacts (
  id serial PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  service text,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

Set the following Vercel environment variables:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
# codinex_project
