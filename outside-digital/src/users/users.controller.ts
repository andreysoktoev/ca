import { Body, Controller, Delete, Get, Put, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../auth/auth.guard.js'
import { UpdateUserDto } from './dto/create-user.dto.js'
import { User } from './entities/user.entity.js'
import { UsersService } from './users.service.js'

@Controller('user')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Delete()
  delete(@Req() req) {
    return this.users.delete(req)
  }

  @Get()
  get(@Req() req): Promise<User> {
    return this.users.get(req)
  }

  @Put()
  update(@Body() data: UpdateUserDto, @Req() req): Promise<User> {
    return this.users.update(data, req)
  }
}