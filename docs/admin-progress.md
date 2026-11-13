# Progress — docs/superpowers/plans/2026-11-13-admin.md
- User authorized full implementation and removal of five-file restriction.
- Decision: native Next.js admin, no new dependencies, persistent disk for a single server instance. Multi-instance deployments require a shared database/object store and are outside this implementation.
- Preflight: public consumers use server getProjects; managed Project extends existing data contract; no changes to inventory-app.
- Task 1: complete — session/persistence/upload/analytics/origin tests RED→GREEN; initial 7 passed, expanded to 11 with corruption/rate/retention/production config coverage.
- Task 2: implementation complete — production browser tested upload/publication/hiding, public project/media/sitemap routes, visitors/detail, desktop/mobile, logout/API denial. Screenshots and disposable scripts in /tmp only.
- Final independent review: fixed structured analytics corruption with regression RED→GREEN; preserving drafts after expired sessions and All-category tracking reproduced in browser before fixes; focus containment/restore added to visitor dialog.
- Minor deferred: pre-existing Header import includes original catalogue in public client JS. Hidden originals are removed from pages/sitemap but original assets/metadata are not confidential; this feature does not promise private asset storage.
- Deployment choice: single Node process with persistent ADMIN_DATA_DIR. No dependencies added; no changes made to inventory-app.
- Production build: passed without warnings after scoping runtime filesystem paths out of Turbopack tracing. Expanded suite: 11/11 passed. Final browser rerun and restart persistence check passed.

- Task 3: complete — final suite 11/11, TypeScript, warning-free production build, clean whitespace diff. Browser: desktop 1440×1000 and mobile 390×844; full project lifecycle, unauthenticated guards, visitors/timeline, session expiry draft retention, All-category event, dialog keyboard focus all passed. No JS runtime errors. Existing published project remained accessible after restart.
- Final category fix: existing filters preserve Next internal history state, so useSearchParams does not observe their changes. Track gallery buttons explicitly and reuse the Header category-change event; event URLs use current location.
- Final minor focus issue fixed: removed competing autofocus so focus returns to the visitor row after closing history.
- Remaining deployment configuration: administrator credentials, SITE_ORIGIN and persistent ADMIN_DATA_DIR; geographic lookup has not been configured. No production deployment performed.
