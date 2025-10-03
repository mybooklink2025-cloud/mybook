import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());

// Configurar CORS para permitir tu frontend de Vercel
app.use(
  cors({
    origin: [
      "http://localhost:3000", // para pruebas locales
      "https://mybook-6oemkhl89-mybooks-projects-bd842ad5.vercel.app", // tu frontend en vercel
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// 🔹 Ruta de prueba (mover antes de authRoutes)
app.get("/auth/test", (req, res) => {
  res.json({ message: "✅ Backend conectado correctamente" });
});

// Rutas principales
app.use("/auth", authRoutes);

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error conectando a MongoDB:", err));

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
