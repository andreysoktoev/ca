import { CacheModule, Module } from '@nestjs/common'
import { UsersModule } from '../users/users.module.js'
import { AuthController } from './auth.controller.js'
import { AuthService } from './auth.service.js'

@Module({
  controllers: [AuthController],
  imports: [CacheModule.register(), UsersModule],
  providers: [AuthService]
})
export class AuthModule {}