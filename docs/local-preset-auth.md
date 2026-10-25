# Local Preset Accounts

RuangCerita development uses local preset accounts and does not require a Supabase project for login, check-ins, or practice attempts.

## Accounts

- Students: `siswa01` through `siswa30`
- Teacher: `guru`
- Password for all preset accounts: `123`

The account list and roles are defined in `src/lib/studentsData.ts`. The login form accepts username and password only. Public registration is not available.

## Sessions and access

The server signs an `HttpOnly`, `SameSite=Lax` cookie using HMAC. The Next.js proxy verifies the signature and preset role before allowing access. Student accounts can access learning routes; only `guru` can access `/dashboard-guru`.

Preset authentication is development-only and intentionally refuses login in production. An optional `LOCAL_SESSION_SECRET` can be set in `.env.local` to keep sessions stable across dev-server restarts. Without it, the server creates a random process-local secret and existing sessions expire when the server restarts.

## Local records

Check-ins and practice attempts are written server-side to `data/learning-records.json`, keyed by the username from the verified session. This file is ignored by Git. Do not use this JSON store for a multi-instance production deployment; move records to a database with row-level security before deploying real student data.

Teacher-created questions are stored in the same local file. Answer keys are removed from responses to student sessions and are evaluated only in the server route.