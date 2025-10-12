const agendaService = require('../services/agendaService');

const crearCita = async (req, res) => {
    try{
        const citaData = req.body;
        const resultado = await agendaService.crearCita(citaData);

        if(resultado.success){
            res.status(201).json(resultado);
        }else{
            res.status(400).json(resultado);
        }
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const obtenerCitas = async (req, res) => {
    try{
        const resultado = await agendaService.obtenerCitas();

        if(resultado.success){
            res.status(200).json(resultado);
        }else{
            res.status(400).json(resultado);
        }
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const actualizarCita = async (req, res) => {
    try{
        const { id } = req.params;
        const citaData = req.body;
        
        const resultado = await agendaService.actualizarCita(id, citaData);

        if(resultado.success){
            res.status(200).json(resultado);
        }else{
            res.status(400).json(resultado);
        }
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const eliminarCita = async (req, res) => {
    try{
        const { id } = req.params;
        const { usuariomodificacion } = req.body;
        
        const resultado = await agendaService.eliminarCita(id, usuariomodificacion);

        if(resultado.success){
            res.status(200).json(resultado);
        }else{
            res.status(400).json(resultado);
        }
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    crearCita,
    obtenerCitas,
    actualizarCita,
    eliminarCita
};