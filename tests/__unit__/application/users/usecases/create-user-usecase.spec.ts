import { CreateUserUseCase } from '@application/data/users/usecases/create-user-usecase';
import { User } from '@domain/user/entities/user';
import { UserRepository } from '@infrastructure/database/repositories/user.repository';
import { HttpException, HttpStatus } from '@nestjs/common';
import { mock, MockProxy } from 'jest-mock-extended';

interface SutTypes {
  sut: (userRepository: UserRepository) => CreateUserUseCase;
}

const makeSut = (): SutTypes => {
  const sut = (userRepository: UserRepository) =>
    new CreateUserUseCase(userRepository);
  return { sut };
};

const makeFakeRequest = () => ({
  body: {
    name: 'valid_name',
    email: 'valid_email@gmail.com',
  },
});

const makeFakeUserMock = (): User => ({
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'John Doe',
  email: 'john.doe@example.com',
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  updatedAt: new Date('2023-12-04T00:00:00.000Z'),
});

describe('Create User Use Case', () => {
  test('should be able to create a new user from userRepository and return the object', async () => {
    const { sut } = makeSut();
    const mockUser = makeFakeUserMock();
    const mockUserRepository: MockProxy<UserRepository> = mock();

    mockUserRepository.findByEmail.mockResolvedValueOnce(null);
    mockUserRepository.create.mockResolvedValueOnce(mockUser);

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut(mockUserRepository).execute(
      httpRequest.body,
    );

    expect(httpResponse).toEqual(mockUser);

    expect(mockUserRepository.create).toHaveBeenCalledWith(httpRequest.body);
    expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      httpRequest.body.email,
    );
  });

  test('should be return 409 if user already exists', async () => {
    const { sut } = makeSut();
    const mockUser = makeFakeUserMock();
    const mockUserRepository: MockProxy<UserRepository> = mock();

    mockUserRepository.findByEmail.mockResolvedValueOnce(mockUser);

    const httpRequest = makeFakeRequest();

    try {
      await sut(mockUserRepository).execute(httpRequest.body);
  } catch (error: any) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('User Already Exists');
      expect(error.status).toBe(HttpStatus.CONFLICT);
  }

    expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      httpRequest.body.email,
    );

    expect(mockUserRepository.create).not.toHaveBeenCalledTimes(1);
  });
});
