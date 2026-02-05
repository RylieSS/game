const CACHE_NAME = 'mathblast-v1';
const ASSETS = [
  './prototype.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request).then(fetchResp => {
        return caches.open(CACHE_NAME).then(cache => {
          try{ cache.put(event.request, fetchResp.clone()); }catch(e){}
          return fetchResp;
        });
      }).catch(()=>{
        return caches.match('./prototype.html');
      });
    })
  );
});
