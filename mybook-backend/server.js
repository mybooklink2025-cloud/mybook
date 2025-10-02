const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple routes
app.get('/', (req, res) => {
  res.send('API funcionando (versión estable lunes)');
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor backend en puerto ${PORT}`));
