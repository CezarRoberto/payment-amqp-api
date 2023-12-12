import { CreateCustomerUseCase } from "@application/data/customer/usecases/create-customer-usecase";
import { PrismaModule } from "@infrastructure/database/prisma.module";
import { CustomerRepository } from "@infrastructure/database/repositories/customer.repository";
import { UserRepository } from "@infrastructure/database/repositories/user.repository";
import { PaymentService } from "@infrastructure/services/payment/payment.service";
import { Module } from "@nestjs/common";
import { CreateCustomerController } from "@presentation/controllers/customer/create-customer-controller";

@Module({
  imports: [PrismaModule],
  controllers: [CreateCustomerController],
  providers: [CustomerRepository, UserRepository, PaymentService, CreateCustomerUseCase],
})
export class CustomerModule {}
