import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tag, TagDocument } from './schemas/tag.schema'; // Update import/rename
import { CreateTagDto } from './dto/create-tag.dto'; // Update import
import { UpdateTagDto } from './dto/update-tag.dto'; // Update import

@Injectable()
export class TagsService {
  // Rename: LabelsService to TagsService
  constructor(
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>, // Rename model reference
  ) {}

  // 1. CREATE Tag
  async create(
    userId: Types.ObjectId,
    createTagDto: CreateTagDto,
  ): Promise<Tag> {
    // Update types/variables
    try {
      const createdTag = new this.tagModel({
        // Update variable
        ...createTagDto,
        userId,
      });
      return await createdTag.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          `Tag with name "${createTagDto.name}" already exists.`,
        );
      }
      throw error;
    }
  }

  // 2. READ Tags
  async findAll(userId: Types.ObjectId): Promise<Tag[]> {
    // Update return type
    return this.tagModel.find({ userId }).sort({ name: 1 }).exec();
  }

  // 3. UPDATE Tag Name
  async update(
    userId: Types.ObjectId,
    tagId: string,
    updateTagDto: UpdateTagDto,
  ): Promise<Tag> {
    // Update types/variables
    const updatedTag = await this.tagModel
      .findOneAndUpdate({ _id: tagId, userId }, updateTagDto, { new: true })
      .exec();

    if (!updatedTag) {
      throw new NotFoundException(
        `Tag with ID ${tagId} not found or doesn't belong to the user.`,
      );
    }

    return updatedTag;
  }

  // 4. DELETE Tag
  async delete(userId: Types.ObjectId, tagId: string): Promise<void> {
    // Update variable
    const result = await this.tagModel.deleteOne({ _id: tagId, userId }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(
        `Tag with ID ${tagId} not found or doesn't belong to the user.`,
      );
    }
  }
}
