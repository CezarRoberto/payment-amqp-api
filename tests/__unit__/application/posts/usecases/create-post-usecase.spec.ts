import { CreatePostUseCase } from '@application/posts/usecases/create-post-usecase';
import { Post } from '@domain/post/entities/post';
import { User } from '@domain/user/entities/user';
import { PostRepository } from '@infrastructure/database/repositories/post.repository';
import { UserRepository } from '@infrastructure/database/repositories/user.repository';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MockProxy, mock } from 'jest-mock-extended';

interface SutTypes {
  sut: (
    userRepository: UserRepository,
    postRepository: PostRepository,
  ) => CreatePostUseCase;
}

const makeSut = (): SutTypes => {
  const sut = (
    userRepository: UserRepository,
    postRepository: PostRepository,
  ) => new CreatePostUseCase(postRepository, userRepository);

  return { sut };
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

const makeFakeUserMock = (): User => ({
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'John Doe',
  email: 'john.doe@example.com',
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  updatedAt: new Date('2023-12-04T00:00:00.000Z'),
});

const makeFakeRequest = () => ({
  body: {
    title: 'valid_title',
    content: 'valid_content_from_post',
    authorId: '123e4567-e89b-12d3-a456-426614174000',
  },
});

describe('Create Post Use Case', () => {
  test('should be able to create a new post based on authorId', async () => {
    const { sut } = makeSut();
    const mockUser = makeFakeUserMock();
    const mockPost = makeFakePostMock();
    const mockUserRepository: MockProxy<UserRepository> = mock();
    const mockPostRepository: MockProxy<PostRepository> = mock();

    jest.spyOn(mockUserRepository, 'findById').mockResolvedValue(mockUser);
    jest.spyOn(mockPostRepository, 'create').mockResolvedValue(mockPost);

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut(
      mockUserRepository,
      mockPostRepository,
    ).execute(httpRequest.body);

    expect(httpResponse).toEqual(mockPost);

    expect(mockPostRepository.create).toHaveBeenCalledWith(httpRequest.body);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(
      httpRequest.body.authorId,
    );
    expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockPostRepository.create).toHaveBeenCalledTimes(1);
  });

  test('should be return 409 if user does not exists', async () => {
    const { sut } = makeSut();
    const mockPost = makeFakePostMock();
    const mockUserRepository: MockProxy<UserRepository> = mock();
    const mockPostRepository: MockProxy<PostRepository> = mock();

    jest.spyOn(mockUserRepository, 'findById').mockResolvedValue(null);
    jest.spyOn(mockPostRepository, 'create').mockResolvedValue(mockPost);

    const httpRequest = makeFakeRequest();

    try {
      await sut(mockUserRepository, mockPostRepository).execute(
        httpRequest.body,
      );
    } catch (error: any) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Author Does not exists');
      expect(error.status).toBe(HttpStatus.CONFLICT);
    }

    expect(mockUserRepository.findById).toHaveBeenCalledWith(
      httpRequest.body.authorId,
    );
    expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockPostRepository.create).not.toHaveBeenCalledTimes(1);
  });
});
