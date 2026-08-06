import { Router } from 'express';
import { getSystemStats, getAllUsers, deleteUser } from '../controllers/adminController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authenticateJWT);
router.use(requireRole('admin'));

router.get('/stats', getSystemStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

export default router;
