import {
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { CreateNoteDto } from './create-note.dto';
import { PartialType } from '@nestjs/mapped-types';

// Inherits all fields (title, description, orderIndex, isPinned, labels, color)
// and makes them optional.

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  // --- Fields specifically updated outside of main edit flow ---

  @IsOptional()
  @IsNumber()
  orderIndex?: number;

  @IsOptional()
  @IsBoolean()
  isArchived?: boolean; // Used for archiving/unarchiving

  @IsOptional()
  @IsBoolean()
  isTrash?: boolean; // Used for soft deletion/restoring

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  tags?: string[];
}
