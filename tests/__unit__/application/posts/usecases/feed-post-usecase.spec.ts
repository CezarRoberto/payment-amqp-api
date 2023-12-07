import { FeedUseCase } from '@application/posts/usecases/feed-usecase';
import { PostRepository } from '@infrastructure/database/repositories/post.repository';
import { Post } from '@prisma/client';
import { MockProxy, mock } from 'jest-mock-extended';

interface SutTypes {
  sut: (postRepository: PostRepository) => FeedUseCase;
}

const makeSut = (): SutTypes => {
  const sut = (postRepository: PostRepository) =>
    new FeedUseCase(postRepository);

  return { sut };
};

const makeFakePostsMock = (): Post[] => [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'First Post',
    content: 'This is the first post',
    published: true,
    views: 100,
    authorId: '123e4567-e89b-12d3-a456-426614174000',
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-12-04T00:00:00.000Z'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    title: 'Third Post',
    content: 'This is the third post',
    published: true,
    views: 100,
    authorId: '123e4567-e89b-12d3-a456-426614174002',
    createdAt: new Date('2023-01-03T00:00:00.000Z'),
    updatedAt: new Date('2023-12-06T00:00:00.000Z'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    title: 'Fourth Post',
    content: 'This is the fourth post',
    published: true,
    views: 100,
    authorId: '123e4567-e89b-12d3-a456-426614174003',
    createdAt: new Date('2023-01-04T00:00:00.000Z'),
    updatedAt: new Date('2023-12-07T00:00:00.000Z'),
  },
];

describe('Feed Post Use Case', () => {
  test('should be able to return posts and the number of them ', async () => {
    const { sut } = makeSut();
    const mockPosts = makeFakePostsMock();
    const mockPostRepository: MockProxy<PostRepository> = mock();

    jest.spyOn(mockPostRepository, 'feed').mockResolvedValue({
      posts: mockPosts,
      numberPosts: mockPosts.length,
    });

    const httpResponse = await sut(mockPostRepository).execute();
    
    expect(httpResponse).toEqual({
     posts: expect.arrayContaining(mockPosts),
     numberPosts: 3
    });

    expect(mockPostRepository.feed).toHaveBeenCalledWith();
    expect(mockPostRepository.feed).toHaveBeenCalledTimes(1);
  });
});
