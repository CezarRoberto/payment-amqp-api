import { PostsInterface } from '@domain/post/interfaces/posts-interface';
import { MyLoggerService } from '@infrastructure/services/logger/logger.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
} from '@prisma/client/runtime/library';
import { Post } from '@domain/post/entities/post';

@Injectable()
export class PostRepository implements PostsInterface {
  constructor(
    private readonly prisma: PrismaService,
    private readonly loggerService: MyLoggerService,
  ) {}

  private ThrowErrorAndLogItOut(err: unknown, method: string) {
    if (
      err instanceof PrismaClientKnownRequestError ||
      PrismaClientUnknownRequestError ||
      PrismaClientRustPanicError
    ) {
      this.loggerService.error(`Error on ${method}, ${err}`);
      throw new HttpException(
        `Fail to ${method}, error-message: ${err}`,
        HttpStatus.CONFLICT,
      );
    }
  }

  async create({
    authorId,
    content,
    title,
  }: Pick<Post, 'authorId' | 'title' | 'content'>): Promise<Post> {
    try {
      const post = await this.prisma.post.create({
        data: {
          title,
          authorId,
          content,
          views: 0,
        },
      });

      return post;
    } catch (error) {
      this.ThrowErrorAndLogItOut(error, this.create.name);
    }
  }

  async feed(): Promise<{ posts: Post[], numberPosts: number }> {
    try {
      const allPosts = await this.prisma.post.findMany({
        where: {
          published: true,
        },
      });
      const postsNumber = await this.prisma.post.count({
        where: {
          published: true
        }
      });

      return {
        posts: allPosts,
        numberPosts: postsNumber,
      }
    } catch (error) {
      this.ThrowErrorAndLogItOut(error, this.feed.name);
    }
  }

  async findOne(id: string): Promise<Post | null> {
    try {
      const post = await this.prisma.post.findUnique({
        where: {
          id
        }
      })

      return post
    } catch (error) {
      this.ThrowErrorAndLogItOut(error, this.findOne.name);
    }
  }
}
