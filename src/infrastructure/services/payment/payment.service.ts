import envs from '@main/envs';
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  protected stripe: Stripe;
  readonly envs: any;

  constructor() {
    this.envs = envs();
    this.stripe = new Stripe(this.envs.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      timeout: 100000,
    });
  }
}
