
/*
server.js - example Node server to support push notifications for the PWA.
NOTES:
- This is an example. You must generate VAPID keys and set environment variables:
  VAPID_PUBLIC and VAPID_PRIVATE
- Deploy this to a small host (Render, Heroku, Railway). The client expects:
  GET /vapidPublicKey -> { key: '...' }
  POST /registerSubscription -> store the subscription JSON
  POST /sendNow -> trigger sending a notification to all stored subscriptions
- You can schedule a daily job on the host (cron, Render scheduled job, etc.) to POST /sendNow with the day's payload.
*/
const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const VAPID_PUBLIC = process.env.VAPID_PUBLIC || '<PUT_YOUR_VAPID_PUBLIC_KEY_HERE>';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE || '<PUT_YOUR_VAPID_PRIVATE_KEY_HERE>';

webpush.setVapidDetails('mailto:you@example.com', VAPID_PUBLIC, VAPID_PRIVATE);

let SUBSCRIPTIONS = []; // Replace with persistent store in production

app.get('/vapidPublicKey', (req, res) => {
  res.json({ key: VAPID_PUBLIC });
});

app.post('/registerSubscription', (req, res) => {
  const sub = req.body;
  // add dedupe logic in real app
  SUBSCRIPTIONS.push(sub);
  res.json({ success: true });
});

app.post('/sendNow', async (req, res) => {
  const payload = JSON.stringify(req.body || { title: 'Palabra del día', body: 'Abre la app para ver la palabra' });
  const results = [];
  for (const s of SUBSCRIPTIONS) {
    try {
      await webpush.sendNotification(s, payload);
      results.push({ ok: true });
    } catch (e) {
      results.push({ ok: false, error: e.message });
    }
  }
  res.json({ results });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log('Server listening on', PORT));
