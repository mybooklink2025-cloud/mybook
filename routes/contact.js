import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: "martinvelez1984@gmail.com, alejosaenz1984@gmail.com",
      subject: `Nuevo mensaje de contacto - ${nombre} <${email}>`,
      text: `Nombre: ${nombre}\nCorreo: ${email}\n\nMensaje:\n${mensaje}`,
    };

    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "✅ Mensaje enviado correctamente",
      info: info.response,
    });
  } catch (error) {
    console.error("Error enviando correo:", error);
    res.status(500).json({
      message: "❌ Error al enviar el mensaje",
      error: error.message,
    });
  }
});

export default router;
