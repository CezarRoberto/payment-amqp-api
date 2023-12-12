import { CreateCustomerUseCase } from '@application/data/customer/usecases/create-customer-usecase';
import { CreateCustomer } from '@domain/customer/usecases/create-customer-usecase';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';

@Controller('customer')
export class CreateCustomerController {
  constructor(private readonly createCustomerUseCase: CreateCustomerUseCase) {}

  @Post()
  @HttpCode(201)
  async perform(@Body() createCustomerBody: CreateCustomer.Params) {
    return this.createCustomerUseCase.execute(createCustomerBody);
  }
}
