import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { CreateUserDto, Credentials } from '../users/dto/create-user.dto.js'
import { AuthGuard } from './auth.guard.js'
import { AuthService } from './auth.service.js'
import { Token } from './entities/auth.entity.js'

@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  signIn(@Body() data: Credentials): Promise<Token> {
    return this.auth.signIn(data)
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  signOut(@Req() req) {
    return this.auth.signOut(req.user.uid)
  }

  @Post('signin')
  signUp(@Body() data: CreateUserDto): Promise<Token> {
    return this.auth.signUp(data)
  }

  @UseGuards(AuthGuard)
  @Post('refresh-token')
  refreshToken(@Req() req): Promise<Token> {
    return this.auth.refreshToken(req.user.uid)
  }
}