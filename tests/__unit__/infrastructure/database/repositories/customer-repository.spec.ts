import { Customer } from '@domain/customer/entities/customer';
import { User } from '@domain/user/entities/user';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CustomerRepository } from '@infrastructure/database/repositories/customer.repository';
import { MyLoggerService } from '@infrastructure/services/logger/logger.service';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
} from '@prisma/client/runtime/library';

interface ISutTypes {
  ctxPrisma: PrismaClient;
  ctxLogger: MyLoggerService;
  sut: CustomerRepository;
}

const makeSut = async (): Promise<ISutTypes> => {
  const moduleRef: TestingModule = await Test.createTestingModule({
    providers: [PrismaService, MyLoggerService, CustomerRepository],
  }).compile();

  const ctxPrisma = moduleRef.get<PrismaClient>(PrismaService);
  const ctxLogger = moduleRef.get<MyLoggerService>(MyLoggerService);
  const sut = moduleRef.get<CustomerRepository>(CustomerRepository);

  return {
    ctxPrisma,
    ctxLogger,
    sut,
  };
};

const makeFakeCustomerMock = (): Customer => ({
  id: 'a96a4a9d-0f3e-4d5a-8200-b159f3fbe875',
  email: 'testcustomer@email.com',
  description: 'Fake Descriptiton',
  stripe_customer_id: 'cus_bb41facf0047',
  userId: '67072848-54e6-495a-a4d4-050ba21d048e',
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  updatedAt: new Date('2023-12-04T00:00:00.000Z'),
});

const makeFakeUserMock = (): User => ({
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'John Doe',
  email: 'john.doe@example.com',
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  updatedAt: new Date('2023-12-04T00:00:00.000Z'),
});

describe('Customer Repository', () => {
  describe('Create', () => {
    test('should be able to create a new customer', async () => {
      const { ctxPrisma, sut } = await makeSut();

      const costumerMock = makeFakeCustomerMock();

      ctxPrisma.customer.create = jest.fn().mockResolvedValueOnce(costumerMock);

      const httpRequest = {
        body: {
          email: 'testcustomer@email.com',
          description: 'Fake Descriptiton',
          stripe_customer_id: 'cus_bb41facf0047',
          userId: '67072848-54e6-495a-a4d4-050ba21d048e',
        },
      };

      const httpResponse = await sut.create(httpRequest.body);

      expect(httpResponse).toEqual(costumerMock);
    });

    test('should be able to throw PrismaClientKnownRequestError', async () => {
      const { ctxLogger, ctxPrisma, sut } = await makeSut();

      ctxPrisma.customer.create = jest.fn().mockRejectedValue(
        new PrismaClientKnownRequestError('error_create_method', {
          clientVersion: 'client1',
          code: '300',
        }),
      );

      ctxLogger.error = jest.fn();

      const httpRequest = {
        body: {
          email: 'testcustomer@email.com',
          description: 'Fake Descriptiton',
          stripe_customer_id: 'cus_bb41facf0047',
          userId: '67072848-54e6-495a-a4d4-050ba21d048e',
        },
      };

      await expect(sut.create(httpRequest.body)).rejects.toThrow(HttpException);
      await expect(sut.create(httpRequest.body)).rejects.toThrow(
        'Fail to create, error-message: PrismaClientKnownRequestError: error_create_method',
      );

      expect(ctxLogger.error).toHaveBeenCalledWith(
        'Error on create, PrismaClientKnownRequestError: error_create_method',
      );
    });

    test('should be able to throw PrismaClientRustPanicError', async () => {
      const { ctxLogger, ctxPrisma, sut } = await makeSut();

      ctxPrisma.customer.create = jest
        .fn()
        .mockRejectedValue(
          new PrismaClientRustPanicError('error_create_method', '200'),
        );

      ctxLogger.error = jest.fn();

      const httpRequest = {
        body: {
          email: 'testcustomer@email.com',
          description: 'Fake Descriptiton',
          stripe_customer_id: 'cus_bb41facf0047',
          userId: '67072848-54e6-495a-a4d4-050ba21d048e',
        },
      };

      await expect(sut.create(httpRequest.body)).rejects.toThrow(HttpException);
      await expect(sut.create(httpRequest.body)).rejects.toThrow(
        'Fail to create, error-message: PrismaClientRustPanicError: error_create_method',
      );

      expect(ctxLogger.error).toHaveBeenCalledWith(
        'Error on create, PrismaClientRustPanicError: error_create_method',
      );
    });
  });

  describe('findById', () => {
    test('should be able to find a customer by parsing Id', async () => {
      const { ctxPrisma, sut } = await makeSut();

      const costumerMock = makeFakeCustomerMock();

      ctxPrisma.customer.findFirst = jest
        .fn()
        .mockResolvedValueOnce(costumerMock);

      const httpRequest = {
        body: {
          id: 'a96a4a9d-0f3e-4d5a-8200-b159f3fbe875',
        },
      };

      const httpResponse = await sut.findById(httpRequest.body.id);

      expect(httpResponse).toEqual(costumerMock);
    });

    test('should be able to throw PrismaClientKnownRequestError', async () => {
      const { ctxLogger, ctxPrisma, sut } = await makeSut();

      ctxPrisma.customer.findFirst = jest.fn().mockRejectedValue(
        new PrismaClientKnownRequestError('error_findById_method', {
          clientVersion: 'client1',
          code: '300',
        }),
      );

      ctxLogger.error = jest.fn();

      const httpRequest = {
        body: {
          id: 'a96a4a9d-0f3e-4d5a-8200-b159f3fbe875',
        },
      };

      await expect(sut.findById(httpRequest.body.id)).rejects.toThrow(
        HttpException,
      );
      await expect(sut.findById(httpRequest.body.id)).rejects.toThrow(
        'Fail to findById, error-message: PrismaClientKnownRequestError: error_findById_method',
      );

      expect(ctxLogger.error).toHaveBeenCalledWith(
        'Error on findById, PrismaClientKnownRequestError: error_findById_method',
      );
    });

    test('should be able to throw PrismaClientRustPanicError', async () => {
      const { ctxLogger, ctxPrisma, sut } = await makeSut();

      ctxPrisma.customer.findFirst = jest
        .fn()
        .mockRejectedValue(
          new PrismaClientRustPanicError('error_findById_method', '200'),
        );

      ctxLogger.error = jest.fn();

      const httpRequest = {
        body: {
          id: 'a96a4a9d-0f3e-4d5a-8200-b159f3fbe875',
        },
      };

      await expect(sut.findById(httpRequest.body.id)).rejects.toThrow(
        HttpException,
      );
      await expect(sut.findById(httpRequest.body.id)).rejects.toThrow(
        'Fail to findById, error-message: PrismaClientRustPanicError: error_findById_method',
      );

      expect(ctxLogger.error).toHaveBeenCalledWith(
        'Error on findById, PrismaClientRustPanicError: error_findById_method',
      );
    });
  });

  describe('Delete', () => {
    test('should be able to delete a customer by parsing Id', async () => {
      const { ctxPrisma, sut } = await makeSut();

      const costumerMock = makeFakeCustomerMock();

      ctxPrisma.customer.delete = jest.fn().mockResolvedValueOnce(costumerMock);

      const httpRequest = {
        body: {
          id: 'a96a4a9d-0f3e-4d5a-8200-b159f3fbe875',
        },
      };

      await sut.delete(httpRequest.body.id);

      expect(ctxPrisma.customer.delete).toHaveBeenCalledWith({
        where: {
          id: costumerMock.id,
        },
      });
    });

    test('should be able to throw PrismaClientKnownRequestError', async () => {
      const { ctxLogger, ctxPrisma, sut } = await makeSut();

      ctxPrisma.customer.delete = jest.fn().mockRejectedValue(
        new PrismaClientKnownRequestError('error_delete_method', {
          clientVersion: 'client1',
          code: '300',
        }),
      );

      ctxLogger.error = jest.fn();

      const httpRequest = {
        body: {
          id: 'a96a4a9d-0f3e-4d5a-8200-b159f3fbe875',
        },
      };

      await expect(sut.delete(httpRequest.body.id)).rejects.toThrow(
        HttpException,
      );
      await expect(sut.delete(httpRequest.body.id)).rejects.toThrow(
        'Fail to delete, error-message: PrismaClientKnownRequestError: error_delete_method',
      );

      expect(ctxLogger.error).toHaveBeenCalledWith(
        'Error on delete, PrismaClientKnownRequestError: error_delete_method',
      );
    });

    test('should be able to throw PrismaClientRustPanicError', async () => {
      const { ctxLogger, ctxPrisma, sut } = await makeSut();

      ctxPrisma.customer.delete = jest
        .fn()
        .mockRejectedValue(
          new PrismaClientRustPanicError('error_delete_method', '200'),
        );

      ctxLogger.error = jest.fn();

      const httpRequest = {
        body: {
          id: 'a96a4a9d-0f3e-4d5a-8200-b159f3fbe875',
        },
      };

      await expect(sut.delete(httpRequest.body.id)).rejects.toThrow(
        HttpException,
      );
      await expect(sut.delete(httpRequest.body.id)).rejects.toThrow(
        'Fail to delete, error-message: PrismaClientRustPanicError: error_delete_method',
      );

      expect(ctxLogger.error).toHaveBeenCalledWith(
        'Error on delete, PrismaClientRustPanicError: error_delete_method',
      );
    });
  });
});
