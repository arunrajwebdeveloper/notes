import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module'; // Import AuthModule to use the JwtAuthGuard/Passport
import { Note, NoteSchema } from './schemas/note.schema';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
    AuthModule,
  ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
