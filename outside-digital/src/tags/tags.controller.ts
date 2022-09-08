import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../auth/auth.guard.js'
import { CreateTagDto } from './dto/create-tag.dto.js'
import { UpdateTagDto } from './dto/update-tag.dto.js'
import { Tag } from './entities/tag.entity.js'
import { TagsService } from './tags.service.js'

@Controller('tag')
@UseGuards(AuthGuard)
export class TagsController {
  constructor(private readonly tags: TagsService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateTagDto): Promise<Tag> {
    return this.tags.create(req.user.uid, dto)
  }

  @Get()
  findAll() {
    return this.tags.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Tag> {
    return this.tags.findOne(+id)
  }

  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateTagDto): Promise<Tag> {
    return this.tags.update(req.user.uid, +id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tags.remove(+id)
  }
}