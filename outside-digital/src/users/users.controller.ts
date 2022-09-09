import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../auth/auth.guard.js'
import { UpdateUserDto } from './dto/create-user.dto.js'
import { User } from './entities/user.entity.js'
import { UsersService } from './users.service.js'

@Controller()
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Delete('user')
  delete(@Req() req) {
    return this.users.delete(req)
  }

  @Get('user')
  get(@Req() req) {
    return this.users.get(req.user.uid)
  }

  @Put('user')
  update(@Body() data: UpdateUserDto, @Req() req): Promise<User> {
    return this.users.update(data, req)
  }

  @Post('user/tag')
  addTags(@Req() req, @Body('tags') tags: number[]) {
    return this.users.addTags(req.user.uid, tags)
  }

  @Delete('user/tag/:id')
  removeTag(@Req() req, @Param('id') id: string) {
    return this.users.removeTag(req.user.uid, +id)
  }

  @Get('user/tag/my')
  getMyTags(@Req() req) {
    return this.users.getMyTags(req.user.uid)
  }
}