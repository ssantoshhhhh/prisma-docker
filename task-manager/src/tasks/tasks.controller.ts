import { Controller, Get, Post, Patch, Delete, Body, Req, UseGuards, Query, Param } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private tasks: TasksService) {}

  @Post()
  create(@Body() dto: CreateTaskDto, @Req() req: any) {
    return this.tasks.create(req.user.userId, dto);
  }

  @Get()
findAll(@Req() req, @Query() query: QueryTasksDto) {
  return this.tasks.findAll(
    req.user.userId,
    query.page || 1,
    query.limit || 10,
  );
}

  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasks.update(+id, req.user.userId, dto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.tasks.remove(+id, req.user.userId);
  }
}
