import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');
  await app.listen(port);
}
bootstrap();
