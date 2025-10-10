import express from "express";

const router = express.Router();

// Función para enviar correo con SendGrid
const sendWithSendGrid = async ({ from, to, subject, text, html }) => {
  const sgMail = await import("@sendgrid/mail");
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY no configurada");
  sgMail.default.setApiKey(SENDGRID_API_KEY);

  const msg = { to, from, subject, text, html };
  return sgMail.default.send(msg);
};

// Ruta POST /contact
router.post("/", async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    const remitente = process.env.EMAIL_FROM || "no-reply@mybook.app";
    const destinatariosEnv = process.env.EMAIL_TO || "";
    const destinatarios = destinatariosEnv.split(",").map(s => s.trim()).filter(Boolean);

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

    await sendWithSendGrid({ from: remitente, to: destinatarios, subject, text, html });
    return res.status(200).json({ message: "✅ Mensaje enviado correctamente (SendGrid)" });

  } catch (error) {
    console.error("Error contact route:", error.message || error);
    res.status(500).json({ message: "❌ Error al enviar el mensaje", error: error.message });
  }
});

export default router;
