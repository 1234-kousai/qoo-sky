// くうちゃんの空：オフラインでも ひらけるように、写真や音を スマホに しまっておく
const CACHE = "qoo-202610300222";
const ASSETS = ["./", "index.html", "manifest.webmanifest", "img/album.jpg", "img/baby.jpg", "img/cake.jpg", "img/face.jpg", "img/nap.jpg", "img/pink.jpg", "img/puppy.jpg", "img/room.jpg", "img/smile.jpg", "img/sunflower.jpg", "snd/LICENSE.txt", "snd/bark.mp3", "snd/barks.mp3", "snd/whine.mp3", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];
const CDN = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS).then(() => c.add(CDN).catch(() => {})))); self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  // ページ本体は 新しいものを 優先（直したら すぐ 反映）。つながらないときは しまってあるものを
  if (req.mode === "navigate") { e.respondWith(fetch(req).then((r) => { const c = r.clone(); caches.open(CACHE).then((x) => x.put("index.html", c)); return r; }).catch(() => caches.match("index.html"))); return; }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => { if (r.ok && (req.url.startsWith(self.location.origin) || req.url === CDN)) { const c = r.clone(); caches.open(CACHE).then((x) => x.put(req, c)); } return r; })));
});
