import { CacheModule, Module } from '@nestjs/common'
import { UsersController } from './users.controller.js'
import { UsersService } from './users.service.js'

@Module({
  controllers: [UsersController],
  exports: [UsersService],
  imports: [CacheModule.register()],
  providers: [UsersService]
})
export class UsersModule {}