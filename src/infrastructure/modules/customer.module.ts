import { CreateCustomerUseCase } from '@application/data/customer/usecases/create-customer-usecase';
import { FindOneCostumerUseCase } from '@application/data/customer/usecases/find-one-customer-usecase';
import { PrismaModule } from '@infrastructure/database/prisma.module';
import { CustomerRepository } from '@infrastructure/database/repositories/customer.repository';
import { UserRepository } from '@infrastructure/database/repositories/user.repository';
import { PaymentService } from '@infrastructure/services/payment/payment.service';
import { Module } from '@nestjs/common';
import { CreateCustomerController } from '@presentation/controllers/customer/create-customer-controller';
import { FindOneCustomerController } from '@presentation/controllers/customer/find-one-customer-controller';

@Module({
  imports: [PrismaModule],
  controllers: [CreateCustomerController, FindOneCustomerController],
  providers: [
    CustomerRepository,
    UserRepository,
    PaymentService,
    CreateCustomerUseCase,
    FindOneCostumerUseCase,
  ],
})
export class CustomerModule {}
