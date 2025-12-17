self.addEventListener('push', event => {
  let data = {
    title: 'Palabra del día',
    body: 'Abre la app para ver la palabra',
    url: '/'
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {}
  }

  const options = {
    body: data.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

