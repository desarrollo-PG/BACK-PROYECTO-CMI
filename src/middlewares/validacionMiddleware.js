const { body, validationResult } = require('express-validator');

const validarResetearPass = [
    body('correo')
    .isEmail()
    .normalizeEmail()
    .withMessage('correo inválido'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Datos inválidos',
            details: errors.array()
        });
        }
        next();
    }
];

module.exports = validarResetearPass;