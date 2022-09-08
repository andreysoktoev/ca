import { CACHE_MANAGER, ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { Cache } from 'cache-manager'
import 'dotenv/config'
import { createDecoder, createSigner } from 'fast-jwt'
import { sql } from '../db/sql.js'
import { CreateUserDto, Credentials } from '../users/dto/create-user.dto.js'
import { Token } from './entities/auth.entity.js'

@Injectable()
export class AuthService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async createToken(uid: string): Promise<Token> {
    const { TOKEN_TTL } = process.env
    const token = createSigner({ expiresIn: +TOKEN_TTL, key: process.env.SECRET })({ uid })
    await this.cache.set(uid, token, { ttl: 1800 })
    return {
      token,
      expire: +TOKEN_TTL
    }
  }

  async signIn(data: Credentials): Promise<Token> {
    const { email, password } = data
    const [user] = await sql`select * from users where email = ${email}`
    if (!user || password !== user.password) throw new UnauthorizedException('Invalid credentials')
    return this.createToken(user.uid)
  }

  async signOut(authorization: string) {
    try {
      const token = authorization.split(' ')[1]
      const { uid } = createDecoder()(token)
      await this.cache.del(uid)
      return true
    } catch (e) {
      throw new UnauthorizedException()
    }
  }

  async signUp(data: CreateUserDto): Promise<Token> {
    const { email, nickname } = data
    const [userExists] = await sql`select * from users where email = ${email} or nickname = ${nickname}`
    if (userExists) throw new ConflictException('User already exists')
    const [{ uid }] = await sql`insert into users ${sql(data)} returning uid`
    return this.createToken(uid)
  }
}