// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { upload } from "../server.js"; // multer importado desde server.js

const router = express.Router();

// Array en memoria para guardar usuarios
const usuarios = [];

// Registro
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y password son requeridos" });
    }

    const existe = usuarios.find(u => u.email === email);
    if (existe) {
      return res.status(400).json({ message: "Usuario ya registrado" });
    }

    // Hasheamos la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creamos usuario con perfil vacío
    const nuevoUsuario = {
      email,
      password: hashedPassword,
      profilePicture: "" // Perfil vacío
    };

    usuarios.push(nuevoUsuario);

    // Generamos JWT
    const token = jwt.sign({ email: nuevoUsuario.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ message: "Usuario registrado correctamente ✅", token });
  } catch (error) {
    res.status(500).json({ message: "Error en el registro", error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos ❌" });
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecta) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos ❌" });
    }

    // Generamos JWT
    const token = jwt.sign({ email: usuario.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Inicio de sesión exitoso ✅", token });
  } catch (error) {
    res.status(500).json({ message: "Error en el login", error: error.message });
  }
});

// Subir foto de perfil
router.post("/upload-profile-picture", upload.single("profilePicture"), (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No autorizado" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = usuarios.find(u => u.email === decoded.email);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    if (!req.file) return res.status(400).json({ message: "No se subió ningún archivo" });

    usuario.profilePicture = req.file.filename;

    res.json({ message: "Foto subida correctamente", filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ message: "Error al subir la foto", error: error.message });
  }
});

export default router;
