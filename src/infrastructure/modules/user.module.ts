import { CreateUserUseCase } from '@application/data/users/usecases/create-user-usecase';
import { PrismaModule } from '@infrastructure/database/prisma.module';
import { UserRepository } from '@infrastructure/database/repositories/user.repository';
import { Module } from '@nestjs/common';
import { CreateUserController } from '@presentation/controllers/users/create-user-controller';

@Module({
  imports: [PrismaModule],
  controllers: [CreateUserController],
  providers: [UserRepository, CreateUserUseCase],
})
export class UserModule {}
