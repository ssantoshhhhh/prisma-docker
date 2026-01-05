import { Injectable } from '@nestjs/common';
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

}
