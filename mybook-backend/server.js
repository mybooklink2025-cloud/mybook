import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://mybook-6oemkhl89-mybooks-projects-bd842ad5.vercel.app",
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
