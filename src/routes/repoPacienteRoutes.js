const express = require('express');
const router = express.Router();
const autenticacion = require('../middlewares/auth');
const { validarCambioClave } = require('../middlewares/validarCambioClave');
const repoPacienteController = require('../controllers/repoPacienteController');
const checkRole = require('../middlewares/checkRole');

router.get(
    '/consultaPorGenero/:genero',
    autenticacion.validarToken,
    autenticacion.verificarUsuarioEnBD,
    validarCambioClave,
    checkRole(1,4,5),
    repoPacienteController.consultaPorGenero
);

router.get(
    '/consultaPorEdad/:tipoEdad',
    autenticacion.validarToken,
    autenticacion.verificarUsuarioEnBD,
    validarCambioClave,
    checkRole(1,4,5),
    repoPacienteController.consultarPorEdad
);

module.exports = router;