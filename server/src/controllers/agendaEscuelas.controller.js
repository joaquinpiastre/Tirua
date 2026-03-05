import prisma from '../config/database.js';

const formatFechaKey = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// Listar: público devuelve solo fecha+turno; admin/maestro devuelve todo
export const getVisitas = async (req, res) => {
  try {
    const isAuth = req.user && (req.user.rol === 'admin' || req.user.rol === 'maestro');
    const visitas = await prisma.visitaEscuela.findMany({
      orderBy: [{ fecha: 'asc' }]
    });
    if (isAuth) {
      return res.json({
        visitas: visitas.map((v) => ({
          id: v.id,
          fecha: formatFechaKey(new Date(v.fecha)),
          turno: v.turno,
          escuela: v.escuela,
          contacto: v.contacto,
          createdAt: v.createdAt
        }))
      });
    }
    res.json({
      reservas: visitas.map((v) => ({
        fecha: formatFechaKey(new Date(v.fecha)),
        turno: v.turno
      }))
    });
  } catch (error) {
    console.error('Error al listar visitas escuelas:', error);
    res.status(500).json({ message: 'Error al cargar la agenda', error: error.message });
  }
};

// Crear visita (solo admin o maestro)
export const createVisita = async (req, res) => {
  try {
    const { fecha, turno, escuela, contacto } = req.body;
    if (!fecha || !turno || !escuela || !escuela.trim()) {
      return res.status(400).json({ message: 'Faltan fecha, turno o nombre de la escuela' });
    }
    const turnoValido = turno === 'mañana' || turno === 'tarde';
    if (!turnoValido) {
      return res.status(400).json({ message: 'El turno debe ser "mañana" o "tarde"' });
    }
    const fechaDate = new Date(fecha + 'T00:00:00');
    if (isNaN(fechaDate.getTime())) {
      return res.status(400).json({ message: 'Fecha inválida' });
    }
    const visita = await prisma.visitaEscuela.create({
      data: {
        fecha: fechaDate,
        turno,
        escuela: escuela.trim(),
        contacto: contacto && contacto.trim() ? contacto.trim() : null
      }
    });
    res.status(201).json({
      visita: {
        id: visita.id,
        fecha: formatFechaKey(new Date(visita.fecha)),
        turno: visita.turno,
        escuela: visita.escuela,
        contacto: visita.contacto,
        createdAt: visita.createdAt
      }
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Ese día y turno ya están ocupados (solo una escuela por mañana y una por tarde por día)' });
    }
    console.error('Error al crear visita:', error);
    res.status(500).json({ message: 'Error al programar la visita', error: error.message });
  }
};

// Eliminar visita (solo admin o maestro)
export const deleteVisita = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.visitaEscuela.delete({ where: { id } });
    res.json({ message: 'Visita eliminada' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Visita no encontrada' });
    }
    console.error('Error al eliminar visita:', error);
    res.status(500).json({ message: 'Error al eliminar', error: error.message });
  }
};
