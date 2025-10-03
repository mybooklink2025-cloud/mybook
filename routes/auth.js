import express from "express";
const router = express.Router();

// Array en memoria para guardar usuarios
const usuarios = [];

// Registro
router.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email y password son requeridos" });
  }

  const existe = usuarios.find(u => u.email === email);
  if (existe) {
    return res.status(400).json({ message: "Usuario ya registrado" });
  }

  const nuevoUsuario = { email, password };
  usuarios.push(nuevoUsuario);
  res.status(201).json({ message: "Usuario registrado correctamente ✅" });
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const usuario = usuarios.find(u => u.email === email && u.password === password);
  if (!usuario) {
    return res.status(401).json({ message: "Usuario o contraseña incorrectos ❌" });
  }

  res.json({ message: "Inicio de sesión exitoso ✅", token: "MOCK_TOKEN" });
});

export default router;
