import { CacheModule, Module } from '@nestjs/common'
import { TagsController } from './tags.controller.js'
import { TagsService } from './tags.service.js'

@Module({
  controllers: [TagsController],
  imports: [CacheModule.register()],
  providers: [TagsService]
})
export class TagsModule {}