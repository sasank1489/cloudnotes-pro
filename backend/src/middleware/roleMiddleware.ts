import { Response, NextFunction } from 'express';
import { AuthRequest, UserRole } from '../types/index.js';
import { sendResponse } from '../utils/apiResponse.js';

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendResponse(res, 401, false, undefined, undefined, undefined, 'Authentication required');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendResponse(res, 403, false, undefined, undefined, undefined, 'Forbidden: Insufficient permissions');
    }

    next();
  };
};
