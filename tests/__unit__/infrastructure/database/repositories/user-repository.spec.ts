import { User } from '@domain/user/entities/user';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { UserRepository } from '@infrastructure/database/repositories/user.repository';
import { MyLoggerService } from '@infrastructure/services/logger/logger.service';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';

interface ISutTypes {
  ctxPrisma: PrismaClient;
  ctxLogger: MyLoggerService;
  sut: UserRepository;
}

const makeSut = async (): Promise<ISutTypes> => {
  const moduleRef: TestingModule = await Test.createTestingModule({
    providers: [PrismaService, MyLoggerService, UserRepository],
  }).compile();

  const ctxPrisma = moduleRef.get<PrismaClient>(PrismaService);
  const sut = moduleRef.get<UserRepository>(UserRepository);
  const ctxLogger = moduleRef.get<MyLoggerService>(MyLoggerService);

  return {
    ctxLogger,
    ctxPrisma,
    sut,
  };
};

const makefakeUserMock = (): User => ({
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'John Doe',
  email: 'john.doe@example.com',
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  updatedAt: new Date('2023-12-04T00:00:00.000Z'),
});

describe('User Repository', () => {
  describe('Create', () => {
    it('should be able to create a new user', async () => {
      const { ctxPrisma, sut } = await makeSut();

      const userMock = makefakeUserMock();

      ctxPrisma.user.create = jest.fn().mockResolvedValue(userMock);

      const httpRequest = {
        body: {
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
      };

      const httpResponse = await sut.create(httpRequest.body);

      expect(httpResponse).toEqual(userMock);
    });

    it('should be able to throw a new error: PrismaClientKnownRequestError', async () => {
      const { ctxPrisma, sut } = await makeSut();

      ctxPrisma.user.create = jest
        .fn()
        .mockRejectedValue(
          new PrismaClientKnownRequestError('ERROR', {
            clientVersion: '200',
            code: '200',
          }),
        );

      const httpRequest = {
        body: {
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
      };
      await expect(sut.create(httpRequest.body)).rejects.toThrow(HttpException);
      await expect(sut.create(httpRequest.body)).rejects.toThrow(
        `Fail to create, error-message: PrismaClientKnownRequestError: ERROR`,
      );
    });
  });

  describe('find By Email', () => {
    it('should be able to find a user by email ', async () => {
      const { ctxPrisma, sut } = await makeSut();

      const userMock = makefakeUserMock();

      ctxPrisma.user.findUnique = jest.fn().mockResolvedValue(userMock);

      const httpRequest = {
        email: 'john.doe@example.com',
      };

      const httpResponse = await sut.findByEmail(httpRequest.email);

      expect(httpResponse).toEqual(userMock);
    });

    it('should be able to throw a new error: PrismaClientUnknownRequestError', async () => {
      const { ctxPrisma, sut } = await makeSut();

      ctxPrisma.user.findUnique = jest
        .fn()
        .mockRejectedValue(
          new PrismaClientUnknownRequestError('UNKOWN ERROR', {
            clientVersion: '200',
          }),
        );

      const httpRequest = {
        email: 'john.doe@example.com',
      };

      await expect(sut.findByEmail(httpRequest.email)).rejects.toThrow(
        HttpException,
      );
      await expect(sut.findByEmail(httpRequest.email)).rejects.toThrow(
        `Fail to findByEmail, error-message: PrismaClientUnknownRequestError: UNKOWN ERROR`,
      );
    });
  });
});
