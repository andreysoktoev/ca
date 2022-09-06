import { Body, Controller, Post } from '@nestjs/common'
import { CreateUserDto } from '../users/dto/create-user.dto.js'
import { AuthService } from './auth.service.js'
import { Token } from './entities/auth.entity.js'

@Controller('signup')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post()
  signUp(@Body('data') data: CreateUserDto): Promise<Token> {
    return this.auth.signUp(data)
  }
}