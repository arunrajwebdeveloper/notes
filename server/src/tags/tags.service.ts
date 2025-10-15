import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { Tag, TagDocument } from './schemas/tag.schema';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Note, NoteDocument } from './../notes/schemas/note.schema';

@Injectable()
export class TagsService {
  // Rename: LabelsService to TagsService
  constructor(
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
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

  // Find all tags

  async findAllWithNoteCounts(userId: Types.ObjectId): Promise<any[]> {
    // Explicitly define the type as PipelineStage[]
    const pipeline: PipelineStage[] = [
      // 1. Filter: Only look at tags belonging to the current user
      {
        $match: { userId: userId },
      },

      // 2. Join: Look up notes that have this tag's ID in their 'tags' array
      {
        $lookup: {
          from: 'notes',
          localField: '_id',
          foreignField: 'tags',
          as: 'notes_matched',

          // Pipeline to only count ACTIVE notes
          pipeline: [
            {
              $match: {
                isTrash: false,
                isArchived: false,
              },
            },
          ],
        },
      },

      // 3. Count: Calculate the size of the 'notes_matched' array
      {
        $addFields: {
          noteCount: { $size: '$notes_matched' },
        },
      },

      // 4. Projection: Shape the output, exclude the large temporary array
      {
        $project: {
          _id: 1,
          name: 1,
          userId: 1,
          createdAt: 1,
          updatedAt: 1,
          noteCount: 1,
        },
      },

      // 5. Unset: Remove the temporary field (this is an EXCLUSION-only stage)
      {
        $unset: 'notes_matched',
      },

      // 6. Sort: Sort tags alphabetically by name
      {
        $sort: { name: 1 },
      },
    ];

    // Use .aggregate() to run the pipeline
    return this.tagModel.aggregate(pipeline).exec();
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
