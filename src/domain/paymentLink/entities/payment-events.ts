export interface PaymentEvents {
  events:
    | 'payment_intent.created'
    | 'payment_intent.payment_failed'
    | 'payment_intent.processing'
    | 'payment_intent.succeeded'
    | 'payment_intent.requires_action';
  metadata: {
    postId: string;
  };
  createdAt: Date;
}
