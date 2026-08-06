import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
import { NoteService } from '../services/noteService.js';
import { sendResponse } from '../utils/apiResponse.js';

export const createNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const note = await NoteService.createNote(req.user!.id, req.body);
    return sendResponse(res, 201, true, 'Note created successfully', note);
  } catch (error) {
    next(error);
  }
};

export const getNotes = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { notes, meta } = await NoteService.getNotes(req.user!.id, req.query);
    return sendResponse(res, 200, true, 'Notes fetched successfully', notes, meta);
  } catch (error) {
    next(error);
  }
};

export const getSharedNotes = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const notes = await NoteService.getSharedNotes(req.user!.id);
    return sendResponse(res, 200, true, 'Shared notes fetched successfully', notes);
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const categories = await NoteService.getCategories(req.user!.id);
    return sendResponse(res, 200, true, 'Categories fetched successfully', categories);
  } catch (error) {
    next(error);
  }
};

export const getTags = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tags = await NoteService.getTags(req.user!.id);
    return sendResponse(res, 200, true, 'Tags fetched successfully', tags);
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const note = await NoteService.getNoteById(req.params.id, req.user!.id);
    return sendResponse(res, 200, true, 'Note retrieved successfully', note);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const note = await NoteService.updateNote(req.params.id, req.user!.id, req.body);
    return sendResponse(res, 200, true, 'Note updated successfully', note);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await NoteService.deleteNote(req.params.id, req.user!.id);
    return sendResponse(res, 200, true, 'Note deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const togglePin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const note = await NoteService.togglePin(req.params.id, req.user!.id);
    return sendResponse(res, 200, true, `Note ${note.isPinned ? 'pinned' : 'unpinned'} successfully`, note);
  } catch (error) {
    next(error);
  }
};

export const toggleArchive = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const note = await NoteService.toggleArchive(req.params.id, req.user!.id);
    return sendResponse(res, 200, true, `Note ${note.isArchived ? 'archived' : 'unarchived'} successfully`, note);
  } catch (error) {
    next(error);
  }
};

export const shareNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const note = await NoteService.shareNote(req.params.id, req.user!.id, req.body.email);
    return sendResponse(res, 200, true, `Note shared successfully with ${req.body.email}`, note);
  } catch (error) {
    next(error);
  }
};
