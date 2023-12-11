import { Global, Module } from '@nestjs/common';
import { MyLoggerService } from '../logger/logger.service';
import { PaymentService } from './payment.service';

@Global()
@Module({
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
