import express from 'express';
import {
  searchSocios,
  getClases,
  createClase,
  getClaseById,
  updateClase,
  deleteClase,
  addAlumnoToClase,
  removeAlumnoFromClase,
  registrarAsistencia,
  getAsistencia
} from '../controllers/clases.controller.js';
import { authenticateToken, requireMaestroOrAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);
router.use(requireMaestroOrAdmin);

router.get('/socios-search', searchSocios);
router.get('/', getClases);
router.post('/', createClase);
router.get('/:id', getClaseById);
router.put('/:id', updateClase);
router.delete('/:id', deleteClase);
router.post('/:id/alumnos', addAlumnoToClase);
router.delete('/:id/alumnos/:userId', removeAlumnoFromClase);
router.post('/:id/asistencia', registrarAsistencia);
router.get('/:id/asistencia', getAsistencia);

export default router;
