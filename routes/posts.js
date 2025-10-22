// routes/posts.js
import express from "express";
import Post from "../models/Post.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware para verificar token
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token requerido" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token inválido" });
    req.user = decoded; // guardamos el email en req.user
    next();
  });
};

// Crear publicación
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "El contenido es obligatorio" });

    const newPost = new Post({
      userEmail: req.user.email,
      content
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la publicación", error: error.message });
  }
});

// Obtener todas las publicaciones (para mostrar en el muro)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener publicaciones", error: error.message });
  }
});

export default router;
