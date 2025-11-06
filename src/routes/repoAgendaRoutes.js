const express = require('express');
const router = express.Router();
const autenticacion = require('../middlewares/auth');
const { validarCambioClave } = require('../middlewares/validarCambioClave');
const repoAgendaController = require('../controllers/repoAgendaController');
const checkRole = require('../middlewares/checkRole');

router.get(
    '/consultaPorTerapeuta/:terapeuta/:fecha',
    // autenticacion.validarToken,
    // autenticacion.verificarUsuarioEnBD,
    // validarCambioClave,
    repoAgendaController.consultaPorTerapeuta
);

router.get(
    '/consultaPaciente/:paciente/mes/:mes/anio/:anio',
    // autenticacion.validarToken,
    // autenticacion.verificarUsuarioEnBD,
    // validarCambioClave,
    repoAgendaController.consultaPorPacienteMes
);

module.exports = router;