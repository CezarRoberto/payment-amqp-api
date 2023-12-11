import {
  CreatePost,
  CreatePostUseCaseInterface,
} from '@data/usecases/posts/create-post-usecase';
import { Post } from '@domain/post/entities/post';
import { PostRepository } from '@infrastructure/database/repositories/post.repository';
import { UserRepository } from '@infrastructure/database/repositories/user.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class CreatePostUseCase implements CreatePostUseCaseInterface {
  constructor(
    private readonly postsRepository: PostRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({
    authorId,
    title,
    content,
  }: CreatePost.Params): Promise<Post> {
    const AuthorExists = await this.userRepository.findById(authorId);

    if (!AuthorExists) {
      throw new HttpException('Author Does not exists', HttpStatus.CONFLICT);
    }

    const post = await this.postsRepository.create({
      authorId,
      content,
      title,
    });

    return post;
  }
}
