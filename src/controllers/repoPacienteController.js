const repoPacienteService = require('../services/repoPaciente');

const consultaPorGenero = async (req, res) =>{
    try {
        const { genero } = req.params;
        
        const resultado = await repoPacienteService.consultaPorGenero(genero);
        
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor en repoPacienteController'
        });
    }
}

const consultarPorEdad = async (req, res) => {
    try{
        const { tipoEdad } = req.params;

        const resultado = await repoPacienteService.consultaPorEdad(tipoEdad);

        if (!resultado.success) {
            return res.status(404).json(resultado);
        }
        
        return res.status(200).json(resultado);
    }catch(error){
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor en repoPacienteController Por edad'
        });
    }
}

module.exports = {
    consultaPorGenero,
    consultarPorEdad
};