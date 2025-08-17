// controllers/expedienteController.js
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

class ExpedienteController {
  // Obtener todos los expedientes con paginación
  static async getAllExpedientes(req, res) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const whereCondition = search ? {
        OR: [
          { numeroexpediente: { contains: search, mode: 'insensitive' } },
          { historiaenfermedad: { contains: search, mode: 'insensitive' } }
        ]
      } : {};

      const [expedientes, total] = await Promise.all([
        prisma.expediente.findMany({
          where: {
            estado: 1,
            ...whereCondition
          },
          skip,
          take: parseInt(limit),
          orderBy: {
            fechacreacion: 'desc'
          },
          include: {
            paciente: {
              select: {
                idpaciente: true,
                nombres: true,
                apellidos: true,
                cui: true
              }
            }
          }
        }),
        prisma.expediente.count({
          where: {
            estado: 1,
            ...whereCondition
          }
        })
      ]);

      res.json({
        success: true,
        data: expedientes,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error al obtener expedientes:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener un expediente por ID
  static async getExpedienteById(req, res) {
    try {
      const { id } = req.params;

      const expediente = await prisma.expediente.findFirst({
        where: {
          idexpediente: parseInt(id),
          estado: 1
        },
        include: {
          paciente: {
            select: {
              idpaciente: true,
              nombres: true,
              apellidos: true,
              cui: true,
              fechanacimiento: true,
              genero: true
            }
          },
          detallereferirpaciente: {
            select: {
              idrefpaciente: true,
              comentario: true,
              fechacreacion: true,
              clinica: {
                select: {
                  idclinica: true,
                  nombreclinica: true
                }
              }
            }
          }
        }
      });

      if (!expediente) {
        return res.status(404).json({
          success: false,
          message: 'Expediente no encontrado'
        });
      }

      res.json({
        success: true,
        data: expediente
      });
    } catch (error) {
      console.error('Error al obtener expediente:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Crear nuevo expediente
  static async createExpediente(req, res) {
    try {
      const {
        idpaciente,
        numeroexpediente,
        generarAutomatico = false, // Nueva opción para generar automáticamente
        historiaenfermedad,
        antmedico,
        antmedicamento,
        anttraumaticos,
        antfamiliar,
        antalergico,
        antmedicamentos,
        antsustancias,
        antintolerantelactosa,
        antfisoinmunizacion,
        antfisocrecimiento,
        antfisohabitos,
        antfisoalimentos,
        gineobsprenatales,
        gineobsnatales,
        gineobspostnatales,
        gineobsgestas,
        gineobspartos,
        gineobsabortos,
        gineobscesareas,
        gineobshv,
        gineobsmh,
        gineobsfur,
        gineobsciclos,
        gineobsmenarquia,
        examenfistc,
        examenfispa,
        examenfisfc,
        examenfisfr,
        examenfissao2,
        examenfispeso,
        examenfistalla,
        examenfisimc,
        examenfisgmt
      } = req.body;

      console.log('📝 Creando expediente con datos:', req.body);

      
      // Obtener usuario del middleware o usar valor por defecto
      const usuario = req.usuario?.usuario || 'sistema';

      let numeroExpedienteFinal;

      // Determinar el número de expediente
      if (generarAutomatico || !numeroexpediente || numeroexpediente.trim() === '') {
        // Generar número automáticamente
        console.log('🤖 Generando número de expediente automáticamente...');
        numeroExpedienteFinal = await ExpedienteController._generarNumeroAutomatico();
        console.log('✅ Número generado:', numeroExpedienteFinal);
      } else {
        // Usar número manual proporcionado
        console.log('✏️ Usando número de expediente manual:', numeroexpediente);
        numeroExpedienteFinal = numeroexpediente.trim();
        
        // Verificar que el número manual no exista
        const existingExpediente = await prisma.expediente.findUnique({
          where: { numeroexpediente: numeroExpedienteFinal }
        });

        if (existingExpediente) {
          return res.status(400).json({
            success: false,
            message: 'Ya existe un expediente con ese número'
          });
        }
      }

      // Crear expediente
      const expediente = await prisma.expediente.create({
        data: {
          numeroexpediente: numeroExpedienteFinal,
          historiaenfermedad,
          antmedico,
          antmedicamento,
          anttraumaticos,
          antfamiliar,
          antalergico,
          antmedicamentos,
          antsustancias,
          antintolerantelactosa: parseInt(antintolerantelactosa) || 0,
          antfisoinmunizacion,
          antfisocrecimiento,
          antfisohabitos,
          antfisoalimentos,
          gineobsprenatales,
          gineobsnatales,
          gineobspostnatales,
          gineobsgestas: parseInt(gineobsgestas) || null,
          gineobspartos: parseInt(gineobspartos) || null,
          gineobsabortos: parseInt(gineobsabortos) || null,
          gineobscesareas: parseInt(gineobscesareas) || null,
          gineobshv,
          gineobsmh,
          gineobsfur: gineobsfur ? new Date(gineobsfur) : null,
          gineobsciclos,
          gineobsmenarquia,
          examenfistc: examenfistc ? parseFloat(examenfistc) : null,
          examenfispa,
          examenfisfc: parseInt(examenfisfc) || null,
          examenfisfr: parseInt(examenfisfr) || null,
          examenfissao2: examenfissao2 ? parseFloat(examenfissao2) : null,
          examenfispeso: examenfispeso ? parseFloat(examenfispeso) : null,
          examenfistalla: examenfistalla ? parseFloat(examenfistalla) : null,
          examenfisimc: examenfisimc ? parseFloat(examenfisimc) : null,
          examenfisgmt,
          usuariocreacion: usuario,
          estado: 1
        }
      });

      // 🎯 NUEVA LÓGICA: Si hay idpaciente, vincularlo al expediente
      if (idpaciente) {
        console.log('🔗 Vinculando expediente al paciente:', idpaciente);
        
        try {
          await prisma.paciente.update({
            where: { idpaciente: parseInt(idpaciente) },
            data: { 
              fkexpediente: expediente.idexpediente,
              usuariomodificacion: usuario,
              fechamodificacion: new Date()
            }
          });
          
          console.log('✅ Paciente vinculado al expediente exitosamente');
        } catch (updateError) {
          console.error('❌ Error al vincular paciente:', updateError);
          // El expediente ya se creó, pero no se pudo vincular
          // Podrías decidir si devolver error o solo advertencia
        }
      }

      res.status(201).json({
        success: true,
        message: `Expediente creado exitosamente con número: ${numeroExpedienteFinal}`,
        data: expediente
      });
    } catch (error) {
      console.error('❌ Error al crear expediente:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Actualizar expediente
  static async updateExpediente(req, res) {
    try {
      const { id } = req.params;
      const usuario = req.usuario?.usuario || 'sistema';
      const updateData = { ...req.body };

      console.log('📝 Actualizando expediente:', id, 'con datos:', updateData);

      // Verificar que el expediente existe
      const existingExpediente = await prisma.expediente.findFirst({
        where: {
          idexpediente: parseInt(id),
          estado: 1
        }
      });

      if (!existingExpediente) {
        return res.status(404).json({
          success: false,
          message: 'Expediente no encontrado'
        });
      }

      // Si se está actualizando el número de expediente, verificar que no exista
      if (updateData.numeroexpediente && updateData.numeroexpediente !== existingExpediente.numeroexpediente) {
        const numeroExists = await prisma.expediente.findFirst({
          where: { 
            numeroexpediente: updateData.numeroexpediente,
            idexpediente: { not: parseInt(id) }
          }
        });

        if (numeroExists) {
          return res.status(400).json({
            success: false,
            message: 'Ya existe un expediente con ese número'
          });
        }
      }

      // Procesar fechas y números si vienen en el update
      if (updateData.gineobsfur) {
        updateData.gineobsfur = new Date(updateData.gineobsfur);
      }

      // Convertir campos numéricos
      const numericFields = ['antintolerantelactosa', 'gineobsgestas', 'gineobspartos', 'gineobsabortos', 'gineobscesareas', 'examenfisfc', 'examenfisfr'];
      const decimalFields = ['examenfistc', 'examenfissao2', 'examenfispeso', 'examenfistalla', 'examenfisimc'];

      numericFields.forEach(field => {
        if (updateData[field] !== undefined && updateData[field] !== null && updateData[field] !== '') {
          updateData[field] = parseInt(updateData[field]);
        }
      });

      decimalFields.forEach(field => {
        if (updateData[field] !== undefined && updateData[field] !== null && updateData[field] !== '') {
          updateData[field] = parseFloat(updateData[field]);
        }
      });

      // Actualizar expediente
      const expedienteActualizado = await prisma.expediente.update({
        where: {
          idexpediente: parseInt(id)
        },
        data: {
          ...updateData,
          usuariomodificacion: usuario,
          fechamodificacion: new Date()
        }
      });

      console.log('✅ Expediente actualizado exitosamente');

      res.json({
        success: true,
        message: 'Expediente actualizado exitosamente',
        data: expedienteActualizado
      });
    } catch (error) {
      console.error('❌ Error al actualizar expediente:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Eliminar expediente (soft delete)
  static async deleteExpediente(req, res) {
    try {
      const { id } = req.params;
      const usuario = req.usuario?.usuario || 'sistema';

      console.log('🗑️ Eliminando expediente:', id);

      // Verificar que el expediente existe
      const existingExpediente = await prisma.expediente.findFirst({
        where: {
          idexpediente: parseInt(id),
          estado: 1
        }
      });

      if (!existingExpediente) {
        return res.status(404).json({
          success: false,
          message: 'Expediente no encontrado'
        });
      }

      // Verificar si tiene pacientes asociados
      const pacientesAsociados = await prisma.paciente.count({
        where: {
          fkexpediente: parseInt(id),
          estado: 1
        }
      });

      if (pacientesAsociados > 0) {
        return res.status(400).json({
          success: false,
          message: 'No se puede eliminar el expediente porque tiene pacientes asociados'
        });
      }

      // Soft delete
      await prisma.expediente.update({
        where: {
          idexpediente: parseInt(id)
        },
        data: {
          estado: 0,
          usuariomodificacion: usuario,
          fechamodificacion: new Date()
        }
      });

      console.log('✅ Expediente eliminado exitosamente');

      res.json({
        success: true,
        message: 'Expediente eliminado exitosamente'
      });
    } catch (error) {
      console.error('❌ Error al eliminar expediente:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener estadísticas básicas
  static async getEstadisticas(req, res) {
    try {
      const [
        totalExpedientes,
        expedientesRecientes,
        expedientesConPacientes,
        expedientesSinPacientes
      ] = await Promise.all([
        // Total de expedientes activos
        prisma.expediente.count({
          where: { estado: 1 }
        }),
        
        // Expedientes creados recientemente (últimos 7 días)
        prisma.expediente.count({
          where: {
            estado: 1,
            fechacreacion: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          }
        }),

        // Expedientes con pacientes asociados
        prisma.expediente.count({
          where: {
            estado: 1,
            paciente: {
              some: {
                estado: 1
              }
            }
          }
        }),

        // Expedientes sin pacientes asociados
        prisma.expediente.count({
          where: {
            estado: 1,
            paciente: {
              none: {
                estado: 1
              }
            }
          }
        })
      ]);

      res.json({
        success: true,
        data: {
          totalExpedientes,
          expedientesRecientes,
          expedientesConPacientes,
          expedientesSinPacientes
        }
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Buscar expedientes disponibles (sin pacientes asignados)
  static async getExpedientesDisponibles(req, res) {
    try {
      const expedientesDisponibles = await prisma.expediente.findMany({
        where: {
          estado: 1,
          paciente: {
            none: {
              estado: 1
            }
          }
        },
        select: {
          idexpediente: true,
          numeroexpediente: true,
          historiaenfermedad: true,
          fechacreacion: true
        },
        orderBy: {
          numeroexpediente: 'asc'
        }
      });

      res.json({
        success: true,
        data: expedientesDisponibles
      });
    } catch (error) {
      console.error('Error al obtener expedientes disponibles:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Método privado para generar número automático
  static async _generarNumeroAutomatico() {
    try {
      // Obtener el último número de expediente
      const ultimoExpediente = await prisma.expediente.findFirst({
        orderBy: {
          idexpediente: 'desc'
        },
        select: {
          numeroexpediente: true
        }
      });

      let nuevoNumero;
      if (ultimoExpediente && ultimoExpediente.numeroexpediente) {
        // Intentar extraer número del patrón EXP-XXXXXX
        const match = ultimoExpediente.numeroexpediente.match(/EXP-(\d+)/);
        if (match) {
          const ultimoNumero = parseInt(match[1]);
          nuevoNumero = `EXP-${String(ultimoNumero + 1).padStart(6, '0')}`;
        } else {
          // Si no sigue el patrón, extraer todos los números y sumar 1
          const numeros = ultimoExpediente.numeroexpediente.replace(/\D/g, '');
          const ultimoNumero = numeros ? parseInt(numeros) : 0;
          nuevoNumero = `EXP-${String(ultimoNumero + 1).padStart(6, '0')}`;
        }
      } else {
        // Si no hay expedientes, comenzar con 1
        nuevoNumero = 'EXP-000001';
      }

      // Verificar que el número generado no exista (por seguridad)
      const existe = await prisma.expediente.findUnique({
        where: { numeroexpediente: nuevoNumero }
      });

      if (existe) {
        // Si existe, generar con timestamp como fallback
        nuevoNumero = `EXP-${Date.now()}`;
      }

      return nuevoNumero;
    } catch (error) {
      console.error('Error al generar número automático:', error);
      // Fallback con timestamp
      return `EXP-${Date.now()}`;
    }
  }

  // Generar número de expediente automático (endpoint público)
  static async generarNumeroExpediente(req, res) {
    try {
      const nuevoNumero = await ExpedienteController._generarNumeroAutomatico();

      res.json({
        success: true,
        data: { numeroexpediente: nuevoNumero }
      });
    } catch (error) {
      console.error('Error al generar número de expediente:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
}

module.exports = ExpedienteController;