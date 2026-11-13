const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
let auth = {}, store = {}, projects = {}, analytics = {}, http = {};
try { auth = require('../.test-build/lib/admin-auth.js'); store = require('../.test-build/lib/admin-store.js'); projects = require('../.test-build/lib/admin-projects.js'); analytics = require('../.test-build/lib/admin-analytics.js'); http = require('../.test-build/lib/admin-http.js'); } catch (e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; }
let dir;
beforeEach(async () => { dir = await fs.mkdtemp(path.join(os.tmpdir(), 'portfolio-admin-')); process.env.ADMIN_DATA_DIR = dir; process.env.ADMIN_SESSION_SECRET = 'a'.repeat(48); process.env.ADMIN_PASSWORD_HASH = auth.hashPassword?.('correct-password'); });
afterEach(async () => { await fs.rm(dir, { recursive: true, force: true }); });
test('passwords require configured scrypt hashes and session signatures expire', () => {
  assert.equal(typeof auth.hashPassword, 'function');
  assert.equal(auth.checkPassword('correct-password'), true);
  assert.equal(auth.checkPassword('wrong'), false);
  const token = auth.createSession(1000);
  assert.equal(auth.verifySession(token, 1001), true);
  assert.equal(auth.verifySession(token + 'x', 1001), false);
  assert.equal(auth.verifySession(token, 1000 + 9 * 3600 * 1000), false);
  delete process.env.ADMIN_SESSION_SECRET;
  assert.equal(auth.verifySession(token, 1001), false);
  delete process.env.ADMIN_PASSWORD_HASH;
  assert.equal(auth.checkPassword(''), false);
});
test('projects preserve original slugs and support drafts, edits, ordering and publication', async () => {
  assert.equal(typeof projects.saveProject, 'function');
  const base = await projects.getProjects();
  assert.ok(base.length > 0);
  const p = await projects.saveProject({ title: 'Новая кухня', description: 'Описание', categorySlug: 'kitchens', images: [base[0].cover], published: false });
  assert.equal((await projects.getProjects()).some(x => x.slug === p.slug), false);
  await projects.saveProject({ ...p, published: true, order: -1 });
  assert.equal((await projects.getProjects())[0].title, 'Новая кухня');
  await projects.saveProject({ ...(await projects.listAdminProjects()).find(x => x.slug === base[0].slug), published: false });
  assert.equal((await projects.getProjects()).some(x => x.slug === base[0].slug), false);
  assert.equal((await projects.getProjects()).length, base.length);
});
test('concurrent mutations persist both projects and invalid input cannot overwrite data', async () => {
  assert.equal(typeof projects.saveProject, 'function');
  const cover = (await projects.getProjects())[0].cover;
  await Promise.all(['A', 'B'].map(title => projects.saveProject({ title, categorySlug: 'bathrooms', images: [cover], published: true })));
  const rows = await projects.listAdminProjects();
  assert.equal(rows.filter(x => x.managed && ['A','B'].includes(x.title)).length, 2);
  await assert.rejects(() => projects.saveProject({ title: 'Bad', categorySlug: '../../', images: [cover] }));
  await assert.rejects(() => projects.saveProject({ title: 'Bad', categorySlug: 'kitchens', images: ['https://evil.test/x.svg'] }));
  await assert.rejects(() => projects.saveProject({ slug: '../../oops', title: 'Bad', categorySlug: 'kitchens', images: [cover] }));
});
test('corrupt saved data throws and is never replaced with an empty catalog', async () => {
  assert.equal(typeof store.readDocument, 'function');
  await fs.writeFile(path.join(dir, 'projects.json'), '{broken');
  await assert.rejects(() => projects.listAdminProjects());
  assert.equal(await fs.readFile(path.join(dir, 'projects.json'), 'utf8'), '{broken');
});
test('events validate types and aggregate sessions, returns, contacts, sources and history', async () => {
  assert.equal(typeof analytics.recordEvent, 'function');
  const headers = new Headers({ 'user-agent': 'Mozilla/5.0 Chrome/120.0', 'x-forwarded-for': '203.0.113.8' });
  const event = { visitorId: 'visitor-12345678', sessionId: 'session-12345678', eventType: 'page_view', page: '/portfolio?category=kitchens&secret=hidden&utm_source=google', referrer: 'https://google.com/search?q=private', locale: 'ru' };
  await analytics.recordEvent(event, headers);
  await analytics.recordEvent({ ...event, sessionId: 'session-87654321', eventType: 'contact_click', target: 'tel' }, headers);
  await analytics.recordEvent({ ...event, visitorId: 'visitor-87654321', eventType: 'page_view' }, headers);
  const result = await analytics.listVisitors(new URLSearchParams('days=7'));
  assert.equal(result.summary.uniqueVisitors, 2);
  assert.equal(result.summary.returningVisitors, 1);
  assert.equal(result.summary.pageViews, 2);
  assert.equal(result.summary.contactClicks, 1);
  const detail = await analytics.visitorDetail('visitor-12345678', new URLSearchParams('days=7'));
  assert.equal(detail.events.length, 2);
  assert.ok(detail.events.every(x => !x.page.includes('secret')));
  assert.ok(detail.events.every(x => !x.referrer.includes('private')));
  assert.equal(detail.visitor.ip, '', 'untrusted proxy headers are ignored');
  await assert.rejects(() => analytics.recordEvent({ ...event, eventType: 'execute' }, headers));
  assert.equal((await analytics.listVisitors(new URLSearchParams('search=nomatch'))).total, 0);
});
test('image validation rejects SVG, traversal and incompatible magic; safe images get generated names', async () => {
  assert.equal(typeof projects.uploadImages, 'function');
  await assert.rejects(() => projects.uploadImages([new File(['<svg/>'], 'x.svg', { type: 'image/svg+xml' })]));
  await assert.rejects(() => projects.uploadImages([new File(['not png'], 'x.png', { type: 'image/png' })]));
  const data = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aZe8AAAAASUVORK5CYII=', 'base64');
  const [url] = await projects.uploadImages([new File([data], '../../x.png', { type: 'image/png' })]);
  assert.match(url, /^\/media\/[a-f0-9-]+\.png$/);
  assert.equal((await projects.readMedia(url.slice(7))).data.length, data.length);
  await assert.rejects(() => projects.readMedia('../projects.json'));
});
test('same-origin requests and bounded bodies reject cross-site and oversized submissions', async () => {
  assert.equal(typeof http.assertOrigin, 'function');
  assert.doesNotThrow(() => http.assertOrigin(new Request('https://site.test/api', { headers: { origin: 'https://site.test' } })));
  assert.throws(() => http.assertOrigin(new Request('https://site.test/api', { headers: { origin: 'https://evil.test' } })));
  await assert.rejects(() => http.readJson(new Request('https://site.test/api', { method: 'POST', body: 'x'.repeat(100) }), 20));
});

test('structurally corrupt project rows cannot be overwritten during save', async () => {
  const cover = (await projects.getProjects())[0].cover;
  const broken = JSON.stringify([{ slug: 'broken-project', images: [] }]);
  await fs.writeFile(path.join(dir, 'projects.json'), broken);
  await assert.rejects(() => projects.saveProject({ title: 'New', categorySlug: 'kitchens', images: [cover], published: true }));
  assert.equal(await fs.readFile(path.join(dir, 'projects.json'), 'utf8'), broken);
});
test('bad dates are rejected; expiry filters retained analytics; rate limits block excess requests', async () => {
  await assert.rejects(() => analytics.listVisitors(new URLSearchParams('from=bad-date')));
  await assert.rejects(() => analytics.listVisitors(new URLSearchParams('from=2026-12-01&to=2026-01-01')));
  const key = 'test-' + Date.now();
  http.rateLimit(key, 1);
  assert.throws(() => http.rateLimit(key, 1), /Слишком много/);
  await fs.writeFile(path.join(dir, 'analytics.json'), JSON.stringify([{ id: 'old-event', timestamp: '2020-01-01T00:00:00.000Z', visitorId: 'old-visitor', sessionId: 'old-session', eventType: 'page_view', page: '/', referrer: '', locale: '', target: '', device: '', browser: '', ip: '', source: '', bot: false }]));
  assert.equal((await analytics.listVisitors(new URLSearchParams('from=2020-01-01'))).total, 0);
});
test('production writes require explicit durable storage configuration', async () => {
  const old = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  delete process.env.ADMIN_DATA_DIR;
  try { assert.throws(() => store.dataDir(true), /ADMIN_DATA_DIR/); }
  finally { process.env.ADMIN_DATA_DIR = dir; if (old === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = old; }
});
test('structurally corrupt analytics rows fail on read and remain untouched on event write', async () => {
  const broken = '[{}]';
  await fs.writeFile(path.join(dir, 'analytics.json'), broken);
  await assert.rejects(() => analytics.listVisitors(new URLSearchParams()));
  await assert.rejects(() => analytics.recordEvent({ visitorId: 'visitor-12345678', sessionId: 'session-12345678', eventType: 'page_view', page: '/' }, new Headers()));
  assert.equal(await fs.readFile(path.join(dir, 'analytics.json'), 'utf8'), broken);
});
test('admin login requires the correct username as well as the password', () => {
  assert.equal(typeof auth.checkCredentials, 'function');
  assert.equal(auth.checkCredentials('admin', 'correct-password'), true);
  assert.equal(auth.checkCredentials('other', 'correct-password'), false);
  assert.equal(auth.checkCredentials(undefined, 'correct-password'), false);
  assert.equal(auth.checkCredentials('admin', 'wrong-password'), false);
});
test('configured primary and exact Railway public domains accept same-site events behind a proxy', () => {
  const oldSite = process.env.SITE_ORIGIN;
  const oldRailway = process.env.RAILWAY_PUBLIC_DOMAIN;
  process.env.SITE_ORIGIN = 'https://primary.example';
  process.env.RAILWAY_PUBLIC_DOMAIN = 'portfolio-production.up.railway.app';
  const request = (origin, extra = {}) => new Request('http://internal:8080/api/public/analytics/event', { headers: { ...(origin ? { origin } : {}), ...extra } });
  try {
    assert.doesNotThrow(() => http.assertOrigin(request('https://primary.example')));
    assert.doesNotThrow(() => http.assertOrigin(request('https://portfolio-production.up.railway.app')));
    assert.throws(() => http.assertOrigin(request('https://other.up.railway.app')));
    assert.throws(() => http.assertOrigin(request('http://portfolio-production.up.railway.app')));
    assert.throws(() => http.assertOrigin(request('https://evil.example', { 'x-forwarded-host': 'portfolio-production.up.railway.app' })));
    assert.throws(() => http.assertOrigin(request(undefined)));
  } finally {
    if (oldSite === undefined) delete process.env.SITE_ORIGIN; else process.env.SITE_ORIGIN = oldSite;
    if (oldRailway === undefined) delete process.env.RAILWAY_PUBLIC_DOMAIN; else process.env.RAILWAY_PUBLIC_DOMAIN = oldRailway;
  }
});
test('three public page visits from one browser count as three views and one visitor', async () => {
  for (const page of ['/', '/portfolio', '/partners']) {
    await analytics.recordEvent({ visitorId: 'same-browser-123', sessionId: 'same-session-123', eventType: 'page_view', page }, new Headers({ 'user-agent': 'Mozilla/5.0 Chrome/131.0' }));
  }
  const result = await analytics.listVisitors(new URLSearchParams());
  assert.equal(result.summary.uniqueVisitors, 1);
  assert.equal(result.summary.sessions, 1);
  assert.equal(result.summary.pageViews, 3);
});
