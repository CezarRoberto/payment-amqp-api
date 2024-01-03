import { FindOneCostumerUseCase } from '@application/data/customer/usecases/find-one-customer-usecase';
import { FindOneCustomer } from '@domain/customer/usecases/find-one-customer-usecase';
import { Param, Controller, Get, HttpCode } from '@nestjs/common';

@Controller('customer')
export class FindOneCustomerController {
  constructor(
    private readonly findOneCustomerUseCase: FindOneCostumerUseCase,
  ) {}

  @HttpCode(200)
  @Get(':id')
  async perform(@Param('id') id: string) {
    return this.findOneCustomerUseCase.execute({ id });
  }
}
