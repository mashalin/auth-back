import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { AuthDto } from './dto';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from './guards';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/login')
  async login(
    @Body() userDto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(userDto);
    if (!user) {
      throw new UnauthorizedException(['Incorrect email or password']);
    }
    const userData = await this.authService.generateUserData(user);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return userData;
  }

  @Post('/register')
  async register(
    @Body() userDto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const candidate = await this.userService.findOneByEmail(userDto.email);
    if (candidate) {
      throw new ConflictException(['User with this email already exists']);
    }
    const userData = await this.authService.register(userDto);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return userData;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { refreshToken } = req.cookies;
    const token = await this.authService.logout(refreshToken);
    res.clearCookie('refreshToken');
    return token;
  }

  @Get('/refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new UnauthorizedException(['Unauthorized']);
    }
    const userData = await this.authService.refresh(refreshToken);
    if (!userData) {
      throw new UnauthorizedException(['Unauthorized']);
    }
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return userData;
  }
}
