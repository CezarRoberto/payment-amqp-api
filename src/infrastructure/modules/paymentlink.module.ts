import { PrismaModule } from '@infrastructure/database/prisma.module';
import { PaymentLinkRepository } from '@infrastructure/database/repositories/paymentlink.repository';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [PaymentLinkRepository],
})
export class CustomerModule {}
