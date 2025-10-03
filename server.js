import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());

// CORS
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://mybook-6oemkhl89-mybooks-projects-bd842ad5.vercel.app",
  ],
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

// Ruta de prueba
app.get("/auth/test", (req, res) => {
  res.json({ message: "✅ Backend conectado correctamente" });
});

// Rutas auth
app.use("/auth", authRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error MongoDB:", err));

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
