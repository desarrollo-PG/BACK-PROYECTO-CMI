const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '¡Servidor funcionando!',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Mi API' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});