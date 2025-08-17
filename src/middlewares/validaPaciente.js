// validaPaciente.js
const { body, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors.array()
        });
    }
    next();
};

const validarPaciente = [
  body('nombres')
    .notEmpty()
    .withMessage('Los nombres son obligatorios')
    .isLength({ min: 2, max: 100 })
    .withMessage('Los nombres deben tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('Los nombres solo pueden contener letras y espacios'),

  body('apellidos')
    .notEmpty()
    .withMessage('Los apellidos son obligatorios')
    .isLength({ min: 2, max: 100 })
    .withMessage('Los apellidos deben tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('Los apellidos solo pueden contener letras y espacios'),

  body('cui')
    .notEmpty()
    .withMessage('El CUI es obligatorio')
    .isLength({ min: 13, max: 13 })
    .withMessage('El CUI debe tener exactamente 13 dígitos')
    .isNumeric()
    .withMessage('El CUI debe contener solo números'),

  body('fechanacimiento')
    .notEmpty()
    .withMessage('La fecha de nacimiento es obligatoria')
    .isISO8601()
    .withMessage('La fecha de nacimiento debe tener un formato válido')
    .custom((value) => {
      const fecha = new Date(value);
      const hoy = new Date();
      const hace150Anos = new Date();
      hace150Anos.setFullYear(hoy.getFullYear() - 150);

      if (fecha > hoy) {
        throw new Error('La fecha de nacimiento no puede ser futura');
      }
      if (fecha < hace150Anos) {
        throw new Error('La fecha de nacimiento no puede ser mayor a 150 años');
      }
      return true;
    }),

  body('genero')
    .notEmpty()
    .withMessage('El género es obligatorio')
    .isIn(['M', 'F'])
    .withMessage('El género debe ser M (Masculino) o F (Femenino)'),

  body('tipoconsulta')
    .optional()
    .isLength({ max: 100 })
    .withMessage('El tipo de consulta no puede exceder 100 caracteres'),

  body('tipodiscapacidad')
    .optional()
    .isLength({ max: 150 })
    .withMessage('El tipo de discapacidad no puede exceder 150 caracteres'),

  body('telefonopersonal')
    .optional()
    .matches(/^[0-9+\-\s()]*$/)
    .withMessage('El teléfono personal debe contener solo números y símbolos válidos')
    .isLength({ max: 20 })
    .withMessage('El teléfono personal no puede exceder 20 caracteres'),

  body('nombrecontactoemergencia')
    .optional()
    .isLength({ max: 150 })
    .withMessage('El nombre del contacto de emergencia no puede exceder 150 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)
    .withMessage('El nombre del contacto de emergencia solo puede contener letras y espacios'),

  body('telefonoemergencia')
    .optional()
    .matches(/^[0-9+\-\s()]*$/)
    .withMessage('El teléfono de emergencia debe contener solo números y símbolos válidos')
    .isLength({ max: 20 })
    .withMessage('El teléfono de emergencia no puede exceder 20 caracteres'),

  body('nombreencargado')
    .optional()
    .isLength({ max: 150 })
    .withMessage('El nombre del encargado no puede exceder 150 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)
    .withMessage('El nombre del encargado solo puede contener letras y espacios'),

  body('dpiencargado')
    .optional()
    .isLength({ max: 20 })
    .withMessage('El DPI del encargado no puede exceder 20 caracteres')
    .matches(/^[0-9\s]*$/)
    .withMessage('El DPI del encargado debe contener solo números'),

  body('telefonoencargado')
    .optional()
    .matches(/^[0-9+\-\s()]*$/)
    .withMessage('El teléfono del encargado debe contener solo números y símbolos válidos')
    .isLength({ max: 20 })
    .withMessage('El teléfono del encargado no puede exceder 20 caracteres'),

  body('municipio')
    .optional()
    .isLength({ max: 100 })
    .withMessage('El municipio no puede exceder 100 caracteres'),

  body('aldea')
    .optional()
    .isLength({ max: 100 })
    .withMessage('La aldea no puede exceder 100 caracteres'),

  body('direccion')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La dirección no puede exceder 500 caracteres'),

  handleValidationErrors
];

// Exportar la validación
module.exports = {
  validarPaciente
};