# Shared fikss.site domain

## Public URLs

The portfolio continues to own `/`, `/articles`, `/articles/:slug`, `/admin`, `/cv`, its assets and its backend API. The education app owns `/belajar`, `/listrik`, `/modul`, `/materi`, `/galeri`, `/simulator`, `/jaringan`, `/iot`, `/git`, `/akun`, `/bagikan`, its static asset directories, Next.js assets, `/api/auth`, and `/api/progress`. Its public catalogue API is namespaced at `/belajar/api/articles` so the portfolio keeps `/api/articles`.

The portfolio Vercel configuration routes education requests to the existing article.fikss.site production origin. The repositories remain separate. Education receives path-preserving rewrites, so root-relative images and Next.js client navigation work on fikss.site without a build basePath. Cross-app links use normal anchors for a full application transition.

All educational canonical and share URLs use https://fikss.site. The education hub canonical is /belajar. `/sitemap.xml` is a sitemap index referencing `/portfolio-sitemap.xml` and `/belajar/sitemap.xml`. The educational sitemap includes public catalogue pages, lessons, nested labs/guides and all Winbox lessons; account and API endpoints are excluded. Existing robots rules point to the root sitemap index.

The legacy education root redirects to https://fikss.site/belajar. Deep article.fikss.site URLs stay reachable as the proxy origin, with fikss.site canonicals; do not add an unconditional host redirect there, which would create a loop for the gateway. listrik.fikss.site redirects to fikss.site paths.

## Google and progress

Register `https://fikss.site/api/auth/callback/google` on the existing Google Web OAuth client before activation. Keep the old callback during the transition. Then change only the education Vercel project's production AUTH_URL to `https://fikss.site` and redeploy that app. Keep AUTH_SECRET, the Google client and all Firestore credentials unchanged, so existing Google subjects continue to use the same Firestore owner IDs.

New main-domain sessions need a fresh Google sign-in. Synced progress follows the account; guest/browser-only progress and pending offline edits remain at the old browser origin and are not automatically copied between domains. Do not delete old browser data; sync the old account online before moving. Account and guest caches retain their existing isolation.

The progress endpoint permits a verified session's same-origin writes and the explicit canonical https://fikss.site origin because Vercel can expose the upstream URL to the handler. It still rejects arbitrary origins and never trusts an owner supplied in a body. Keep Auth.js credentials private and preserve all service-account IAM restrictions.

## Release order and checks

1. Confirm the new Google callback is registered.
2. Publish the education app, which adds /belajar and its sitemap while keeping deep legacy pages working.
3. Publish portfolio gateway routes, category links, and the sitemap index immediately afterward.
4. Set education Production AUTH_URL=https://fikss.site and redeploy education.
5. Wait for READY on both projects. Verify main-domain portfolio, catalogue, all academy pages, assets, APIs, canonical/share URLs, sitemap index and OAuth redirect. A real user must test Google consent, sync and reload on two devices.

Local checks: `node scripts/check-progress-api.cjs`; build both apps; `CHROMIUM_PATH=<browser> node scripts/check-shared-domain.cjs`. The gateway test uses the actual ordered Vercel route patterns with local production servers. It checks every sitemap URL and representative browser flows at mobile/desktop widths.

Rollback: roll back both production projects to their pre-migration deployments and restore education AUTH_URL=https://article.fikss.site, then redeploy education. Keep both OAuth callbacks registered until verification is complete. No database records or DNS ownership need to be deleted or transferred.
