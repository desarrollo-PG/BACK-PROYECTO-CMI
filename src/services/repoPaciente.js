const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

class repoPaciente {
    async consultaPorGenero(genero){
        try{
            const pacienteGenero = await prisma.paciente.findMany({
                select:{
                    nombres:                  true,
                    apellidos:                true,
                    cui:                      true,
                    fechanacimiento:          true,
                    genero:                   true,
                    tipodiscapacidad:         true,
                    telefonopersonal:         true,
                    nombrecontactoemergencia: true,
                    telefonoemergencia:       true,
                    municipio:                true,
                    aldea:                    true,
                    direccion:                true,
                    estado:                   true
                },
                where:{
                    ...(genero && genero !== 'T' && { genero: genero }), // Spread condicional
                    estado: 1
                },
                orderBy:{
                    nombres: 'asc'
                }
            });

            if(pacienteGenero.length === 0){
                return {
                    success: false,
                    message: 'No se encontraron pacientes'
                };
            }

            return{
                success: true,
                data: pacienteGenero
            }
        }catch(error){
            console.error("Error en repoPacienteService al consultar por genero: ", error.message);
            throw error;
        }
    }

    async consultaPorEdad(tipoEdad){
        try{
            // Calcular la fecha de hace 18 años (límite de mayoría de edad)
            const fechaLimite = new Date();
            fechaLimite.setFullYear(fechaLimite.getFullYear() - 18);

            // Construir el filtro de forma dinámica
            const whereCondition = {
                estado: 1
            };

            // Agregar filtro de edad según el tipo
            if(tipoEdad && tipoEdad !== 'T' && tipoEdad !== ''){
                if(tipoEdad === 'mayor' || tipoEdad === 'MAYOR'){
                    // Mayores de edad: nacidos hace más de 18 años
                    whereCondition.fechanacimiento = {
                        lte: fechaLimite
                    };
                } else if(tipoEdad === 'menor' || tipoEdad === 'MENOR'){
                    // Menores de edad: nacidos hace menos de 18 años
                    whereCondition.fechanacimiento = {
                        gt: fechaLimite
                    };
                }
            }

            const pacientes = await prisma.paciente.findMany({
                select:{
                    nombres:                  true,
                    apellidos:                true,
                    cui:                      true,
                    fechanacimiento:          true,
                    genero:                   true,
                    tipodiscapacidad:         true,
                    telefonopersonal:         true,
                    nombrecontactoemergencia: true,
                    telefonoemergencia:       true,
                    municipio:                true,
                    aldea:                    true,
                    direccion:                true,
                    estado:                   true
                },
                where: whereCondition,
                orderBy:{
                    nombres: 'asc'
                }
            });

            if(pacientes.length === 0){
                return {
                    success: false,
                    message: 'No se encontraron pacientes'
                };
            }

            return{
                success: true,
                data: pacientes
            }
        }catch(error){
            console.error("Error en repoPacienteService al consultar por edad: ", error.message);
            throw error;
        }
    }
}

module.exports = new repoPaciente();