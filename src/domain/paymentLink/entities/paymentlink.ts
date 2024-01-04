export interface PaymentLink {
  id: string;
  purchasedNumber: number;
  stripe_paymentlink_id: string;
  currency: string;
  amount: number;
  recurringInterval: string;
  postId: string;
  createdAt: Date;
  updatedAt: Date;
}
