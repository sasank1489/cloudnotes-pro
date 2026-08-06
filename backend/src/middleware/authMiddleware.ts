import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, UserRole } from '../types/index.js';
import { config } from '../config/index.js';
import { sendResponse } from '../utils/apiResponse.js';

interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Check Authorization Header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // Check Cookies
    token = req.cookies.token;
  }

  if (!token) {
    return sendResponse(res, 401, false, undefined, undefined, undefined, 'Access denied. No authentication token provided.');
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return sendResponse(res, 401, false, undefined, undefined, undefined, 'Invalid or expired authentication token.');
  }
};
