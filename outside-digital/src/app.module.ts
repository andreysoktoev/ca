import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module.js'
import { TagsModule } from './tags/tags.module.js'
import { UsersModule } from './users/users.module.js'

@Module({
  imports: [AuthModule, UsersModule, TagsModule]
})
export class AppModule {}