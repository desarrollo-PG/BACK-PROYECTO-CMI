const repoAgendaService = require('../services/repoAgenda');

const consultaPorTerapeuta = async (req, res) => {
    try {
        const { terapeuta, fecha } = req.params;
        
        const resultado = await repoAgendaService.consultaPorTerapeuta(terapeuta, fecha);
        
        if (!resultado.success) {
            return res.status(404).json(resultado);
        }
        
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor en repoAgendaController por terapeuta'
        });
    }
}

const consultaPorPacienteMes = async (req, res) => {
    try {
        const { paciente, mes, anio } = req.params;
        
        const resultado = await repoAgendaService.consultaPorPacienteMes(paciente, mes, anio);
        
        if (!resultado.success) {
            return res.status(404).json(resultado);
        }
        
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor en agendaController'
        });
    }
}

module.exports = {
    consultaPorTerapeuta,
    consultaPorPacienteMes
};