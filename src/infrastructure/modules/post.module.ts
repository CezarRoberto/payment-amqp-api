import { CreatePostController } from '@application/posts/controllers/create-post-controller';
import { FeedPostController } from '@application/posts/controllers/feed-post-controller';
import { CreatePostUseCase } from '@application/posts/usecases/create-post-usecase';
import { FeedUseCase } from '@application/posts/usecases/feed-usecase';
import { PrismaModule } from '@infrastructure/database/prisma.module';
import { PostRepository } from '@infrastructure/database/repositories/post.repository';
import { UserRepository } from '@infrastructure/database/repositories/user.repository';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [FeedPostController, CreatePostController],
  providers: [UserRepository, PostRepository, CreatePostUseCase, FeedUseCase],
})
export class PostModule {}
