import { Injectable } from '@nestjs/common'
import { createSigner } from 'fast-jwt'
import { CreateUserDto, Credentials } from '../users/dto/create-user.dto.js'
import { UsersService } from '../users/users.service.js'
import { Token } from './entities/auth.entity.js'

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService) { }

  createToken(uid: string): Token {
    const TOKEN_TTL = 1000 * 60 * 30
    return {
      token: createSigner({ expiresIn: TOKEN_TTL, key: 'access' })({ uid }),
      expire: TOKEN_TTL
    }
  }

  async signIn(data: Credentials): Promise<Token> {
    const user = await this.users.findOne(data)
    return this.createToken(user.uid)
  }

  async signUp(data: CreateUserDto): Promise<Token> {
    const user = await this.users.create(data)
    return this.createToken(user.uid)
  }
}