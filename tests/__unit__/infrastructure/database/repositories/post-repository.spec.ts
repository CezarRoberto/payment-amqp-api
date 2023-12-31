import { Post } from '@domain/post/entities/post';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { PostRepository } from '@infrastructure/database/repositories/post.repository';
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
  sut: PostRepository;
}

const makeSut = async (): Promise<ISutTypes> => {
  const moduleRef: TestingModule = await Test.createTestingModule({
    providers: [PrismaService, MyLoggerService, PostRepository],
  }).compile();

  const ctxPrisma = moduleRef.get<PrismaClient>(PrismaService);
  const sut = moduleRef.get<PostRepository>(PostRepository);
  const ctxLogger = moduleRef.get<MyLoggerService>(MyLoggerService);

  return {
    ctxLogger,
    ctxPrisma,
    sut,
  };
};

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

describe('Post Repository', () => {
  describe('Create', () => {
    test('should be able to create a new post', async () => {
      const { ctxPrisma, sut } = await makeSut();

      const postMock = makeFakePostMock();

      ctxPrisma.post.create = jest.fn().mockResolvedValue(postMock);

      const httpRequest = {
        body: {
          title: 'First Post',
          content: 'This is the first post',
          authorId: '123e4567-e89b-12d3-a456-426614174000',
        },
      };

      const httpResponse = await sut.create(httpRequest.body);

      expect(httpResponse).toEqual(postMock);
    });

    test('should be able to throw error when something went wrong', async () => {
      const { ctxPrisma, sut } = await makeSut();

      ctxPrisma.post.create = jest
        .fn()
        .mockRejectedValue(
          new PrismaClientKnownRequestError('error_create_method', {
            clientVersion: 'client1',
            code: '300',
          }),
        );

      const httpRequest = {
        body: {
          title: 'First Post',
          content: 'This is the first post',
          authorId: '123e4567-e89b-12d3-a456-426614174000',
        },
      };

      await expect(sut.create(httpRequest.body)).rejects.toThrow(HttpException);
      await expect(sut.create(httpRequest.body)).rejects.toThrow(
        'Fail to create, error-message: PrismaClientKnownRequestError: error_create_method',
      );
    });
  });

  describe('Feed', () => {
    test('should be able to return array of posts and count', async () => {
      const { ctxPrisma, sut } = await makeSut();

      const postMockOne = makeFakePostMock();
      const postMockTwo = makeFakePostMock();

      const postsArray = new Array(postMockOne, postMockTwo);

      ctxPrisma.post.findMany = jest.fn().mockResolvedValue(postsArray);
      ctxPrisma.post.count = jest.fn().mockResolvedValue(postsArray.length);

      const httpResponse = await sut.feed();

      expect(httpResponse).toEqual({
        posts: postsArray,
        numberPosts: postsArray.length,
      });

      expect(postsArray.some((post) => post.published === true)).toBe(true);
    });

    test('should be able to throw error: PrismaClientKnownRequestError', async () => {
      const { ctxPrisma, sut } = await makeSut();

      ctxPrisma.post.findMany = jest.fn().mockRejectedValue(
        new PrismaClientKnownRequestError('ERROR_KNOWN_PRSIMA', {
          clientVersion: 'client1',
          code: '300',
        }),
      );

      await expect(sut.feed()).rejects.toThrow(HttpException);
      await expect(sut.feed()).rejects.toThrow(
        'Fail to feed, error-message: PrismaClientKnownRequestError: ERROR_KNOWN_PRSIMA',
      );
    });

    test('should be able to throw error when something went RUST PANIC', async () => {
      const { ctxPrisma, sut } = await makeSut();

      ctxPrisma.post.findMany = jest
        .fn()
        .mockRejectedValue(
          new PrismaClientRustPanicError('client-1', 'Rust panic error'),
        );

      await expect(sut.feed()).rejects.toThrow(HttpException);
      await expect(sut.feed()).rejects.toThrow(
        'Fail to feed, error-message: PrismaClientRustPanicError: client-1',
      );
    });
  });

  describe('Find One', () => {
    test('should be able to find by id a post', async () => {
      const { ctxPrisma, sut } = await makeSut();

      const postMock = makeFakePostMock();

      ctxPrisma.post.findUnique = jest.fn().mockResolvedValue(postMock);

      const httpRequest = {
        body: {
          id: '123e4567-e89b-12d3-a456-426614174000',
        },
      };

      const httpResponse = await sut.findOne(httpRequest.body.id);

      expect(httpResponse).toEqual(postMock);
    });

    test('should be able to throw error when something went wrong', async () => {
      const { ctxPrisma, sut } = await makeSut();

      ctxPrisma.post.findUnique = jest.fn().mockRejectedValue(
        new PrismaClientKnownRequestError('ERROR_KNOWN_PRSIMA', {
          clientVersion: 'client1',
          code: '300',
        }),
      );

      const httpRequest = {
        body: {
          id: '123e4567-e89b-12d3-a456-426614174000',
        },
      };

      await expect(sut.findOne(httpRequest.body.id)).rejects.toThrow(
        HttpException,
      );
      await expect(sut.findOne(httpRequest.body.id)).rejects.toThrow(
        'Fail to findOne, error-message: PrismaClientKnownRequestError: ERROR_KNOWN_PRSIMA',
      );
    });
  });
});
