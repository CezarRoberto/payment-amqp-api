import { CreatePrice } from '@application/protocols/payment/payment-interface';
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
        list: jest.fn().mockImplementationOnce(() => []),
      },
      paymentIntents: {
        create: jest.fn(),
      },
      prices: {
        create: jest.fn(),
      },
      paymentLinks: {
        create: jest.fn(),
      },
      errors: {
        StripeError: jest.fn(),
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

describe('Stripe Payment Service', () => {
  test('should be able to create a new customer', async () => {
    const { ctxLogger, sut } = await makeSut();

    const makeFakeCustomer = {
      name: 'John Doe',
      email: 'john.doe@example.com',
    };

    let testCustomer: Promise<Stripe.Stripe.Customer>;
    jest.spyOn(ctxLogger, 'error').mockImplementation(() => new Error('ERROR'));

    const result = await sut.createCustomer(
      makeFakeCustomer.name,
      makeFakeCustomer.email,
    );

    expect(result).toBe(testCustomer);
  });

  test('should be able to create a new payment intent', async () => {
    const { ctxLogger, sut } = await makeSut();

    const makeFakePaymentIntent = {
      amount: 2,
      orderId: '229f01f2-f350-4f8f-8f54-cfadac02c365',
    };

    let testPaymentIntent: Promise<Stripe.Stripe.PaymentIntent>;
    jest.spyOn(ctxLogger, 'error').mockImplementation(() => new Error('ERROR'));

    const result = await sut.createPaymentIntent(
      makeFakePaymentIntent.amount,
      makeFakePaymentIntent.orderId,
    );

    expect(result).toBe(testPaymentIntent);
  });

  test('should be able to list a customer by email', async () => {
    const { ctxLogger, sut } = await makeSut();

    const makeFindCustomerList = {
      email: 'john.doe@example.com',
    };

    let testFindCustomerList: Promise<Stripe.Stripe.Customer>;
    jest.spyOn(ctxLogger, 'error').mockImplementation(() => new Error('ERROR'));

    const result = await sut.findCustomer(makeFindCustomerList.email);

    expect(result).toBe(testFindCustomerList);
  });

  test('should be able to list a create a new price ', async () => {
    const { ctxLogger, sut } = await makeSut();

    const makePriceFake: CreatePrice = {
      currency: 'BRL',
      unit_amount: 20,
      interval: 'day',
      productData: {
        name: 'Product Name',
        postId: 'ec6b8a2d-0eb2-4f50-8355-0c875a70a97c',
      },
    };

    let testPrice: Promise<Stripe.Stripe.Price>;
    jest.spyOn(ctxLogger, 'error').mockImplementation(() => new Error('ERROR'));

    const result = await sut.createPrice(makePriceFake);

    expect(result).toBe(testPrice);
  });

  test('should be able to list a create a new price ', async () => {
    const { ctxLogger, sut } = await makeSut();

    const makeFakePaymentLink = {
      data: [
        {
          price: 'price_1MoBy5LkdIwHu7ixZhnattbh',
          quantity: 2,
        },
      ],
      metadata: {
        postId: 'e4970293-a746-46cd-8e41-ba1c983f32eb',
      },
    };

    let testPaymentLink: Promise<Stripe.Stripe.PaymentLink>;
    jest.spyOn(ctxLogger, 'error').mockImplementation(() => new Error('ERROR'));

    const result = await sut.createPaymentLink(
      makeFakePaymentLink.data,
      makeFakePaymentLink.metadata,
    );

    expect(result).toBe(testPaymentLink);
  });
});
