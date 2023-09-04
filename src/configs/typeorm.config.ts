import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

import { User } from '../user/entities';

export const getTypeOrmConfig = (): TypeOrmModuleAsyncOptions => {
  return {
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get('POSTGRES_HOST'),
      port: Number(configService.get('POSTGRES_PORT')),
      username: configService.get('POSTGRES_USER'),
      password: configService.get('POSTGRES_PASSWORD'),
      database: configService.get('POSTGRES_DB'),
      entities: [User],
      synchronize: !!configService.get('POSTGRES_SYNCHRONIZE'),
    }),
    inject: [ConfigService],
    imports: [ConfigModule],
  };
};
