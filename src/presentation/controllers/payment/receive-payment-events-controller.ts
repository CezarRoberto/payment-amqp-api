import { ReceivePaymentEventsUseCase } from '@application/data/payment/useCases/receive-payment-event.usecase';
import { Controller, Get, HttpCode, Req, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('payment')
export class FeedPostController {
  constructor(
    private readonly receivePaymentEventuseCase: ReceivePaymentEventsUseCase,
  ) {}

  @Get('/webhook')
  @HttpCode(100)
  async perform(@Req() request: Request, @Res() res: Response) {
    const data = request.body;
    const sig = request.headers.get('stripe-signature');

    await this.receivePaymentEventuseCase.execute(data, sig);
  }
}
