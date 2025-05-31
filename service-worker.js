const CACHE_NAME = "notes-app-cache-v1";
const FILES_TO_CACHE = [
  "index.html",
  "main.js",
  "router.js",
  "libs/localforage.min.js",
  "styles/style.css",
  "styles/page-list.css",
  "styles/page-folders.css",
  "styles/page-form.css",
  "styles/page-detail.css",
  "pages/page-list.js",
  "pages/page-form.js",
  "pages/page-detail.js",
  "pages/page-folders.js",
  "pages/page-404.js",
  "assets/icons.svg",
  "assets/logo.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // Navigace
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match("index.html").then(response => response || fetch(event.request))
    );
    return;
  }

  // Assety + fallback pro offline
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      return fetch(event.request).catch(() => new Response('', { status: 404, statusText: 'Not Found' }));
    })
  );
});
