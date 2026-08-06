import { Request, Response, NextFunction } from 'express';
import { AppError, sendResponse } from '../utils/apiResponse.js';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Error Middleware]:', err);

  if (err instanceof AppError) {
    return sendResponse(res, err.statusCode, false, undefined, undefined, undefined, err.message);
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return sendResponse(res, 400, false, undefined, undefined, undefined, `Duplicate value for ${field}. Please use another value.`);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e: any) => e.message).join(', ');
    return sendResponse(res, 400, false, undefined, undefined, undefined, messages);
  }

  // JWT Error
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return sendResponse(res, 401, false, undefined, undefined, undefined, 'Invalid or expired token.');
  }

  return sendResponse(
    res,
    500,
    false,
    undefined,
    undefined,
    undefined,
    process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message || 'Internal server error'
  );
};
