export interface PaymentInterface {
  createCustomer<T>(name: string, email: string): Promise<T>;
  createPaymentIntent<T>(amount: number, orderId: string): Promise<T>;
  findCustomer<T>(email: string): Promise<T>;
  createPrice<T>(data: CreatePrice): Promise<T>;
  createPaymentLink<T>(
    data: LineItems[],
    metadata: { postId: string },
  ): Promise<T>;

  signatureEvent<T>(data: 'string' | Buffer, signatureKey: unknown): T;
}

export type LineItems = {
  price: string;
  quantity: number;
};

export type CreatePrice = {
  currency: string;
  unit_amount: number;
  interval: 'day' | 'month' | 'week' | 'year';
  productData: { name: string; postId: string };
};
