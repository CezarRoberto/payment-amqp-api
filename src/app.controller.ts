import { PrismaService } from '@infrastructure/database/prisma.service';
import { Controller, Get} from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  PrismaHealthIndicator,
} from '@nestjs/terminus';

@Controller()
export class AppController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private readonly prisma: PrismaHealthIndicator,
    private readonly prismaService: PrismaService,
  ) {}

  @Get('/health')
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('stripe', 'https://status.stripe.com/'),
      () => this.prisma.pingCheck('prisma', this.prismaService),
    ]);
  }
}
