import { IsMongoId } from 'class-validator';

export class RemoveSingleTagDto {
  @IsMongoId()
  tagId: string;
}
