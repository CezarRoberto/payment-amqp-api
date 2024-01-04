import { PaymentLink } from '@domain/paymentLink/entities/paymentlink';

export interface PaymentLinkInterface {
  create(
    data: Pick<
      PaymentLink,
      | 'postId'
      | 'amount'
      | 'currency'
      | 'recurringInterval'
      | 'stripe_paymentlink_id'
    >,
  ): Promise<PaymentLink>;
  findById(id: string): Promise<PaymentLink | null>;
}
