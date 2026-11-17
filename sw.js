// سرویس‌ورکر مدرسه‌یار: فقط خودِ برنامه (HTML و آیکون‌ها) را نگه می‌دارد تا نصب‌پذیر باشد و سریع باز شود.
// درخواست‌های داده (Apps Script) هیچ‌وقت کش نمی‌شوند.
const CACHE = 'madreseyar-v3';
const FILES = ['./', './index.html', './manifest.json', './config.js', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;          // فقط فایل‌های همین سایت
  e.respondWith(fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); } return res; })
    .catch(() => caches.match(r).then(m => m || caches.match('./index.html'))));   // اول شبکه (نسخه‌ی تازه)، اگر نبود کش
});
