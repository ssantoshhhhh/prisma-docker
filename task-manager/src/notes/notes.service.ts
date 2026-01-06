import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  create(userId: number, dto: CreateNoteDto) {
    return this.prisma.note.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  findAll(userId: number, page: number, limit: number) {
    return this.prisma.note.findMany({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(noteId: number, userId: number, dto: UpdateNoteDto) {
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!note || note.userId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.note.update({
      where: { id: noteId },
      data: dto,
    });
  }

  async remove(noteId: number, userId: number) {
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!note || note.userId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.note.delete({
      where: { id: noteId },
    });
  }
}
