import { Customer } from '@domain/customer/entities/customer';
import { User } from '@domain/user/entities/user';

export interface CustomerInterface {
  create(
    data: Pick<
      Customer,
      'email' | 'stripe_customer_id' | 'userId' | 'description'
    >,
  ): Promise<Customer>;
  findById(id: string): Promise<(Customer & { user: User }) | null>;
  delete(id: string): Promise<void>;
}
