import { Router } from 'express';
import { register, login, logout, getProfile, updateProfile } from '../controllers/authController.js';
import { registerValidation, loginValidation, updateProfileValidation } from '../validators/authValidator.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', logout);
router.get('/profile', authenticateJWT, getProfile);
router.put('/profile', authenticateJWT, updateProfileValidation, updateProfile);

export default router;
