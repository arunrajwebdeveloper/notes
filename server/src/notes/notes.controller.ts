import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
  Request,
  Delete,
  HttpCode,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './schemas/note.schema';
import { UpdateNoteDto } from './dto/update-note.dto';

@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  // --- Standard CRUD ---

  @Post()
  create(@Request() req, @Body() createNoteDto: CreateNoteDto): Promise<Note> {
    return this.notesService.create(req.user.userId, createNoteDto);
  }

  @Get()
  findAll(@Request() req): Promise<Note[]> {
    // Finds active notes (not archived, not trashed)
    return this.notesService.findAllActive(req.user.userId);
  }

  /**
   * PUT /notes/:id - Update content, color, pin status, labels, or order index.
   */
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    return this.notesService.update(req.user.userId, id, updateNoteDto);
  }

  // --- Archiving Endpoints ---

  @Get('archive')
  findArchived(@Request() req): Promise<Note[]> {
    return this.notesService.findArchived(req.user.userId);
  }

  @Post(':id/archive')
  archive(@Request() req, @Param('id') id: string): Promise<Note> {
    return this.notesService.archive(req.user.userId, id);
  }

  @Post(':id/unarchive')
  unarchive(@Request() req, @Param('id') id: string): Promise<Note> {
    return this.notesService.unarchive(req.user.userId, id);
  }

  // --- Trash Bin Endpoints ---

  @Get('trash')
  findTrashed(@Request() req): Promise<Note[]> {
    return this.notesService.findTrashed(req.user.userId);
  }

  /**
   * POST /notes/:id/trash - Moves the note to the trash bin (soft delete).
   */
  @Delete(':id')
  @HttpCode(200) // Changed to 200/204, but POST/DELETE is semantic for moving to trash
  moveToTrash(@Request() req, @Param('id') id: string): Promise<Note> {
    return this.notesService.moveToTrash(req.user.userId, id);
  }

  /**
   * POST /notes/:id/restore - Restores the note from the trash bin.
   */
  @Post(':id/restore')
  restore(@Request() req, @Param('id') id: string): Promise<Note> {
    return this.notesService.restoreFromTrash(req.user.userId, id);
  }

  /**
   * DELETE /notes/trash/:id - Permanently deletes the note.
   */
  @Delete('trash/:id')
  @HttpCode(204) // 204 No Content is standard for successful deletion
  deletePermanent(@Request() req, @Param('id') id: string): Promise<void> {
    return this.notesService.deletePermanent(req.user.userId, id);
  }
}
