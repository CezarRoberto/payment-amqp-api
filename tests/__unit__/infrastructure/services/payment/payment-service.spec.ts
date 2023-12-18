import { MyLoggerService } from '@infrastructure/services/logger/logger.service';
import { PaymentService } from '@infrastructure/services/payment/payment.service';
import { Test, TestingModule } from '@nestjs/testing';

interface ISutTypes {
  ctxLogger: MyLoggerService;
  sut: PaymentService;
}

const makeSut = async (): Promise<ISutTypes> => {
  const moduleRef: TestingModule = await Test.createTestingModule({
    providers: [PaymentService, MyLoggerService],
  }).compile();

  const ctxLogger = moduleRef.get<MyLoggerService>(MyLoggerService);
  const sut = moduleRef.get<PaymentService>(PaymentService);

  return {
    ctxLogger,
    sut,
  };
};

const makeFakeCustomer = () => {
  id: 'cus_NffrFeUfNV2Hib'
}


describe('Stripe Payment Service', () => {
  describe('Create Customer', () => {
    test('should be able to create a new customer', async () => {

      const {ctxLogger, sut} = await makeSut();

      jest.spyOn(sut, 'createCustomer').mockResolvedValue({})
    });
  });
});
