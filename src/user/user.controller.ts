import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards';

@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param() params: { id: string }) {
    return this.userService.findOneById(Number(params.id));
  }
}
