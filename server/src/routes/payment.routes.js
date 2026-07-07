import express from 'express';
import { getPayments, getPaymentStatus } from '../controllers/payment.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/history', authenticateToken, getPayments);
router.get('/status', authenticateToken, getPaymentStatus);

export default router;
