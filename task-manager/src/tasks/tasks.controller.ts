import { Controller, Get, Post, Body, Req, UseGuards, Query } from '@nestjs/common';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private tasks: TasksService) {}

  @Post()
  create(@Body('title') title: string, @Req() req: any) {
    return this.tasks.create(title, req.user.userId);
  }

  @Get()
findAll(@Req() req, @Query() query: QueryTasksDto) {
  return this.tasks.findAll(
    req.user.userId,
    query.page || 1,
    query.limit || 10,
  );
}

}
