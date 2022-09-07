import {
  CACHE_MANAGER,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { Cache } from 'cache-manager'
import 'dotenv/config'
import { createVerifier } from 'fast-jwt'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest()
      const token = req?.headers?.authorization.split(' ')[1]
      const { uid } = createVerifier({ key: process.env.SECRET })(token)
      // const whiteToken = await this.cache.get(uid)
      // if (token !== whiteToken) throw new UnauthorizedException()
      req.user = { uid }
      return true
    } catch (e) {
      throw new UnauthorizedException()
    }
  }
}