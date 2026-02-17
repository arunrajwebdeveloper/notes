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
import { NotesService } from '../notes/notes.service';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
    private notesService: NotesService,
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
    } catch (error: any) {
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
      // Filter: Only look at tags belonging to the current user
      {
        $match: { userId: userId },
      },

      // Join: Look up notes that have this tag's ID in their 'tags' array
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

      // Count: Calculate the size of the 'notes_matched' array
      {
        $addFields: {
          noteCount: { $size: '$notes_matched' },
        },
      },

      // Projection: Shape the output, exclude the large temporary array
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

      // Unset: Remove the temporary field (this is an EXCLUSION-only stage)
      {
        $unset: 'notes_matched',
      },

      // Sort: Sort tags alphabetically by name
      {
        $sort: { name: 1 },
      },
    ];

    // Use .aggregate() to run the pipeline
    return this.tagModel
      .aggregate(pipeline)
      .collation({ locale: 'en', strength: 2 })
      .exec();
  }

  // UPDATE Tag Name
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

  // DELETE Tag

  async delete(userId: Types.ObjectId, tagId: string): Promise<void> {
    // 1. Delete the Tag document
    const deletedTag = await this.tagModel
      .findOneAndDelete({ _id: tagId, userId })
      .exec();

    if (!deletedTag) {
      throw new NotFoundException(
        `Tag with ID ${tagId} not found or doesn't belong to the user.`,
      );
    }

    // Perform the cascading cleanup in the Notes collection
    await this.notesService.removeTagFromAllNotes(tagId);
  }

  // DELETE  multiple tags deletions

  async deleteManyTags(
    userId: Types.ObjectId,
    tagIds: string[],
  ): Promise<void> {
    // Convert string IDs to ObjectIds for the query
    const objectIdsToDelete = tagIds.map((id) => new Types.ObjectId(id));

    // Delete the Tag documents owned by the user
    const deleteResult = await this.tagModel
      .deleteMany({
        _id: { $in: objectIdsToDelete }, // Match any ID in the provided array
        userId,
      })
      .exec();

    // Check if any tags were actually deleted
    if (deleteResult.deletedCount === 0) {
      throw new NotFoundException(
        `No tags found with the provided IDs or they don't belong to the user.`,
      );
    }

    // Perform the cascading cleanup in the Notes collection
    // Call the method to remove all deleted tag IDs from all notes that reference them.
    await this.notesService.removeTagsFromAllNotes(objectIdsToDelete);
  }
}
