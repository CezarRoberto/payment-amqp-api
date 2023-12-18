import { MessageRabbitMQInterface } from '@application/protocols/messaging/message-interface';
import { MyLoggerService } from '../logger/logger.service';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class MessageRabbitMQService
  implements MessageRabbitMQInterface, OnModuleInit
{
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly amqpConnection: AmqpConnection,
  ) {}
  async onModuleInit() {
    // await this.amqpConnection.publish('exchange-1', 'webhooks-stripe', {
    //   test: 'test',
    // });
  }

  async publishToQueue<T>(Message: T): Promise<T> {
    try {
      await this.amqpConnection.publish(
        'exchange-1',
        'webhooks-stripe',
        Message,
      );
      return { ...Message, response: 'sucess' };
    } catch (error) {
      throw new HttpException(
        'ERROR ON SENDING webhooks-stripe',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @RabbitSubscribe({
    exchange: 'exchange-1',
    routingKey: 'webhooks-stripe',
    queue: 'webhooks-stripe',
  })
  async receiveFromQueue<T>(Message: T): Promise<T> {
    try {
      this.loggerService.log(
        `Received message from : ${JSON.stringify(Message)}`,
      );
      return { ...Message, response: 'sucess' };
    } catch (error) {
      throw new HttpException(
        'ERROR ON CONSUMING webhooks-stripe',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
