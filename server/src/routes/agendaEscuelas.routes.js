import { Router } from 'express';
import { authenticateToken, optionalAuth, requireMaestroOrAdmin } from '../middleware/auth.middleware.js';
import { getVisitas, createVisita, deleteVisita } from '../controllers/agendaEscuelas.controller.js';

const router = Router();

// GET público o con auth: listado (con auth admin/maestro devuelve todo; sin auth solo reservas fecha+turno)
router.get('/', optionalAuth, getVisitas);

// POST y DELETE solo para admin o maestro
router.post('/', authenticateToken, requireMaestroOrAdmin, createVisita);
router.delete('/:id', authenticateToken, requireMaestroOrAdmin, deleteVisita);

export default router;
