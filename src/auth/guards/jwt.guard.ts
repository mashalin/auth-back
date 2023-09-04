import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { User } from '../../user/entities';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt-token') {
  handleRequest<TUser = User>(err: HttpException, user: TUser): TUser {
    if (err || !user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
