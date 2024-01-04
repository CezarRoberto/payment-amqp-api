import {
  CreatePrice,
  LineItems,
  PaymentInterface,
} from '@application/protocols/payment/payment-interface';
import envs from '@main/envs';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
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

  async createCustomer<T = Stripe.Customer>(
    name: string,
    email: string,
  ): Promise<T> {
    try {
      const costumer = await this.stripe.customers.create({
        name,
        email,
      });

      return costumer as T;
    } catch (error) {
      this.ThrowErrorAndLogItOut(error, this.createCustomer.name);
    }
  }

  async createPaymentIntent<T = Stripe.PaymentIntent>(
    amount: number,
    orderId: string,
  ): Promise<T> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency: 'brl',
        metadata: {
          orderId,
        },
      });

      return paymentIntent as T;
    } catch (error) {
      this.ThrowErrorAndLogItOut(error, this.createPaymentIntent.name);
    }
  }

  async findCustomer<T = Stripe.PaymentIntent>(email: string): Promise<T> {
    try {
      const customers = await this.stripe.customers.list({ email: `${email}` });

      const customer = customers.data[0];

      return customer as T;
    } catch (error) {
      this.ThrowErrorAndLogItOut(error, this.createPaymentIntent.name);
    }
  }

  async createPrice<T = Stripe.Price>(data: CreatePrice): Promise<T> {
    try {
      const price = await this.stripe.prices.create({
        currency: data.currency || 'BRL',
        unit_amount: data.unit_amount,
        recurring: {
          interval: data.interval || 'year',
        },
        product_data: {
          name: data.productData.name,
        },
        metadata: {
          postId: data.productData.postId,
        },
      });

      return price as T;
    } catch (error) {
      this.ThrowErrorAndLogItOut(error, this.createPrice.name);
    }
  }
  async createPaymentLink<T = Stripe.PaymentLink>(
    data: LineItems[],
    metadata: { postId: string },
  ): Promise<T> {
    try {
      const paymentLink = await this.stripe.paymentLinks.create({
        line_items: data,
        metadata: {
          postId: metadata.postId,
        },
      });

      return paymentLink as T;
    } catch (error) {
      console.log(error);
      this.ThrowErrorAndLogItOut(error, this.createPaymentLink.name);
    }
  }
}
