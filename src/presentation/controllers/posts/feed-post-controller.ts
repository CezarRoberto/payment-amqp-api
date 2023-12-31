import { FeedUseCase } from '@application/data/posts/usecases/feed-usecase';
import { Controller, Get, HttpCode, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('post')
export class FeedPostController {
  constructor(private readonly feedPostUseCase: FeedUseCase) {}

  @Get('/feed')
  @HttpCode(200)
  async perform(@Res() res: Response) {
    const posts = await this.feedPostUseCase.execute();
    const headerValue = this.getHeaderValue(posts.numberPosts);
    res.set('x-posts-numbers', `${headerValue}`);
    res.send(posts.posts);
  }

  getHeaderValue(number: Number) {
    return number;
  }
}
