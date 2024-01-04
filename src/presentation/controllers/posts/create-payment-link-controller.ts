import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { ZodValidationAdapter } from '@main/adapters/zod-validation-adapter';
import { CreatePaymentLinkSchema } from '@application/data/posts/validations/posts-validation';
import { CreatePaymentlink } from '@domain/paymentLink/usecases/create-payment-link-usecase';
import { CreatePaymentLinkUseCase } from '@application/data/posts/usecases/create-payment-link.usecase';

@Controller('post')
export class CreatePaymentLinkController {
  constructor(
    private readonly createPaymentLinkUseCase: CreatePaymentLinkUseCase,
  ) {}

  @Post('/payment')
  @HttpCode(201)
  @UsePipes(new ZodValidationAdapter(CreatePaymentLinkSchema))
  async perform(@Body() createPostBody: CreatePaymentlink.Params) {
    return this.createPaymentLinkUseCase.execute(createPostBody);
  }
}
