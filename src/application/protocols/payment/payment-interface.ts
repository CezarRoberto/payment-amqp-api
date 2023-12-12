export interface PaymentInterface {
  createCustomer<T>(name: string, email: string): Promise<T>
}