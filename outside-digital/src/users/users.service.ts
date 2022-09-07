import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { sql } from '../db/sql.js'
import { CreateUserDto, Credentials, UpdateUserDto } from './dto/create-user.dto.js'
import { User } from './entities/user.entity.js'

@Injectable()
export class UsersService {
  async create(data: CreateUserDto): Promise<User> {
    try {
      const { email, password, nickname } = data
      const [user] = await sql`
        insert into users (email, password, nickname) values
          (${email}, crypt(${password}, gen_salt('md5')), ${nickname})
        returning *
      `
      return user
    } catch (e) {
      throw new ConflictException(e.message)
    }
  }

  async findOne(data: Credentials): Promise<User> {
    try {
      const { email, password } = data
      const [user] = await sql`
        select
          uid,
          (
            password <> crypt(${password}, password)
          ) invalid_password
        from users
        where email = ${email}
      `
      if (!user || user.invalid_password) throw new UnauthorizedException('Invalid credentials')
      return user
    } catch (e) {
      throw new UnauthorizedException(e.message)
    }
  }

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