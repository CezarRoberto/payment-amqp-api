import {
  CreatePaymentLinkUseCaseContract,
  CreatePaymentlink,
} from '@domain/paymentLink/usecases/create-payment-link-usecase';
import { PaymentLinkRepository } from '@infrastructure/database/repositories/paymentlink.repository';
import { PostRepository } from '@infrastructure/database/repositories/post.repository';
import { PaymentService } from '@infrastructure/services/payment/payment.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class CreatePaymentLinkUseCase
  implements CreatePaymentLinkUseCaseContract
{
  constructor(
    private readonly postsRepository: PostRepository,
    private readonly paymentService: PaymentService,
    private readonly paymentLinkRepository: PaymentLinkRepository,
  ) {}

  async execute({
    amount,
    currency,
    postId,
    recurringInterval,
  }: CreatePaymentlink.Params): Promise<CreatePaymentlink.Result> {
    const PostExists = await this.postsRepository.findOne(postId);

    if (!PostExists) {
      throw new HttpException('Post Does not  exists', HttpStatus.CONFLICT);
    }
    const Price = await this.paymentService.createPrice({
      currency,
      interval: recurringInterval,
      productData: {
        name: PostExists.title,
        postId: PostExists.id,
      },
      unit_amount: amount,
    });

    const PaymentLink = await this.paymentService.createPaymentLink(
      [{ price: Price.id, quantity: amount }],
      {
        postId: PostExists.id,
      },
    );

    await this.paymentLinkRepository.create({
      amount,
      currency,
      postId: PostExists.id,
      recurringInterval,
      stripe_paymentlink_id: PaymentLink.id,
    });

    return {
      url: PaymentLink.url,
    };
  }
}
