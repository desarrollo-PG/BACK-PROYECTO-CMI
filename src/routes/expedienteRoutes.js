// routes/expedienteRoutes.js
const express = require('express');
const router = express.Router();
const ExpedienteController = require('../controllers/expedienteController');
const autenticacion = require('../middlewares/auth');
const { validarExpediente, validateExpedienteId } = require('../middlewares/validaExpediente'); // ⭐ CAMBIO DE IMPORT

// GET /api/expedientes - Obtener todos los expedientes con paginación y búsqueda
router.get('/', 
  autenticacion.validarToken, 
  autenticacion.verificarUsuarioEnBD, 
  ExpedienteController.getAllExpedientes
);

// GET /api/expedientes/disponibles - Obtener expedientes sin pacientes asignados
router.get('/disponibles', 
  autenticacion.validarToken, 
  autenticacion.verificarUsuarioEnBD, 
  ExpedienteController.getExpedientesDisponibles
);

// GET /api/expedientes/generar-numero - Generar número de expediente automático
router.get('/generar-numero', 
  autenticacion.validarToken, 
  autenticacion.verificarUsuarioEnBD, 
  ExpedienteController.generarNumeroExpediente
);

// GET /api/expedientes/estadisticas - Obtener estadísticas de expedientes
router.get('/estadisticas', 
  autenticacion.validarToken, 
  autenticacion.verificarUsuarioEnBD, 
  ExpedienteController.getEstadisticas
);

// GET /api/expedientes/:id - Obtener un expediente por ID
router.get('/:id', 
  autenticacion.validarToken, 
  autenticacion.verificarUsuarioEnBD, 
  validateExpedienteId, // ✅ Ahora viene del nuevo archivo
  ExpedienteController.getExpedienteById
);

// POST /api/expedientes - Crear nuevo expediente
router.post('/', 
  autenticacion.validarToken, 
  autenticacion.verificarUsuarioEnBD, 
  validarExpediente, // ✅ Ahora viene del nuevo archivo
  ExpedienteController.createExpediente
);

// PUT /api/expedientes/:id - Actualizar expediente
router.put('/:id', 
  autenticacion.validarToken, 
  autenticacion.verificarUsuarioEnBD, 
  validateExpedienteId, // ✅ Ahora viene del nuevo archivo
  validarExpediente, // ✅ Ahora viene del nuevo archivo
  ExpedienteController.updateExpediente
);

// DELETE /api/expedientes/:id - Eliminar expediente (soft delete)
router.delete('/:id', 
  autenticacion.validarToken, 
  autenticacion.verificarUsuarioEnBD, 
  validateExpedienteId, // ✅ Ahora viene del nuevo archivo
  ExpedienteController.deleteExpediente
);

module.exports = router;