import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import envs from '.';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envs],
    }),
  ],
})
export class EnvsModule {}
