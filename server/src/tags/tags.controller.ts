import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  Patch,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Tag } from './schemas/tag.schema';
import { DeleteManyTagsDto } from './dto/delete-many-tags.dto';

@UseGuards(JwtAuthGuard)
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  // POST /tags
  @Post()
  create(
    @Request() req: any,
    @Body() createTagDto: CreateTagDto,
  ): Promise<Tag> {
    return this.tagsService.create(req?.user?.userId, createTagDto);
  }

  // GET /tags
  @Get()
  findAll(@Request() req: any): Promise<any[]> {
    return this.tagsService.findAllWithNoteCounts(req.user.userId);
  }

  // PATCH /tags/:id (Use PATCH for partial update of the name)
  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateLabelDto: UpdateTagDto,
  ): Promise<Tag> {
    return this.tagsService.update(req.user.userId, id, updateLabelDto);
  }

  // DELETE /tags/:id
  @Delete(':id')
  @HttpCode(204) // Standard response for successful deletion
  delete(@Request() req: any, @Param('id') id: string): Promise<void> {
    return this.tagsService.delete(req.user.userId, id);
  }

  // DELETE /tags
  @Delete()
  async deleteManyTags(
    @Request() req: any,
    @Body() deleteManyTagsDto: DeleteManyTagsDto,
  ): Promise<void> {
    await this.tagsService.deleteManyTags(
      req.user.userId,
      deleteManyTagsDto.tagIds,
    );
  }
}
