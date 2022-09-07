import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../auth/auth.guard.js'
import { User } from './entities/user.entity.js'
import { UsersService } from './users.service.js'

@Controller('user')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) { }

  @Get()
  get(@Req() req): Promise<User> {
    return this.users.get(req)
  }
}