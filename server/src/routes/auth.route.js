import express from 'express';
import { login, logout, refresh, register, userCredentials } from '../controllers/auth.controller.js';
import { authorizeToken } from '../middlewares/auth.middleware.js';
import { loginLimiter, registerLimiter } from '../utils/rateLimit.utils.js';

const router = express.Router();

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.post('/refresh', refresh);

router.get('/me', authorizeToken, userCredentials);

export default router;