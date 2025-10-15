import {
  IsOptional,
  IsNumber,
  Min,
  IsString,
  IsIn,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'orderIndex';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';

  // Search term for title/description
  @IsOptional()
  @IsString()
  search?: string;

  // Array of tag IDs to filter by
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true }) // Validates that each item in the array is a valid Mongo ID
  tagIds?: string[];
}
