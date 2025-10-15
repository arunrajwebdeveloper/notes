import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Tag } from '../../tags/schemas/tag.schema';

// Interface for type safety
export type NoteDocument = Note & Document;

@Schema({ timestamps: true }) // 'timestamps: true' adds 'createdAt' and 'updatedAt' fields
export class Note {
  // --- Required Fields ---

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId; // Links the note to a specific user

  // --- Sorting/Reordering Field ---

  // This field is crucial for client-side sorting (like dnd-kit).
  // The client will manage and update this index when notes are rearranged.
  @Prop({ required: true, default: 0, index: true })
  orderIndex: number;

  // --- Optional/Utility Fields ---

  @Prop({ default: 'white' }) // Example: 'red', 'blue', 'green', hex codes, etc.
  color: string;

  @Prop({ default: false })
  isPinned: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: Tag.name }], default: [] })
  tags: Types.ObjectId[];

  // --- Advanced Fields (Good to Have) ---

  @Prop({ default: false })
  isArchived: boolean;

  @Prop({ default: false })
  isTrash: boolean; // For soft deletion
}

export const NoteSchema = SchemaFactory.createForClass(Note);

// Create a compound index for efficient fetching and sorting
// Ensures that notes are correctly ordered *per user*
NoteSchema.index({ userId: 1, orderIndex: 1 });
