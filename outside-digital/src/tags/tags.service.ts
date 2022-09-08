import { BadRequestException, Injectable } from '@nestjs/common'
import { sql } from '../db/sql.js'
import { CreateTagDto } from './dto/create-tag.dto.js'
import { UpdateTagDto } from './dto/update-tag.dto.js'
import { Tag } from './entities/tag.entity.js'

@Injectable()
export class TagsService {
  async create(uid: string, dto: CreateTagDto): Promise<Tag> {
    try {
      const [tag] = await sql`insert into tags ${sql({ creator: uid, ...dto })} returning id, name, sort_order`
      return tag
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  findAll() {
    return `This action returns all tags`
  }

  async findOne(id: number): Promise<Tag> {
    const [tag] = await sql`select * from tags where id = ${id}`
    return tag
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`
  }

  remove(id: number) {
    return `This action removes a #${id} tag`
  }
}