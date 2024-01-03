import { MyLoggerService } from '@infrastructure/services/logger/logger.service';
import { PrismaService } from '../prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
} from '@prisma/client/runtime/library';
import { Customer } from '@domain/customer/entities/customer';
import { User } from '@domain/user/entities/user';
import { CustomerInterface } from '@application/protocols/customer/customer-interface';

@Injectable()
export class CustomerRepository implements CustomerInterface {
  constructor(
    private readonly prisma: PrismaService,
    private readonly loggerService: MyLoggerService,
  ) {}

  private ThrowErrorAndLogItOut(err: unknown, method: string) {
    if (
      err instanceof PrismaClientKnownRequestError ||
      err instanceof PrismaClientUnknownRequestError ||
      err instanceof PrismaClientRustPanicError
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

  async findById(id: string): Promise<(Customer & { user: User }) | null> {
    try {
      const customer = await this.prisma.customer.findUnique({
        where: {
          id,
        },
        include: {
          user: true,
        },
      });

      return customer;
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
