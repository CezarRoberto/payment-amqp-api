import { CreatePostUseCase } from '@application/data/posts/usecases/create-post-usecase';
import { FeedUseCase } from '@application/data/posts/usecases/feed-usecase';
import { PrismaModule } from '@infrastructure/database/prisma.module';
import { PostRepository } from '@infrastructure/database/repositories/post.repository';
import { UserRepository } from '@infrastructure/database/repositories/user.repository';
import { Module } from '@nestjs/common';
import { CreatePostController } from '@presentation/controllers/posts/create-post-controller';
import { FeedPostController } from '@presentation/controllers/posts/feed-post-controller';

@Module({
  imports: [PrismaModule],
  controllers: [FeedPostController, CreatePostController],
  providers: [UserRepository, PostRepository, CreatePostUseCase, FeedUseCase],
})
export class PostModule {}
