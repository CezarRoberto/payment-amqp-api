import { PaymentInterface } from '@application/protocols/payment/payment-interface';
import envs from '@main/envs';
import {
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { MyLoggerService } from '../logger/logger.service';

@Injectable()
export class PaymentService implements PaymentInterface {
  protected stripe: Stripe;
  readonly envs: any;

  constructor(private readonly loggerService: MyLoggerService) {
    this.envs = envs();
    this.stripe = new Stripe(this.envs.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      timeout: 100000,
    });
  }

  private ThrowErrorAndLogItOut(err: unknown, method: string) {
    if (err instanceof this.stripe.errors.StripeError) {
      this.loggerService.error(`Error on ${method}, ${err}`);
      throw new UnprocessableEntityException(
        `Fail to ${method}, error-message: ${err}`,
      );
    }
  }

  async createCustomer(name: string, email: string): Promise<string> {
    try {
      const { id } = await this.stripe.customers.create({
        name,
        email,
      });

      return id;
    } catch (error) {
      this.ThrowErrorAndLogItOut(error, this.createCustomer.name);
    }
  }
}
