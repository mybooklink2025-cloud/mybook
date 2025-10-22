import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contact.js";
import postsRoutes from "./routes/posts.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configuración CORS ampliada
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://mybook3.vercel.app",
      "https://mybook4.vercel.app",
      "https://mybook5.vercel.app",
      "https://mybook6.vercel.app",
      "https://mybook7.vercel.app",
      "https://mybook8.vercel.app",
      "https://mybook9.vercel.app",
      "https://mybook10.vercel.app",
      "https://mybook.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Permitir preflight de todas las rutas
app.options("*", cors());

// Manejo de archivos estáticos (fotos de perfil)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rutas
app.use("/auth", authRoutes);
app.use("/contact", contactRoutes);
app.use("/posts", postsRoutes);

// Servidor en puerto configurado
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
