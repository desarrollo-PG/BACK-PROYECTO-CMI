const authService = require('../services/authService');
const emailService = require('../services/EmailService');

const login = async (req, res) => {
    try{
        const { usuario, clave } = req.body;

        const resultado = await authService.login(usuario, clave);

        res.status(200).json({
            success: true,
            message: 'Login exitoso',
            data: resultado
        });
    } catch(error) {
        console.error('Error en AuthController.login:', error.message);

        let statusCode = 500;
        if(error.message === 'Credenciales inválidas'){
            statusCode = 401;
        } else if(error.message.includes('inactivo')){
            statusCode = 403; 
        }

        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

const logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logout exitoso. Elimine el token del cliente.'
    });
};

const RecuperarClave = async (req, res) => {
    try{
        const { correo } = req.body;

        const claveRecuperada = await emailService.ResetearClave(correo);

        res.status(200).json({
            success: true,
            message: 'Clave restaurada',
            data: claveRecuperada
        });
    }catch(error){
        console.error('Error en AuthController.login:', error.message);
    }
};

module.exports = {
    login,
    logout,
    RecuperarClave
};