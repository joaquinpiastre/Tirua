import { Router } from 'express';
import { authenticateToken, requireMaestroOrAdmin } from '../middleware/auth.middleware.js';
import { addHoras, getMisHoras, getAlumnos } from '../controllers/profe.controller.js';

const router = Router();
router.use(authenticateToken);
router.use(requireMaestroOrAdmin);

router.post('/horas', addHoras);
router.get('/horas', getMisHoras);
router.get('/alumnos', getAlumnos);

export default router;
