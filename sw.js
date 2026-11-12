// Offline support: after the page is opened once with signal, it works with no signal.
const CACHE = 'auth-link-v9';
const FILES = ['./', './index.html', './logo.png', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Network first (so updates show up), cached copy when there is no signal.
  // ignoreSearch: any job link (?customer=...) opens the same saved page.
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok && new URL(e.request.url).origin === location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request.url.split('?')[0], copy));
      }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true })
      .then(r => r || caches.match('./index.html')))
  );
});
