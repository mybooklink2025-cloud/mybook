import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contact.js";
import postsRoutes from "./routes/posts.js";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

dotenv.config();
const app = express();
const server = http.createServer(app); // 🔹 Reemplaza app.listen() al final

// Middleware para parsear JSON
app.use(express.json());

// Configuración CORS ampliada (idéntica a la tuya)
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

// Rutas (exactamente como las tenías)
app.use("/auth", authRoutes);
app.use("/contact", contactRoutes);
app.use("/posts", postsRoutes);

// 🔹 Configuración de Socket.IO (solo añadido, sin romper nada)
const io = new Server(server, {
  cors: {
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
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 🔹 Lista de usuarios conectados en memoria (no base de datos)
let usuariosConectados = [];

// 🔹 Lógica de chat en tiempo real
io.on("connection", (socket) => {
  // Usuario entra al chat
  socket.on("usuarioConectado", (nombreUsuario) => {
    if (!usuariosConectados.some((u) => u.name === nombreUsuario)) {
      usuariosConectados.push({ id: socket.id, name: nombreUsuario });
    }
    io.emit("usuariosActivos", usuariosConectados);
  });

  // Enviar mensaje a otro usuario
  socket.on("enviarMensaje", (data) => {
    const receptor = usuariosConectados.find((u) => u.name === data.receptor);
    if (receptor) {
      io.to(receptor.id).emit("recibirMensaje", data);
    }
  });

  // Usuario se desconecta
  socket.on("disconnect", () => {
    usuariosConectados = usuariosConectados.filter((u) => u.id !== socket.id);
    io.emit("usuariosActivos", usuariosConectados);
  });
});

// Servidor en puerto configurado (solo cambia app.listen → server.listen)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
