import { User } from '@domain/user/entities/user';
import { Customer } from '../entities/customer';

export interface CustomerInterface {
  create(
    data: Pick<
      Customer,
      'email' | 'stripe_customer_id' | 'userId' | 'description'
    >,
  ): Promise<Customer>;
  findById(id: string): Promise<Customer & User>;
  delete(id: string): Promise<void>;
}
