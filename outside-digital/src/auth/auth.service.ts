import { Injectable } from '@nestjs/common'
import { createSigner } from 'fast-jwt'
import { CreateUserDto } from '../users/dto/create-user.dto.js'
import { UsersService } from '../users/users.service.js'
import { Token } from './entities/auth.entity.js'

const TOKEN_TTL = 1000 * 60 * 30
const createToken = (uid: string) => createSigner({ expiresIn: TOKEN_TTL, key: 'access' })({ uid })

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService) {}

  async signUp(data: CreateUserDto): Promise<Token> {
    const user = await this.users.create(data)
    const token = createToken(user.uid)
    return { token, expire: TOKEN_TTL }
  }
}