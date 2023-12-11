import { Body, Controller, HttpCode, Post, UsePipes,  } from "@nestjs/common";
import { CreateUserUseCase } from "../usecases/create-user-usecase";
import { ZodValidationAdapter } from "@main/adapters/zod-validation-adapter";
import { CreateUserSchema } from "../validations/user-validations";
import { CreateUser } from "@data/usecases/users/create-user";

@Controller('user')
export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}
  
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationAdapter(CreateUserSchema))
  async perform(@Body() createUserBody: CreateUser.Params) {
    return this.createUserUseCase.execute(createUserBody)
  }
}