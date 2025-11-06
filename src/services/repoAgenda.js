const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

class repoAgenda{
    async consultaPorTerapeuta(terapeuta, fecha){
        try{
            // Validar que la fecha sea obligatoria
            if(!fecha || fecha === '' || fecha === 'T'){
                return {
                    success: false,
                    message: 'La fecha es obligatoria'
                };
            }

            // Construir las fechas directamente en UTC
            const fechaInicio = new Date(`${fecha}T00:00:00.000Z`);
            const fechaFin = new Date(`${fecha}T23:59:59.999Z`);

            const whereCondition = {
                estado: 1,
                fechaatencion: {
                    gte: fechaInicio,
                    lte: fechaFin
                }
            };

            // Filtro OPCIONAL por terapeuta - VALIDAR QUE SEA UN NÚMERO VÁLIDO
            if(terapeuta && terapeuta !== 'T' && terapeuta !== 't' && terapeuta !== '' && !isNaN(parseInt(terapeuta))){
                whereCondition.fkusuario = parseInt(terapeuta);
            }

            const citaPorTerapeuta = await prisma.agenda.findMany({
                where: whereCondition,
                select:{
                    idagenda:          true,
                    fkusuario:         true,
                    fkpaciente:        true,
                    fechaatencion:     true,
                    horaatencion:      true,
                    comentario:        true,
                    transporte:        true,
                    fechatransporte:   true,
                    horariotransporte: true,
                    direccion:         true,
                    estado:            true,

                    usuario: {
                        select: {
                            idusuario: true,
                            nombres:   true,
                            apellidos: true
                        }
                    },
                    paciente: {
                        select: {
                            idpaciente:        true,
                            nombres:           true,
                            apellidos:         true,
                            nombreencargado:   true,
                            telefonoencargado: true
                        }
                    }
                },
                orderBy:[
                    { fechaatencion: 'asc' },
                    { horaatencion: 'asc' }
                ]
            });

            if(citaPorTerapeuta.length === 0){
                return {
                    success: false,
                    message: 'No se encontraron citas para la fecha indicada'
                };
            }

            return {
                success: true,
                data: citaPorTerapeuta,
                total: citaPorTerapeuta.length
            };

        }catch(error){
            console.error("Error en repoAgenda al consultar por terapeuta: ", error.message);
            throw error;
        }
    }

    async consultaPorPacienteMes(paciente, mes, anio){
        try{
            // Validar que mes y año sean obligatorios
            if(!mes || !anio || mes === '' || anio === ''){
                return {
                    success: false,
                    message: 'El mes y año son obligatorios'
                };
            }

            // Validar que el mes sea válido (1-12)
            const mesNum = parseInt(mes);
            if(isNaN(mesNum) || mesNum < 1 || mesNum > 12){
                return {
                    success: false,
                    message: 'El mes debe ser un número entre 1 y 12'
                };
            }

            // Validar que el año sea válido
            const anioNum = parseInt(anio);
            if(isNaN(anioNum) || anioNum < 2000){
                return {
                    success: false,
                    message: 'El año no es válido'
                };
            }

            // Calcular primer y último día del mes en UTC
            const fechaInicio = new Date(Date.UTC(anioNum, mesNum - 1, 1, 0, 0, 0, 0));
            const fechaFin = new Date(Date.UTC(anioNum, mesNum, 0, 23, 59, 59, 999));

            const whereCondition = {
                estado: 1,
                fechaatencion: {
                    gte: fechaInicio,
                    lte: fechaFin
                }
            };

            // Filtro OPCIONAL por paciente - VALIDAR QUE SEA UN NÚMERO VÁLIDO
            if(paciente && paciente !== 'T' && paciente !== 't' && paciente !== '' && !isNaN(parseInt(paciente))){
                whereCondition.fkpaciente = parseInt(paciente);
            }

            const citasPorMes = await prisma.agenda.findMany({
                where: whereCondition,
                select:{
                    idagenda:          true,
                    fkusuario:         true,
                    fkpaciente:        true,
                    fechaatencion:     true,
                    horaatencion:      true,
                    comentario:        true,
                    transporte:        true,
                    fechatransporte:   true,
                    horariotransporte: true,
                    direccion:         true,
                    estado:            true,

                    usuario: {
                        select: {
                            idusuario: true,
                            nombres:   true,
                            apellidos: true
                        }
                    },
                    paciente: {
                        select: {
                            idpaciente:        true,
                            nombres:           true,
                            apellidos:         true,
                            nombreencargado:   true,
                            telefonoencargado: true
                        }
                    }
                },
                orderBy:[
                    { fechaatencion: 'asc' },
                    { horaatencion: 'asc' }
                ]
            });

            if(citasPorMes.length === 0){
                return {
                    success: false,
                    message: 'No se encontraron citas para el mes indicado'
                };
            }

            return {
                success: true,
                data: citasPorMes,
                total: citasPorMes.length
            };

        }catch(error){
            console.error("Error en repoAgenda al consultar por paciente y mes: ", error.message);
            throw error;
        }
    }
}

module.exports = new repoAgenda();