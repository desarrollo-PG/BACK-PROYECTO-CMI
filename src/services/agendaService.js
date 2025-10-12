const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

class AgendaService{
    convertirFecha(fechaString) {
        if (!fechaString) return null;
        
        // Si ya es un objeto Date, devolverlo tal como está
        if (fechaString instanceof Date) return fechaString;
        
        // Convertir string a Date
        const fecha = new Date(fechaString);
        
        // Verificar que la fecha sea válida
        if (isNaN(fecha.getTime())) {
            throw new Error(`Fecha inválida: ${fechaString}`);
        }
        
        return fecha;
    }

    async crearCita(agendaData){
        try{
            const { fkusuario, fkpaciente, fechaatencion, horaatencion, comentario, transporte, fechatransporte, horariotransporte, direccion,
                    usuariocreacion, estado } = agendaData;

            if(!fkusuario || !fkpaciente || !fechaatencion || !horaatencion || !usuariocreacion){
                return{
                    success: false,
                    message: 'Complete los campos requeridos'
                };
            }

            let horaFormateada = horaatencion;
    
            // Si viene en formato HH:mm:ss, usarla directamente
            // Si viene en formato HH:mm, agregar :00
            if (horaatencion.split(':').length === 2) {
            horaFormateada = `${horaatencion}:00`;
            }

            const citaNueva = await prisma.agenda.create({
                data:{
                    fkusuario:          parseInt(fkusuario),
                    fkpaciente:         parseInt(fkpaciente),
                    fechaatencion:      this.convertirFecha(fechaatencion),
                    horaatencion:       new Date(`1970-01-01T${horaFormateada}Z`),
                    comentario:         comentario,
                    transporte:         parseInt(transporte),
                    fechatransporte:    this.convertirFecha(fechatransporte),
                    horariotransporte:  horariotransporte
                                        ? new Date(`1970-01-01T${horariotransporte}:00Z`)
                                        : null,
                    direccion:          direccion,
                    usuariocreacion:    usuariocreacion,
                    estado:             parseInt(estado)
                },
                select:{
                    fkusuario:          true,
                    fkpaciente:         true,
                    fechaatencion:      true,
                    horaatencion:       true,
                    comentario:         true,
                    transporte:         true,
                    fechatransporte:    true,
                    horariotransporte:  true,
                    direccion:          true,
                    estado:             true
                }
            });

            return{
                success: true,
                message: 'Cita creado exitosamente',
                data: agendaData
            };
        }catch(error){
            console.error("Error al crear una cita en el service: ", error.message);
            throw error;
        }
    }

    async obtenerCitas(){
        try{
            const agenda = await prisma.agenda.findMany({
                where:{
                    estado: 1
                },
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
                orderBy:{
                    fkpaciente: 'asc'
                }
            });

            // Formatear las fechas y horas para el frontend
            const agendaFormateada = agenda.map(cita => {
                // Formatear fecha de atención
                const fechaAtencion = new Date(cita.fechaatencion);
                const fechaStr = fechaAtencion.toISOString().split('T')[0];
                
                // Formatear hora de atención
                const horaAtencion = new Date(cita.horaatencion);
                const horaStr = horaAtencion.toISOString().split('T')[1].substring(0, 8);
                
                // Formatear fecha de transporte si existe
                let fechaTransporteStr = null;
                if (cita.fechatransporte) {
                    const fechaTransporte = new Date(cita.fechatransporte);
                    fechaTransporteStr = fechaTransporte.toISOString().split('T')[0];
                }
                
                // Formatear hora de transporte si existe
                let horaTransporteStr = null;
                if (cita.horariotransporte) {
                    const horaTransporte = new Date(cita.horariotransporte);
                    horaTransporteStr = horaTransporte.toISOString().split('T')[1].substring(0, 8);
                }
                
                return {
                    ...cita,
                    fechaatencion: fechaStr,
                    horaatencion: horaStr,
                    fechatransporte: fechaTransporteStr,
                    horariotransporte: horaTransporteStr
                };
            });

            return{
                success: true,
                data: agendaFormateada
            };
        }catch(error){
            console.error("Error en agendaService: ", error.message);
            throw error;
        }
    }

    async actualizarCita(idagenda, agendaData){
        try{
            const { fkusuario, fkpaciente, fechaatencion, horaatencion, comentario, transporte, fechatransporte, horariotransporte, direccion,
                    usuariomodificacion, estado } = agendaData;

            // Validar que la cita existe
            const citaExistente = await prisma.agenda.findUnique({
                where: { idagenda: parseInt(idagenda) }
            });

            if(!citaExistente){
                return{
                    success: false,
                    message: 'La cita no existe'
                };
            }

            // Validar campos requeridos
            if(!fkusuario || !fkpaciente || !fechaatencion || !horaatencion){
                return{
                    success: false,
                    message: 'Complete los campos requeridos'
                };
            }

            let horaFormateada = horaatencion;

            // Si viene en formato HH:mm:ss, usarla directamente
            // Si viene en formato HH:mm, agregar :00
            if (horaatencion.split(':').length === 2) {
                horaFormateada = `${horaatencion}:00`;
            }

            // Formatear hora de transporte si existe
            let horaTransporteFormateada = null;
            if (horariotransporte) {
                if (horariotransporte.split(':').length === 2) {
                    horaTransporteFormateada = `${horariotransporte}:00`;
                } else {
                    horaTransporteFormateada = horariotransporte;
                }
            }

            const citaActualizada = await prisma.agenda.update({
                where: {
                    idagenda:           parseInt(idagenda)
                },
                data:{
                    fkusuario:          parseInt(fkusuario),
                    fkpaciente:         parseInt(fkpaciente),
                    fechaatencion:      this.convertirFecha(fechaatencion),
                    horaatencion:       new Date(`1970-01-01T${horaFormateada}Z`),
                    comentario:         comentario || null,
                    transporte:         parseInt(transporte),
                    fechatransporte:    fechatransporte ? this.convertirFecha(fechatransporte) : null,
                    horariotransporte:  horaTransporteFormateada
                                        ? new Date(`1970-01-01T${horaTransporteFormateada}Z`)
                                        : null,
                    direccion:          direccion || null,
                    usuariomodificacion: usuariomodificacion || null,
                    fechamodificacion:  new Date(),
                    estado:             estado !== undefined ? parseInt(estado) : citaExistente.estado
                },
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
                }
            });

            // Formatear las fechas para el frontend
            const fechaStr = citaActualizada.fechaatencion.toISOString().split('T')[0];
            const horaStr = citaActualizada.horaatencion.toISOString().split('T')[1].substring(0, 8);
            
            let fechaTransporteStr = null;
            if (citaActualizada.fechatransporte) {
                fechaTransporteStr = citaActualizada.fechatransporte.toISOString().split('T')[0];
            }
            
            let horaTransporteStr = null;
            if (citaActualizada.horariotransporte) {
                horaTransporteStr = citaActualizada.horariotransporte.toISOString().split('T')[1].substring(0, 8);
            }

            return{
                success: true,
                message: 'Cita actualizada exitosamente',
                data: {
                    ...citaActualizada,
                    fechaatencion: fechaStr,
                    horaatencion: horaStr,
                    fechatransporte: fechaTransporteStr,
                    horariotransporte: horaTransporteStr
                }
            };
        }catch(error){
            console.error("Error al actualizar la cita en el service: ", error.message);
            throw error;
        }
    }

    async eliminarCita(idagenda, usuarioModificacion){
        try{
            // Validar que la cita existe
            const citaExistente = await prisma.agenda.findUnique({
                where: { idagenda: parseInt(idagenda) }
            });

            if(!citaExistente){
                return{
                    success: false,
                    message: 'La cita no existe'
                };
            }

            // Verificar que no esté ya eliminada
            if(citaExistente.estado === 0){
                return{
                    success: false,
                    message: 'La cita ya está eliminada'
                };
            }

            // Cambiar estado a ELIMINADA (soft delete)
            const citaEliminada = await prisma.agenda.update({
                where: {
                    idagenda: parseInt(idagenda)
                },
                data: {
                    estado: 0,
                    usuariomodificacion: usuarioModificacion
                }
            });

            return{
                success: true,
                message: 'Cita eliminada exitosamente'
            };
        }catch(error){
            console.error("Error al eliminar la cita en el service: ", error.message);
            throw error;
        }
    }
}

module.exports = new AgendaService();