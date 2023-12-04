import { UsersInterface } from '@domain/user/interfaces/users-interface';
import { HttpException, HttpStatus, Injectable, Scope } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MyLoggerService } from '@infrastructure/services/logger/logger.service';
import { User } from '@domain/user/entities/user';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
} from '@prisma/client/runtime/library';
import { Post } from '@domain/post/entities/post';

@Injectable()
export class UserRepository implements UsersInterface {
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

  async create({ email, name }: Pick<User, 'email' | 'name'>): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          name,
        },
      });

      return user;
    } catch (err) {
      this.ThrowErrorAndLogItOut(err, this.create.name);
    }
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data,
      });
      return user;
    } catch (err) {
      this.ThrowErrorAndLogItOut(err, this.update.name);
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
      return user;
    } catch (err) {
      this.ThrowErrorAndLogItOut(err, this.findById.name);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: {
          id,
        },
      });
    } catch (err) {
      this.ThrowErrorAndLogItOut(err, this.delete.name);
    }
  }

  async deleteMany(id: string): Promise<void> {
    try {
      await this.prisma.user.deleteMany({
        where: {
          id,
        },
      });
    } catch (err) {
      this.ThrowErrorAndLogItOut(err, this.deleteMany.name);
    }
  }

  async listPosts(id: string): Promise<User & { posts: Post[] } | null > {
    try {
      const postsByUser = await this.prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          post: {
            where: { authorId: id },
          },
        },
      });

      return {
        ...postsByUser,
        posts: postsByUser.post
      };
    } catch (error) {
      this.ThrowErrorAndLogItOut(error, this.listPosts.name);
    }
  }
}
