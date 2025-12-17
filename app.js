// app.js - Daily Spanish Word client

// ---------------- WORD DATA ----------------
const WORDS = [
  {"es":"casa","en":"house","pos":"noun","example":"La casa es grande."},
  {"es":"perro","en":"dog","pos":"noun","example":"El perro está jugando."},
  {"es":"libro","en":"book","pos":"noun","example":"Estoy leyendo un libro."},
  {"es":"agua","en":"water","pos":"noun","example":"Necesito agua, por favor."},
  {"es":"feliz","en":"happy","pos":"adj","example":"Estoy muy feliz hoy."},
  {"es":"comer","en":"to eat","pos":"verb","example":"Quiero comer ahora."},
  {"es":"beber","en":"to drink","pos":"verb","example":"¿Quieres beber algo?"},
  {"es":"amigo","en":"friend","pos":"noun","example":"Mi amigo vive cerca."},
  {"es":"familia","en":"family","pos":"noun","example":"La familia es importante."},
  {"es":"trabajo","en":"work","pos":"noun","example":"Tengo mucho trabajo hoy."},
  {"es":"tiempo","en":"time/weather","pos":"noun","example":"¿Tienes tiempo ahora?"},
  {"es":"hoy","en":"today","pos":"adv","example":"Hoy hace sol."},
  {"es":"mañana","en":"tomorrow/morning","pos":"noun/adv","example":"Mañana será otro día."},
  {"es":"ayer","en":"yesterday","pos":"adv","example":"Ayer fui al cine."},
  {"es":"hablar","en":"to speak","pos":"verb","example":"¿Puedes hablar más despacio?"},
  {"es":"escuchar","en":"to listen","pos":"verb","example":"Escucha la canción."},
  {"es":"leer","en":"to read","pos":"verb","example":"Me gusta leer libros."},
  {"es":"escribir","en":"to write","pos":"verb","example":"Voy a escribir un correo."},
  {"es":"triste","en":"sad","pos":"adj","example":"Se siente triste."},
  {"es":"rápido","en":"fast","pos":"adj","example":"Él corre muy rápido."},
  {"es":"lento","en":"slow","pos":"adj","example":"El tráfico está lento."},
  {"es":"música","en":"music","pos":"noun","example":"La música está alta."},
  {"es":"película","en":"movie","pos":"noun","example":"Quiero ver una película."},
  {"es":"viajar","en":"to travel","pos":"verb","example":"Me gusta viajar por el mundo."},
  {"es":"tren","en":"train","pos":"noun","example":"Tomamos el tren a las ocho."},
  {"es":"aeropuerto","en":"airport","pos":"noun","example":"El aeropuerto está lejos."},
  {"es":"comprar","en":"to buy","pos":"verb","example":"Necesito comprar pan."},
  {"es":"dinero","en":"money","pos":"noun","example":"No tengo mucho dinero."}
];

// ---------------- HELPERS ----------------
function todayIndex(listLength) {
  const d = new Date();
  const dateStr = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  let sum = 0;
  for (let i = 0; i < dateStr.length; i++) sum += dateStr.charCodeAt(i);
  return sum % listLength;
}

function showWord() {
  const w = WORDS[todayIndex(WORDS.length)];
  document.getElementById("word").textContent = w.es;
  document.getElementById("pos").textContent = `${w.pos} — ${w.en}`;
  document.getElementById("meaning").textContent = w.en;
  document.getElementById("example").textContent = `Ejemplo: ${w.example}`;
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

// ---------------- INIT ----------------
showWord();

// ---------------- BUTTONS ----------------
document.getElementById("pronounce").addEventListener("click", () => {
  const text = document.getElementById("word").textContent;
  if ("speechSynthesis" in window) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-ES";
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }
});

document.getElementById("copy").addEventListener("click", () => {
  const text = `${document.getElementById("word").textContent} — ${document.getElementById("meaning").textContent}`;
  navigator.clipboard.writeText(text);
  alert("Copied!");
});

document.getElementById("share").addEventListener("click", () => {
  const text = `${document.getElementById("word").textContent} — ${document.getElementById("meaning").textContent}`;
  if (navigator.share) {
    navigator.share({ title: "Palabra del día", text });
  } else {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  }
});

// ---------------- SERVICE WORKER ----------------
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js")
    .then(() => console.log("Service Worker registered"));
}

// ---------------- PUSH SUBSCRIPTION ----------------
document.getElementById("subscribe").addEventListener("click", async () => {
  try {
    const registration = await navigator.serviceWorker.ready;

    const response = await fetch(
      "https://daily-spanish-push-server.onrender.com/vapidPublicKey"
    );
    const vapidPublicKey = await response.text();

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    });

    await fetch(
      "https://daily-spanish-push-server.onrender.com/subscribe",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription)
      }
    );

    alert("✅ Push notifications enabled!");
  } catch (err) {
    console.error(err);
    alert("❌ Subscription failed. Check console.");
  }
});
