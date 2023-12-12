import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { ZodValidationAdapter } from '@main/adapters/zod-validation-adapter';
import { CreateUserUseCase } from '@application/data/users/usecases/create-user-usecase';
import { CreateUserSchema } from '@application/data/users/validations/user-validations';
import { CreateUser } from '@domain/user/usecases/create-user';

@Controller('user')
export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationAdapter(CreateUserSchema))
  async perform(@Body() createUserBody: CreateUser.Params) {
    return this.createUserUseCase.execute(createUserBody);
  }
}
