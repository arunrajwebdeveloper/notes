import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Note, NoteDocument } from './schemas/note.schema';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  // Create note

  async create(
    userId: Types.ObjectId,
    createNoteDto: CreateNoteDto,
  ): Promise<Note> {
    // Find the highest existing orderIndex for the current user's notes
    const lastNote = await this.noteModel
      .findOne({ userId })
      .sort({ orderIndex: -1 }) // Sort descending to get the highest index
      .select('orderIndex') // Only retrieve the index field
      .exec();

    // Calculate the new orderIndex
    // If no notes exist, start at 0 (or 1, based on preference).
    // If notes exist, use the max index + 1.
    const newOrderIndex = (lastNote?.orderIndex || 0) + 1;

    // 3Create the new note object
    const createdNote = new this.noteModel({
      ...createNoteDto,
      userId,
      orderIndex: newOrderIndex,
    });

    return createdNote.save();
  }

  /**
   * Main Read: Finds all ACTIVE notes (not archived, not trashed) with pagination, filter and search.
   * * Returns the paginated data along with total count and navigation flags.
   */
  async findAllActive(
    userId: Types.ObjectId,
    pagination: PaginationDto,
  ): Promise<{
    total: number;
    limit: number;
    page: number;
    result: Note[];
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'orderIndex',
      sortOrder = 'asc',
      search,
      tagIds,
    } = pagination;

    const skip = (page - 1) * limit;

    // 1. Base Filter
    // This filter must contain all conditions (user ID, not trashed/archived)
    // Mongoose queries use $and for combining multiple conditions implicitly.
    const filter: any = {
      userId,
      isTrash: false,
      isArchived: false,
    };

    // 2. Apply Search Filter (by title or description)
    if (search) {
      const searchRegex = new RegExp(search, 'i'); // 'i' for case-insensitive

      // Use $or to search across multiple fields
      filter['$or'] = [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ];
    }

    // 3. Apply Tag Filter
    if (tagIds && tagIds.length > 0) {
      // Converts string IDs from the client/DTO into Mongoose ObjectIds
      const objectIdTags = tagIds.map((id) => new Types.ObjectId(id));

      // Use $in to find notes where the 'tags' array contains ANY of the provided IDs.
      // Use $all if you want to find notes that must contain ALL of the provided IDs.
      filter['tags'] = { $in: objectIdTags };
    }

    // 4. Sorting logic remains the same
    const sort: Record<string, 1 | -1> = {
      // Primary Sort: Pinned notes always come first (true > false)
      isPinned: -1,

      // Secondary Sort (Tie-breaker for Pinned Notes):
      // Latest update/creation date first within the pinned group.
      updatedAt: -1, // Use -1 (descending) to show latest note first
      // [sortBy]: sortOrder === 'asc' ? 1 : (-1 as 1 | -1),

      // Tertiary/Dynamic Sort: Used as the final fallback,
      //    or when the user specifically requests a different sort (e.g., A-Z title).
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };

    const limitValue = limit;
    const skipValue = skip;

    // Execute the two queries using the combined dynamic filter
    const total = await this.noteModel.countDocuments(filter).exec();

    const notes = await this.noteModel
      .find(filter)
      .populate('tags', '_id name')
      .sort(sort)
      .skip(skipValue)
      .limit(limitValue)
      .lean()
      .exec();

    const totalPages = Math.ceil(total / limitValue);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      total,
      limit: limitValue,
      page,
      result: notes as Note[],
      hasNext,
      hasPrev,
    };
  }

  /**
   * Main Read: Finds one ACTIVE note (not archived, not trashed).
   */
  async findOne(userId: Types.ObjectId, noteId: string): Promise<Note | null> {
    return this.noteModel
      .findOne({ _id: noteId, userId })
      .populate('tags', 'name')
      .lean()
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
    // 1. Separate tags from other fields for atomic update
    const { tags, ...otherUpdateFields } = updateNoteDto;

    // 2. Build the Mongoose update object
    const mongoUpdate: any = { $set: {} };

    // 3. Handle other fields: Use $set for direct replacement (title, color, etc.)
    if (Object.keys(otherUpdateFields).length > 0) {
      // If the DTO includes other fields, add them to $set
      mongoUpdate.$set = otherUpdateFields;
    }

    // 4. Handle tags: Use $addToSet for non-duplicate addition
    if (tags && tags.length > 0) {
      // Convert string IDs from DTO to Mongoose ObjectIds
      const objectIdTags = tags.map((id) => new Types.ObjectId(id));

      // Use $addToSet with $each to add IDs only if they don't already exist.
      // This is atomic and prevents duplicates without reading the note first.
      mongoUpdate.$addToSet = { tags: { $each: objectIdTags } };
    }

    // 5. Execute the update
    const updatedNote = await this.noteModel
      .findOneAndUpdate(
        { _id: noteId, userId },
        mongoUpdate, // <-- Uses $addToSet for tags, and $set for other fields
        { new: true },
      )
      .exec();

    if (!updatedNote) {
      throw new NotFoundException(
        `Note with ID ${noteId} not found or doesn't belong to the user.`,
      );
    }

    return updatedNote;
  }

  /**
   * Removes a single specific tag ID from a note using the $pull operator.
   */
  async removeSingleTagFromNote(
    userId: Types.ObjectId,
    noteId: string,
    tagId: string,
  ): Promise<void> {
    // Convert the string tag ID to a Mongoose ObjectId
    const objectIdTagToRemove = new Types.ObjectId(tagId);

    const result = await this.noteModel
      .updateOne(
        { _id: noteId, userId },
        // $pull removes all instances of the specified value from the array.
        { $pull: { tags: objectIdTagToRemove } },
      )
      .exec();

    // Check if the note was found and updated
    if (result.matchedCount === 0) {
      throw new NotFoundException(
        `Note with ID ${noteId} not found or doesn't belong to the user.`,
      );
    }
  }

  // --- Archive Management ---

  async findArchived(userId: Types.ObjectId): Promise<Note[]> {
    return this.noteModel
      .find({ userId, isArchived: true, isTrash: false })
      .populate('tags', 'name')
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

  /**
   * Removes a specific tag ID from the 'tags' array in ALL notes that use it.
   * This is called for data cleanup when a tag is deleted.
   */
  async removeTagFromAllNotes(tagId: string): Promise<void> {
    const objectIdTag = new Types.ObjectId(tagId);

    // Use updateMany to safely modify all documents in a single atomic operation
    await this.noteModel
      .updateMany(
        // Filter: Find all notes where the 'tags' array contains this tag ID
        { tags: objectIdTag },

        // Update: Pull (remove) that specific ID from the 'tags' array
        { $pull: { tags: objectIdTag } },

        // No need for { new: true } as we don't need the result documents
      )
      .exec();
  }

  /**
   * Removes multiple tag IDs from the 'tags' array in ALL notes that use it.
   * This is called for data cleanup when a tags were deleted.
   */

  async removeTagsFromAllNotes(
    tagIds: (string | Types.ObjectId)[],
  ): Promise<void> {
    // Ensure all IDs are Types.ObjectId before using them in the query
    const objectIdsToRemove = tagIds.map((id) =>
      id instanceof Types.ObjectId ? id : new Types.ObjectId(id),
    );

    // Use updateMany to safely modify all documents in a single atomic operation
    await this.noteModel
      .updateMany(
        // Filter: Find all notes where the 'tags' array contains ANY of these tag IDs
        { tags: { $in: objectIdsToRemove } },

        // Update: $pullAll removes ALL matching IDs from the 'tags' array
        { $pullAll: { tags: objectIdsToRemove } },
      )
      .exec();
  }
}
