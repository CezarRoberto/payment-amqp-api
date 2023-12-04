import { type PipeTransform, BadRequestException } from '@nestjs/common';

import { type ZodObject } from 'zod';

export class ZodValidationAdapter implements PipeTransform {
  constructor(private readonly schema: ZodObject<any>) {}

  transform(value: unknown) {
    try {
      if (typeof value !== 'string') {
        this.schema.parse(value);
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
    return value;
  }
}
