import { CreateCustomerUseCase } from '@application/data/customer/usecases/create-customer-usecase';
import { Customer } from '@domain/customer/entities/customer';
import { User } from '@domain/user/entities/user';
import { CustomerRepository } from '@infrastructure/database/repositories/customer.repository';
import { UserRepository } from '@infrastructure/database/repositories/user.repository';
import { PaymentService } from '@infrastructure/services/payment/payment.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MockProxy, mock } from 'jest-mock-extended';

interface SutTypes {
  sut: (
    userRepository: UserRepository,
    customerRepository: CustomerRepository,
    paymentService: PaymentService,
  ) => CreateCustomerUseCase;
}

const makeSut = (): SutTypes => {
  const sut = (
    userRepository: UserRepository,
    customerRepository: CustomerRepository,
    paymentService: PaymentService,
  ) =>
    new CreateCustomerUseCase(
      userRepository,
      customerRepository,
      paymentService,
    );

  return { sut };
};

const makeFakeUserMock = (): User => ({
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'John Doe',
  email: 'john.doe@example.com',
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  updatedAt: new Date('2023-12-04T00:00:00.000Z'),
});

const makeFakeCostumerMock = (): Customer => ({
  id: 'c99f8b7a-643c-4a9c-83b7-03ea9307c855',
  email: 'john.doe@example.com',
  description: 'Test customer',
  userId: '123e4567-e89b-12d3-a456-426614174000',
  stripe_customer_id: 'cus_NffrFeUfNV2Hib',
  createdAt: new Date(),
  updatedAt: new Date(),
});

const makeFakeRequest = () => ({
  body: {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    description: 'valid_description',
  },
});

describe('Create Costumer UseCase', () => {
  test('should be able to create a new customer', async () => {
    const { sut } = makeSut();

    const mockUser = makeFakeUserMock();
    const mockCustomer = makeFakeCostumerMock();

    const mockUserRepository: MockProxy<UserRepository> = mock();
    const mockCustomerRepository: MockProxy<CustomerRepository> = mock();
    const mockPaymentService: MockProxy<PaymentService> = mock();

    mockUserRepository.findById.mockResolvedValueOnce(mockUser);
    mockPaymentService.createCustomer.mockResolvedValueOnce({
      id: 'cus_NffrFeUfNV2Hib',
      object: 'customer',
      address: null,
      balance: 0,
      created: 1680893993,
      email: 'jennyrosen@example.com',
    });

    mockCustomerRepository.create.mockResolvedValueOnce(mockCustomer);

    const httpRequest = makeFakeRequest();

    const httpReponse = await sut(
      mockUserRepository,
      mockCustomerRepository,
      mockPaymentService,
    ).execute(httpRequest.body);

    expect(httpReponse).toEqual({
      created_at_stripe: '1680893993',
      stripe_customer_id: 'cus_NffrFeUfNV2Hib',
      id: mockCustomer.id,
      email: mockCustomer.email,
      name: mockUser.name,
      createdAt: mockCustomer.createdAt,
      updatedAt: mockCustomer.updatedAt,
    });

    expect(mockUserRepository.findById).toHaveBeenCalledWith(
      httpRequest.body.userId,
    );
    expect(mockPaymentService.createCustomer).toHaveBeenCalledWith(
      mockUser.name,
      mockUser.email,
    );

    expect(httpReponse.stripe_customer_id).toStrictEqual(
      mockCustomer.stripe_customer_id,
    );
    expect(mockCustomerRepository.create).toHaveBeenCalledWith({
      email: mockUser.email,
      userId: mockUser.id,
      stripe_customer_id: 'cus_NffrFeUfNV2Hib',
      description: httpRequest.body.description,
    });

    expect(mockCustomerRepository.create).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockPaymentService.createCustomer).toHaveBeenCalledTimes(1);
  });

  test('should be able to throw error when something went to create costumer', async () => {
    const { sut } = makeSut();

    const mockUser = makeFakeUserMock();
    const mockCustomer = makeFakeCostumerMock();

    const mockUserRepository: MockProxy<UserRepository> = mock();
    const mockCustomerRepository: MockProxy<CustomerRepository> = mock();
    const mockPaymentService: MockProxy<PaymentService> = mock();

    mockUserRepository.findById.mockResolvedValueOnce(mockUser);
    mockPaymentService.createCustomer.mockRejectedValueOnce(
      new Error('Error on stripe'),
    );

    mockCustomerRepository.create.mockResolvedValueOnce(mockCustomer);

    try {
      const httpRequest = makeFakeRequest();

      await sut(
        mockUserRepository,
        mockCustomerRepository,
        mockPaymentService,
      ).execute(httpRequest.body);
    } catch (error: any) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe(
        'Something went wrong, error: Error: Error on stripe',
      );
      expect(error.status).toBe(HttpStatus.BAD_REQUEST);
    }

    expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockCustomerRepository.create).not.toHaveBeenCalledTimes(1);
    expect(mockPaymentService.createCustomer).toHaveBeenCalledTimes(1);
  });

  test('should be able to throw error when userId is not correct', async () => {
    const { sut } = makeSut();

    const mockUserRepository: MockProxy<UserRepository> = mock();
    const mockCustomerRepository: MockProxy<CustomerRepository> = mock();
    const mockPaymentService: MockProxy<PaymentService> = mock();

    mockUserRepository.findById.mockResolvedValueOnce(null);
    const httpRequest = makeFakeRequest();

    try {
      await sut(
        mockUserRepository,
        mockCustomerRepository,
        mockPaymentService,
      ).execute(httpRequest.body);
    } catch (error: any) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('User not found');
      expect(error.status).toBe(HttpStatus.BAD_REQUEST);
    }

    expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockCustomerRepository.create).not.toHaveBeenCalledTimes(1);
    expect(mockPaymentService.createCustomer).not.toHaveBeenCalledTimes(1);
  });
});
