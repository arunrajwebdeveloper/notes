import { IsArray, IsMongoId, ArrayNotEmpty } from 'class-validator';

export class DeleteManyTagsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  tagIds: string[];
}
