import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
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

  async findAll(query) {
    const sortByOrder = query?.sortByOrder
    const sortByName = query?.sortByName
    const length = query?.length
    const offset = query?.offset
    const tags = await sql`
      select creator, name, sort_order
      from tags_view
      order by
        case when ${sortByOrder === ''} then sort_order end,
        case when ${sortByName === ''} then name end
      limit case when ${length > 0} then ${length}::bigint end
      offset case when ${offset > 0} then ${offset}::bigint end
    `
    return {
      data: tags,
      meta: {
        offset,
        length,
        quantity: tags.length
      }
    }
  }

  async findOne(id: number): Promise<Tag> {
    const [tag] = await sql`select creator, name, sort_order from tags_view where id = ${id}`
    return tag
  }

  async update(uid: string, id: number, dto: UpdateTagDto) {
    const [oldTag] = await sql`select * from tags where id = ${id}`
    if (!oldTag) throw new NotFoundException()
    if (uid !== oldTag.creator) throw new ForbiddenException()
    await sql`update tags set ${sql(dto)} where id = ${id}`
    const newTag = await this.findOne(id)
    return newTag
  }

  async remove(uid: string, id: number) {
    const [oldTag] = await sql`select * from tags where id = ${id}`
    if (!oldTag) throw new NotFoundException()
    if (uid !== oldTag.creator) throw new ForbiddenException()
    await sql`delete from tags where id = ${id}`
  }
}