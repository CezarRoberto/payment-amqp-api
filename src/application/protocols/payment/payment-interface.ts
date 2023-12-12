export interface PaymentInterface {
  createCustomer(name: string, email: string): Promise<string>
}