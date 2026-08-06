import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
import { AdminService } from '../services/adminService.js';
import { sendResponse } from '../utils/apiResponse.js';

export const getSystemStats = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await AdminService.getSystemStats();
    return sendResponse(res, 200, true, 'System statistics retrieved', stats);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { users, meta } = await AdminService.getAllUsers(page, limit);
    return sendResponse(res, 200, true, 'Users list retrieved', users, meta);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await AdminService.deleteUser(req.params.id);
    return sendResponse(res, 200, true, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};
