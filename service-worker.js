const CACHE_NAME = "pwa-chatbot-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/static/styles.css",
  "/static/Images/record.png",
  "/static/Images/stop-button.png",
  "/static/Images/play.png",
  "/path/to/other/assets",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (cacheWhitelist.indexOf(name) === -1) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});
