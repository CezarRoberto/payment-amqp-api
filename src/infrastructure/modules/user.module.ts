import { CreateUserController } from '@application/users/controllers/create-user-controller';
import { CreateUserUseCase } from '@application/users/usecases/create-user-usecase';
import { PrismaModule } from '@infrastructure/database/prisma.module';
import { UserRepository } from '@infrastructure/database/repositories/user.repository';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [CreateUserController],
  providers: [UserRepository, CreateUserUseCase],
})
export class UserModule {}
