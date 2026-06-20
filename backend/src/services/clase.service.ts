import { ClaseRepository } from '../repositories/clase.repository.js';
import { CreateClaseDTO, UpdateClaseDTO } from '../types/clase.dto.js';
import prisma from '../config/prisma.js';

export class ClaseService {
  
  static async registrarClase(data: CreateClaseDTO) {
    const clase = await ClaseRepository.crear(data);
    
    // Parse JSON details from description if they exist
    let instructorName = 'Profesor A';
    try {
      if (data.descripcion && data.descripcion.startsWith('{')) {
        const parsed = JSON.parse(data.descripcion);
        instructorName = parsed.instructorName || instructorName;
      }
    } catch (e) {
      console.error('Error parsing class description JSON:', e);
    }
    
    // Auto-create/find instructor
    let instructor = await prisma.instructor.findFirst({
      where: {
        OR: [
          { nombre: { contains: instructorName, mode: 'insensitive' } },
          { apellidos: { contains: instructorName, mode: 'insensitive' } }
        ]
      }
    });
    
    if (!instructor) {
      const names = instructorName.split(' ');
      instructor = await prisma.instructor.create({
        data: {
          nombre: names[0] || 'Profesor',
          apellidos: names.slice(1).join(' ') || 'General',
          foto_url: JSON.stringify({ specialty: 'General', status: 'Activo' })
        }
      });
    }
    
    // Create DetalleClase (agenda record)
    // Schedule it for next Monday at 6:00 PM
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + ((1 + 7 - baseDate.getDay()) % 7 || 7)); // Next Monday
    baseDate.setHours(18, 0, 0, 0); // 6:00 PM
    
    const endDate = new Date(baseDate);
    endDate.setHours(19, 0, 0, 0); // 7:00 PM

    // Array para obtener el nombre del día automáticamente
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    
    await prisma.detalleClase.create({
      data: {
        id_clase: clase.id_clase,
        id_instructor: instructor.id_instructor,
        fecha_hora_inicio: baseDate,
        fecha_hora_fin: endDate,
        dia: dayNames[baseDate.getDay()], // <-- Este es el campo clave que faltaba
        estado: 'Disponible',
        cupos: 30
      }
    });
    
    return clase;
  }

  static async listarClases() {
    const clases = await ClaseRepository.obtenerTodas();
    if (clases.length === 0) {
      throw new Error('No hay clases registradas en el catálogo.');
    }
    return clases;
  }

  static async modificarClase(id: string, data: UpdateClaseDTO) {
    const claseExistente = await ClaseRepository.buscarPorId(id);
    if (!claseExistente) {
      throw new Error('La clase que intentas modificar no existe.');
    }

    const claseActualizada = await ClaseRepository.actualizar(id, data);

    // If description changed, we might need to update the instructor in the DetalleClase
    let instructorName = '';
    try {
      if (data.descripcion && data.descripcion.startsWith('{')) {
        const parsed = JSON.parse(data.descripcion);
        instructorName = parsed.instructorName;
      }
    } catch (e) {
      console.error('Error parsing class description JSON:', e);
    }

    if (instructorName) {
      // Find or create instructor
      let instructor = await prisma.instructor.findFirst({
        where: {
          OR: [
            { nombre: { contains: instructorName, mode: 'insensitive' } },
            { apellidos: { contains: instructorName, mode: 'insensitive' } }
          ]
        }
      });

      if (!instructor) {
        const names = instructorName.split(' ');
        instructor = await prisma.instructor.create({
          data: {
            nombre: names[0] || 'Profesor',
            apellidos: names.slice(1).join(' ') || 'General',
            foto_url: JSON.stringify({ specialty: 'General', status: 'Activo' })
          }
        });
      }

      // Update instructor in DetalleClase
      await prisma.detalleClase.updateMany({
        where: { id_clase: id },
        data: { id_instructor: instructor.id_instructor }
      });
    }

    return claseActualizada;
  }

  static async eliminarClase(id: string) {
    const claseExistente = await ClaseRepository.buscarPorId(id);
    if (!claseExistente) {
      throw new Error('La clase que intentas eliminar no existe.');
    }

    // 1. Find DetalleClase ids
    const detallesClase = await prisma.detalleClase.findMany({
      where: { id_clase: id }
    });
    
    const idsDetalleClase = detallesClase.map(d => d.id_detalle_clase);

    // 2. Cascade delete Details and Reservations
    await prisma.detalleReserva.deleteMany({
      where: { id_detalle_clase: { in: idsDetalleClase } }
    });
    
    await prisma.reserva.deleteMany({
      where: { id_detalle_clase: { in: idsDetalleClase } }
    });
    
    await prisma.detalleClase.deleteMany({
      where: { id_clase: id }
    });

    return await ClaseRepository.eliminar(id);
  }
}