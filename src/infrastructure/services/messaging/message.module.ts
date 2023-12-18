import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import envs from '@main/envs';
import { Global, Module } from '@nestjs/common';
import { MessageRabbitMQService } from './message.service';

@Global()
@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'exchange-1',
          type: 'topic',
        },
      ],
      uri: 'amqp://guest:guest@localhost:5672',
      channels: {
        'channel-1': {
          prefetchCount: 1,
          default: true,
        },
      },
    }),
  ],
  providers: [MessageRabbitMQService],
  exports: [MessageRabbitMQService],
})
export class MessageModule {}
