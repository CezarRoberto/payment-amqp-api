import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { ZodValidationAdapter } from '@main/adapters/zod-validation-adapter';
import { CreatePostSchema } from '@application/data/posts/validations/posts-validation';
import { CreatePostUseCase } from '@application/data/posts/usecases/create-post-usecase';
import { CreatePost } from '@domain/post/usecases/create-post-usecase';

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
