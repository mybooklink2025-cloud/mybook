import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());

// Configurar CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://https://mybook2.vercel.app"
      "https://https://mybook3.vercel.app"
      "https://https://mybook4.vercel.app"
      "https://https://mybook5.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Ruta de prueba
app.get("/auth/test", (req, res) => {
  res.json({ message: "✅ Backend conectado correctamente" });
});

// Rutas
app.use("/auth", authRoutes);

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
