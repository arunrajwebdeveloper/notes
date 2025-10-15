import { IsMongoId } from 'class-validator';

export class RemoveSingleTagDto {
  @IsMongoId()
  tagId: string; // The single Tag ID to remove
}
