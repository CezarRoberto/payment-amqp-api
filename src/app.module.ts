import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [AppController],
})
export class AppModule {}
