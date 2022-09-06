import { ConflictException, Injectable } from '@nestjs/common'
import { sql } from '../db/sql.js'
import { CreateUserDto } from './dto/create-user.dto.js'

@Injectable()
export class UsersService {
  async create(data: CreateUserDto) {
    try {
      const [user] = await sql`insert into users ${sql(data)} returning *`
      return user
    } catch (e) {
      throw new ConflictException(e.message)
    }
  }
}