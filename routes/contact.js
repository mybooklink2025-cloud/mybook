import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    console.log("📩 Nuevo mensaje de contacto:", { nombre, email, mensaje });

    res.status(200).json({ message: "✅ Mensaje enviado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error al enviar el mensaje", error: error.message });
  }
});

export default router;
