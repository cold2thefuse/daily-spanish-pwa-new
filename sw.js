
const CACHE = 'daily-spanish-cache-v1';
const ASSETS = ['/', '/index.html', '/styles.css', '/app.js', '/manifest.json'];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});

self.addEventListener('push', e=>{
  let data = { title: 'Palabra del día', body: 'Abre la app para ver la palabra', url:'/' };
  try { data = e.data.json(); } catch(e){}
  const options = { body: data.body, icon: '/icons/icon-192.svg', badge:'/icons/icon-192.svg', data: { url: data.url } };
  e.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', e=>{
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window'}).then(clientsArr=>{
    for (const client of clientsArr) {
      if (client.url === '/' && 'focus' in client) return client.focus();
    }
    if (clients.openWindow) return clients.openWindow('/');
  }));
});
