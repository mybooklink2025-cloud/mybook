import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Multer config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}${ext}`;
    cb(null, name);
  },
});
export const upload = multer({ storage });

// Array en memoria
const usuarios = [];

// Registro
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email y password son requeridos" });
    const existe = usuarios.find(u => u.email === email);
    if (existe) return res.status(400).json({ message: "Usuario ya registrado" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = { email, password: hashedPassword, profilePicture: "" };
    usuarios.push(nuevoUsuario);

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
    if (!usuario) return res.status(401).json({ message: "Usuario o contraseña incorrectos ❌" });

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecta) return res.status(401).json({ message: "Usuario o contraseña incorrectos ❌" });

    const token = jwt.sign({ email: usuario.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Inicio de sesión exitoso ✅", token });
  } catch (error) {
    res.status(500).json({ message: "Error en el login", error: error.message });
  }
});

// Subir foto de perfil
router.post("/upload-profile-picture", upload.single("profilePicture"), (req, res) => {
  const { email } = req.body;
  const usuario = usuarios.find(u => u.email === email);
  if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

  usuario.profilePicture = req.file.filename;
  res.json({ message: "Foto subida correctamente ✅", filename: req.file.filename });
});

export default router;
