import express from "express";
import cors from "cors";
import webpush from "web-push";

const app = express();

app.use(cors({
  origin: "https://precious-banoffee-f30011.netlify.app"
}));
app.use(express.json());

// ----- CHECK ENV VARS (safe logs) -----
console.log("VAPID_PUBLIC_KEY:", !!process.env.VAPID_PUBLIC_KEY);
console.log("VAPID_PRIVATE_KEY:", !!process.env.VAPID_PRIVATE_KEY);
console.log("MAILTO:", process.env.MAILTO);

// ----- VAPID SETUP -----
webpush.setVapidDetails(
  `mailto:${process.env.MAILTO}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// ----- DATA -----
const words = [
  { word: "Hola", meaning: "Hello" },
  { word: "Gracias", meaning: "Thank you" },
  { word: "Perro", meaning: "Dog" },
  { word: "Casa", meaning: "House" },
  { word: "Comer", meaning: "To eat" }
];

let pushSubscriptions = [];

// ----- ROUTES -----
app.get("/", (req, res) => {
  res.send("Push server running!");
});

// 🔑 THIS IS THE IMPORTANT ONE
app.get("/vapidPublicKey", (req, res) => {
  res.type("text/plain").send(process.env.VAPID_PUBLIC_KEY);
});

app.post("/subscribe", (req, res) => {
  pushSubscriptions.push(req.body);
  res.status(201).json({ message: "Subscribed" });
});

app.get("/send", async (req, res) => {
  const word = words[Math.floor(Math.random() * words.length)];
  const payload = JSON.stringify({
    title: word.word,
    body: `Meaning: ${word.meaning}`
  });

  for (const sub of pushSubscriptions) {
    try {
      await webpush.sendNotification(sub, payload);
    } catch (err) {
      console.error("Push error:", err.message);
    }
  }

  res.json({ message: "Notifications sent" });
});

// ----- PORT (Render REQUIRED) -----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

