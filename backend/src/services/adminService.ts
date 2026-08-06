import { User } from '../models/User.js';
import { Note } from '../models/Note.js';
import { AppError } from '../utils/apiResponse.js';

export class AdminService {
  static async getSystemStats() {
    const [totalUsers, totalNotes, archivedNotes, sharedNotes] = await Promise.all([
      User.countDocuments(),
      Note.countDocuments(),
      Note.countDocuments({ isArchived: true }),
      Note.countDocuments({ 'sharedWith.0': { $exists: true } }),
    ]);

    return {
      totalUsers,
      totalNotes,
      archivedNotes,
      sharedNotes,
      systemUptimeSeconds: Math.floor(process.uptime()),
    };
  }

  static async getAllUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    return {
      users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async deleteUser(userId: string) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    // Delete all notes owned by user
    await Note.deleteMany({ owner: userId });
    return true;
  }
}
