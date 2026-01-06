import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { QueryNotesDto } from './dto/query-notes.dto';

@Controller('notes')
@UseGuards(AuthGuard('jwt'))
export class NotesController {
  constructor(private notes: NotesService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateNoteDto) {
    return this.notes.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Req() req, @Query() query: QueryNotesDto) {
    return this.notes.findAll(
      req.user.userId,
      query.page ?? 1,
      query.limit ?? 10,
    );
  }

  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.notes.update(+id, req.user.userId, dto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.notes.remove(+id, req.user.userId);
  }
}
