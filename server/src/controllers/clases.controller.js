import prisma from '../config/database.js';

// Buscar socios (alumnos) por nombre del alumno - para que maestro/admin agregue a una clase
export const searchSocios = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json({ socios: [] });
    }
    const socios = await prisma.user.findMany({
      where: {
        rol: 'socio',
        OR: [
          { nombreAlumno: { contains: q.trim(), mode: 'insensitive' } },
          { nombre: { contains: q.trim(), mode: 'insensitive' } },
          { apellido: { contains: q.trim(), mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        nombreAlumno: true,
        email: true
      },
      take: 30
    });
    res.json({ socios });
  } catch (error) {
    console.error('Error al buscar socios:', error);
    res.status(500).json({ message: 'Error al buscar socios', error: error.message });
  }
};

// Listar clases: maestro ve solo las suyas, admin ve todas
export const getClases = async (req, res) => {
  try {
    const isAdmin = req.user.rol === 'admin';
    const where = isAdmin ? {} : { maestroId: req.user.id };
    const clases = await prisma.clase.findMany({
      where,
      include: {
        maestro: {
          select: { id: true, nombre: true, apellido: true }
        },
        _count: { select: { alumnos: true } }
      },
      orderBy: { updatedAt: 'desc' }
    });
    res.json({ clases });
  } catch (error) {
    console.error('Error al listar clases:', error);
    res.status(500).json({ message: 'Error al listar clases', error: error.message });
  }
};

// Crear clase: maestro crea para sí, admin puede indicar maestroId
export const createClase = async (req, res) => {
  try {
    const { nombre, maestroId } = req.body;
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ message: 'El nombre de la clase es requerido' });
    }
    const isAdmin = req.user.rol === 'admin';
    const finalMaestroId = isAdmin && maestroId ? maestroId : req.user.id;
    if (isAdmin && maestroId) {
      const maestro = await prisma.user.findUnique({
        where: { id: maestroId },
        select: { rol: true }
      });
      if (!maestro || maestro.rol !== 'maestro') {
        return res.status(400).json({ message: 'El maestro indicado no existe o no tiene rol maestro' });
      }
    }
    const clase = await prisma.clase.create({
      data: {
        nombre: nombre.trim(),
        maestroId: finalMaestroId
      },
      include: {
        maestro: { select: { id: true, nombre: true, apellido: true } },
        _count: { select: { alumnos: true } }
      }
    });
    res.status(201).json({ clase });
  } catch (error) {
    console.error('Error al crear clase:', error);
    res.status(500).json({ message: 'Error al crear clase', error: error.message });
  }
};

// Obtener una clase con alumnos
export const getClaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user.rol === 'admin';
    const clase = await prisma.clase.findUnique({
      where: { id },
      include: {
        maestro: { select: { id: true, nombre: true, apellido: true } },
        alumnos: {
          include: {
            user: {
              select: { id: true, nombre: true, apellido: true, nombreAlumno: true, email: true }
            }
          }
        }
      }
    });
    if (!clase) return res.status(404).json({ message: 'Clase no encontrada' });
    if (!isAdmin && clase.maestroId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes acceso a esta clase' });
    }
    res.json({
      clase: {
        ...clase,
        alumnos: clase.alumnos.map((a) => ({ ...a.user, claseAlumnoId: a.id }))
      }
    });
  } catch (error) {
    console.error('Error al obtener clase:', error);
    res.status(500).json({ message: 'Error al obtener clase', error: error.message });
  }
};

// Actualizar clase (nombre; admin puede cambiar maestroId)
export const updateClase = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, maestroId } = req.body;
    const isAdmin = req.user.rol === 'admin';
    const clase = await prisma.clase.findUnique({ where: { id } });
    if (!clase) return res.status(404).json({ message: 'Clase no encontrada' });
    if (!isAdmin && clase.maestroId !== req.user.id) {
      return res.status(403).json({ message: 'No puedes editar esta clase' });
    }
    const data = {};
    if (nombre !== undefined && nombre.trim()) data.nombre = nombre.trim();
    if (isAdmin && maestroId !== undefined) {
      const maestro = await prisma.user.findUnique({
        where: { id: maestroId },
        select: { rol: true }
      });
      if (!maestro || maestro.rol !== 'maestro') {
        return res.status(400).json({ message: 'El maestro indicado no existe o no tiene rol maestro' });
      }
      data.maestroId = maestroId;
    }
    const updated = await prisma.clase.update({
      where: { id },
      data,
      include: {
        maestro: { select: { id: true, nombre: true, apellido: true } },
        _count: { select: { alumnos: true } }
      }
    });
    res.json({ clase: updated });
  } catch (error) {
    console.error('Error al actualizar clase:', error);
    res.status(500).json({ message: 'Error al actualizar clase', error: error.message });
  }
};

// Eliminar clase
export const deleteClase = async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user.rol === 'admin';
    const clase = await prisma.clase.findUnique({ where: { id } });
    if (!clase) return res.status(404).json({ message: 'Clase no encontrada' });
    if (!isAdmin && clase.maestroId !== req.user.id) {
      return res.status(403).json({ message: 'No puedes eliminar esta clase' });
    }
    await prisma.clase.delete({ where: { id } });
    res.json({ message: 'Clase eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar clase:', error);
    res.status(500).json({ message: 'Error al eliminar clase', error: error.message });
  }
};

// Agregar alumno a la clase
export const addAlumnoToClase = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId es requerido' });
    const clase = await prisma.clase.findUnique({ where: { id } });
    if (!clase) return res.status(404).json({ message: 'Clase no encontrada' });
    const isAdmin = req.user.rol === 'admin';
    if (!isAdmin && clase.maestroId !== req.user.id) {
      return res.status(403).json({ message: 'No puedes modificar esta clase' });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { rol: true }
    });
    if (!user || user.rol !== 'socio') {
      return res.status(400).json({ message: 'El usuario no existe o no es un socio/alumno' });
    }
    await prisma.claseAlumno.create({
      data: { claseId: id, userId }
    });
    const updated = await prisma.clase.findUnique({
      where: { id },
      include: {
        alumnos: {
          include: {
            user: {
              select: { id: true, nombre: true, apellido: true, nombreAlumno: true, email: true }
            }
          }
        }
      }
    });
    res.status(201).json({ clase: updated, message: 'Alumno agregado a la clase' });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'El alumno ya está en esta clase' });
    }
    console.error('Error al agregar alumno:', error);
    res.status(500).json({ message: 'Error al agregar alumno', error: error.message });
  }
};

// Quitar alumno de la clase
export const removeAlumnoFromClase = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const clase = await prisma.clase.findUnique({ where: { id } });
    if (!clase) return res.status(404).json({ message: 'Clase no encontrada' });
    const isAdmin = req.user.rol === 'admin';
    if (!isAdmin && clase.maestroId !== req.user.id) {
      return res.status(403).json({ message: 'No puedes modificar esta clase' });
    }
    await prisma.claseAlumno.deleteMany({
      where: { claseId: id, userId }
    });
    res.json({ message: 'Alumno quitado de la clase' });
  } catch (error) {
    console.error('Error al quitar alumno:', error);
    res.status(500).json({ message: 'Error al quitar alumno', error: error.message });
  }
};

// Registrar asistencia: body { fecha (YYYY-MM-DD), userIds: string[] }
export const registrarAsistencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, userIds } = req.body;
    if (!fecha || !Array.isArray(userIds)) {
      return res.status(400).json({ message: 'fecha y userIds (array) son requeridos' });
    }
    const clase = await prisma.clase.findUnique({ where: { id } });
    if (!clase) return res.status(404).json({ message: 'Clase no encontrada' });
    const isAdmin = req.user.rol === 'admin';
    if (!isAdmin && clase.maestroId !== req.user.id) {
      return res.status(403).json({ message: 'No puedes tomar asistencia en esta clase' });
    }
    const fechaDate = new Date(fecha);
    if (isNaN(fechaDate.getTime())) {
      return res.status(400).json({ message: 'Fecha inválida. Usa formato YYYY-MM-DD' });
    }
    fechaDate.setHours(0, 0, 0, 0);
    const created = [];
    for (const userId of userIds) {
      try {
        const a = await prisma.asistencia.create({
          data: { claseId: id, userId, fecha: fechaDate }
        });
        created.push(a);
      } catch (e) {
        if (e.code !== 'P2002') throw e;
      }
    }
    const asistencias = await prisma.asistencia.findMany({
      where: { claseId: id, fecha: fechaDate },
      include: {
        user: {
          select: { id: true, nombre: true, apellido: true, nombreAlumno: true }
        }
      }
    });
    res.status(201).json({
      message: 'Asistencia registrada',
      asistencias,
      fecha: fechaDate.toISOString().slice(0, 10)
    });
  } catch (error) {
    console.error('Error al registrar asistencia:', error);
    res.status(500).json({ message: 'Error al registrar asistencia', error: error.message });
  }
};

// Obtener asistencia de una clase en una fecha
export const getAsistencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha } = req.query;
    if (!fecha) return res.status(400).json({ message: 'Query "fecha" (YYYY-MM-DD) es requerido' });
    const clase = await prisma.clase.findUnique({ where: { id } });
    if (!clase) return res.status(404).json({ message: 'Clase no encontrada' });
    const isAdmin = req.user.rol === 'admin';
    if (!isAdmin && clase.maestroId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes acceso a esta clase' });
    }
    const fechaDate = new Date(fecha);
    if (isNaN(fechaDate.getTime())) {
      return res.status(400).json({ message: 'Fecha inválida' });
    }
    fechaDate.setHours(0, 0, 0, 0);
    const asistencias = await prisma.asistencia.findMany({
      where: { claseId: id, fecha: fechaDate },
      include: {
        user: {
          select: { id: true, nombre: true, apellido: true, nombreAlumno: true }
        }
      }
    });
    res.json({ asistencias, fecha: fechaDate.toISOString().slice(0, 10) });
  } catch (error) {
    console.error('Error al obtener asistencia:', error);
    res.status(500).json({ message: 'Error al obtener asistencia', error: error.message });
  }
};
