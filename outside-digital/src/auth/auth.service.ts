import { CACHE_MANAGER, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { createDecoder, createSigner } from 'fast-jwt'
import { CreateUserDto, Credentials } from '../users/dto/create-user.dto.js'
import { UsersService } from '../users/users.service.js'
import { Token } from './entities/auth.entity.js'

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly users: UsersService
  ) {}

  async createToken(uid: string): Promise<Token> {
    const ttl = 1000 * 60 * 30
    const token = createSigner({ expiresIn: ttl, key: 'access' })({ uid })
    await this.cache.set(uid, token, { ttl })
    return {
      token,
      expire: ttl
    }
  }

  async signIn(data: Credentials): Promise<Token> {
    const user = await this.users.findOne(data)
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
    const user = await this.users.create(data)
    return this.createToken(user.uid)
  }
}