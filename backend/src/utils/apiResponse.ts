import { Response } from 'express';
import { ApiResponse } from '../types/index.js';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message?: string,
  data?: T,
  meta?: any,
  error?: string
) => {
  const responsePayload: ApiResponse<T> = {
    success,
    ...(message && { message }),
    ...(data !== undefined && { data }),
    ...(meta && { meta }),
    ...(error && { error }),
  };
  return res.status(statusCode).json(responsePayload);
};
