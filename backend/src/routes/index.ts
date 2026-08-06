import { Router } from 'express';
import authRoutes from './authRoutes.js';
import noteRoutes from './noteRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/notes', noteRoutes);
router.use('/admin', adminRoutes);

export default router;
