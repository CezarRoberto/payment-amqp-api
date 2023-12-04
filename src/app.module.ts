import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { PrismaModule } from '@infrastructure/database/prisma.module';
import { LoggerModule } from '@infrastructure/services/logger/logger.module';
import { UserModule } from '@infrastructure/modules/user.module';
import { EnvsModule } from '@main/envs/envs.module';

@Module({
  controllers: [AppController],
  imports: [
    TerminusModule,
    EnvsModule,
    HttpModule,
    PrismaModule,
    LoggerModule,
    UserModule,
  ],
})
export class AppModule {}
