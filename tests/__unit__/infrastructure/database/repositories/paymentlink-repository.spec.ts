import { PrismaService } from '@infrastructure/database/prisma.service';
import { PaymentLinkRepository } from '@infrastructure/database/repositories/paymentlink.repository';
import { MyLoggerService } from '@infrastructure/services/logger/logger.service';
import { HttpException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';

interface ISutTypes {
  ctxPrisma: PrismaClient;
  ctxLogger: MyLoggerService;
  sut: PaymentLinkRepository;
}

const makeSut = async (): Promise<ISutTypes> => {
  const moduleRef: TestingModule = await Test.createTestingModule({
    providers: [PrismaService, MyLoggerService, PaymentLinkRepository],
  }).compile();

  const ctxPrisma = moduleRef.get<PrismaClient>(PrismaService);
  const sut = moduleRef.get<PaymentLinkRepository>(PaymentLinkRepository);
  const ctxLogger = moduleRef.get<MyLoggerService>(MyLoggerService);

  return {
    ctxLogger,
    ctxPrisma,
    sut,
  };
};

const makeFakePaymentLink = () => ({
  id: '4cfb0f83-c42d-4d12-84f1-3eaaac1e905b',
  purchgasedNumber: 1,
  stripe_paymentlink_id: '1e956a44-3480-4a74-8e1f-f99ffc4ccbd0',
  currency: 'BRL',
  amount: 2,
  recurringInterval: 'day',
  postId: '927f32ce-a8d8-4339-9fea-0840e298e491',
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  updatedAt: new Date('2023-12-04T00:00:00.000Z'),
});

describe('PaymentLink Repository', () => {
  describe('CREATE ', () => {
    test('should be able to create a new paymentlink', async () => {
      expect.assertions(1);
      const { ctxPrisma, sut } = await makeSut();

      const paymentLink = makeFakePaymentLink();

      ctxPrisma.paymentLink.create = jest.fn().mockResolvedValue(paymentLink);

      const httpRequest = {
        body: {
          purchgasedNumber: 1,
          stripe_paymentlink_id: '1e956a44-3480-4a74-8e1f-f99ffc4ccbd0',
          currency: 'BRL',
          amount: 2,
          recurringInterval: 'day',
          postId: '927f32ce-a8d8-4339-9fea-0840e298e491',
        },
      };

      const httpResponse = await sut.create(httpRequest.body);

      expect(httpResponse).toEqual(paymentLink);
    });

    test('should be able to throw error when something went wrong', async () => {
      const { ctxPrisma, sut } = await makeSut();

      ctxPrisma.paymentLink.create = jest.fn().mockRejectedValue(
        new PrismaClientKnownRequestError('error_create_method', {
          clientVersion: 'client1',
          code: '200',
        }),
      );

      const httpRequest = {
        body: {
          purchgasedNumber: 1,
          stripe_paymentlink_id: '1e956a44-3480-4a74-8e1f-f99ffc4ccbd0',
          currency: 'BRL',
          amount: 2,
          recurringInterval: 'day',
          postId: '927f32ce-a8d8-4339-9fea-0840e298e491',
        },
      };

      await expect(sut.create(httpRequest.body)).rejects.toThrow(HttpException);
      await expect(sut.create(httpRequest.body)).rejects.toThrow(
        'Fail to create, error-message: PrismaClientKnownRequestError: error_create_method',
      );
    });
  });

  describe('FIND BY ID', () => {
    test('should be able to find a paymentLink by ID', async () => {
      expect.assertions(2);
      const { ctxPrisma, sut } = await makeSut();

      const paymentLink = makeFakePaymentLink();

      ctxPrisma.paymentLink.findUnique = jest
        .fn()
        .mockResolvedValue(paymentLink);

      const httpRequest = {
        body: {
          id: '927f32ce-a8d8-4339-9fea-0840e298e491',
        },
      };

      const httpResponse = await sut.findById(httpRequest.body.id);

      expect(httpResponse).toEqual(paymentLink);
      expect(ctxPrisma.paymentLink.findUnique).toHaveBeenCalledWith({
        where: {
          id: expect.stringMatching(
            new RegExp(
              /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
            ),
          ),
        },
        include: { post: true },
      });
    });

    test('should be able to throw error when something went wrong', async () => {
      const { ctxPrisma, sut } = await makeSut();

      ctxPrisma.paymentLink.findUnique = jest.fn().mockRejectedValue(
        new PrismaClientUnknownRequestError('error_findbyId_method', {
          clientVersion: 'client1',
        }),
      );

      const httpRequest = {
        body: {
          id: '927f32ce-a8d8-4339-9fea-0840e298e491',
        },
      };

      await expect(sut.findById(httpRequest.body.id)).rejects.toThrow(
        HttpException,
      );
      await expect(sut.findById(httpRequest.body.id)).rejects.toThrow(
        'Fail to create, error-message: PrismaClientUnknownRequestError: error_findbyId_method',
      );
    });
  });
});
