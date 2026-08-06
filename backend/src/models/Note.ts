import mongoose, { Schema } from 'mongoose';
import { INote } from '../types/index.js';

const NoteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: [true, 'Note title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    content: {
      type: String,
      required: [true, 'Note content is required'],
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'General',
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPinned: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sharedWith: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for fast search & filtering
NoteSchema.index({ title: 'text', content: 'text', category: 'text', tags: 'text' });
NoteSchema.index({ owner: 1, isArchived: 1, isPinned: -1, createdAt: -1 });

export const Note = mongoose.model<INote>('Note', NoteSchema);
