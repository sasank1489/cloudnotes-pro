import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { IUser, UserRole } from '../types/index.js';
import { config } from '../config/index.js';
import { AppError } from '../utils/apiResponse.js';

export class AuthService {
  static generateToken(user: IUser): string {
    return jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn as any }
    );
  }

  static async registerUser(data: { name: string; email: string; password: string; role?: UserRole }) {
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      throw new AppError('Email address is already registered', 400);
    }

    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
      role: data.role || 'user',
    });

    const token = this.generateToken(user);
    return { user, token };
  }

  static async loginUser(data: { email: string; password: string }) {
    const user = await User.findOne({ email: data.email.toLowerCase() }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password credentials', 401);
    }

    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password credentials', 401);
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  static async getUserProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User profile not found', 404);
    }
    return user;
  }

  static async updateUserProfile(userId: string, data: { name?: string; profileImage?: string }) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!user) {
      throw new AppError('User profile not found', 404);
    }
    return user;
  }
}
