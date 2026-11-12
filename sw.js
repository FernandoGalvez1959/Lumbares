var CACHE = "lumbares-v6";
var ARCHIVOS = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ARCHIVOS); }));
  self.skipWaiting();
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});
/* Primero internet (así siempre ves la última versión); sin conexión, la copia guardada */
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(function (resp) {
      if (resp && resp.ok) { var cp = resp.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, cp); }); }
      return resp;
    }).catch(function () { return caches.match(e.request); })
  );
});
