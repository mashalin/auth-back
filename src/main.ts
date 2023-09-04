import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { ValidationPipe } from './pipes';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);
}

bootstrap();
