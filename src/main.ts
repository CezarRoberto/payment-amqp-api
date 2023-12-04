import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { MyLoggerService } from '@infrastructure/services/logger/logger.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new MyLoggerService(),
  });
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');
  await app.listen(port);
}
bootstrap();