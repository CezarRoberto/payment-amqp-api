import { CreatePaymentLinkUseCase } from '@application/data/posts/usecases/create-payment-link.usecase';
import { CreatePostUseCase } from '@application/data/posts/usecases/create-post-usecase';
import { FeedUseCase } from '@application/data/posts/usecases/feed-usecase';
import { PrismaModule } from '@infrastructure/database/prisma.module';
import { PaymentLinkRepository } from '@infrastructure/database/repositories/paymentlink.repository';
import { PostRepository } from '@infrastructure/database/repositories/post.repository';
import { UserRepository } from '@infrastructure/database/repositories/user.repository';
import { PaymentService } from '@infrastructure/services/payment/payment.service';
import { Module } from '@nestjs/common';
import { CreatePaymentLinkController } from '@presentation/controllers/posts/create-payment-link-controller';
import { CreatePostController } from '@presentation/controllers/posts/create-post-controller';
import { FeedPostController } from '@presentation/controllers/posts/feed-post-controller';

@Module({
  imports: [PrismaModule],
  controllers: [
    FeedPostController,
    CreatePostController,
    CreatePaymentLinkController,
  ],
  providers: [
    UserRepository,
    PostRepository,
    PaymentService,
    PaymentLinkRepository,
    CreatePostUseCase,
    FeedUseCase,
    CreatePaymentLinkUseCase,
  ],
})
export class PostModule {}
