import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/apiResponse.js';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg).join(', ');
    return sendResponse(res, 400, false, undefined, undefined, undefined, errorMessages);
  }
  next();
};

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').trim().isEmail().withMessage('Valid email address is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  validateRequest,
];

export const loginValidation = [
  body('email').trim().isEmail().withMessage('Valid email address is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest,
];

export const updateProfileValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('profileImage').optional().trim().isURL().withMessage('Profile image must be a valid URL'),
  validateRequest,
];
