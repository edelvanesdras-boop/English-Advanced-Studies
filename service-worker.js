const CACHE = 'english-advanced-studies-v11-vocab-writing-stats-1';
const FILES = ['./', './index.html', './questions.js', './level-test-items.js', './level-test.js', './manifest.webmanifest', './icon.svg',
  './fonts/unbounded-latin-700-normal.woff2', './fonts/unbounded-latin-800-normal.woff2',
  './fonts/figtree-latin-500-normal.woff2', './fonts/figtree-latin-600-normal.woff2',
  './fonts/figtree-latin-700-normal.woff2', './fonts/figtree-latin-800-normal.woff2'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  // Buscas (iTunes/YouTube) e imagens externas passam direto pela rede.
  if (new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(req, copy));
    return response;
  }).catch(() => caches.match('./index.html'))));
});
// Fontes dos outros estilos (Caderno, Estúdio, Metrô, Calma, Foco) não entram no pré-cache:
// são baixadas e guardadas na primeira vez que o estilo é usado (cache dinâmico acima).
