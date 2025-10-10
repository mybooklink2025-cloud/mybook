import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helpers: SendGrid and Nodemailer will be required lazily when used
const sendWithSendGrid = async ({ from, to, subject, text, html }) => {
  // Se importa dinámicamente para no romper si no está instalado hasta que se npm install
  const sgMail = await import("@sendgrid/mail");
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY not configured");
  sgMail.default.setApiKey(SENDGRID_API_KEY);

  const msg = {
    to,
    from,
    subject,
    text,
    html,
  };

  return sgMail.default.send(msg);
};

const sendWithNodemailer = async ({ from, to, subject, text, html }) => {
  const nodemailer = await import("nodemailer");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  return info;
};

router.post("/", async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    // Datos base para el correo
    const remitente = process.env.EMAIL_FROM || process.env.GMAIL_USER || "no-reply@mybook.app";
    // Destinatarios: se puede configurar en env como lista separada por comas
    const destinatariosEnv = process.env.EMAIL_TO || "";
    const destinatarios = destinatariosEnv
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
    // Si no hay destinatarios configurados, devolver error para evitar envíos no deseados
    if (!destinatarios.length) {
      return res.status(500).json({ message: "No hay destinatarios configurados en EMAIL_TO" });
    }

    const subject = `Nuevo mensaje de contacto desde MyBook: ${nombre}`;
    const text = `Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}`;
    const html = `
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${mensaje}</p>
    `;

    // Intentar SendGrid primero si está configurado
    try {
      if (process.env.SENDGRID_API_KEY) {
        await sendWithSendGrid({
          from: remitente,
          to: destinatarios,
          subject,
          text,
          html,
        });
        return res.status(200).json({ message: "✅ Mensaje enviado correctamente (SendGrid)" });
      }
    } catch (sgError) {
      // Si falla SendGrid, intentamos con Nodemailer/Gmail abajo
      console.error("SendGrid error:", sgError.message || sgError);
    }

    // Fallback a Gmail/Nodemailer
    try {
      await sendWithNodemailer({
        from: remitente,
        to: destinatarios,
        subject,
        text,
        html,
      });
      return res.status(200).json({ message: "✅ Mensaje enviado correctamente (Gmail fallback)" });
    } catch (nmError) {
      console.error("Nodemailer error:", nmError.message || nmError);
      return res.status(500).json({ message: "❌ Error al enviar el mensaje", error: nmError.message || nmError });
    }
  } catch (error) {
    console.error("Contact route error:", error);
    res.status(500).json({ message: "❌ Error al enviar el mensaje", error: error.message });
  }
});

export default router;
