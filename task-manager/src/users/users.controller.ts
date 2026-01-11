import { Controller, Delete, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Delete('me')
  deleteAccount(@Req() req) {
    return this.usersService.delete(req.user.userId);
  }
}
