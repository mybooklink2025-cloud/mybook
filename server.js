import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contact.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// CORS flexible: permite todos los frontends de MyBook desplegados
const allowedOrigins = [
  "http://localhost:3000",
  "https://mybook2.vercel.app",
  "https://mybook3.vercel.app",
  "https://mybook4.vercel.app",
  "https://mybook5.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy: origen no permitido"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

// Servir imágenes
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ruta de prueba
app.get("/auth/test", (req, res) => {
  res.json({ message: "✅ Backend conectado correctamente" });
});

// Rutas principales
app.use("/auth", authRoutes);
app.use("/contact", contactRoutes);

// Preflight para CORS
app.options("*", cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
