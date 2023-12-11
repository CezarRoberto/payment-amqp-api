import { CreateUser } from '@data/usecases/users/create-user';
import { User } from '@domain/user/entities/user';
import { UserRepository } from '@infrastructure/database/repositories/user.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class CreateUserUseCase implements CreateUser {
  constructor(private readonly usersRepository: UserRepository) {}

  async execute({ email, name }: CreateUser.Params): Promise<User> {
    const userExists = await this.usersRepository.findByEmail(email);

    if (userExists) {
      throw new HttpException('User Already Exists', HttpStatus.CONFLICT);
    }

    const user = await this.usersRepository.create({
      email,
      name,
    });

    return user;
  }
}
