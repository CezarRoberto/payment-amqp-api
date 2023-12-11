import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { CreatePostUseCase } from '../usecases/create-post-usecase';
import { ZodValidationAdapter } from '@main/adapters/zod-validation-adapter';
import { CreatePostSchema } from '../validations/posts-validation';
import { CreatePost } from '@data/usecases/posts/create-post-usecase';

@Controller('post')
export class CreatePostController {
  constructor(private readonly cratePostUseCase: CreatePostUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationAdapter(CreatePostSchema))
  async perform(@Body() createPostBody: CreatePost.Params) {
    return this.cratePostUseCase.execute(createPostBody);
  }
}
