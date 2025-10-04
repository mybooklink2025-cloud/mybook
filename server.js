// server.js
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();

// Middleware
app.use(express.json());

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://mybook2.vercel.app",
      "https://mybook3.vercel.app",
      "https://mybook4.vercel.app",
      "https://mybook5.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Crear carpeta uploads si no existe
const uploadDir = path.join("./uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware multer para subida de imágenes
export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  })
});

// Ruta de prueba
app.get("/auth/test", (req, res) => {
  res.json({ message: "✅ Backend mock conectado correctamente" });
});

// Rutas
app.use("/auth", authRoutes);

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
