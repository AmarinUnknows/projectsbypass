const CACHE_NAME = 'amarin-cache-v1';
const ASSETS = [
	'/',
	'/index.html',
	'/styles.css',
	'/script.js',
	'/offline.html'
];

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
	);
	self.skipWaiting();
});

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(keys => Promise.all(
			keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
		))
	);
	self.clients.claim();
});

self.addEventListener('fetch', event => {
	const request = event.request;
	if (request.method !== 'GET') return;

	event.respondWith(
		caches.match(request).then(cached => {
			const fetchPromise = fetch(request).then(response => {
				const clone = response.clone();
				caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
				return response;
			}).catch(() => {
				// Offline fallback only for navigation/html
				if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
					return caches.match('/offline.html');
				}
				return cached;
			});

			return cached || fetchPromise;
		})
	);
});


