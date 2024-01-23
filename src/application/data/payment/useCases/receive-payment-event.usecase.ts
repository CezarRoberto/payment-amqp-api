import { ReceivePaymentEventsUseCaseContract } from '@domain/paymentLink/usecases/receive-payment-link-usecase';
import { MessageRabbitMQService } from '@infrastructure/services/messaging/message.service';
import { PaymentService } from '@infrastructure/services/payment/payment.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ReceivePaymentEventsUseCase
  implements ReceivePaymentEventsUseCaseContract
{
  constructor(
    private readonly messageRabbitMQService: MessageRabbitMQService,
    private readonly paymentService: PaymentService,
  ) {}

  async execute(
    data: 'string' | Buffer,
    signatureHeader: string,
  ): Promise<void> {
    try {
      const signature = this.paymentService.signatureEvent(
        data,
        signatureHeader,
      );

      if (
        ![
          'payment_intent.created',
          'payment_intent.payment_failed',
          'payment_intent.processing',
          'payment_intent.succeeded',
          'payment_intent.requires_action',
        ].includes(signature.type)
      ) {
        throw new HttpException(
          'Webhook Error: NOT THE SAME EVENT TYPE',
          HttpStatus.CONFLICT,
        );
      }

      await this.messageRabbitMQService.publishToQueue(signature.data);
    } catch (err) {
      throw new HttpException(
        `Webhook Error: ${(err as Error).message}`,
        HttpStatus.CONFLICT,
      );
    }
  }
}
