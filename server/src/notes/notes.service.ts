import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Note, NoteDocument } from './schemas/note.schema';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  // --- CRUD (C and U for Content/Order) ---

  async create(
    userId: Types.ObjectId,
    createNoteDto: CreateNoteDto,
  ): Promise<Note> {
    const createdNote = new this.noteModel({
      ...createNoteDto,
      userId,
    });
    return createdNote.save();
  }

  /**
   * Main Read: Finds all ACTIVE notes (not archived, not trashed).
   * Sorted by isPinned (pinned first) and orderIndex.
   */
  async findAllActive(userId: Types.ObjectId): Promise<Note[]> {
    return this.noteModel
      .find({ userId, isTrash: false, isArchived: false }) // Filter for active notes
      .sort({ isPinned: -1, orderIndex: 1 })
      .exec();
  }

  /**
   * Main Update: Used for editing content (title, description, labels, color) or a single order update.
   */
  async update(
    userId: Types.ObjectId,
    noteId: string,
    updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    const updatedNote = await this.noteModel
      .findOneAndUpdate({ _id: noteId, userId }, updateNoteDto, { new: true })
      .exec();

    if (!updatedNote) {
      throw new NotFoundException(
        `Note with ID ${noteId} not found or doesn't belong to the user.`,
      );
    }

    return updatedNote;
  }

  // --- Archive Management ---

  async findArchived(userId: Types.ObjectId): Promise<Note[]> {
    return this.noteModel
      .find({ userId, isArchived: true, isTrash: false })
      .sort({ updatedAt: -1 }) // Sort by most recently archived/updated
      .exec();
  }

  /**
   * Archives a note.
   */
  async archive(userId: Types.ObjectId, noteId: string): Promise<Note> {
    return this.update(userId, noteId, { isArchived: true, isPinned: false }); // Unpin when archiving
  }

  /**
   * Unarchives a note.
   */
  async unarchive(userId: Types.ObjectId, noteId: string): Promise<Note> {
    return this.update(userId, noteId, { isArchived: false });
  }

  // --- Trash Bin Management ---

  async findTrashed(userId: Types.ObjectId): Promise<Note[]> {
    return this.noteModel
      .find({ userId, isTrash: true })
      .sort({ updatedAt: -1 }) // Sort by most recently trashed
      .exec();
  }

  /**
   * Soft Delete: Moves a note to the trash bin.
   */
  async moveToTrash(userId: Types.ObjectId, noteId: string): Promise<Note> {
    // When trashing, unpin and unarchive it
    return this.update(userId, noteId, {
      isTrash: true,
      isArchived: false,
      isPinned: false,
    });
  }

  /**
   * Restore: Moves a note from trash back to the active list.
   */
  async restoreFromTrash(
    userId: Types.ObjectId,
    noteId: string,
  ): Promise<Note> {
    return this.update(userId, noteId, { isTrash: false });
  }

  /**
   * Permanent Delete: Deletes a note permanently from the database.
   * This should only be allowed for notes that are already in the trash.
   */
  async deletePermanent(userId: Types.ObjectId, noteId: string): Promise<void> {
    const result = await this.noteModel
      .deleteOne({
        _id: noteId,
        userId,
        isTrash: true, // Only allow permanent delete if the note is already in trash
      })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(
        `Note ID ${noteId} not found in trash or doesn't belong to user.`,
      );
    }
  }

  /**
   *  Permanently deletes ALL notes for a user that are in the trash bin.
   */
  async emptyTrash(userId: Types.ObjectId): Promise<{ deletedCount: number }> {
    const result = await this.noteModel
      .deleteMany({
        userId, // Filter by the current user
        isTrash: true, // Filter for notes that are marked as trash
      })
      .exec();

    // Return the count of deleted documents
    return { deletedCount: result.deletedCount };
  }
}
