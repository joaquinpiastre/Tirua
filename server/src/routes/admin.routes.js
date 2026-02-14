import express from 'express';
import { getAllUsers, getUserDetails, getStats, markPaymentAsPaid, createManualPayment, deleteUser } from '../controllers/admin.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/users', getAllUsers);
router.get('/users/:userId', getUserDetails);
router.delete('/users/:userId', deleteUser);
router.get('/stats', getStats);
router.post('/payments/:paymentId/mark-paid', markPaymentAsPaid);
router.post('/payments/manual', createManualPayment);

export default router;

