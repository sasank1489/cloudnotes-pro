import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
import { AuthService } from '../services/authService.js';
import { sendResponse } from '../utils/apiResponse.js';

export const register = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user, token } = await AuthService.registerUser(req.body);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendResponse(res, 201, true, 'User registered successfully', { user, token });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user, token } = await AuthService.loginUser(req.body);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendResponse(res, 200, true, 'Login successful', { user, token });
  } catch (error) {
    next(error);
  }
};

export const logout = async (_req: AuthRequest, res: Response) => {
  res.clearCookie('token');
  return sendResponse(res, 200, true, 'Logged out successfully');
};

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await AuthService.getUserProfile(req.user!.id);
    return sendResponse(res, 200, true, 'User profile retrieved', user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await AuthService.updateUserProfile(req.user!.id, req.body);
    return sendResponse(res, 200, true, 'Profile updated successfully', user);
  } catch (error) {
    next(error);
  }
};
