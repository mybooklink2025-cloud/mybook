import express from "express";

const router = express.Router();

// Usuarios en memoria
const usuarios = [];

// Registro
router.post("/register", (req, res) => {
  const { email, password } = req.body;
  const existe = usuarios.find(u => u.email === email);
  if (existe) {
    return res.status(400).json({ message: "El correo ya está registrado" });
  }
  const nuevoUsuario = { email, password, id: Date.now().toString() };
  usuarios.push(nuevoUsuario);
  res.status(201).json({ message: "Usuario registrado correctamente ✅", _id: nuevoUsuario.id });
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const usuario = usuarios.find(u => u.email === email && u.password === password);
  if (!usuario) {
    return res.status(400).json({ message: "Usuario o contraseña incorrectos" });
  }
  res.json({ message: "Inicio de sesión exitoso ✅", token: "MOCK_TOKEN" });
});

export default router;
