# Optional accounts and learning progress

Production app: https://article.fikss.site/akun
Supabase project: personal-branding (cjwwkdglhnegpszliwlc).

## Authentication configuration

Email/password is enabled; Google is not configured and is not advertised.
Keep the existing Site URL for the portfolio. Add `https://article.fikss.site/akun` to Authentication → URL Configuration → Redirect URLs for education confirmation and password recovery. Do not replace the portfolio Site URL.
After verifying the redirect and email sender, set the Vercel production variable `EDUCATION_EMAIL_AUTH_READY=true` and redeploy to enable signup and password recovery. Until then the account page permits existing verified accounts to sign in and explains that new registration is being prepared.

Check Authentication → Email configuration before opening signups to the public. Supabase's built-in email sender has restricted recipients and quotas; configure a verified SMTP sender for public signup/recovery if one is not already configured. No SMTP credentials are committed to this repository. Enable leaked-password protection when the project's plan supports it.

Required public Vercel variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. A publishable key is intentionally browser-visible; no service_role key is used.

## Private progress model

`public.education_learning_progress` is keyed by `(user_id, academy, lesson_slug)` with `completed` and a server-maintained `updated_at`. Academies are listrik, jaringan, iot. False rows preserve deliberate completion removal. RLS restricts SELECT, INSERT, and UPDATE to auth.uid() = user_id. Anonymous roles have no access; clients have no DELETE grant. No existing portfolio tables are modified.

Local progress uses fiks-learning-v2:guest or fiks-learning-v2:<user uuid>. Legacy electricity keys and network/IoT lists migrate once. At first account sync, guest completion is imported only when no account record exists (including a false record). After successful sync, imported guest entries are removed from the guest cache. Signing out switches back to the separate guest cache; it never copies account progress into another account.

Dirty local edits survive remote refresh and are uploaded per lesson. Acknowledgements only clear matching revisions, preserving clicks made during a request. Other devices refresh on foreground, online, explicit Sync, and every 60 seconds while logged in. Conflicting edits to the same lesson use the last successfully uploaded edit. Offline storage is browser-local until syncing succeeds.

## Verification

npm run build
node scripts/check-account-progress.cjs

RLS was tested transactionally with two synthetic users and rollback: owner read/write, false completion updates, blocked other-user read/insert/ownership reassignment. No test accounts or rows were retained. Email delivery and interactive login must be verified using an actual email after sender/redirect configuration. No verification email is sent automatically by deployment.

## Existing project policy findings

A read-only audit found pre-existing PUBLIC policies with unconditional access on cms_config, contacts, documents, guestbook, and sent_emails. These were not changed by this feature; review their privileges and the portfolio's intended admin identity before enabling public account signup. Merely enabling RLS does not protect a table when the policy allows every row. See https://supabase.com/docs/guides/database/postgres/row-level-security . The new education progress table has separate ownership policies and passed isolation tests.

## Login repair (27 October 2026)

The production readiness flag was absent. Public Auth settings confirmed that email/password is enabled, signup is allowed by the backend, and email confirmation is required. SMTP readiness and the redirect allowlist could not be verified because dashboard authentication was declined. Do not enable the readiness flag until a real confirmation and recovery email have been tested. No confirmation requirement was disabled and no production test user was created.

The account UI now explains the signup dependency when the signup tab is selected. Login distinguishes invalid credentials, unconfirmed email, throttling, and network failures. Requests have a 15-second abort deadline; session initialization has a bounded loading indicator. Mode switching and field edits are disabled during submission. Browser-storage failures no longer leave the account provider loading indefinitely.

Verification: npm run typecheck; node scripts/check-auth-errors.cjs; node scripts/check-account-progress.cjs; npm run build. Successful real-account login and email delivery remain unverified until dashboard access and a test mailbox are available.
