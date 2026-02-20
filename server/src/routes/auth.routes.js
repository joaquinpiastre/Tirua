import express from 'express';
import { register, login, getProfile } from '../controllers/auth.controller.js';
import { validateRegister, validateLogin } from '../utils/validation.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/profile', authenticateToken, getProfile);

export default router;



