import express from 'express';
import { updateProfile } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);

router.put('/profile', updateProfile);

export default router;



