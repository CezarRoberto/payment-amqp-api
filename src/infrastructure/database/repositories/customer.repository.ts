import { CustomerInterface } from '@domain/customer/interfaces/customer-interface';
import { MyLoggerService } from '@infrastructure/services/logger/logger.service';
import { PrismaService } from '../prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
} from '@prisma/client/runtime/library';
import { Customer } from '@domain/customer/entities/customer';
import { User } from '@domain/user/entities/user';

export class CustomerRepository implements CustomerInterface {
  constructor(
    private readonly prisma: PrismaService,
    private readonly loggerService: MyLoggerService,
  ) {}

  private ThrowErrorAndLogItOut(err: unknown, method: string) {
    if (
      err instanceof PrismaClientKnownRequestError ||
      PrismaClientUnknownRequestError ||
      PrismaClientRustPanicError
    ) {
      this.loggerService.error(`Error on ${method}, ${err}`);
      throw new HttpException(
        `Fail to ${method}, error-message: ${err}`,
        HttpStatus.CONFLICT,
      );
    }
  }

  async create({
    email,
    stripe_customer_id,
    userId,
    description,
  }: Pick<
    Customer,
    'email' | 'stripe_customer_id' | 'userId' | 'description'
  >): Promise<Customer> {
    try {
      const customer = await this.prisma.customer.create({
        data: {
          email,
          description,
          userId,
          stripe_customer_id,
        },
      });

      return customer;
    } catch (error) {
      this.ThrowErrorAndLogItOut(error, this.create.name);
    }
  }

  async findById(id: string): Promise<Customer & User> {
    try {
      const customer = await this.prisma.customer.findFirst({
        where: {
          OR: [
            {
              stripe_customer_id: id,
            },
            {
              userId: id,
            },
          ],
        },
        select: {
          id: true,
          stripe_customer_id: true,
          description: true,
          email: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      const result = Object.assign({}, customer, customer.user);

      return result;
    } catch (error) {
      this.ThrowErrorAndLogItOut(error, this.findById.name);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.customer.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      this.ThrowErrorAndLogItOut(error, this.delete.name);
    }
  }
}
