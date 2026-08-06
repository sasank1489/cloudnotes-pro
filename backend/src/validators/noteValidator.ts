import { body } from 'express-validator';
import { validateRequest } from './authValidator.js';

export const createNoteValidation = [
  body('title').trim().notEmpty().withMessage('Note title is required').isLength({ max: 120 }).withMessage('Title cannot exceed 120 characters'),
  body('content').optional().isString().withMessage('Content must be text'),
  body('category').optional().trim().isString().withMessage('Category must be string'),
  body('tags').optional().isArray().withMessage('Tags must be an array of strings'),
  body('isPinned').optional().isBoolean().withMessage('isPinned must be boolean'),
  body('isArchived').optional().isBoolean().withMessage('isArchived must be boolean'),
  validateRequest,
];

export const updateNoteValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 120 }).withMessage('Title cannot exceed 120 characters'),
  body('content').optional().isString().withMessage('Content must be text'),
  body('category').optional().trim().isString().withMessage('Category must be string'),
  body('tags').optional().isArray().withMessage('Tags must be an array of strings'),
  body('isPinned').optional().isBoolean().withMessage('isPinned must be boolean'),
  body('isArchived').optional().isBoolean().withMessage('isArchived must be boolean'),
  validateRequest,
];

export const shareNoteValidation = [
  body('email').trim().isEmail().withMessage('Please provide a valid recipient email address'),
  validateRequest,
];
