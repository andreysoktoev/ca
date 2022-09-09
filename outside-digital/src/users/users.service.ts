import {
  BadRequestException,
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { Cache } from 'cache-manager'
import { sql } from '../db/sql.js'
import { UpdateUserDto } from './dto/create-user.dto.js'
import { User } from './entities/user.entity.js'

@Injectable()
export class UsersService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async delete(req: any) {
    const { uid } = req.user
    await this.cache.del(uid)
    await sql`delete from users where uid = ${uid}`
  }

  async get(uid: string) {
    try {
      const [user] = await sql`select email, nickname, tags from users_view where uid = ${uid}`
      return user
    } catch (e) {
      throw new NotFoundException()
    }
  }

  async update(data: UpdateUserDto, req: any): Promise<User> {
    try {
      const [user] = await sql`update users set ${sql(data)} where uid = ${req.user.uid} returning email, nickname`
      return user
    } catch (e) {
      throw new ConflictException(e.message)
    }
  }

  async addTags(uid: string, tags: number[]) {
    const tmp = await sql`select * from tags where id = any (${tags})`
    if (tmp.length < tags.length) throw new BadRequestException()
    await Promise.all(
      tags.map(async tid => await sql`insert into user_tags values (${uid}, ${tid}) on conflict do nothing`)
    )
    const [userTags] = await sql`select tags from users_view where uid = ${uid}`
    return userTags
  }

  async removeTag(uid: string, id: number) {
    await sql`delete from user_tags where uid = ${uid} and tid = ${id}`
    const [tags] = await sql`select tags from users_view where uid = ${uid}`
    return tags
  }

  async getMyTags(uid: string) {
    const tags = await sql`select id, name, sort_order from tags where creator = ${uid}`
    return { tags }
  }
}