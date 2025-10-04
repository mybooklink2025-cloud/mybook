import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import multer from "multer";

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

// Configuración de multer
export const upload = multer({ dest: "uploads/" });

// Ruta de prueba
app.get("/auth/test", (req, res) => {
  res.json({ message: "✅ Backend mock conectado correctamente" });
});

// Rutas
app.use("/auth", authRoutes);

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
