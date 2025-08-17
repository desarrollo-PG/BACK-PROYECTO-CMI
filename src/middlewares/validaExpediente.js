// middlewares/validaExpediente.js - VERSIÓN CORREGIDA
const { body, param, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('❌ ERRORES DE VALIDACIÓN:', errors.array());
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors.array()
        });
    }
    next();
};

// Validaciones para crear/actualizar expediente
const validarExpediente = [
  // ✅ ARREGLO: Validación del número de expediente simplificada
  body('numeroexpediente')
    .optional({ nullable: true, checkFalsy: true }) // ✅ Permitir null, undefined, string vacío
    .isLength({ min: 1, max: 50 })
    .withMessage('El número de expediente debe tener entre 1 y 50 caracteres')
    .matches(/^[a-zA-Z0-9\-_]+$/)
    .withMessage('El número de expediente solo puede contener letras, números, guiones y guiones bajos'),

  // ✅ ARREGLO: Validación del flag de generación automática
  body('generarAutomatico')
    .optional({ nullable: true })
    .isBoolean()
    .withMessage('generarAutomatico debe ser un valor booleano'),

  // ✅ ARREGLO: Validación personalizada mejorada
  body().custom((value, { req }) => {
    const { numeroexpediente, generarAutomatico } = req.body;
    
    console.log('🔍 VALIDANDO:', { numeroexpediente, generarAutomatico });
    
    // ✅ Si generarAutomatico es true, no necesita numeroexpediente
    if (generarAutomatico === true) {
      console.log('✅ Modo automático - validación OK');
      return true;
    }
    
    // ✅ Si generarAutomatico es false o no existe, necesita numeroexpediente
    if (generarAutomatico === false) {
      if (!numeroexpediente || numeroexpediente.trim() === '') {
        console.log('❌ Modo manual pero sin número de expediente');
        throw new Error('El número de expediente es obligatorio cuando no se genera automáticamente');
      }
      console.log('✅ Modo manual con número - validación OK');
    }
    
    // ✅ Si generarAutomatico es undefined/null, asumir automático
    if (generarAutomatico === undefined || generarAutomatico === null) {
      console.log('✅ Modo automático por defecto - validación OK');
      return true;
    }
    
    return true;
  }),

  // Historia de enfermedad
  body('historiaenfermedad')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 5000 })
    .withMessage('La historia de enfermedad no puede exceder 5000 caracteres'),

  // Antecedentes médicos
  body('antmedico')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 2000 })
    .withMessage('Los antecedentes médicos no pueden exceder 2000 caracteres'),

  body('antmedicamento')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 2000 })
    .withMessage('Los antecedentes de medicamentos no pueden exceder 2000 caracteres'),

  body('anttraumaticos')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 2000 })
    .withMessage('Los antecedentes traumáticos no pueden exceder 2000 caracteres'),

  body('antfamiliar')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 2000 })
    .withMessage('Los antecedentes familiares no pueden exceder 2000 caracteres'),

  body('antalergico')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 2000 })
    .withMessage('Los antecedentes alérgicos no pueden exceder 2000 caracteres'),

  body('antmedicamentos')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 2000 })
    .withMessage('Los antecedentes de medicamentos no pueden exceder 2000 caracteres'),

  body('antsustancias')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 2000 })
    .withMessage('Los antecedentes de sustancias no pueden exceder 2000 caracteres'),

  // ✅ ARREGLO: Antecedente intolerante lactosa mejorado
  body('antintolerantelactosa')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true; // Permitir valores vacíos
      }
      const numValue = parseInt(value);
      if (numValue !== 0 && numValue !== 1) {
        throw new Error('Intolerante lactosa debe ser 0 (No) o 1 (Sí)');
      }
      return true;
    }),

  // Antecedentes fisiológicos
  body('antfisoinmunizacion')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 2000 })
    .withMessage('Los antecedentes de inmunización no pueden exceder 2000 caracteres'),

  body('antfisocrecimiento')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 2000 })
    .withMessage('Los antecedentes de crecimiento no pueden exceder 2000 caracteres'),

  body('antfisohabitos')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 2000 })
    .withMessage('Los antecedentes de hábitos no pueden exceder 2000 caracteres'),

  body('antfisoalimentos')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 2000 })
    .withMessage('Los antecedentes de alimentos no pueden exceder 2000 caracteres'),

  // Antecedentes gineco-obstétricos
  body('gineobsprenatales')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 2000 })
    .withMessage('Los antecedentes prenatales no pueden exceder 2000 caracteres'),

  body('gineobsnatales')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 2000 })
    .withMessage('Los antecedentes natales no pueden exceder 2000 caracteres'),

  body('gineobspostnatales')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 2000 })
    .withMessage('Los antecedentes postnatales no pueden exceder 2000 caracteres'),

  // ✅ ARREGLO: Números gineco-obstétricos mejorados
  body('gineobsgestas')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 0) {
        throw new Error('El número de gestas debe ser un entero positivo');
      }
      return true;
    }),

  body('gineobspartos')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 0) {
        throw new Error('El número de partos debe ser un entero positivo');
      }
      return true;
    }),

  body('gineobsabortos')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 0) {
        throw new Error('El número de abortos debe ser un entero positivo');
      }
      return true;
    }),

  body('gineobscesareas')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 0) {
        throw new Error('El número de cesáreas debe ser un entero positivo');
      }
      return true;
    }),

  // Otros campos gineco-obstétricos
  body('gineobshv')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 500 })
    .withMessage('Gineco HV no puede exceder 500 caracteres'),

  body('gineobsmh')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 500 })
    .withMessage('Gineco MH no puede exceder 500 caracteres'),

  // Fecha de última regla
  body('gineobsfur')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('La fecha de última regla debe tener un formato válido'),

  body('gineobsciclos')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 500 })
    .withMessage('Los ciclos no pueden exceder 500 caracteres'),

  body('gineobsmenarquia')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 500 })
    .withMessage('La menarquia no puede exceder 500 caracteres'),

  // ✅ ARREGLO: Examen físico - valores decimales mejorados
  body('examenfistc')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0 || numValue > 999.99) {
        throw new Error('La temperatura corporal debe ser un número válido entre 0 y 999.99');
      }
      return true;
    }),

  body('examenfispa')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 20 })
    .withMessage('La presión arterial no puede exceder 20 caracteres')
    .matches(/^[0-9\/\-\s]*$/)
    .withMessage('La presión arterial solo puede contener números, barras y guiones'),

  body('examenfisfc')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 0 || numValue > 999) {
        throw new Error('La frecuencia cardíaca debe ser un entero entre 0 y 999');
      }
      return true;
    }),

  body('examenfisfr')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 0 || numValue > 999) {
        throw new Error('La frecuencia respiratoria debe ser un entero entre 0 y 999');
      }
      return true;
    }),

  body('examenfissao2')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0 || numValue > 100) {
        throw new Error('La saturación de oxígeno debe ser un número entre 0 y 100');
      }
      return true;
    }),

  body('examenfispeso')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0 || numValue > 9999.99) {
        throw new Error('El peso debe ser un número válido entre 0 y 9999.99');
      }
      return true;
    }),

  body('examenfistalla')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0 || numValue > 999.99) {
        throw new Error('La talla debe ser un número válido entre 0 y 999.99');
      }
      return true;
    }),

  body('examenfisimc')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0 || numValue > 999.99) {
        throw new Error('El IMC debe ser un número válido entre 0 y 999.99');
      }
      return true;
    }),

  body('examenfisgmt')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 2000 })
    .withMessage('El examen físico GMT no puede exceder 2000 caracteres'),

  handleValidationErrors
];

// Validación para parámetros de ID de expediente
const validateExpedienteId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID del expediente debe ser un número entero válido'),
    handleValidationErrors
];

module.exports = {
  validarExpediente,
  validateExpedienteId
};