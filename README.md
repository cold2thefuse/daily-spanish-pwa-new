
Daily Spanish Word - PWA (Ready for Netlify)
===========================================

What you got in this ZIP:
- index.html, app.js, styles.css, manifest.json, sw.js, icons/ (client)
- server.js (example Node server for push notifications)
- README (this file)

Quick publish to Netlify (client only):
1. Go to https://app.netlify.com/sites/new
2. Choose "Deploy manually" -> Drag and drop all files from this ZIP (or the root folder after unzipping).
3. Netlify will provide a public URL (https://your-site.netlify.app). Open that URL in Chrome on your Android device.
4. Install: In Chrome, open the site -> tap the menu (⋮) -> 'Install app' or 'Add to Home screen'.

Enabling push notifications (server step):
- Push requires a server to actually send the pushes (the push service must be invoked by a server).
- Use the included server.js (Node) and deploy it to a small host (Render, Railway, Heroku, etc.).
- Generate VAPID keys with web-push (npm i -g web-push) and run:
    web-push generate-vapid-keys
  Then set VAPID_PUBLIC and VAPID_PRIVATE as environment variables on the host.
- Endpoints the client expects (server must expose):
    GET /vapidPublicKey  -> returns { key: '<VAPID_PUBLIC>' }
    POST /registerSubscription  -> receives subscription JSON from client
    POST /sendNow  -> triggers sending a notification to all registered subscriptions
- To send daily notifications, schedule a daily job on your host to POST /sendNow with a payload like:
    { "title": "Palabra del día", "body": "Casa — Abre la app para ver la definición", "url": "/" }

Notes:
- For testing push locally, you can run the server on localhost and update app.js fetch URLs accordingly, but real push requires HTTPS in production.
- If you'd like, I can provide step-by-step instructions to deploy the server to Render (free tier) and schedule the daily job.

If you want me to also generate a one-click deploy button or step-by-step screenshots, say the word!
