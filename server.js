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

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://mybook2.vercel.app"
    "https://mybook3.vercel.app"
    "https://mybook4.vercel.app"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

// Servir imágenes si hay
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rutas
app.use("/auth", authRoutes);
app.use("/contact", contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
