import { PaymentLinkInterface } from '@application/protocols/paymentlink/paymentlink-interface';
import { MyLoggerService } from '@infrastructure/services/logger/logger.service';
import { PrismaService } from '../prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
} from '@prisma/client/runtime/library';
import { PaymentLink } from '@domain/paymentLink/entities/paymentlink';

@Injectable()
export class PaymentLinkRepository implements PaymentLinkInterface {
  constructor(
    private readonly prisma: PrismaService,
    private readonly loggerService: MyLoggerService,
  ) {}

  private ThrowErrorAndLogItOut(err: unknown, method: string) {
    if (
      err instanceof PrismaClientKnownRequestError ||
      err instanceof PrismaClientUnknownRequestError ||
      err instanceof PrismaClientRustPanicError
    ) {
      this.loggerService.error(`Error on ${method}, ${err}`);
      throw new HttpException(
        `Fail to ${method}, error-message: ${err}`,
        HttpStatus.CONFLICT,
      );
    }
  }
  async create(
    data: Pick<
      PaymentLink,
      | 'postId'
      | 'amount'
      | 'currency'
      | 'recurringInterval'
      | 'stripe_paymentlink_id'
    >,
  ): Promise<PaymentLink> {
    try {
      const paymentLink = await this.prisma.paymentLink.create({
        data: {
          amount: data.amount,
          currency: data.currency || 'BRL',
          recurringInterval: data.recurringInterval || 'year',
          stripe_paymentlink_id: data.stripe_paymentlink_id,
          postId: data.postId,
        },
      });

      return paymentLink;
    } catch (error) {
      this.ThrowErrorAndLogItOut(error, this.create.name);
    }
  }

  async findById(id: string): Promise<PaymentLink> {
    try {
      const paymentLink = await this.prisma.paymentLink.findUnique({
        where: {
          id,
        },
        include: {
          post: true,
        },
      });

      return paymentLink;
    } catch (error) {
      this.ThrowErrorAndLogItOut(error, this.create.name);
    }
  }
}
