import { User } from '@domain/user/entities/user';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { UserRepository } from '@infrastructure/database/repositories/user.repository';
import { MyLoggerService } from '@infrastructure/services/logger/logger.service';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Post, PrismaClient } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
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

const makeFakePostMock = (): Post => ({
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: 'First Post',
  content: 'This is the first post',
  published: true,
  views: 100,
  authorId: '123e4567-e89b-12d3-a456-426614174000',
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  updatedAt: new Date('2023-12-04T00:00:00.000Z'),
});

describe('User Repository', () => {
  describe('Create', () => {
    it('should be able to create a new user', async () => {
      const { ctxPrisma, sut } = await makeSut();

      const userMock = makefakeUserMock();

      ctxPrisma.user.create = jest.fn().mockResolvedValueOnce(userMock);

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

      ctxPrisma.user.create = jest.fn().mockRejectedValue(
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

      ctxPrisma.user.findUnique = jest.fn().mockResolvedValueOnce(userMock);

      const httpRequest = {
        email: 'john.doe@example.com',
      };

      const httpResponse = await sut.findByEmail(httpRequest.email);

      expect(httpResponse).toEqual(userMock);
    });

    it('should be able to throw a new error: PrismaClientUnknownRequestError', async () => {
      const { ctxPrisma, sut } = await makeSut();

      ctxPrisma.user.findUnique = jest.fn().mockRejectedValue(
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

  describe('find By ID', () => {
    it('should be able to find a user by id ', async () => {
      const { ctxPrisma, sut } = await makeSut();

      const userMock = makefakeUserMock();

      ctxPrisma.user.findUnique = jest.fn().mockResolvedValueOnce(userMock);

      const httpRequest = {
        id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const httpResponse = await sut.findById(httpRequest.id);

      expect(httpResponse).toEqual(userMock);
    });

    it('should be able to throw a new error: PrismaClientUnknownRequestError', async () => {
      const { ctxPrisma, sut } = await makeSut();

      ctxPrisma.user.findUnique = jest.fn().mockRejectedValue(
        new PrismaClientUnknownRequestError('UNKOWN ERROR', {
          clientVersion: '200',
        }),
      );

      const httpRequest = {
        id: '123e4567-e89b-12d3-a456-426614174000',
      };

      await expect(sut.findById(httpRequest.id)).rejects.toThrow(HttpException);
      await expect(sut.findById(httpRequest.id)).rejects.toThrow(
        `Fail to findById, error-message: PrismaClientUnknownRequestError: UNKOWN ERROR`,
      );
    });

    it('should be able to throw a new error: PrismaClientRustPanicError', async () => {
      const { ctxPrisma, sut } = await makeSut();

      ctxPrisma.user.findUnique = jest
        .fn()
        .mockRejectedValue(
          new PrismaClientRustPanicError('CLIENT_RUST_PANIC', '200'),
        );

      const httpRequest = {
        id: '123e4567-e89b-12d3-a456-426614174000',
      };

      await expect(sut.findById(httpRequest.id)).rejects.toThrow(HttpException);
      await expect(sut.findById(httpRequest.id)).rejects.toThrow(
        `Fail to findById, error-message: PrismaClientRustPanicError: CLIENT_RUST_PANIC`,
      );
    });
  });

  describe('List Posts By User ID', () => {
    it('should be able to find a all posts by user ID ', async () => {
      const { ctxPrisma, sut } = await makeSut();

      const userMock = makefakeUserMock();
      const postMock = makeFakePostMock();

      const userPlusPosts: (User & { posts: Post[] } | null) = {
        ...userMock,
        posts: new Array(postMock),
      };
      ctxPrisma.user.findUnique = jest
        .fn()
        .mockResolvedValueOnce(userPlusPosts);

      const httpRequest = {
        id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const httpResponse = await sut.listPosts(httpRequest.id);
      expect(httpResponse).toHaveProperty('id');
      expect(httpResponse).toHaveProperty('posts');
    });

    it('should be able to throw a new error: PrismaClientUnknownRequestError', async () => {
      const { ctxPrisma, sut } = await makeSut();

      ctxPrisma.user.findUnique = jest.fn().mockRejectedValue(
        new PrismaClientUnknownRequestError('UNKOWN ERROR', {
          clientVersion: '200',
        }),
      );

      const httpRequest = {
        id: '123e4567-e89b-12d3-a456-426614174000',
      };

      await expect(sut.listPosts(httpRequest.id)).rejects.toThrow(HttpException);
      await expect(sut.listPosts(httpRequest.id)).rejects.toThrow(
        `Fail to listPosts, error-message: PrismaClientUnknownRequestError: UNKOWN ERROR`,
      );
    });

    it('should be able to throw a new error: PrismaClientRustPanicError', async () => {
      const { ctxPrisma, sut } = await makeSut();

      ctxPrisma.user.findUnique = jest
        .fn()
        .mockRejectedValue(
          new PrismaClientRustPanicError('CLIENT_RUST_PANIC', '200'),
        );

      const httpRequest = {
        id: '123e4567-e89b-12d3-a456-426614174000',
      };

      await expect(sut.listPosts(httpRequest.id)).rejects.toThrow(HttpException);
      await expect(sut.listPosts(httpRequest.id)).rejects.toThrow(
        `Fail to listPosts, error-message: PrismaClientRustPanicError: CLIENT_RUST_PANIC`,
      );
    });
  });
});
