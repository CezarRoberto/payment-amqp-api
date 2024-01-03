export interface PaymentInterface {
  createCustomer<T>(name: string, email: string): Promise<T>;
  createPaymentIntent<T>(amount: number, orderId: string): Promise<T>;
  findCustomer<T>(email: string): Promise<T>;
}
