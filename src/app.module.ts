import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { PrismaModule } from '@infrastructure/database/prisma.module';
import { LoggerModule } from '@infrastructure/services/logger/logger.module';

@Module({
  controllers: [AppController],
  imports: [TerminusModule, HttpModule, PrismaModule, LoggerModule],
})
export class AppModule {}
