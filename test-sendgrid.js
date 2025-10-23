import dotenv from "dotenv";
dotenv.config();

import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_TO = process.env.EMAIL_TO;

sgMail.setApiKey(SENDGRID_API_KEY);

const msg = {
  to: EMAIL_TO.split(","), // soporta varios destinatarios
  from: EMAIL_FROM,
  subject: "Prueba SendGrid desde backend",
  text: "Este es un mensaje de prueba para verificar la API Key.",
};

sgMail
  .send(msg)
  .then(() => console.log("✅ Envío de prueba exitoso"))
  .catch((err) => console.error("❌ Error en envío de prueba:", err));
