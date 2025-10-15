import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tag, TagSchema } from './schemas/tag.schema'; // Update import

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]), // Update names
  ],
  controllers: [TagsController], // Update name
  providers: [TagsService], // Update name
})
export class TagsModule {} // Update name
