import { MyLoggerService } from '@infrastructure/services/logger/logger.service';
import { PaymentService } from '@infrastructure/services/payment/payment.service';
import { Test, TestingModule } from '@nestjs/testing';
import * as Stripe from 'stripe';

jest.mock('stripe', () => {
  return {
    __esModule: true,
    default: jest.fn().mockReturnValue({
      customers: {
        create: jest.fn(),
      },
    }),
  };
});

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

const makeFakeCustomer = {
  name: 'John Doe',
  email: 'john.doe@example.com',
};

describe('Stripe Payment Service', () => {
  describe('Create Customer', () => {
    test('should be able to create a new customer', async () => {
      const { ctxLogger, sut } = await makeSut();

      let testCustomer: Promise<Stripe.Stripe.Customer>;
      jest
        .spyOn(ctxLogger, 'error')
        .mockImplementation(() => new Error('ERROR'));

      const result = await sut.createCustomer(
        makeFakeCustomer.name,
        makeFakeCustomer.email,
      );

      expect(result).toBe(testCustomer);
    });
  });
});
