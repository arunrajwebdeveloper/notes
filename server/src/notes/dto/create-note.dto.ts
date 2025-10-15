import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';

export class CreateNoteDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  // orderIndex is passed by the client when a new note is created (usually the highest index + 1)
  @IsNumber()
  orderIndex: number;

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // each element in the array must be a string
  labels?: string[];

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;
}
