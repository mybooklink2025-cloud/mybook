import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contact.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

app.use(express.json());

// ✅ Configuración CORS — solo tus dominios válidos
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://mybook2.vercel.app",
      "https://mybook3.vercel.app",
      "https://mybook4.vercel.app",
      "https://mybook5.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ✅ Servir archivos estáticos (por si los necesitas)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Ruta de prueba
app.get("/auth/test", (req, res) => {
  res.json({ message: "✅ Backend conectado correctamente" });
});

// ✅ Rutas reales
app.use("/auth", authRoutes);
app.use("/contact", contactRoutes);

// ✅ Servidor en Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
