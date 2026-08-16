import { Note } from '../models/Note.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/apiResponse.js';

export interface NoteQueryParams {
  search?: string;
  category?: string;
  tag?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

export class NoteService {
  static async createNote(ownerId: string, data: any) {
    const note = await Note.create({
      ...data,
      owner: ownerId,
    });
    return note;
  }

  static async getNotes(userId: string, queryParams: NoteQueryParams) {
    const page = Math.max(1, Number(queryParams.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(queryParams.limit) || 12));
    const skip = (page - 1) * limit;

    const filter: any = { owner: userId };

    if (queryParams.isArchived !== undefined) {
      filter.isArchived = queryParams.isArchived;
    }

    if (queryParams.isPinned !== undefined) {
      filter.isPinned = queryParams.isPinned;
    }

    if (queryParams.category && queryParams.category !== 'All') {
      filter.category = queryParams.category;
    }

    if (queryParams.tag) {
      filter.tags = queryParams.tag;
    }

    if (queryParams.search) {
      const searchRegex = new RegExp(queryParams.search, 'i');
      filter.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { category: searchRegex },
        { tags: searchRegex },
      ];
    }

    let sortOption: any = { isPinned: -1, createdAt: -1 };

    if (queryParams.sort === 'oldest') {
      sortOption = { isPinned: -1, createdAt: 1 };
    } else if (queryParams.sort === 'title_asc') {
      sortOption = { title: 1 };
    } else if (queryParams.sort === 'title_desc') {
      sortOption = { title: -1 };
    } else if (queryParams.sort === 'updated') {
      sortOption = { isPinned: -1, updatedAt: -1 };
    }

    const [notes, total] = await Promise.all([
      Note.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .populate('sharedWith', 'name email profileImage'),
      Note.countDocuments(filter),
    ]);

    return {
      notes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getSharedNotes(userId: string) {
    const notes = await Note.find({ sharedWith: userId })
      .sort({ createdAt: -1 })
      .populate('owner', 'name email profileImage')
      .populate('sharedWith', 'name email profileImage');
    return notes;
  }

  static async getCategories(userId: string) {
    const categories = await Note.distinct('category', { owner: userId });
    return categories.filter(Boolean);
  }

  static async getTags(userId: string) {
    const tags = await Note.distinct('tags', { owner: userId });
    return tags.filter(Boolean);
  }

  static async getNoteById(noteId: string, userId: string) {
    const note = await Note.findById(noteId)
      .populate('owner', 'name email profileImage')
      .populate('sharedWith', 'name email profileImage');

    if (!note) {
      throw new AppError('Note not found', 404);
    }

    // Check ownership or shared permission
    const isOwner = note.owner._id.toString() === userId;
    const isShared = note.sharedWith.some((u: any) => u._id.toString() === userId);

    if (!isOwner && !isShared) {
      throw new AppError('Unauthorized access to this note', 403);
    }

    return note;
  }

  static async updateNote(noteId: string, userId: string, updateData: any) {
    const note = await Note.findOne({ _id: noteId, owner: userId });
    if (!note) {
      throw new AppError('Note not found or permission denied', 404);
    }

    Object.assign(note, updateData);
    await note.save();
    return note;
  }

  static async deleteNote(noteId: string, userId: string) {
    const note = await Note.findOneAndDelete({ _id: noteId, owner: userId });
    if (!note) {
      throw new AppError('Note not found or permission denied', 404);
    }
    return true;
  }

  static async togglePin(noteId: string, userId: string) {
    const note = await Note.findOne({ _id: noteId, owner: userId });
    if (!note) {
      throw new AppError('Note not found or permission denied', 404);
    }

    note.isPinned = !note.isPinned;
    await note.save();
    return note;
  }

  static async toggleArchive(noteId: string, userId: string) {
    const note = await Note.findOne({ _id: noteId, owner: userId });
    if (!note) {
      throw new AppError('Note not found or permission denied', 404);
    }

    note.isArchived = !note.isArchived;
    if (note.isArchived) {
      note.isPinned = false; // unpin when archiving
    }
    await note.save();
    return note;
  }

  static async shareNote(noteId: string, userId: string, targetEmail: string) {
    const note = await Note.findOne({ _id: noteId, owner: userId });
    if (!note) {
      throw new AppError('Note not found or permission denied', 404);
    }

    const targetUser = await User.findOne({ email: targetEmail.toLowerCase() });
    if (!targetUser) {
      throw new AppError(`User with email "${targetEmail}" was not found`, 404);
    }

    if (targetUser._id.toString() === userId) {
      throw new AppError('You cannot share a note with yourself', 400);
    }

    if (note.sharedWith.some((id: any) => id.toString() === targetUser._id.toString())) {
      throw new AppError('Note is already shared with this user', 400);
    }

    note.sharedWith.push(targetUser._id);
    await note.save();
    return note.populate('sharedWith', 'name email profileImage');
  }
}
