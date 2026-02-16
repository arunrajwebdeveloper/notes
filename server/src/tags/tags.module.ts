import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tag, TagSchema } from './schemas/tag.schema'; // Update import
import { Note, NoteSchema } from './../notes/schemas/note.schema';
import { NotesModule } from '../notes/notes.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
    NotesModule,
  ],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
