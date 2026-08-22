import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendWithSendGrid = async ({ from, to, subject, text, html, replyTo }) => {
  const sgMail = await import("@sendgrid/mail");
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

  if (!SENDGRID_API_KEY) {
    throw new Error("SENDGRID_API_KEY not configured");
  }

  if (!from) {
    throw new Error("EMAIL_FROM not configured");
  }

  sgMail.default.setApiKey(SENDGRID_API_KEY);

  const msg = {
    to,
    from,
    replyTo,
    subject,
    text,
    html,
  };

  return await sgMail.default.send(msg);
};

router.post("/", async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
      return res
        .status(400)
        .json({ message: "Todos los campos son requeridos" });
    }

    const remitente = process.env.EMAIL_FROM;
    const destinatariosEnv = process.env.EMAIL_TO || "";

    const destinatarios = destinatariosEnv
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!remitente) {
      return res.status(500).json({
        message: "EMAIL_FROM no está configurado",
      });
    }

    if (!destinatarios.length) {
      return res.status(500).json({
        message: "No hay destinatarios configurados en EMAIL_TO",
      });
    }

    const subject = `Nuevo mensaje de contacto desde MyBook: ${nombre}`;

    const text = `Nombre: ${nombre}
Email: ${email}

Mensaje:
${mensaje}`;

    const html = `
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${mensaje}</p>
    `;

    await sendWithSendGrid({
      from: remitente,
      to: destinatarios,
      replyTo: email,
      subject,
      text,
      html,
    });

    return res.status(200).json({
      message: "✅ Mensaje enviado correctamente (SendGrid)",
    });
  } catch (error) {
    console.error("Contact route error:", error);

    return res.status(500).json({
      message: "❌ Error al enviar el mensaje",
      error:
        error?.response?.body?.errors?.[0]?.message ||
        error?.message ||
        "Error desconocido",
    });
  }
});

export default router;