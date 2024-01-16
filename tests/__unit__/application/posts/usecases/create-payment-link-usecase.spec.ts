import { CreatePaymentLinkUseCase } from '@application/data/posts/usecases/create-payment-link.usecase';
import { PaymentLink } from '@domain/paymentLink/entities/paymentlink';
import { CreatePaymentlink } from '@domain/paymentLink/usecases/create-payment-link-usecase';
import { Post } from '@domain/post/entities/post';
import { PaymentLinkRepository } from '@infrastructure/database/repositories/paymentlink.repository';
import { PostRepository } from '@infrastructure/database/repositories/post.repository';
import { PaymentService } from '@infrastructure/services/payment/payment.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MockProxy, mock } from 'jest-mock-extended';

interface SutTypes {
  sut: (
    paymentService: PaymentService,
    postRepository: PostRepository,
    paymentLinkRepository: PaymentLinkRepository,
  ) => CreatePaymentLinkUseCase;
}

const makeSut = (): SutTypes => {
  const sut = (
    paymentService: PaymentService,
    postRepository: PostRepository,
    paymentLinkRepository: PaymentLinkRepository,
  ) =>
    new CreatePaymentLinkUseCase(
      postRepository,
      paymentService,
      paymentLinkRepository,
    );

  return { sut };
};

const makeFakePostMock = (): Post => ({
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: 'First Post',
  content: 'This is the first post',
  published: true,
  views: 100,
  authorId: '123e4567-e89b-12d3-a456-426614174000',
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  updatedAt: new Date('2023-12-04T00:00:00.000Z'),
});

const makeFakePaymentLink = (): PaymentLink => ({
  id: '9e91858e-7268-40e4-9463-708dd209d103',
  purchasedNumber: 1,
  stripe_paymentlink_id: 'stripe1',
  currency: 'USD',
  amount: 100,
  recurringInterval: 'Monthly',
  postId: 'post1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
});

const makeFakeRequest = (): CreatePaymentlink.Params => ({
  amount: 2,
  currency: 'BRL',
  postId: '550e8400-e29b-41d4-a716-446655440000',
  recurringInterval: 'week',
});

describe('Create Payment Link Use Case', () => {
  test('should be able to create a new payment link based on postId', async () => {
    const { sut } = makeSut();
    const mockPost = makeFakePostMock();
    const mockPaymentLink = makeFakePaymentLink();
    const mockPaymentService: MockProxy<PaymentService> = mock();
    const mockPaymentLinkRepository: MockProxy<PaymentLinkRepository> = mock();
    const mockPostRepository: MockProxy<PostRepository> = mock();

    jest.spyOn(mockPaymentService, 'createPrice').mockResolvedValue({
      id: 'b29fa0fb-ba30-4e36-b1c7-30e15dcb6b87',
    });
    jest.spyOn(mockPaymentService, 'createPaymentLink').mockResolvedValue({
      url: 'https://test.com',
      id: '00a3b5fa-492f-4962-91fc-9bdccd4d2150',
    });
    jest
      .spyOn(mockPaymentLinkRepository, 'create')
      .mockResolvedValue(mockPaymentLink);
    jest.spyOn(mockPostRepository, 'findOne').mockResolvedValue(mockPost);

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut(
      mockPaymentService,
      mockPostRepository,
      mockPaymentLinkRepository,
    ).execute(httpRequest);

    expect(httpResponse).toEqual({
      url: 'https://test.com',
    });

    expect(mockPostRepository.findOne).toHaveBeenCalledWith(httpRequest.postId);
    expect(mockPaymentService.createPrice).toHaveBeenCalledWith({
      currency: httpRequest.currency,
      interval: httpRequest.recurringInterval,
      productData: {
        name: mockPost.title,
        postId: mockPost.id,
      },
      unit_amount: httpRequest.amount,
    });
    expect(mockPaymentService.createPaymentLink).toHaveBeenCalledWith(
      [
        {
          price: 'b29fa0fb-ba30-4e36-b1c7-30e15dcb6b87',
          quantity: httpRequest.amount,
        },
      ],
      {
        postId: mockPost.id,
      },
    );
    expect(mockPaymentLinkRepository.create).toHaveBeenCalledWith({
      amount: httpRequest.amount,
      currency: httpRequest.currency,
      postId: mockPost.id,
      recurringInterval: httpRequest.recurringInterval,
      stripe_paymentlink_id: '00a3b5fa-492f-4962-91fc-9bdccd4d2150',
    });
    expect(mockPostRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockPaymentService.createPrice).toHaveBeenCalledTimes(1);
    expect(mockPaymentService.createPaymentLink).toHaveBeenCalledTimes(1);
    expect(mockPaymentLinkRepository.create).toHaveBeenCalledTimes(1);
  });

  test('should be return 409 if user does not exists', async () => {
    const { sut } = makeSut();
    const mockPaymentLink = makeFakePaymentLink();
    const mockPaymentService: MockProxy<PaymentService> = mock();
    const mockPaymentLinkRepository: MockProxy<PaymentLinkRepository> = mock();
    const mockPostRepository: MockProxy<PostRepository> = mock();

    jest.spyOn(mockPaymentService, 'createPrice').mockResolvedValue({
      id: 'b29fa0fb-ba30-4e36-b1c7-30e15dcb6b87',
    });
    jest.spyOn(mockPaymentService, 'createPaymentLink').mockResolvedValue({
      url: 'https://test.com',
      id: '00a3b5fa-492f-4962-91fc-9bdccd4d2150',
    });
    jest
      .spyOn(mockPaymentLinkRepository, 'create')
      .mockResolvedValue(mockPaymentLink);
    jest.spyOn(mockPostRepository, 'findOne').mockResolvedValue(null);

    const httpRequest = makeFakeRequest();

    try {
      await sut(
        mockPaymentService,
        mockPostRepository,
        mockPaymentLinkRepository,
      ).execute(httpRequest);
    } catch (error: any) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Post Does not  exists');
      expect(error.status).toBe(HttpStatus.CONFLICT);
    }

    expect(mockPostRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockPaymentService.createPrice).not.toHaveBeenCalledTimes(1);
  });
});
