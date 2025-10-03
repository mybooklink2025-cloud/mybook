import express from "express";
const router = express.Router();

let usuarios = []; // usuarios guardados temporalmente

// Registro
router.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (usuarios.find(u => u.email === email)) {
    return res.status(400).json({ message: "El correo ya está registrado" });
  }
  usuarios.push({ email, password });
  res.status(201).json({ message: "Usuario registrado correctamente ✅" });
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = usuarios.find(u => u.email === email && u.password === password);
  if (!user) return res.status(400).json({ message: "Usuario o contraseña incorrecta" });

  res.json({ message: "Inicio de sesión exitoso ✅", token: "MOCK_TOKEN" });
});

export default router;
