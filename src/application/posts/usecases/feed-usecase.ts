import { Post } from '@domain/post/entities/post';
import { FeedUseCaseInterface } from '@domain/post/useCases/feed-usecase';
import { PostRepository } from '@infrastructure/database/repositories/post.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FeedUseCase implements FeedUseCaseInterface {
  constructor(private readonly postsRepository: PostRepository) {}

  async execute(): Promise<{ posts: Post[]; numberPosts: number }> {
    const posts = await this.postsRepository.feed();

    const shuffledPostArray = this.sortPostsRandomly(posts.posts);

    return {
      posts: shuffledPostArray,
      numberPosts: posts.numberPosts,
    };
  }

  private sortPostsRandomly(postsArray: Array<Post>): Array<Post> {
    const shuffledArray = postsArray.slice();
    for (let i = postsArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }
}
