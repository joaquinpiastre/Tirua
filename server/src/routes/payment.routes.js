import express from 'express';
import { createPayment, createMultiplePayments, getPayments, getPaymentStatus, handleWebhook } from '../controllers/payment.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create', authenticateToken, createPayment);
router.post('/create-multiple', authenticateToken, createMultiplePayments);
router.get('/history', authenticateToken, getPayments);
router.get('/status', authenticateToken, getPaymentStatus);
router.post('/webhook', handleWebhook);

export default router;



