import { User } from '@domain/user/entities/user';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { UserRepository } from '@infrastructure/database/repositories/user.repository';
import { MyLoggerService } from '@infrastructure/services/logger/logger.service';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

interface ISutTypes {
  ctxPrisma: PrismaClient;
  ctxLogger: Promise<MyLoggerService>;
  sut: UserRepository;
}

const makeSut = async (): Promise<ISutTypes> => {
  const moduleRef: TestingModule = await Test.createTestingModule({
    providers: [PrismaService, MyLoggerService, UserRepository],
  }).compile();

  const ctxPrisma = moduleRef.get<PrismaClient>(PrismaService);
  const sut = moduleRef.get<UserRepository>(UserRepository);
  const ctxLogger = moduleRef.resolve<MyLoggerService>(MyLoggerService);

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

    it('should be able to throw a new error and http ERROR when something went wrong', async () => {
      const { ctxPrisma, sut } = await makeSut();

      ctxPrisma.user.create = jest
        .fn()
        .mockRejectedValue(
          new Error() instanceof PrismaClientKnownRequestError,
        );

      const httpRequest = {
        body: {
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
      };
      await expect(sut.create(httpRequest.body)).rejects.toThrow(HttpException);
      await expect(sut.create(httpRequest.body)).rejects.toThrow(
        `Fail to create, error-message: false`,
      );
    });
  });
});
