# Google-only accounts

The education app uses Auth.js with Google OAuth and encrypted JWT session cookies. Email/password signup, recovery, the Supabase client, have been removed from this app. Firestore replaces the progress storage (see setup below). The shared Supabase project and its database records have not been deleted or changed.

## Setup

Create a Web application OAuth client in Google Cloud. Configure the consent screen and, while in testing, add authorized test users. Register this exact redirect URI:

https://article.fikss.site/api/auth/callback/google

For local development, also register http://localhost:3000/api/auth/callback/google. Every supported alternate production domain requires its own registered callback and matching AUTH_URL; use article.fikss.site as the canonical login domain.

Set these server-only variables in Vercel, never in browser code or git:

- AUTH_URL=https://article.fikss.site
- AUTH_GOOGLE_ID (Google OAuth Client ID)
- AUTH_GOOGLE_SECRET (Google OAuth Client Secret)
- AUTH_SECRET (generate with openssl rand -base64 32)

Remove the obsolete education app variables NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, and EDUCATION_EMAIL_AUTH_READY from the article-listrik Vercel project after reviewing the migration. Do not remove settings from the separate portfolio project. Redeploy after configuration changes.

Only openid, email, and profile scopes are requested. Google must confirm email_verified. OAuth tokens and provider secrets are not included in client sessions. Auth.js handles state, CSRF, and session cookies.

Without configuration, the page displays a setup message and disables sign-in. No placeholder credentials are used. Real Google consent, callback, session persistence, and sign-out must be tested after credentials are configured.

## Progress preservation and limitations

Guest browser progress and legacy keys remain unchanged. Old Supabase-account browser caches are retained, and existing remote database records remain untouched. They are not automatically mapped to Google identities. Progress is now isolated by Google identity and synchronizes when Firestore is configured. Old Supabase account migration remains separate.

## Firestore progress sync (replacement storage)

The app now synchronizes via the server-only `/api/progress` endpoint. The owner comes exclusively from the verified Auth.js session, never from a request body or email address. Each Google identity has a SHA-256 document ID under `education_progress/{ownerHash}/lessons/{academy--slug}`. True and false completion records are both retained so unmarking a lesson does not resurrect old completion. Conflicts on the same lesson follow the last successful upload. The API validates each row, limits batches to 400, checks Origin for writes, and returns private/no-store responses. Service-account credentials never enter browser code or session responses.

Enable a Firestore Native-mode database in the Google Cloud/Firebase project. Create a dedicated service account with only the required Firestore data access (for example roles/datastore.user); do not grant Owner/Editor. Store these server-only Vercel production variables through the dashboard:

- FIRESTORE_PROJECT_ID
- FIRESTORE_CLIENT_EMAIL
- FIRESTORE_PRIVATE_KEY (actual multiline PEM or escaped newlines)

Do not send service-account JSON or private keys in chat or commit them. Prefer workload identity federation/ADC in deployments where it is configured; this implementation currently reads explicit server environment credentials. Keep local credential files outside git.

Server SDK access uses IAM and bypasses Firestore Security Rules. In addition to the endpoint's session/ownership checks, deny all browser-client access to the `education_progress` collection. Merge the following into your existing rules (do not replace unrelated application rules):

```
match /education_progress/{document=**} {
  allow read, write: if false;
}
```

Ensure no other overlapping rule grants access, since Firestore combines matching allows. No Firebase web client or public API key is needed for this server integration.

Guest progress is imported once after a successful cloud read; remote records, including false, take precedence over guest completion. The guest snapshot is cleared only after all writes succeed. Pending account changes persist locally, retries occur on connectivity/focus, a manual sync, and every 60 seconds. In-flight acknowledgements cannot clear later edits. Signing out switches to the separate guest cache and never copies private account progress into it. Old Supabase identities and records are not automatically linked to Google identities.

Without Firestore credentials the endpoint returns 503 and the UI explicitly says account storage is being prepared. It never reports a successful cloud sync. Google OAuth setup remains required too. No live cloud resources, database rules, credentials, or production settings have been configured by this code change.

Verify with `node scripts/check-progress-api.cjs`, `node scripts/check-account-progress.cjs`, `npm run build`, then `CHROMIUM_PATH=<chromium> node scripts/check-account-ui.cjs`. Browser tests stub authenticated sessions and the cloud endpoint; API tests use an isolated in-memory store. After deployment, verify a real Google account on two devices, unmark/reload, offline/reconnect, and sign-out/account switching before declaring cross-device synchronization live.
