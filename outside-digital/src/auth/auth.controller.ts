import { Body, Controller, Headers, Post } from '@nestjs/common'
import { CreateUserDto, Credentials } from '../users/dto/create-user.dto.js'
import { AuthService } from './auth.service.js'
import { Token } from './entities/auth.entity.js'

@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('signin')
  signIn(@Body() data: Credentials): Promise<Token> {
    return this.auth.signIn(data)
  }

  @Post('signout')
  signOut(@Headers('authorization') authorization: string): Promise<boolean> {
    return this.auth.signOut(authorization)
  }

  @Post('signup')
  signUp(@Body() data: CreateUserDto): Promise<Token> {
    return this.auth.signUp(data)
  }
}