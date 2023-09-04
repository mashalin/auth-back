import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { getJwtConfig } from '../configs';
import { JwtStrategy } from './strategies';

@Module({
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  imports: [UserModule, JwtModule.registerAsync(getJwtConfig())],
})
export class AuthModule {}
