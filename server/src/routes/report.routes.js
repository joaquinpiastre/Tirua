import express from 'express';
import { getMonthlyRevenue } from '../controllers/report.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/monthly', getMonthlyRevenue);

export default router;



