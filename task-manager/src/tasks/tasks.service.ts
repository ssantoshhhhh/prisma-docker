import { Injectable, ForbiddenException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  create(title: string, userId: number) {
    return this.prisma.task.create({
      data: { title, userId },
    });
  }

  findAll(userId: number, page: number, limit: number) {
  return this.prisma.task.findMany({
    where: { userId },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
}

  async update(id: number, userId: number, dto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task || task.userId !== userId) {
      throw new ForbiddenException('Access to task denied');
    }

    return this.prisma.task.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, userId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task || task.userId !== userId) {
      throw new ForbiddenException('Access to task denied');
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
