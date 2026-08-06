import { Router } from 'express';
import {
  createNote,
  getNotes,
  getSharedNotes,
  getCategories,
  getTags,
  getNoteById,
  updateNote,
  deleteNote,
  togglePin,
  toggleArchive,
  shareNote,
} from '../controllers/noteController.js';
import { createNoteValidation, updateNoteValidation, shareNoteValidation } from '../validators/noteValidator.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateJWT);

router.post('/', createNoteValidation, createNote);
router.get('/', getNotes);
router.get('/shared', getSharedNotes);
router.get('/categories', getCategories);
router.get('/tags', getTags);
router.get('/:id', getNoteById);
router.put('/:id', updateNoteValidation, updateNote);
router.delete('/:id', deleteNote);
router.patch('/:id/pin', togglePin);
router.patch('/:id/archive', toggleArchive);
router.post('/:id/share', shareNoteValidation, shareNote);

export default router;
