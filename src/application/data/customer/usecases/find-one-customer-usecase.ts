import {
  FindOneCustomer,
  FindOneCustomerUseCaseContract,
} from '@domain/customer/usecases/find-one-customer-usecase';
import { CustomerRepository } from '@infrastructure/database/repositories/customer.repository';
import { PaymentService } from '@infrastructure/services/payment/payment.service';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';

@Injectable()
export class FindOneCostumerUseCase implements FindOneCustomerUseCaseContract {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly paymentService: PaymentService,
  ) {}

  async execute({
    id,
  }: FindOneCustomer.Params): Promise<FindOneCustomer.Result> {
    const localCustomer = await this.customerRepository.findById(id);

    if (!localCustomer && localCustomer.stripe_customer_id) {
      throw new HttpException('Customer Does not Exists', HttpStatus.CONFLICT);
    }

    const stripeCostumer = await this.paymentService.findCustomer(
      localCustomer.email,
    );
    return {
      id: localCustomer.id,
      email: localCustomer.email,
      stripe_customer_id: stripeCostumer.id,
      createdAt: localCustomer.createdAt,
      updatedAt: localCustomer.updatedAt,
    };
  }
}
