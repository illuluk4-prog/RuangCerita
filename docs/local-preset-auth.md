# Authentication

Local development uses preset accounts and does not require a Supabase project for login.

## Local development accounts

The account names, passwords, and roles are defined in `src/lib/studentsData.ts`. The login form accepts a username and password. Public registration is not available.

Local sessions use an `HttpOnly`, `SameSite=Lax` HMAC cookie. An optional `LOCAL_SESSION_SECRET` in `.env.local` keeps sessions stable across dev-server restarts. Without it, the development server creates a random secret and existing sessions expire when the server restarts.

## Vercel production authentication

Production uses Supabase Auth. Configure these Vercel environment variables for Production:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; never expose it with a `NEXT_PUBLIC_` prefix)

Run `supabase/schema.sql` in the Supabase SQL Editor. Create each student and teacher as a Supabase Auth user with a unique email, password, and user metadata containing the desired `username`. The schema trigger creates a student profile; set teacher roles explicitly in the SQL Editor, for example:

```sql
update public.profiles set role = 'guru' where username = 'guru';
```

Users sign in with their profile username and the password assigned in Supabase Auth. The server-only `get_auth_email_by_username` function maps the username to the Auth email; it cannot be called by anonymous or regular authenticated clients.

After setting environment variables and running the schema, redeploy the `main` branch in Vercel. Changes to Vercel environment variables require a new deployment.

## Production data storage

Check-ins, quiz attempts, and teacher-created questions still use the local `data/learning-records.json` store. Vercel's serverless filesystem is not persistent or shared across instances, so these records must be migrated to Supabase before relying on them for real students or expecting them to sync across devices.

## Local records

During local development, check-ins and practice attempts are stored in `data/learning-records.json`, keyed by username. The file is ignored by Git.