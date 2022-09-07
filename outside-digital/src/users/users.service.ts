import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { sql } from '../db/sql.js'
import { UpdateUserDto } from './dto/create-user.dto.js'
import { User } from './entities/user.entity.js'

@Injectable()
export class UsersService {
  async get(req: any): Promise<User> {
    try {
      const [user] = await sql`select uid, email, nickname from users where uid = ${req.user.uid}`
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
}