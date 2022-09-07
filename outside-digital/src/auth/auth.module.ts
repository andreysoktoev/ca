import { CacheModule, Module } from '@nestjs/common'
import { AuthController } from './auth.controller.js'
import { AuthService } from './auth.service.js'

@Module({
  controllers: [AuthController],
  imports: [CacheModule.register()],
  providers: [AuthService],
})
export class AuthModule {}