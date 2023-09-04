import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities';
import { AuthDto } from '../auth/dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(dto: AuthDto): Promise<User> {
    const user = new User();
    user.email = dto.email;
    user.password = dto.password;
    await this.userRepository.save(user);
    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async findOneById(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async findOneByRefreshToken(refreshToken: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ refreshToken });
  }

  async update(id: number, refreshToken: string | null): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    return await this.userRepository.save({
      ...user,
      refreshToken,
    });
  }
}
