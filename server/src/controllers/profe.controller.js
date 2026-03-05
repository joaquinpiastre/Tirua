import prisma from '../config/database.js';

// El profe (maestro) agrega sus horas trabajadas
export const addHoras = async (req, res) => {
  try {
    const { tipo, horas, fecha } = req.body;
    const userId = req.user.id;

    if (req.user.rol !== 'maestro' && req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'Solo profes pueden cargar horas' });
    }

    const tipoValido = tipo === 'pyp' || tipo === 'docente';
    if (!tipoValido) {
      return res.status(400).json({ message: 'tipo debe ser "pyp" o "docente"' });
    }

    const horasNum = parseFloat(horas);
    if (isNaN(horasNum) || horasNum <= 0) {
      return res.status(400).json({ message: 'Las horas deben ser un número mayor a 0' });
    }

    const registro = await prisma.profeHora.create({
      data: {
        userId,
        tipo,
        horas: horasNum,
        fecha: fecha ? new Date(fecha) : new Date()
      }
    });

    res.status(201).json({ message: 'Horas cargadas', registro });
  } catch (error) {
    console.error('Error al cargar horas:', error);
    res.status(500).json({ message: 'Error al cargar horas', error: error.message });
  }
};

// El profe ve sus propias horas
export const getMisHoras = async (req, res) => {
  try {
    const userId = req.user.id;
    const registros = await prisma.profeHora.findMany({
      where: { userId },
      orderBy: [{ fecha: 'desc' }, { createdAt: 'desc' }]
    });
    const resumen = {
      totalPyp: registros.filter(r => r.tipo === 'pyp').reduce((s, r) => s + r.horas, 0),
      totalDocente: registros.filter(r => r.tipo === 'docente').reduce((s, r) => s + r.horas, 0)
    };
    res.json({ registros, resumen });
  } catch (error) {
    console.error('Error al obtener horas:', error);
    res.status(500).json({ message: 'Error al obtener horas', error: error.message });
  }
};
