import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import axios from "axios";

dotenv.config();

const app = express();

/* =========================
   SECURITY
========================= */
app.use(helmet());

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

app.use(express.json({
  limit: "10kb"
}));

/* =========================
   RATE LIMIT
========================= */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    reply: "Prea multe cereri momentan 💅 Încearcă mai târziu."
  }
});

app.use("/chat", limiter);
app.use("/contact", limiter);

/* =========================
   OPENAI CLIENT
========================= */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* =========================
   CONTEXT BRAND
========================= */
const FAQ_CONTEXT = `
Tu ești asistenta premium Luxe Beauty, un salon elegant de unghii și gene din București.

Răspunde scurt, feminin, premium, politicos și util.

Informații:
- Programări: online sau WhatsApp
- Anulare: minim 24h înainte
- Plată: cash sau card
- Servicii: unghii, manichiură, extensii gene
- Parcare: disponibilă în apropiere
- Locație: București
- Ton: luxury, elegant, drăguț, profesionist
- Dacă nu știi ceva: recomandă contact direct prin WhatsApp
`;

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.json({
    status: "Luxe Beauty server running 💎"
  });
});

/* =========================
   CHAT ENDPOINT
========================= */
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length < 1 ||
      message.length > 500
    ) {
      return res.status(400).json({
        reply: "Mesaj invalid 💅"
      });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: FAQ_CONTEXT },
        { role: "user", content: message }
      ],
      max_tokens: 120,
      temperature: 0.7
    });

    const reply = completion.choices[0].message.content;

    return res.json({ reply });

  } catch (error) {
    console.error("EROARE OPENAI:", error.message);

    return res.status(500).json({
      reply: "Momentan nu pot răspunde 🤍"
    });
  }
});

/* =========================
   CONTACT ENDPOINT
========================= */
app.post("/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (
      !name || !email || !phone || !message ||
      name.length < 2 ||
      message.length < 10
    ) {
      return res.status(400).json({
        message: "Date invalide."
      });
    }

    console.log("PUBLIC:", process.env.EMAILJS_PUBLIC_KEY);
console.log("PRIVATE:", process.env.EMAILJS_PRIVATE_KEY);
console.log("SERVICE:", process.env.EMAILJS_SERVICE_ID);
console.log("TEMPLATE:", process.env.EMAILJS_TEMPLATE_ID);

    await axios.post("https://api.emailjs.com/api/v1.0/email/send", {
  service_id: process.env.EMAILJS_SERVICE_ID,
  template_id: process.env.EMAILJS_TEMPLATE_ID,
  user_id: process.env.EMAILJS_PUBLIC_KEY,
  accessToken: process.env.EMAILJS_PRIVATE_KEY,
  template_params: {
    name,
    email,
    phone,
    message
  }
});

    return res.json({
      message: "Mesaj trimis cu succes!"
    });

  } catch (error) {
    console.error("EROARE CONTACT:", error.response?.data || error.message);

    return res.status(500).json({
      message: "A apărut o eroare. Încearcă din nou."
    });
  }
});

/* =========================
   404
========================= */
app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint inexistent 💅"
  });
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});