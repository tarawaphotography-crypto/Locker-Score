// Simple service worker to cache app shell
const CACHE_NAME = 'locker-scores-v1'
const ASSETS = ['/', '/index.html', '/src/main.tsx', '/styles.css', '/manifest.json']

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(() => {})
    })
  )
})

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request).catch(() => caches.match('/')))
  )
})
