import express from "express";

const router = express.Router();

// Registro mock
router.post("/register", (req, res) => {
  const { email, password } = req.body;
  // Respondemos como si siempre fuera exitoso
  res.status(201).json({ message: "Usuario registrado correctamente ✅" });
});

// Login mock
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  // Respondemos como si siempre fuera exitoso
  res.json({ message: "Inicio de sesión exitoso ✅", token: "MOCK_TOKEN" });
});

export default router;
