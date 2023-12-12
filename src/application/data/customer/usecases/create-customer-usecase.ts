import {
  CreateCustomer,
  CreateCustomerUseCaseContract,
} from '@domain/customer/usecases/create-customer-usecase';
import { CustomerRepository } from '@infrastructure/database/repositories/customer.repository';
import { UserRepository } from '@infrastructure/database/repositories/user.repository';
import { PaymentService } from '@infrastructure/services/payment/payment.service';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';

@Injectable()
export class CreateCustomerUseCase implements CreateCustomerUseCaseContract {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly paymentService: PaymentService,
  ) {}

  async execute({
    userId,
    description,
  }: CreateCustomer.Params): Promise<CreateCustomer.Result> {
    const user = await this.userRepository.findById(userId);

    if (!user)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);

   try {
    const paymentServiceCustomer = await this.paymentService.createCustomer(
      user.name,
      user.email,
    );

    const localCustomer = await this.customerRepository.create({
      email: user.email,
      stripe_customer_id: paymentServiceCustomer.id,
      userId: user.id,
      description,
    });
    return {
      created_at_stripe: paymentServiceCustomer.created.toString(),
      stripe_customer_id: paymentServiceCustomer.id,
      id: localCustomer.id,
      email: localCustomer.email,
      name: user.name,
      createdAt: localCustomer.createdAt,
      updatedAt: localCustomer.updatedAt,
    };
   } catch (error) {
    throw new HttpException(`Something went wrong, error: ${error}`, HttpStatus.BAD_REQUEST);
   }
  }
}
