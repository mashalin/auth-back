import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { AuthDto } from './dto';
import { UserService } from '../user/user.service';
import { User } from '../user/entities';
import { IJwtData } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async generateUserData(user: User) {
    const tokens = await this.generateTokens(user);
    await this.userService.update(user.id, tokens.refreshToken);
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async register(userDto: AuthDto) {
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.create({
      ...userDto,
      password: hashPassword,
    });
    const userData = await this.generateUserData(user);
    return userData;
  }

  async generateTokens(user: User) {
    const payload = { id: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '5m' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '30d' }),
    };
  }

  async validateUser(userDto: AuthDto) {
    const user = await this.userService.findOneByEmail(userDto.email);
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (user && passwordEquals) {
      return user;
    }
    return null;
  }

  async logout(refreshToken: string) {
    const user = await this.userService.findOneByRefreshToken(refreshToken);
    await this.userService.update(user.id, null);
    return refreshToken;
  }

  async validateToken(token: string): Promise<IJwtData | null> {
    const userData = await this.jwtService.verify(token);
    if (userData) {
      return userData;
    }
    return null;
  }

  async refresh(refreshToken: string) {
    const userTokenData = await this.validateToken(refreshToken);
    const user = await this.userService.findOneByRefreshToken(refreshToken);
    if (!user || !userTokenData) {
      return null;
    }
    const userData = await this.generateUserData(user);
    return userData;
  }
}
